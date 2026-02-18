<template>
  <Teleport to="body">
    <Transition name="bsw-bottom-sheet">
      <div v-if="isVisible" class="bsw-bottom-sheet-wrapper" :style="{ zIndex: zIndex }" v-bind="$attrs">
        <!-- Backdrop Layer (visible backdrop) -->
        <div v-if="shouldShowBackdrop" class="bsw-bottom-sheet-backdrop" :class="{
          'bsw-bottom-sheet-backdrop--visible': showBackdrop,
          'bsw-bottom-sheet-backdrop--closing': isClosing
        }" @click="handleBackdropClick"></div>

        <!-- Panel Principal -->
        <div ref="panelRef" class="bsw-bottom-sheet-panel" :class="[
          `bsw-bottom-sheet--dynamic`,
          `bsw-bottom-sheet--${currentSize}`,
          { 'bsw-bottom-sheet--dragging': isDragging }
        ]" :style="panelStyles" @transitionend="handleTransitionEnd">
          <!-- Header con Handle - gestos del header -->
          <div ref="headerRef" class="bsw-bottom-sheet-header" @click="handleHeaderClick"
            @touchstart="handleHeaderTouchStart" @touchmove="handleHeaderTouchMove" @touchend="handleHeaderTouchEnd"
            @mousedown="handleHeaderMouseDown"
            v-show="hasCollapsedSlot && !showCollapsedContent"
            >
            <!-- Handle -->
            <div class="bsw-bottom-sheet-handle" />

            <!-- Close Button (solo si no hay header personalizado) -->
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
            @touchstart="handleContentTouchStart" @touchmove="handleContentTouchMove"
            @touchend="handleContentTouchEnd">
            
            <!-- Handle -->
            <div class="bsw-bottom-sheet-handle-container" v-if="showCollapsedContent" @click="handleHeaderClick">
              <div class="bsw-bottom-sheet-handle" />
              <button v-if="showCloseButton" class="close-btn"
              @click.stop="handleClose">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>


            <!-- Collapsed content slot — shown only when collapsed and slot exists -->
            <Transition name="bsw-collapsed-content">
              <div v-if="showCollapsedContent" ref="collapsedContentRef" class="bsw-bottom-sheet-collapsed-content">
                <slot name="collapsed-content" />
              </div>
            </Transition>

            <!-- Regular content — hidden when collapsed with collapsed-content slot -->
            <Transition name="bsw-regular-content">
              <div v-show="!showCollapsedContent" ref="innerContentRef" class="bsw-bottom-sheet-content-inner">
                <slot />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { useDynamicGestures } from '../composables/bottom-sheet/useDynamicGestures'
import { useDynamicSizeCalculation } from '../composables/bottom-sheet/useDynamicSizeCalculation'
import { useContentScroll } from '../composables/bottom-sheet/useContentScroll'

import type { DynamicSize } from '../composables/bottom-sheet/useDynamicGestures'


export type { DynamicSize }

export interface DynamicBottomSheetProps {
  modelValue: boolean
  title?: string
  initialSize?: DynamicSize
  half?: string
  full?: string
  showCloseButton?: boolean
  showBackdrop?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
  zIndex?: number
}

defineOptions({
  inheritAttrs: false
})
// ============================================================================
// Props & Emits
// ============================================================================

const props = withDefaults(defineProps<DynamicBottomSheetProps>(), {
  modelValue: false,
  title: '',
  initialSize: 'half',
  half: '45dvh',
  full: '95dvh',
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
  'size-change': [size: DynamicSize]
}>()

const slots = useSlots()

// ============================================================================
// DOM Refs
// ============================================================================

const headerRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const innerContentRef = ref<HTMLElement | null>(null)
const collapsedContentRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

// ============================================================================
// State
// ============================================================================

const isVisible = ref(props.modelValue)
const isClosing = ref(false)

// Height tracking
const headerHeight = ref(0)
const contentHeight = ref(0)
const collapsedContentHeight = ref(0)

// Whether the collapsed-content slot is provided
const hasCollapsedSlot = computed(() => !!slots['collapsed-content'])

// ============================================================================
// Content Scroll
// ============================================================================

const { contentScrollTop, handleContentScroll } = useContentScroll()

// ============================================================================
// Size Calculation
// ============================================================================

// We need a temporary isDragging ref for the size calculation composable.
// It will be replaced by the real one from gestures after setup.
const tempIsDragging = ref(false)
const tempGestureState = {
  startY: ref(0),
  currentY: ref(0),
  startHeight: ref(0)
}

const {
  currentSize,
  sizesPx,
  canExpandToFull,
  isScrollable,
  panelStyles: _basePanelStyles,
  animateToSize
} = useDynamicSizeCalculation({
  headerHeight,
  contentHeight,
  collapsedContentHeight,
  isDragging: tempIsDragging,
  isClosing,
  hasCollapsedSlot,
  gestureState: tempGestureState,
  props: {
    initialSize: props.initialSize,
    half: props.half,
    full: props.full
  },
  emit: (_event, size) => emit('size-change', size)
})

const {
  isDragging,
  gestureState,
  handleHeaderTouchStart,
  handleHeaderTouchMove,
  handleHeaderTouchEnd,
  handleHeaderMouseDown,
  handleHeaderClick,
  handleContentTouchStart,
  handleContentTouchMove,
  handleContentTouchEnd
} = useDynamicGestures({
  currentSize,
  sizesPx,
  canExpandToFull,
  contentScrollTop,
  animateToSize,
  handleClose
})

watch(isDragging, (v) => { tempIsDragging.value = v })
watch(() => gestureState.startY.value, (v) => { tempGestureState.startY.value = v })
watch(() => gestureState.currentY.value, (v) => { tempGestureState.currentY.value = v })
watch(() => gestureState.startHeight.value, (v) => { tempGestureState.startHeight.value = v })

// Use the base panel styles (they read from the synced temp refs)
const panelStyles = _basePanelStyles

// Show collapsed content only when collapsed AND slot exists
const showCollapsedContent = computed(() =>
  currentSize.value === 'collapsed' && hasCollapsedSlot.value
)

// ============================================================================
// Backdrop
// ============================================================================

const shouldShowBackdrop = computed(() => props.showBackdrop)

// ============================================================================
// Methods
// ============================================================================

function handleClose(): void {
  if (props.persistent) return

  isClosing.value = true
  emit('close')

  setTimeout(() => {
    if (!isClosing.value) return

    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')

    stopOutsideClickListener()
    unlockBodyScroll()
  }, 300)
}

const handleTransitionEnd = (event: TransitionEvent): void => {
  if (event.target !== panelRef.value) return

  if (isClosing.value && event.propertyName === 'transform') {
    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')
    unlockBodyScroll()
  }
}

const handleBackdropClick = (): void => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

/**
 * Document-level listener: when there's no backdrop and the sheet is expanded,
 * any click/touch outside the panel auto-collapses to "collapsed".
 * No overlay element is used, so hover, focus, and clicks on elements behind
 * work normally — the event is NOT prevented, it just also triggers collapse.
 */
const handleDocumentPointerDown = (event: PointerEvent): void => {
  if (!isVisible.value) return
  if (shouldShowBackdrop.value) return
  if (currentSize.value === 'collapsed') return

  // If the click is inside the panel, ignore
  if (panelRef.value && panelRef.value.contains(event.target as Node)) {
    return
  }

  // Click was outside the panel — collapse (don't prevent the event)
  animateToSize('collapsed')
}

const startOutsideClickListener = (): void => {
  // Use capture phase so we see the event before any stopPropagation
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
}

const stopOutsideClickListener = (): void => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
}

