<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div v-if="isVisible" class="bottom-sheet-wrapper" :style="{ zIndex: zIndex }">
        <!-- Interaction Layer (Invisible Backdrop for clickToCollapse) -->
        <div v-if="clickToCollapse && currentSize !== 'small'" class="bottom-sheet-interaction-layer"
          @click="handleInteractionLayerClick"></div>

        <!-- Panel Principal -->
        <div class="bottom-sheet-panel" :class="[
          `bottom-sheet--${effectiveMode}`,
          `bottom-sheet--${currentSize}`,
          { 'bottom-sheet--dragging': isDragging }
        ]" :style="panelStyles">
          <!-- Header con Handle -->
          <div ref="headerRef" class="bottom-sheet-header" @click="handleHeaderClick"
            v-touch-pan.vertical.prevent.mouse="handleHeaderPan">
            <div v-if="showHandle" class="bottom-sheet-handle" />

            <div class="bottom-sheet-header-content">
              <slot name="header">
                <div class="bottom-sheet-title">{{ title }}</div>
              </slot>

              <q-btn v-if="showCloseButton" flat dense round icon="close" @click.stop="handleClose" />
            </div>
          </div>

          <!-- Content -->
          <div ref="contentWrapperRef" class="bottom-sheet-content"
            :class="{ 'bottom-sheet-content--scrollable': isScrollable }" @scroll="handleContentScroll"
            @touchstart="handleContentTouchStart" @touchmove="handleContentTouchMove" @touchend="handleContentTouchEnd">
            <div ref="innerContentRef" class="bottom-sheet-content-inner">
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
import type { BottomSheetProps } from '../types/bottom-sheet.types';

