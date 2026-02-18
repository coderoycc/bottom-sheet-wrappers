<template>
  <Teleport to="body">
    <Transition name="bsw-bottom-sheet">
      <div v-if="isVisible" class="bsw-bottom-sheet-wrapper" :style="{ zIndex: zIndex }" v-bind="$attrs">
        <!-- Backdrop Layer -->
        <div v-if="shouldShowBackdrop" class="bsw-bottom-sheet-backdrop" :class="{
          'bsw-bottom-sheet-backdrop--visible': showBackdrop,
          'bsw-bottom-sheet-backdrop--closing': isClosing
        }" @click="handleBackdropClick" @touchstart="handleBackdropTouchStart" @touchmove="handleBackdropTouchMove"
          @touchend="handleBackdropTouchEnd"></div>

        <!-- Panel Principal -->
        <div ref="panelRef" class="bsw-bottom-sheet-panel" :class="[
          `bsw-bottom-sheet--${effectiveMode}`,
          `bsw-bottom-sheet--${currentSize}`,
          { 'bsw-bottom-sheet--dragging': isDragging }
        ]" :style="panelStyles" @transitionend="handleTransitionEnd">
          <!-- Header con Handle -->
          <div ref="headerRef" class="bsw-bottom-sheet-header" @click="handleHeaderClick"
            @touchstart="handleHeaderTouchStart" @touchmove="handleHeaderTouchMove" @touchend="handleHeaderTouchEnd"
            @mousedown="handleHeaderMouseDown">

            <!-- Handle -->
            <div class="bsw-bottom-sheet-handle" />

            <!-- Close Button (flotante, solo si no hay header personalizado) -->
            <button v-if="showCloseButton && !$slots.header" class="bsw-bottom-sheet-close-btn"
              @click.stop="handleClose">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Header Content -->
            <div class="bsw-bottom-sheet-header-content">
              <slot name="header">
                <div class="bsw-bottom-sheet-title">{{ title }}</div>
              </slot>
            </div>
          </div>

          <!-- Content -->
          <div ref="contentWrapperRef" class="bsw-bottom-sheet-content"
            :class="{ 'bsw-bottom-sheet-content--scrollable': isScrollable }" @scroll="handleContentScroll"
            @touchstart="handleContentTouchStart" @touchmove="handleContentTouchMove" @touchend="handleContentTouchEnd">
            <div ref="innerContentRef" class="bsw-bottom-sheet-content-inner">
              <component :is="contentComponent" v-bind="contentProps" v-if="contentComponent" />
              <slot v-else />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { BottomSheetProps } from '../types'
import {
  useModeDetection,
  useSizeCalculation,
  useGestureHandling,
  useBackdropInteraction,
  useContentScroll,
  useResizeObservers
} from '../composables/bottom-sheet'

defineOptions({
  inheritAttrs: false
})

// ============================================================================
// Props & Emits
// ============================================================================