const lockBodyScroll = (): void => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
}

const unlockBodyScroll = (): void => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// ============================================================================
// Resize Observers
// ============================================================================

let headerObserver: ResizeObserver | null = null
let contentObserver: ResizeObserver | null = null
let collapsedObserver: ResizeObserver | null = null

const setupObservers = (): void => {
  cleanupObservers()

  // Header observer
  if (headerRef.value) {
    headerObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        headerHeight.value = entry.borderBoxSize[0]?.blockSize || entry.contentRect.height
      }
    })
    headerObserver.observe(headerRef.value)
  }

  // Content observer
  if (innerContentRef.value) {
    contentObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        contentHeight.value = entry.contentRect.height
      }
    })
    contentObserver.observe(innerContentRef.value)
  }

  // Collapsed content observer (if slot exists)
  setupCollapsedObserver()
}

const setupCollapsedObserver = (): void => {
  if (collapsedObserver) {
    collapsedObserver.disconnect()
    collapsedObserver = null
  }
  if (collapsedContentRef.value) {
    collapsedObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        collapsedContentHeight.value = entry.contentRect.height
      }
    })
    collapsedObserver.observe(collapsedContentRef.value)
  }
}

const cleanupObservers = (): void => {
  headerObserver?.disconnect()
  contentObserver?.disconnect()
  collapsedObserver?.disconnect()
  headerObserver = null
  contentObserver = null
  collapsedObserver = null
}

// ============================================================================
// Open / Close
// ============================================================================

const open = (): void => {
  isVisible.value = true
  currentSize.value = props.initialSize || 'collapsed'

  nextTick(() => {
    setupObservers()
    startOutsideClickListener()
    emit('opened')

    if (currentSize.value !== 'collapsed') {
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

// Lock/unlock body scroll based on size
watch(currentSize, (newSize) => {
  if (!isVisible.value) return

  if (newSize === 'collapsed') {
    unlockBodyScroll()
  } else {
    lockBodyScroll()
  }
})

// Re-observe collapsed content ref when it appears/disappears
watch(showCollapsedContent, (show) => {
  if (show) {
    nextTick(() => setupCollapsedObserver())
  }
})

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  if (props.modelValue) open()
})

onBeforeUnmount(() => {
  cleanupObservers()
  stopOutsideClickListener()
  unlockBodyScroll()
})

// ============================================================================
// Expose
// ============================================================================

defineExpose({
  open,
  close,
  animateToSize
})
</script>

<style lang="scss" scoped>
/* Collapsed content styles */
.bsw-bottom-sheet-collapsed-content {
  padding: 0 0px 8px;
}

/* Transition for collapsed ↔ regular content swap */
.bsw-collapsed-content-enter-active,
.bsw-collapsed-content-leave-active,
.bsw-regular-content-enter-active,
.bsw-regular-content-leave-active {
  transition: opacity 0.2s ease;
}

.bsw-collapsed-content-enter-from,
.bsw-collapsed-content-leave-to,
.bsw-regular-content-enter-from,
.bsw-regular-content-leave-to {
  opacity: 0;
}

.bsw-bottom-sheet-handle-container {
  flex-shrink: 0;
  padding: 8px 8px 0px 8px;
  user-select: none;
  touch-action: none;
  position: relative;
}
.bsw-bottom-sheet-handle-container .close-btn {
  position: absolute;
  top: 3px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  transition: opacity 0.2s;
  opacity: 0.4;
}

.bsw.bottom-sheet-handle-container .close-btn svg {
  color: var(--bsw-close-btn-color, rgba(0, 0, 0, 0.5));
  transition: color 0.2s;
}
</style>
