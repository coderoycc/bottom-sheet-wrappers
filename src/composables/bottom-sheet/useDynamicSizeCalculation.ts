import { ref, computed, type Ref, type ComputedRef, type MaybeRef } from "vue";
import type { SizesPx } from "./types";

export type DynamicSize = "collapsed" | "half" | "full";

interface UseDynamicSizeCalculationParams {
	headerHeight: Ref<number>;
	contentHeight: Ref<number>;
	collapsedContentHeight: Ref<number>;
	isDragging: Ref<boolean>;
	isClosing: Ref<boolean>;
	hasCollapsedSlot: Ref<boolean> | ComputedRef<boolean>;
	gestureState: {
		startY: Ref<number>;
		currentY: Ref<number>;
		startHeight: Ref<number>;
	};
	props: {
		initialSize?: DynamicSize;
		half?: string;
		full?: string;
	};
	emit: (event: "size-change", size: DynamicSize) => void;
}

interface UseDynamicSizeCalculationReturn {
	currentSize: Ref<DynamicSize>;
	sizesPx: ComputedRef<SizesPx>;
	canExpandToFull: ComputedRef<boolean>;
	isScrollable: ComputedRef<boolean>;
	panelStyles: ComputedRef<Record<string, string>>;
	animateToSize: (size: DynamicSize) => void;
}

/**
 * Map DynamicSize to SizesPx keys
 */
const sizeKey = (size: DynamicSize): keyof SizesPx => {
	if (size === "collapsed") return "small";
	if (size === "half") return "medium";
	return "large";
};

/**
 * Composable for calculating dynamic bottom sheet sizes and styles
 *
 * Handles:
 * - Three breakpoints: collapsed (header only), half, full
 * - Auto-adjusts half/full if content is smaller than the breakpoint
 * - Fluid drag height during gestures
 * - Collapsed mode shows header or collapsed-content slot
 */
export function useDynamicSizeCalculation(
	params: UseDynamicSizeCalculationParams,
): UseDynamicSizeCalculationReturn {
	const {
		headerHeight,
		contentHeight,
		collapsedContentHeight,
		isDragging,
		isClosing,
		hasCollapsedSlot,
		gestureState,
		props,
		emit,
	} = params;

	const currentSize = ref<DynamicSize>(props.initialSize || "collapsed");

	// Helper to get dynamic viewport height
	const getViewportHeight = (): number => {
		if (window.visualViewport) {
			return window.visualViewport.height;
		}
		return window.innerHeight;
	};

	// Parse a size string (e.g. '45dvh', '95vh', '300px') to pixels
	const parseSizeToPx = (size: string): number => {
		const value = parseFloat(size);
		if (isNaN(value)) return 0;

		if (size.includes("dvh") || size.includes("vh") || size.includes("%")) {
			return (value / 100) * getViewportHeight();
		}
		if (size.includes("px")) {
			return value;
		}
		return value;
	};

	// Calculate sizes in pixels
	const sizesPx = computed<SizesPx>(() => {
		const header = headerHeight.value;
		const content = contentHeight.value;

		// Collapsed: header height, or header + collapsed-content if slot exists
		const small = hasCollapsedSlot.value
			? header + 18 + collapsedContentHeight.value
			: header + 18;

		// Half breakpoint from props, but capped to content if content is smaller
		const halfPx = parseSizeToPx(props.half || "45dvh");
		const contentBasedHalf = header + content + 18; // 8px buffer
		const medium =
			content > 0
				? Math.min(halfPx, Math.max(contentBasedHalf, small + 1))
				: halfPx;

		// Full breakpoint from props, but capped to content if content is smaller
		const fullPx = parseSizeToPx(props.full || "95dvh");
		const contentBasedFull = header + content + 18;
		const large =
			content > 0
				? Math.min(fullPx, Math.max(contentBasedFull, medium + 1))
				: fullPx;

		return { small, medium, large };
	});

	// Smart expansion: prevent expanding to full if content fits in half
	const canExpandToFull = computed(() => {
		const availableInHalf = sizesPx.value.medium - sizesPx.value.small;
		return contentHeight.value > availableInHalf + 18;
	});

	// Determine if content should be scrollable
	const isScrollable = computed(() => {
		if (currentSize.value === "full") {
			return true;
		}
		if (currentSize.value === "half") {
			const currentHeight = sizesPx.value.medium;
			return contentHeight.value > currentHeight - headerHeight.value;
		}
		return false;
	});

	// Calculate panel styles including height and drag transforms
	const panelStyles = computed<Record<string, string>>(() => {
		let height: string;

		if (isDragging.value) {
			// Fluid resize during drag
			const deltaY = gestureState.currentY.value - gestureState.startY.value;
			const newHeight = gestureState.startHeight.value - deltaY;

			const minHeight = sizesPx.value.small;
			const maxHeight = canExpandToFull.value
				? sizesPx.value.large
				: sizesPx.value.medium;

			height = `${Math.max(minHeight, Math.min(maxHeight, newHeight))}px`;
		} else {
			height = `${sizesPx.value[sizeKey(currentSize.value)]}px`;
		}

		const styles: Record<string, string> = { height };

		// Apply transform when closing (Vue transition handles opening)
		if (isClosing.value) {
			styles.transform = "translateY(100%)";
		}

		return styles;
	});

	const animateToSize = (size: DynamicSize): void => {
		// Check smart expansion limit
		if (size === "full" && !canExpandToFull.value) {
			currentSize.value = "half";
			emit("size-change", "half");
			return;
		}

		currentSize.value = size;
		emit("size-change", size);
	};

	return {
		currentSize,
		sizesPx,
		canExpandToFull,
		isScrollable,
		panelStyles,
		animateToSize,
	};
}
