<template>
  <Teleport to="body">
    <Transition name="bsw-bottom-sheet">
      <div v-if="isVisible" class="bsw-bottom-sheet-wrapper" :style="{ zIndex: computedZIndex }" v-bind="$attrs">
        <!-- Backdrop Layer -->
        <!-- Se oculta al hacer click si closeOnBackdrop = true y no es persistent -->
        <div v-if="showBackdrop" class="bsw-bottom-sheet-backdrop" :class="{
          'bsw-bottom-sheet-backdrop--visible': showBackdrop,
          'bsw-bottom-sheet-backdrop--closing': isClosing
        }" @click="handleBackdropClick"></div>

        <!-- Panel Principal -->
        <div ref="panelRef" class="bsw-bottom-sheet-panel bsw-bottom-sheet--fixed" :class="[
          { 'bsw-bottom-sheet--dragging': isDragging }
        ]" :style="panelStyles" @transitionend="handleTransitionEnd">
          <!-- Header con Handle -->
          <div ref="headerRef" class="bsw-bottom-sheet-header" @click="handleHeaderClick"
            @touchstart="handleHeaderTouchStart" @touchmove="handleHeaderTouchMove" @touchend="handleHeaderTouchEnd"
            @mousedown="handleHeaderMouseDown">

            <!-- Handle -->
            <div v-if="!hideDragHandle" class="bsw-bottom-sheet-handle" />

            <!-- Close Button (solo si no hay header personalizado) -->
            <!-- Se oculta si hideCloseButton es true o si persistent es true -->
            <button v-if="!hideCloseButton && !persistent && !hasHeaderSlot" class="bsw-bottom-sheet-close-btn"
              @click.stop="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Header Content -->
            <div class="bsw-bottom-sheet-header-content">
              <slot name="header">
                <div v-if="title" class="bsw-bottom-sheet-title">{{ title }}</div>
              </slot>
            </div>
          </div>

          <!-- Content -->
          <div ref="contentWrapperRef" class="bsw-bottom-sheet-content"
            :class="{ 'bsw-bottom-sheet-content--scrollable': isScrollable }" @scroll="handleContentScroll"
            @touchstart="handleContentTouchStart" @touchmove="handleContentTouchMove" @touchend="handleContentTouchEnd">
            <div ref="innerContentRef" class="bsw-bottom-sheet-content-inner">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { useAutoHeight } from '../composables/bottom-sheet/useAutoHeight'
import { useSimpleGestures } from '../composables/bottom-sheet/useSimpleGestures'
import { useContentScroll } from '../composables/bottom-sheet/useContentScroll'

defineOptions({
  inheritAttrs: false
})

// ============================================================================
// Props & Emits
// ============================================================================

export interface SimpleBottomSheetProps {
  modelValue?: boolean
  props?: Record<string, any>
  title?: string
  height?: string | number
  showBackdrop?: boolean
  hideCloseButton?: boolean
  hideDragHandle?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
  zIndex?: number
}

const props = withDefaults(defineProps<SimpleBottomSheetProps>(), {
  modelValue: false,
  title: '',
  height: undefined,
  showBackdrop: false,
  hideCloseButton: false,
  hideDragHandle: false,
  closeOnBackdrop: true,
  persistent: false,
  zIndex: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'opened': []
  'closed': []
  'before-close': []
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
const headerHeight = ref(0)

// ResizeObserver for header
let headerObserver: ResizeObserver | null = null

// ============================================================================
// Computed
// ============================================================================
const slots = useSlots()
const hasHeaderSlot = computed(() => !!slots['header'])

/** 
 * Computed zIndex - adds 9000 to the provided value 
 */
const computedZIndex = computed(() => {
  return (props.zIndex || 0) + 9000
})

// ============================================================================
// Content Scroll Tracking
// ============================================================================

const {
  contentScrollTop,
  handleContentScroll
} = useContentScroll()

// ============================================================================
// Auto Height Composable
// ============================================================================

const {
  panelHeight,
  isScrollable,
  setCustomHeight,
  setupContentObserver,
  cleanup: cleanupAutoHeight
} = useAutoHeight({
  innerContentRef,
  headerHeight
})

/**
 * Apply custom height from prop
 */
watch(() => props.height, (newHeight) => {
  setCustomHeight(newHeight)
}, { immediate: true })

/**
 * Panel inline styles with drag transform
 */
const panelStyles = computed<Record<string, string>>(() => {
  const height = panelHeight.value
  const styles: Record<string, string> = { height }

  // Add drag transform when dragging
  if (isDragging.value) {
    const deltaY = gestureState.currentY.value - gestureState.startY.value
    if (deltaY > 0) {
      styles.transform = `translateY(${deltaY}px)`
    }
  }

  if (isClosing.value) {
    styles.transform = 'translateY(100%)'
  }

  return styles
})

// ============================================================================
// Gesture Handling
// ============================================================================

const close = (): void => {
  if (!isVisible.value || isClosing.value) return

  isClosing.value = true
  emit('before-close')

  setTimeout(() => {
    if (!isClosing.value) return

    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')
    unlockBodyScroll()
  }, 300)
}

const {
  isDragging,
  gestureState,
  handleHeaderTouchStart,
  handleHeaderTouchMove,
  handleHeaderTouchEnd,
  handleHeaderMouseDown,
  handleContentTouchStart,
  handleContentTouchMove,
  handleContentTouchEnd
} = useSimpleGestures({
  contentScrollTop,
  handleClose: () => close(),
  persistent: computed(() => props.persistent)
})

// Header click handler (no expand in simple mode)
const handleHeaderClick = (): void => {
  // Simple mode: header click does nothing
}

// Backdrop click handler
const handleBackdropClick = (): void => {
  if (!props.persistent && props.closeOnBackdrop) {
    close()
  }
}

// ============================================================================
// Transition & Scroll Lock
// ============================================================================

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

const lockBodyScroll = (): void => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
}

const unlockBodyScroll = (): void => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const setupHeaderObserver = (): void => {
  if (headerObserver) headerObserver.disconnect()
  if (!headerRef.value) return

  headerObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      headerHeight.value = entry.contentRect.height + 16 // padding compensation
    }
  })
  headerObserver.observe(headerRef.value)
}

const open = (): void => {
  isVisible.value = true

  nextTick(() => {
    setupHeaderObserver()
    setupContentObserver()
    emit('opened')
    lockBodyScroll()
  })
}



watch(() => props.modelValue, (newVal: boolean) => {
  if (newVal) open() // abrir modales
  else close()
})

onMounted(() => {
  if (props.modelValue) open()
  setupHeaderObserver()
  setupContentObserver()
})

onBeforeUnmount(() => {
  if (headerObserver) headerObserver.disconnect()
  cleanupAutoHeight()
  unlockBodyScroll()
})
</script>

<style lang="scss" scoped></style>