const props = withDefaults(defineProps<BottomSheetProps>(), {
  modelValue: false,
  title: '',
  mode: undefined,
  initialSize: 'small',
  allowResize: true,
  maxHeight: '95vh',
  showHandle: true,
  showCloseButton: true,
  showBackdrop: false,
  closeOnBackdrop: true,
  persistent: false,
  zIndex: 9000,
  clickToCollapse: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'opened': []
  'closed': []
  'size-change': [size: 'small' | 'medium' | 'large']
}>()

// Refs
const headerRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const innerContentRef = ref<HTMLElement | null>(null)
const contentScrollTop = ref(0)
const isDragging = ref(false)
const isClosing = ref(false)
const isVisible = ref(props.modelValue)
const detectedMode = ref<'dynamic' | 'auto-fit' | 'fixed'>('dynamic')
const currentSize = ref<'small' | 'medium' | 'large'>(props.initialSize || 'small')
const headerHeight = ref(0)
const contentHeight = ref(0)

// Gesture tracking
const gestureStartY = ref(0)
const gestureCurrentY = ref(0)
const gestureStartHeight = ref(0)

// Resize Observer
let headerResizeObserver: ResizeObserver | null = null
let contentResizeObserver: ResizeObserver | null = null

// Computed
const contentComponent = computed(() => props.component)
const contentProps = computed(() => props.props || {})

const effectiveMode = computed(() => {
  if (props.mode) return props.mode
  const componentMeta = (props.component as any)?.bottomSheet
  if (componentMeta?.mode) return componentMeta.mode
  return detectedMode.value
})

const isScrollable = computed(() => {
  if (effectiveMode.value === 'dynamic' && currentSize.value === 'large') return true
  if (effectiveMode.value === 'fixed') {
    // Enable scrolling in fixed mode if content overflows
    const currentHeight = sizesPx.value[currentSize.value]
    return contentHeight.value > (currentHeight - headerHeight.value)
  }
  if (effectiveMode.value === 'auto-fit') {
    const totalContentHeight = headerHeight.value + contentHeight.value
    const windowHeight = window.innerHeight
    
    // Calculate max height in pixels to compare
    let maxHeightPx = windowHeight * 0.95 // Default 95%
    
    if (props.maxHeight) {
      const parsed = parseFloat(props.maxHeight)
      if (!isNaN(parsed)) {
        if (props.maxHeight.endsWith('px')) {
           maxHeightPx = parsed
        } else {
           // Assume vh/dvh/%
           maxHeightPx = (parsed / 100) * windowHeight
        }
      }
    }
    
    return totalContentHeight > maxHeightPx
  }
  return false
})

// Dynamic Sizes Calculation
const sizesPx = computed(() => {
  const windowHeight = window.innerHeight
  const header = headerHeight.value

  const small = header
  
  if (effectiveMode.value === 'fixed') {
     return {
        small,
        medium: windowHeight * 0.45,
        large: windowHeight * 0.95
     }
  }

  const maxMedium = windowHeight * 0.45
  // Medium should be at least the header size, and at most maxMedium.
  // It should try to fit the content (header + contentHeight).
  const contentBasedMedium = header + contentHeight.value

  // If contentHeight is 0 (not yet measured), default to maxMedium to avoid flashing small
  const medium = contentHeight.value > 0
    ? Math.min(maxMedium, contentBasedMedium)
    : maxMedium

  const large = windowHeight * 0.95

  return { small, medium, large }
})

// Smart Expansion Logic
const canExpandToLarge = computed(() => {
  // If content fits in medium, don't expand to large
  // We compare contentHeight (px) with the available space in medium (medium - header)
  const availableHeightInMedium = sizesPx.value.medium - sizesPx.value.small
  // Add a small buffer (e.g. 10px) to avoid edge cases
  return contentHeight.value > (availableHeightInMedium + 10)
})

const panelStyles = computed(() => {
  let height: string

  if (effectiveMode.value === 'auto-fit') {
    const totalContentHeight = headerHeight.value + contentHeight.value
    const windowHeight = window.innerHeight
    
    // Calculate required height in dvh
    const requiredDvh = (totalContentHeight / windowHeight) * 100
    
    // Parse max-height (default to 95dvh)
    let maxDvh = 95
    if (props.maxHeight) {
      const parsed = parseFloat(props.maxHeight)
      if (!isNaN(parsed)) {
        // If it's pixels, convert to dvh, otherwise assume it's already a relative unit (vh/dvh/%)
        if (props.maxHeight.endsWith('px')) {
           maxDvh = (parsed / windowHeight) * 100
        } else {
           maxDvh = parsed
        }
      }
    }

    const finalDvh = Math.min(requiredDvh, maxDvh)
    height = `${finalDvh}dvh`
    
    // Add drag transform for auto-fit
    if (isDragging.value) {
      const deltaY = gestureCurrentY.value - gestureStartY.value
      if (deltaY > 0) { // Only allow dragging down
         return {
            height,
            transform: `translateY(${deltaY}px)`
         }
      }
    }
  } else if (effectiveMode.value === 'fixed') {
    // Fixed mode: Stick to initial size or current size, no dynamic gestures affecting height directly
    height = `${sizesPx.value[currentSize.value]}px`
    
    // Add drag transform for fixed mode (swipe to close)
    if (isDragging.value) {
      const deltaY = gestureCurrentY.value - gestureStartY.value
      if (deltaY > 0) { // Only allow dragging down
         return {
            height,
            transform: `translateY(${deltaY}px)`
         }
      }
    }
  } else {
    // Dynamic
    if (isDragging.value) {
      const deltaY = gestureCurrentY.value - gestureStartY.value
      const newHeight = gestureStartHeight.value - deltaY

      const minHeight = sizesPx.value.small
      const maxHeight = canExpandToLarge.value ? sizesPx.value.large : sizesPx.value.medium

      height = `${Math.max(minHeight, Math.min(maxHeight, newHeight))}px`
    } else {
      height = `${sizesPx.value[currentSize.value]}px`
    }
  }

  return {
    height,
    transform: isClosing.value ? 'translateY(100%)' : 'translateY(0)'
  }
})

// Methods
const updateHeaderHeight = () => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.offsetHeight
  }
}

