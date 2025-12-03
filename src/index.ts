// Main library entry point
export { default as BottomSheet } from './components/BottomSheet.vue'

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

// Default export
import BottomSheet from './components/BottomSheet.vue'
export default BottomSheet
