import { computed, type Ref, type ComputedRef } from 'vue'
import type { SheetMode, SheetSize } from '../../types'

interface UseBackdropInteractionParams {
    effectiveMode: ComputedRef<SheetMode>
    currentSize: Ref<SheetSize>
    props: {
        showBackdrop?: boolean
        closeOnBackdrop?: boolean
    }
    animateToSize: (size: SheetSize) => void
    handleClose: () => void
}

interface UseBackdropInteractionReturn {
    shouldShowBackdrop: ComputedRef<boolean>
    handleBackdropClick: () => void
    handleBackdropTouchStart: (event: TouchEvent) => void
    handleBackdropTouchMove: (event: TouchEvent) => void
    handleBackdropTouchEnd: (event: TouchEvent) => void
}

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 0.5

/**
 * Composable for managing backdrop visibility and interactions
 * 
 * Handles mode-specific backdrop behavior:
 * - Dynamic: Always show when not small, collapse on any gesture
 * - Auto-fit: Show only if closeOnBackdrop=true, close on click
 * - Fixed: Never show backdrop
 */
export function useBackdropInteraction(params: UseBackdropInteractionParams): UseBackdropInteractionReturn {
    const {
        effectiveMode,
        currentSize,
        props,
        animateToSize,
        handleClose
    } = params

    // Backdrop touch tracking
    let backdropTouchStartY = 0
    let backdropTouchStartTime = 0
    let isBackdropTouchActive = false

    // Determine if backdrop should be shown based on mode
    const shouldShowBackdrop = computed(() => {
        if (effectiveMode.value === 'fixed') {
            // Fixed mode: Never show backdrop
            return false
        }

        if (effectiveMode.value === 'dynamic') {
            // Dynamic mode: Always show backdrop when not in 'small' size
            return currentSize.value !== 'small'
        }

        if (effectiveMode.value === 'auto-fit') {
            // Auto-fit mode: Only show if closeOnBackdrop is true
            return props.closeOnBackdrop === true
        }

        return false
    })

    const handleBackdropClick = (): void => {
        if (effectiveMode.value === 'dynamic') {
            // Dynamic mode: Collapse to small on click
            animateToSize('small')
        } else if (effectiveMode.value === 'auto-fit' && props.closeOnBackdrop) {
            // Auto-fit mode: Close only if closeOnBackdrop is true
            handleClose()
        }
        // Fixed mode: Do nothing (backdrop shouldn't even be visible)
    }

    const handleBackdropTouchStart = (event: TouchEvent): void => {
        if (effectiveMode.value !== 'dynamic') return // Only dynamic mode supports gestures

        const touch = event.touches[0]
        if (touch === undefined) return

        backdropTouchStartY = touch.clientY
        backdropTouchStartTime = Date.now()
        isBackdropTouchActive = true
    }

    const handleBackdropTouchMove = (event: TouchEvent): void => {
        if (effectiveMode.value !== 'dynamic' || !isBackdropTouchActive) return

        const touch = event.touches[0]
        if (touch === undefined) return

        const deltaY = touch.clientY - backdropTouchStartY

        // If user is swiping down or up significantly, we consider it a gesture
        if (Math.abs(deltaY) > 10) {
            event.preventDefault() // Prevent scrolling
        }
    }

    const handleBackdropTouchEnd = (event: TouchEvent): void => {
        if (effectiveMode.value !== 'dynamic' || !isBackdropTouchActive) return

        isBackdropTouchActive = false

        const touch = event.changedTouches[0]
        if (touch === undefined) return

        const deltaY = touch.clientY - backdropTouchStartY
        const deltaTime = Date.now() - backdropTouchStartTime
        const velocity = Math.abs(deltaY) / deltaTime

        // Detect any movement - very low threshold for sensitivity
        const MINIMAL_MOVEMENT = 5 // Very low threshold - any small movement counts

        if (Math.abs(deltaY) > MINIMAL_MOVEMENT || velocity > VELOCITY_THRESHOLD) {
            // Any gesture on backdrop in dynamic mode collapses to small
            animateToSize('small')
        } else {
            // Even tiny movement or tap, treat as click and collapse
            animateToSize('small')
        }
    }

    return {
        shouldShowBackdrop,
        handleBackdropClick,
        handleBackdropTouchStart,
        handleBackdropTouchMove,
        handleBackdropTouchEnd
    }
}