const detectContentMode = async () => {
  await nextTick()
  if (!innerContentRef.value) return

  contentHeight.value = innerContentRef.value.offsetHeight
  detectedMode.value = 'dynamic'
}

// --- Gesture Handling ---

const startDrag = (y: number) => {
  // Removed early return for fixed mode to allow swipe-to-close
  // if (effectiveMode.value === 'fixed') return 

  isDragging.value = true
  gestureStartY.value = y
  gestureCurrentY.value = y
  gestureStartHeight.value = sizesPx.value[currentSize.value]
}

const updateDrag = (y: number) => {
  if (!isDragging.value) return
  gestureCurrentY.value = y
}

const endDrag = (y: number) => {
  if (!isDragging.value) return
  isDragging.value = false

  const deltaY = y - gestureStartY.value
  const SNAP_THRESHOLD = 50

  // Fixed mode: only allow closing on swipe down
  if (effectiveMode.value === 'fixed') {
    if (deltaY > SNAP_THRESHOLD) {
      handleClose()
    }
    return
  }

  if (effectiveMode.value === 'auto-fit') {
    if (deltaY > SNAP_THRESHOLD) {
      handleClose()
    }
    return
  }

  if (deltaY > SNAP_THRESHOLD) {
    // Dragged Down
    if (currentSize.value === 'large') {
      animateToSize('medium')
    } else if (currentSize.value === 'medium') {
      animateToSize('small')
    }
  } else if (deltaY < -SNAP_THRESHOLD) {
    // Dragged Up
    if (currentSize.value === 'small') {
      animateToSize('medium')
    } else if (currentSize.value === 'medium') {
      if (canExpandToLarge.value) {
        animateToSize('large')
      } else {
        // Snap back to medium if content is small
        animateToSize('medium')
      }
    }
  }
}

const handleHeaderPan = (details: any) => {
  const { isFirst, isFinal, position } = details

  if (isFirst) {
    startDrag(position.top)
  } else if (isFinal) {
    endDrag(position.top)
  } else {
    updateDrag(position.top)
  }
}

let isContentTouchActive = false
let contentTouchStartY = 0

const handleContentTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (touch === undefined) return
  contentTouchStartY = touch.clientY
  isContentTouchActive = true

  // Fixed mode: allow dragging only when at top
  if (effectiveMode.value === 'fixed') {
    // Will be handled in touchmove
    return
  }

  if (currentSize.value !== 'large' && effectiveMode.value !== 'auto-fit') {
    startDrag(touch.clientY)
  } else {
    // Large mode or auto-fit
    // Only drag if at top and pulling down
  }
}

const handleContentTouchMove = (e: TouchEvent) => {
  if (!isContentTouchActive) return

  const touch = e.touches[0]
  if (touch === undefined) return
  const currentY = touch.clientY
  const deltaY = currentY - contentTouchStartY

  if (isDragging.value) {
    e.preventDefault()
    updateDrag(currentY)
    return
  }

  if (effectiveMode.value === 'fixed') {
    if (contentScrollTop.value <= 0 && deltaY > 0) {
      startDrag(contentTouchStartY)
      updateDrag(currentY)
      e.preventDefault()
    }
    return
  }

  if (effectiveMode.value === 'auto-fit') {
    if (contentScrollTop.value <= 0 && deltaY > 0) {
      startDrag(contentTouchStartY)
      updateDrag(currentY)
      e.preventDefault()
    }
    // Else: allow native scroll
    return
  }

  if (currentSize.value === 'large') {
    if (contentScrollTop.value <= 0 && deltaY > 0) {
      startDrag(contentTouchStartY)
      updateDrag(currentY)
      e.preventDefault()
    }
  } else {
    if (!isDragging.value) {
      startDrag(contentTouchStartY)
      updateDrag(currentY)
    }
    e.preventDefault()
  }
}

