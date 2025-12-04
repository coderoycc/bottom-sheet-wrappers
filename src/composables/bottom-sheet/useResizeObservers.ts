import { ref, onBeforeUnmount, type Ref } from 'vue'

interface UseResizeObserversParams {
    headerRef: Ref<HTMLElement | null>
    innerContentRef: Ref<HTMLElement | null>
    onContentResize?: () => void
}

interface UseResizeObserversReturn {
    headerHeight: Ref<number>
    contentHeight: Ref<number>
    setupHeaderObserver: () => void
    setupContentObserver: () => void
    cleanupObservers: () => void
}

/**
 * Composable for observing and tracking element dimensions
 * 
 * Uses ResizeObserver to track header and content heights.
 * Automatically cleans up observers on component unmount.
 */
export function useResizeObservers(params: UseResizeObserversParams): UseResizeObserversReturn {
    const { headerRef, innerContentRef, onContentResize } = params

    const headerHeight = ref(0)
    const contentHeight = ref(0)

    let headerResizeObserver: ResizeObserver | null = null
    let contentResizeObserver: ResizeObserver | null = null

    const setupHeaderObserver = (): void => {
        if (headerResizeObserver) {
            headerResizeObserver.disconnect()
        }

        if (headerRef.value) {
            headerResizeObserver = new ResizeObserver(() => {
                if (headerRef.value) {
                    headerHeight.value = headerRef.value.offsetHeight
                }
            })
            headerResizeObserver.observe(headerRef.value)
        }
    }

    const setupContentObserver = (): void => {
        if (contentResizeObserver) {
            contentResizeObserver.disconnect()
        }

        if (innerContentRef.value) {
            contentResizeObserver = new ResizeObserver(() => {
                if (onContentResize) {
                    onContentResize()
                }
            })
            contentResizeObserver.observe(innerContentRef.value)
        }
    }

    const cleanupObservers = (): void => {
        if (headerResizeObserver) {
            headerResizeObserver.disconnect()
            headerResizeObserver = null
        }
        if (contentResizeObserver) {
            contentResizeObserver.disconnect()
            contentResizeObserver = null
        }
    }

    // Auto cleanup on unmount
    onBeforeUnmount(() => {
        cleanupObservers()
    })

    return {
        headerHeight,
        contentHeight,
        setupHeaderObserver,
        setupContentObserver,
        cleanupObservers
    }
}
