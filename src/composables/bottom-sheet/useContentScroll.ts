import { ref, type Ref } from 'vue'

interface UseContentScrollReturn {
    contentScrollTop: Ref<number>
    handleContentScroll: (event: Event) => void
}

/**
 * Composable for tracking content scroll position
 * 
 * Simple composable that tracks the scroll position of the content area.
 * Used to determine when to allow drag gestures vs native scrolling.
 */
export function useContentScroll(): UseContentScrollReturn {
    const contentScrollTop = ref(0)

    const handleContentScroll = (event: Event): void => {
        const target = event.target as HTMLElement
        contentScrollTop.value = target.scrollTop
    }

    return {
        contentScrollTop,
        handleContentScroll
    }
}
