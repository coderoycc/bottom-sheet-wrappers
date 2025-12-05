import { ref, type Ref, type ComputedRef } from 'vue'
import type { SheetMode, SheetSize } from '../../types'
import type { SizesPx } from './types'

interface UseGestureHandlingParams {
    effectiveMode: ComputedRef<SheetMode>
    currentSize: Ref<SheetSize>
    sizesPx: ComputedRef<SizesPx>
    canExpandToLarge: ComputedRef<boolean>
    contentScrollTop: Ref<number>
    animateToSize: (size: SheetSize) => void
    handleClose: () => void
}

interface UseGestureHandlingReturn {
    isDragging: Ref<boolean>
    gestureState: {
        startY: Ref<number>
        currentY: Ref<number>
        startHeight: Ref<number>
    }
    contentTouchState: {
        isActive: Ref<boolean>
        startY: Ref<number>
    }
    handleHeaderTouchStart: (event: TouchEvent) => void
    handleHeaderTouchMove: (event: TouchEvent) => void
    handleHeaderTouchEnd: (event: TouchEvent) => void
    handleHeaderMouseDown: (event: MouseEvent) => void
    handleHeaderClick: () => void
    handleContentTouchStart: (event: TouchEvent) => void
    handleContentTouchMove: (event: TouchEvent) => void
    handleContentTouchEnd: (event: TouchEvent) => void
}

const SNAP_THRESHOLD = 50

/**
 * Composable for handling all drag/swipe gestures
 * 
 * Manages:
 * - Header pan gestures (Quasar touch-pan directive)
 * - Header click to expand
 * - Content touch gestures with scroll detection
 * - Mode-specific gesture behavior
 */
