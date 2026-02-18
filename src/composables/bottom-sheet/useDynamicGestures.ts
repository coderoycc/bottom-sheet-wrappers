import { ref, type Ref, type ComputedRef } from 'vue'
import type { SizesPx } from './types'

export type DynamicSize = 'collapsed' | 'half' | 'full'

interface UseDynamicGesturesParams {
    currentSize: Ref<DynamicSize>
    sizesPx: ComputedRef<SizesPx>
    canExpandToFull: ComputedRef<boolean>
    contentScrollTop: Ref<number>
    animateToSize: (size: DynamicSize) => void
    handleClose: () => void
}

interface UseDynamicGesturesReturn {
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
/** Minimum vertical movement before we decide it's a vertical gesture (vs horizontal scroll) */
const DIRECTION_LOCK_THRESHOLD = 8

/**
 * Map DynamicSize to SizesPx keys
 */
const sizeKey = (size: DynamicSize): keyof SizesPx => {
    if (size === 'collapsed') return 'small'
    if (size === 'half') return 'medium'
    return 'large'
}

/**
 * Composable for handling all drag/swipe gestures in dynamic bottom sheet
 *
 * Manages:
 * - Header pan gestures (fluid height resize while dragging)
 * - Header click to cycle sizes
 * - Content touch gestures with scroll detection
 * - Three breakpoints: collapsed → half → full
 * - Vertical-only gesture lock: horizontal swipes are ignored to allow horizontal scrolling
 */
export function useDynamicGestures(params: UseDynamicGesturesParams): UseDynamicGesturesReturn {
    const {
        currentSize,
        sizesPx,
        canExpandToFull,
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

    // Direction lock state for content gestures
    // 'none' = not yet determined, 'vertical' = locked vertical, 'horizontal' = locked horizontal (ignore)
    let directionLock: 'none' | 'vertical' | 'horizontal' = 'none'
    let touchStartX = 0

    // --- Internal Gesture Methods ---

    const startDrag = (y: number): void => {
        isDragging.value = true
        gestureStartY.value = y
        gestureCurrentY.value = y
        gestureStartHeight.value = sizesPx.value[sizeKey(currentSize.value)]
    }

    const updateDrag = (y: number): void => {
        if (!isDragging.value) return
        gestureCurrentY.value = y
    }

    const endDrag = (y: number): void => {
        if (!isDragging.value) return
        isDragging.value = false

        const deltaY = y - gestureStartY.value

        // Dragged Down — shrink
        if (deltaY > SNAP_THRESHOLD) {
            if (currentSize.value === 'full') {
                animateToSize('half')
            } else if (currentSize.value === 'half') {
                animateToSize('collapsed')
            }
            // collapsed + drag down: no-op
        }
        // Dragged Up — expand
        else if (deltaY < -SNAP_THRESHOLD) {
            if (currentSize.value === 'collapsed') {
                animateToSize('half')
            } else if (currentSize.value === 'half') {
                if (canExpandToFull.value) {
                    animateToSize('full')
                } else {
                    animateToSize('half')
                }
            }
            // full + drag up: no-op
        }
    }

    const cancelDrag = (): void => {
        if (isDragging.value) {
            isDragging.value = false
            // Snap back to current size (no change)
            gestureCurrentY.value = gestureStartY.value
        }
    }

    // --- Public Handlers: Header ---
    // Header gestures are always vertical (touch-action: none on header element)

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

        document.removeEventListener('mousemove', handleDocumentMouseMove)
        document.removeEventListener('mouseup', handleDocumentMouseUp)
    }

    // Header click — cycle through sizes
    const handleHeaderClick = (): void => {
        if (currentSize.value === 'collapsed') {
            animateToSize('half')
        } else if (currentSize.value === 'half') {
            if (canExpandToFull.value) {
                animateToSize('full')
            } else {
                animateToSize('collapsed')
            }
        } else if (currentSize.value === 'full') {
            animateToSize('collapsed')
        }
    }

    // --- Public Handlers: Content ---
    // Content gestures need direction lock to allow horizontal scrolling

    const handleContentTouchStart = (event: TouchEvent): void => {
        const touch = event.touches[0]
        if (touch === undefined) return

        contentTouchStartY.value = touch.clientY
        contentTouchIsActive.value = true
        directionLock = 'none'
        touchStartX = touch.clientX

        // In non-full sizes where content doesn't scroll, we'll decide direction in touchmove
        // Don't start drag yet — wait for direction lock
    }

    const handleContentTouchMove = (event: TouchEvent): void => {
        if (!contentTouchIsActive.value) return

        const touch = event.touches[0]
        if (touch === undefined) return

        const currentY = touch.clientY
        const currentX = touch.clientX
        const deltaY = currentY - contentTouchStartY.value
        const deltaX = currentX - touchStartX

        // If already dragging (direction was locked vertical), continue
        if (isDragging.value) {
            event.preventDefault()
            updateDrag(currentY)
            return
        }

        // Determine direction lock if not yet decided
        if (directionLock === 'none') {
            const absX = Math.abs(deltaX)
            const absY = Math.abs(deltaY)

            // Need minimum movement to decide
            if (absX < DIRECTION_LOCK_THRESHOLD && absY < DIRECTION_LOCK_THRESHOLD) {
                return // Not enough movement yet
            }

            if (absX > absY) {
                // Horizontal gesture — let browser handle it (horizontal scroll)
                directionLock = 'horizontal'
                return
            } else {
                // Vertical gesture — we handle it
                directionLock = 'vertical'
            }
        }

        // If locked horizontal, do nothing (allow native horizontal scroll)
        if (directionLock === 'horizontal') {
            return
        }

        // Vertical gesture handling
        if (currentSize.value === 'full') {
            // Full size: start drag only when scrolled to top and pulling down
            if (contentScrollTop.value <= 0 && deltaY > 0) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
                event.preventDefault()
            }
        } else {
            // Non-full sizes: always drag vertically
            if (!isDragging.value) {
                startDrag(contentTouchStartY.value)
                updateDrag(currentY)
            }
            event.preventDefault()
        }
    }

    const handleContentTouchEnd = (event: TouchEvent): void => {
        contentTouchIsActive.value = false
        directionLock = 'none'

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