const props = withDefaults(defineProps<BottomSheetProps>(), {
  modelValue: false,
  title: '',
  mode: undefined,
  initialSize: 'small',
  maxHeight: '95dvh',
  showCloseButton: true,
  showBackdrop: false,
  closeOnBackdrop: false,
  persistent: false,
  zIndex: 9000
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'opened': []
  'closed': []
  'size-change': [size: 'small' | 'medium' | 'large']
}>()

// ============================================================================
// DOM Refs
// ============================================================================

const headerRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const innerContentRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

// ============================================================================
// State
// ============================================================================

const isVisible = ref(props.modelValue)
const isClosing = ref(false)

// ============================================================================
// Composables
// ============================================================================

// Resize Observers - tracks header and content dimensions
const {
  headerHeight,
  contentHeight,
  setupHeaderObserver,
  setupContentObserver
} = useResizeObservers({
  headerRef,
  innerContentRef,
  onContentResize: undefined // Will be set after mode detection is available
})

// Mode Detection - determines effective mode (dynamic/auto-fit/fixed)
const {
  effectiveMode,
  detectContentMode
} = useModeDetection({
  props,
  innerContentRef,
  contentHeight
})

// Content Scroll - tracks scroll position
const {
  contentScrollTop,
  handleContentScroll
} = useContentScroll()

// Initialize gesture state refs (will be populated by gesture handling)
const isDragging = ref(false)
const gestureStartY = ref(0)
const gestureCurrentY = ref(0)
const gestureStartHeight = ref(0)

// Size Calculation - computes sizes, styles, and scrollability
const {
  currentSize,
  sizesPx,
  canExpandToLarge,
  isScrollable,
  panelStyles,
  animateToSize
} = useSizeCalculation({
  effectiveMode,
  headerHeight,
  contentHeight,
  isDragging,
  isClosing,
  gestureState: {
    startY: gestureStartY,
    currentY: gestureCurrentY,
    startHeight: gestureStartHeight
  },
  props,
  emit
})

// Gesture Handling - manages all drag/swipe interactions
const {
  isDragging: gestureIsDragging,
  gestureState,
  handleHeaderTouchStart,
  handleHeaderTouchMove,
  handleHeaderTouchEnd,
  handleHeaderMouseDown,
  handleHeaderClick,
  handleContentTouchStart,
  handleContentTouchMove,
  handleContentTouchEnd
} = useGestureHandling({
  effectiveMode,
  currentSize,
  sizesPx,
  canExpandToLarge,
  contentScrollTop,
  animateToSize,
  handleClose: () => handleClose()
})

// Sync gesture state from gesture handling to our refs
watch(gestureIsDragging, (val) => { isDragging.value = val })
watch(() => gestureState.startY.value, (val) => { gestureStartY.value = val })
watch(() => gestureState.currentY.value, (val) => { gestureCurrentY.value = val })
watch(() => gestureState.startHeight.value, (val) => { gestureStartHeight.value = val })

// Backdrop Interaction - manages backdrop visibility and events
const {
  shouldShowBackdrop,
  handleBackdropClick,
  handleBackdropTouchStart,
  handleBackdropTouchMove,
  handleBackdropTouchEnd
} = useBackdropInteraction({
  effectiveMode,
  currentSize,
  props,
  animateToSize,
  handleClose: () => handleClose()
})

// ============================================================================
// Computed
// ============================================================================

const contentComponent = computed(() => props.component)
const contentProps = computed(() => props.props || {})

// ============================================================================
// Methods
// ============================================================================

const handleClose = (): void => {
  if (props.persistent) return

  // Start the close animation
  isClosing.value = true
  emit('close')

  // Wait for the animation to complete before actually hiding
  // Reduced from 500ms to 300ms to match CSS transitions
  setTimeout(() => {
    if (!isClosing.value) return // Prevent race condition if reopened quickly

    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')

    // Unlock body scroll when closing
    unlockBodyScroll()
  }, 300)
}

const handleTransitionEnd = (event: TransitionEvent): void => {
  // Only handle transitions from the panel itself, not children
  if (event.target !== panelRef.value) return

  // If we're closing and the transform transition ended, finalize the close
  if (isClosing.value && event.propertyName === 'transform') {
    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')
    unlockBodyScroll()
  }
}

const lockBodyScroll = (): void => {
  // Simple approach: just prevent scrolling without changing position
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
}

const unlockBodyScroll = (): void => {
  // Restore scrolling
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const open = (): void => {
  isVisible.value = true
  currentSize.value = props.initialSize || 'small'

  nextTick(() => {
    setupHeaderObserver()
    detectContentMode()
    setupContentObserver()
    emit('opened')

    // Lock body scroll after everything is set up (except for dynamic mode at small size)
    const shouldLockScroll = !(effectiveMode.value === 'dynamic' && currentSize.value === 'small')
    if (shouldLockScroll) {
      lockBodyScroll()
    }
  })
}

const close = (): void => {
  handleClose()
}

// ============================================================================
// Watchers
// ============================================================================

watch(() => props.modelValue, (newVal: boolean) => {
  if (newVal) open()
  else close()
})

// Watch for size changes in dynamic mode to lock/unlock body scroll
watch(currentSize, (newSize) => {
  if (!isVisible.value) return

  if (effectiveMode.value === 'dynamic') {
    if (newSize === 'small') {
      // Unlock scroll when collapsing to small in dynamic mode
      unlockBodyScroll()
    } else {
      // Lock scroll when expanding from small in dynamic mode
      lockBodyScroll()
    }
  }
})

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  if (props.modelValue) open()
  setupHeaderObserver()
  setupContentObserver()
})

onBeforeUnmount(() => {
  unlockBodyScroll()
})

defineExpose({
  open,
  close,
  animateToSize
})
</script>

<style lang="scss" scoped>
</style>