const handleContentTouchEnd = (e: TouchEvent) => {
  isContentTouchActive = false
  if (isDragging.value) {
    const touch = e.changedTouches[0]
    if (touch === undefined) return
    endDrag(touch.clientY)
  }
}

const animateToSize = (size: 'small' | 'medium' | 'large') => {
  if (!props.allowResize && effectiveMode.value !== 'fixed') return
  if (effectiveMode.value === 'fixed') return // Explicitly block resizing in fixed mode

  // Check smart expansion limit
  if (size === 'large' && !canExpandToLarge.value) {
    // If trying to go large but content is small, stay at medium
    currentSize.value = 'medium'
    emit('size-change', 'medium')
    return
  }

  currentSize.value = size
  emit('size-change', size)
}

const handleHeaderClick = () => {
  // In auto-fit, we might want to allow closing on click if it's a toggle, 
  // but standard behavior is usually just for expansion. 
  // For now, we keep it disabled for auto-fit as requested (only swipe down).
  if (effectiveMode.value === 'auto-fit' || effectiveMode.value === 'fixed') return

  if (currentSize.value === 'small') {
    animateToSize('medium')
  } else if (currentSize.value === 'medium') {
    animateToSize('large')
  }
}

const handleContentScroll = (e: Event) => {
  const target = e.target as HTMLElement
  contentScrollTop.value = target.scrollTop
}

const handleInteractionLayerClick = () => {
  animateToSize('small')
}

const handleClose = () => {
  if (props.persistent) return
  
  // Start the close animation
  isClosing.value = true
  emit('close')
  
  // Wait for the animation to complete before actually hiding
  setTimeout(() => {
    isVisible.value = false
    isClosing.value = false
    emit('update:modelValue', false)
    emit('closed')
  }, 500)
}

const setupContentObserver = () => {
  if (contentResizeObserver) contentResizeObserver.disconnect()
  if (innerContentRef.value) {
    contentResizeObserver = new ResizeObserver(() => {
      detectContentMode()
    })
    contentResizeObserver.observe(innerContentRef.value)
  }
}

const open = () => {
  isVisible.value = true
  currentSize.value = props.initialSize || 'small'
  nextTick(() => {
    updateHeaderHeight()
    detectContentMode()
    setupContentObserver()
    emit('opened')
  })
}

const close = () => {
  handleClose()
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) open()
  else close()
})

onMounted(() => {
  if (props.modelValue) open()

  if (headerRef.value) {
    headerResizeObserver = new ResizeObserver(() => {
      updateHeaderHeight()
    })
    headerResizeObserver.observe(headerRef.value)
  }

  setupContentObserver()
})

onBeforeUnmount(() => {
  if (headerResizeObserver) headerResizeObserver.disconnect()
  if (contentResizeObserver) contentResizeObserver.disconnect()
})

defineExpose({
  open,
  close,
  animateToSize
})
</script>

<style lang="scss" scoped>
.bottom-sheet-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; // Allow clicks to pass through wrapper to underlying app
  z-index: 9000;
}

.bottom-sheet-interaction-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent; // Invisible
  pointer-events: auto; // Catch clicks
}

.bottom-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  pointer-events: auto; // Content is interactive
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height, transform;

  &.bottom-sheet--dragging {
    transition: none;
  }
}

.bottom-sheet-header {
  flex-shrink: 0;
  padding: 8px 16px 12px;
  cursor: pointer;
  user-select: none;
  touch-action: none; // Important for dragging
}

.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  margin: 0 auto 12px;
}

.bottom-sheet-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bottom-sheet-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.bottom-sheet-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none; // Prevent pull-to-refresh on the content itself

  &:not(.bottom-sheet-content--scrollable) {
    overflow-y: hidden;
  }
}

// Transition
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  .bottom-sheet-panel {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  .bottom-sheet-panel {
    transform: translateY(100%);
  }
}
</style>


