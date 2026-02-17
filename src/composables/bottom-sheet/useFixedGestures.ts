import { ref, type Ref } from 'vue'

interface UseFixedGesturesParams {
    contentScrollTop: Ref<number>
    handleClose: () => void
}

interface UseFixedGesturesReturn {
    isDragging: Ref<boolean>
    gestureState: {
        startY: Ref<number>
        currentY: Ref<number>
    }
    contentTouchState: {
        isActive: Ref<boolean>
        startY: Ref<number>
    }
    handleHeaderTouchStart: (event: TouchEvent) => void
    handleHeaderTouchMove: (event: TouchEvent) => void
    handleHeaderTouchEnd: (event: TouchEvent) => void
    handleHeaderMouseDown: (event: MouseEvent) => void
    handleContentTouchStart: (event: TouchEvent) => void
    handleContentTouchMove: (event: TouchEvent) => void
    handleContentTouchEnd: (event: TouchEvent) => void
}

const SWIPE_THRESHOLD = 50

/**
 * Simplified gesture composable for fixed mode bottom sheet.
 * 
 * Handles:
 * - Header pan gestures (swipe down to close)
 * - Content touch gestures with scroll detection
 * - Swipe down on content at top position to close
 */
export function useFixedGestures(params: UseFixedGesturesParams): UseFixedGesturesReturn {
    const {
        contentScrollTop,
        handleClose
    } = params

    const isDragging = ref(false)

    // Gesture state
    const gestureStartY = ref(0)
    const gestureCurrentY = ref(0)

    // Content touch state
    const contentTouchIsActive = ref(false)
    const contentTouchStartY = ref(0)

    // Internal methods
    const startDrag = (y: number): void => {
        isDragging.value = true
        gestureStartY.value = y
        gestureCurrentY.value = y
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
        if (deltaY > SWIPE_THRESHOLD) {
            handleClose()
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

    const handleContentTouchStart = (event: TouchEvent): void => {
        const touch = event.touches[0]
        if (touch === undefined) return

        contentTouchStartY.value = touch.clientY
        contentTouchIsActive.value = true
    }

    const handleContentTouchMove = (event: TouchEvent): void => {
        if (!contentTouchIsActive.value) return

        const touch = event.touches[0]
        if (touch === undefined) return

        const currentY = touch.clientY
        const deltaY = currentY - contentTouchStartY.value

        // Fixed mode: start drag only when scrolled to top and pulling down
        if (contentScrollTop.value <= 0 && deltaY > 0) {
            if (!isDragging.value) {
                startDrag(contentTouchStartY.value)
            }
            updateDrag(currentY)
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
            currentY: gestureCurrentY
        },
        contentTouchState: {
            isActive: contentTouchIsActive,
            startY: contentTouchStartY
        },
        handleHeaderTouchStart,
        handleHeaderTouchMove,
        handleHeaderTouchEnd,
        handleHeaderMouseDown,
        handleContentTouchStart,
        handleContentTouchMove,
        handleContentTouchEnd
    }
}
