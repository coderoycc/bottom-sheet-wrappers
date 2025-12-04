import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { SheetSize, SheetMode } from '../../types'
import type { SizesPx } from './types'

interface UseSizeCalculationParams {
    effectiveMode: ComputedRef<SheetMode>
    headerHeight: Ref<number>
    contentHeight: Ref<number>
    isDragging: Ref<boolean>
    isClosing: Ref<boolean>
    gestureState: {
        startY: Ref<number>
        currentY: Ref<number>
        startHeight: Ref<number>
    }
    props: {
        initialSize?: SheetSize
        maxHeight?: string
    }
    emit: (event: 'size-change', size: SheetSize) => void
}

interface UseSizeCalculationReturn {
    currentSize: Ref<SheetSize>
    sizesPx: ComputedRef<SizesPx>
    canExpandToLarge: ComputedRef<boolean>
    isScrollable: ComputedRef<boolean>
    panelStyles: ComputedRef<Record<string, string>>
    animateToSize: (size: SheetSize) => void
}

/**
 * Composable for calculating bottom sheet sizes and styles
 * 
 * Handles:
 * - Size calculations based on mode (dynamic/auto-fit/fixed)
 * - Smart expansion logic (prevent expanding to large if content fits in medium)
 * - Scroll detection
 * - Panel style computation including drag transforms
 */
export function useSizeCalculation(params: UseSizeCalculationParams): UseSizeCalculationReturn {
    const {
        effectiveMode,
        headerHeight,
        contentHeight,
        isDragging,
        isClosing,
        gestureState,
        props,
        emit
    } = params

    const currentSize = ref<SheetSize>(props.initialSize || 'small')

    // Calculate sizes in pixels based on mode
    const sizesPx = computed<SizesPx>(() => {
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

    // Smart expansion logic - prevent expanding to large if content fits in medium
    const canExpandToLarge = computed(() => {
        const availableHeightInMedium = sizesPx.value.medium - sizesPx.value.small
        // Add a small buffer (10px) to avoid edge cases
        return contentHeight.value > (availableHeightInMedium + 10)
    })

    // Determine if content should be scrollable
    const isScrollable = computed(() => {
        if (effectiveMode.value === 'dynamic' && currentSize.value === 'large') {
            return true
        }

        if (effectiveMode.value === 'fixed') {
            // Enable scrolling in fixed mode if content overflows
            const currentHeight = sizesPx.value[currentSize.value]
            return contentHeight.value > (currentHeight - headerHeight.value)
        }

        if (effectiveMode.value === 'auto-fit') {
            // Add a small buffer to account for any padding/margin in the content wrapper
            const CONTENT_PADDING_BUFFER = 16 // 16px buffer for potential padding/margin
            const totalContentHeight = headerHeight.value + contentHeight.value + CONTENT_PADDING_BUFFER
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

    // Calculate panel styles including height and transforms
    const panelStyles = computed<Record<string, string>>(() => {
        let height: string

        if (effectiveMode.value === 'auto-fit') {
            // Add a small buffer to account for any padding/margin in the content wrapper
            const CONTENT_PADDING_BUFFER = 16 // 16px buffer for potential padding/margin
            const totalContentHeight = headerHeight.value + contentHeight.value + CONTENT_PADDING_BUFFER
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
                const deltaY = gestureState.currentY.value - gestureState.startY.value
                if (deltaY > 0) { // Only allow dragging down
                    return {
                        height,
                        transform: `translateY(${deltaY}px)`
                    }
                }
            }
        } else if (effectiveMode.value === 'fixed') {
            // Fixed mode: Stick to initial size or current size
            height = `${sizesPx.value[currentSize.value]}px`

            // Add drag transform for fixed mode (swipe to close)
            if (isDragging.value) {
                const deltaY = gestureState.currentY.value - gestureState.startY.value
                if (deltaY > 0) { // Only allow dragging down
                    return {
                        height,
                        transform: `translateY(${deltaY}px)`
                    }
                }
            }
        } else {
            // Dynamic mode
            if (isDragging.value) {
                const deltaY = gestureState.currentY.value - gestureState.startY.value
                const newHeight = gestureState.startHeight.value - deltaY

                const minHeight = sizesPx.value.small
                const maxHeight = canExpandToLarge.value ? sizesPx.value.large : sizesPx.value.medium

                height = `${Math.max(minHeight, Math.min(maxHeight, newHeight))}px`
            } else {
                height = `${sizesPx.value[currentSize.value]}px`
            }
        }

        const styles: Record<string, string> = { height }

        // Only apply transform when closing (Vue transition handles opening)
        if (isClosing.value) {
            styles.transform = 'translateY(100%)'
        }

        return styles
    })

    const animateToSize = (size: SheetSize): void => {
        if (effectiveMode.value === 'fixed') {
            // Explicitly block resizing in fixed mode
            return
        }

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

    return {
        currentSize,
        sizesPx,
        canExpandToLarge,
        isScrollable,
        panelStyles,
        animateToSize
    }
}
