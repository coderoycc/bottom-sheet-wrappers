// Main library entry point
export { default as BottomSheet } from './components/BottomSheet.vue'
export { default as FixedBottomSheet } from './components/FixedBottomSheet.vue'

// Export types
export type {
    BottomSheetProps,
    SheetSize,
    SheetMode,
    SheetOptions,
    SheetInstance,
    SheetState,
    GestureState,
    BottomSheetMetadata
} from './types'

export type { FixedBottomSheetProps } from './components/FixedBottomSheet.vue'

// Default export
import BottomSheet from './components/BottomSheet.vue'
export default BottomSheet