export function useGestureHandling(params: UseGestureHandlingParams): UseGestureHandlingReturn {
    const {
        effectiveMode,
        currentSize,
        sizesPx,
        canExpandToLarge,
        contentScrollTop,
        animateToSize,
        handleClose
    } = params

    const isDragging = ref(false)

    // Gesture state
    const gestureStartY = ref(0)
    const gestureCurrentY = ref(0)
    const gestureStartHeight = ref(0)

    // Content touch state
    const contentTouchIsActive = ref(false)
    const contentTouchStartY = ref(0)

    // --- Internal Gesture Methods ---

    const startDrag = (y: number): void => {
        isDragging.value = true
        gestureStartY.value = y
        gestureCurrentY.value = y
        gestureStartHeight.value = sizesPx.value[currentSize.value]
    }

    const updateDrag = (y: number): void => {
        if (!isDragging.value) return
        gestureCurrentY.value = y
    }

    const endDrag = (y: number): void => {
        if (!isDragging.value) return
        isDragging.value = false

        const deltaY = y - gestureStartY.value

        // Fixed mode: only allow closing on swipe down
        if (effectiveMode.value === 'fixed') {
            if (deltaY > SNAP_THRESHOLD) {
                handleClose()
            }
            return
        }

        // Auto-fit mode: only allow closing on swipe down
        if (effectiveMode.value === 'auto-fit') {
            if (deltaY > SNAP_THRESHOLD) {
                handleClose()
            }
            return
        }

        // Dynamic mode: resize based on drag direction
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

    // --- Public Handlers ---

    const handleHeaderTouchStart = (event: TouchEvent): void => {
        const touch = event.touches[0]
        if (touch === undefined) return

        startDrag(touch.clientY)
    }

    const handleHeaderTouchMove = (event: TouchEvent): void => {
        if (!isDragging.value) return

        const touch = event.touches[0]
        if (touch === undefined) return

        event.preventDefault()
        updateDrag(touch.clientY)
    }

    const handleHeaderTouchEnd = (event: TouchEvent): void => {
        if (!isDragging.value) return

        const touch = event.changedTouches[0]
        if (touch === undefined) return

        endDrag(touch.clientY)
    }

    // Mouse events (desktop)
    const handleHeaderMouseDown = (event: MouseEvent): void => {
        event.preventDefault()
        startDrag(event.clientY)

        // Add global mouse event listeners
        document.addEventListener('mousemove', handleDocumentMouseMove)
        document.addEventListener('mouseup', handleDocumentMouseUp)
    }

    const handleDocumentMouseMove = (event: MouseEvent): void => {
        if (!isDragging.value) return

        event.preventDefault()
        updateDrag(event.clientY)
    }

    const handleDocumentMouseUp = (event: MouseEvent): void => {
        if (!isDragging.value) return

        event.preventDefault()
        endDrag(event.clientY)

        // Remove global mouse event listeners
        document.removeEventListener('mousemove', handleDocumentMouseMove)
        document.removeEventListener('mouseup', handleDocumentMouseUp)
    }

    const handleHeaderClick = (): void => {
        // In auto-fit and fixed modes, header click doesn't expand
        if (effectiveMode.value === 'auto-fit' || effectiveMode.value === 'fixed') {
            return
        }

        // Dynamic mode: click to cycle through sizes
        if (currentSize.value === 'small') {
            animateToSize('medium')
        } else if (currentSize.value === 'medium') {
            if (canExpandToLarge.value) {
                animateToSize('large')
            } else {
                // If can't expand to large, go back to small
                animateToSize('small')
            }
        } else if (currentSize.value === 'large') {
            // Collapse back to small
            animateToSize('small')
        }
    }

    const handleContentTouchStart = (event: TouchEvent): void => {
        const touch = event.touches[0]
        if (touch === undefined) return

        contentTouchStartY.value = touch.clientY
        contentTouchIsActive.value = true

        // Fixed mode: allow dragging only when at top
        if (effectiveMode.value === 'fixed') {
            // Will be handled in touchmove
            return
        }

        if (currentSize.value !== 'large' && effectiveMode.value !== 'auto-fit') {
            startDrag(touch.clientY)
        }
        // Large mode or auto-fit: Only drag if at top and pulling down
    }

    const handleContentTouchMove = (event: TouchEvent): void => {
        if (!contentTouchIsActive.value) return

        const touch = event.touches[0]
        if (touch === undefined) return

        const currentY = touch.clientY
        const deltaY = currentY - contentTouchStartY.value

        if (isDragging.value) {
            event.preventDefault()
            updateDrag(currentY)
            return
        }

        // Fixed mode: start drag only when scrolled to top and pulling down
        if (effectiveMode.value === 'fixed') {
            if (contentScrollTop.value <= 0 && deltaY > 0) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
                event.preventDefault()
            }
            return
        }

        // Auto-fit mode: start drag only when scrolled to top and pulling down
        if (effectiveMode.value === 'auto-fit') {
            if (contentScrollTop.value <= 0 && deltaY > 0) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
                event.preventDefault()
            }
            return
        }

        // Dynamic mode
        if (currentSize.value === 'large') {
            if (contentScrollTop.value <= 0 && deltaY > 0) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
                event.preventDefault()
            }
        } else {
            if (!isDragging.value) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
            }
            event.preventDefault()
        }
    }

    const handleContentTouchEnd = (event: TouchEvent): void => {
        contentTouchIsActive.value = false

        if (isDragging.value) {
            const touch = event.changedTouches[0]
            if (touch === undefined) return
            endDrag(touch.clientY)
        }
    }

    return {
        isDragging,
        gestureState: {
            startY: gestureStartY,
            currentY: gestureCurrentY,
            startHeight: gestureStartHeight
        },
        contentTouchState: {
            isActive: contentTouchIsActive,
            startY: contentTouchStartY
        },
        handleHeaderTouchStart,
        handleHeaderTouchMove,
        handleHeaderTouchEnd,
        handleHeaderMouseDown,
        handleHeaderClick,
        handleContentTouchStart,
        handleContentTouchMove,
        handleContentTouchEnd
    }
}
