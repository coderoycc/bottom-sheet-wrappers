import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue'
import type { SheetMode } from '../../types'

interface UseModeDetectionParams {
    props: {
        mode?: SheetMode
        component?: any
    }
    innerContentRef: Ref<HTMLElement | null>
    contentHeight: Ref<number>
}

interface UseModeDetectionReturn {
    effectiveMode: ComputedRef<SheetMode>
    detectedMode: Ref<SheetMode>
    detectContentMode: () => Promise<void>
}

/**
 * Composable for detecting and managing the bottom sheet mode
 * 
 * Determines the effective mode based on:
 * 1. Explicit prop mode
 * 2. Component metadata
 * 3. Auto-detected mode based on content
 */
export function useModeDetection(params: UseModeDetectionParams): UseModeDetectionReturn {
    const { props, innerContentRef, contentHeight } = params

    const detectedMode = ref<SheetMode>('dynamic')

    const effectiveMode = computed<SheetMode>(() => {
        // Priority 1: Explicit mode prop
        if (props.mode) return props.mode

        // Priority 2: Component metadata
        const componentMeta = (props.component as any)?.bottomSheet
        if (componentMeta?.mode) return componentMeta.mode

        // Priority 3: Auto-detected mode
        return detectedMode.value
    })

    const detectContentMode = async (): Promise<void> => {
        await nextTick()
        if (!innerContentRef.value) return

        contentHeight.value = innerContentRef.value.offsetHeight
        detectedMode.value = 'dynamic'
    }

    return {
        effectiveMode,
        detectedMode,
        detectContentMode
    }
}
