import { ref, computed, type Ref } from "vue";

interface UseAutoHeightParams {
	innerContentRef: Ref<HTMLElement | null>;
	headerHeight: Ref<number>;
}

interface UseAutoHeightReturn {
	contentHeight: Ref<number>;
	panelHeight: Ref<string>;
	isScrollable: Ref<boolean>;
	setCustomHeight: (height: string | number | undefined) => void;
	setupContentObserver: () => void;
	cleanup: () => void;
}

/**
 * Composable for auto-height calculation in fixed/auto-fit bottom sheet modes.
 *
 * Handles:
 * - Detecting content height via ResizeObserver
 * - Calculating panel height (content + header) capped at 95dvh
 * - Determining if content should be scrollable
 * - Custom height override support
 */
export function useAutoHeight(
	params: UseAutoHeightParams,
): UseAutoHeightReturn {
	const { innerContentRef, headerHeight } = params;

	const contentHeight = ref(0);
	let contentObserver: ResizeObserver | null = null;

	// Custom height override (from prop)
	const customHeight = ref<string | number | undefined>(undefined);

	/**
	 * Get dynamic viewport height (accounts for mobile browser bars)
	 */
	const getViewportHeight = (): number => {
		if (window.visualViewport) {
			return window.visualViewport.height;
		}
		return window.innerHeight;
	};

	/**
	 * Calculate max allowed height (95dvh)
	 */
	const maxHeightPx = computed(() => {
		return getViewportHeight() * 0.95;
	});

	/**
	 * Determine if content should be scrollable
	 */
	const isScrollable = computed(() => {
		if (customHeight.value) return true; // Always scrollable if custom height is set
		return contentHeight.value > maxHeightPx.value - headerHeight.value;
	});

	/**
	 * Calculate the panel height
	 * - If customHeight is set, use that
	 * - Otherwise, use contentHeight + header, capped at 95dvh
	 */
	const panelHeight = computed(() => {
		// If custom height is provided, use it directly
		if (customHeight.value) {
			return typeof customHeight.value === "number"
				? `${customHeight.value}px`
				: customHeight.value;
		}

		// Calculate required height
		const requiredHeight = headerHeight.value + contentHeight.value + 8;
		const totalHeight = Math.min(requiredHeight, maxHeightPx.value);

		return `${totalHeight}px`;
	});

	/**
	 * Set custom height from prop
	 */
	const setCustomHeight = (height: string | number | undefined): void => {
		customHeight.value = height;
	};

	/**
	 * Setup ResizeObserver to track content height
	 */
	const setupContentObserver = (): void => {
		if (contentObserver) contentObserver.disconnect();
		if (!innerContentRef.value) return;

		contentObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				contentHeight.value = entry.contentRect.height;
			}
		});
		contentObserver.observe(innerContentRef.value);
	};

	/**
	 * Cleanup observer
	 */
	const cleanup = (): void => {
		if (contentObserver) {
			contentObserver.disconnect();
			contentObserver = null;
		}
	};

	return {
		contentHeight,
		panelHeight,
		isScrollable,
		setCustomHeight,
		setupContentObserver,
		cleanup,
	};
}
