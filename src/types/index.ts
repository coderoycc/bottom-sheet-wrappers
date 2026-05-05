import type { DynamicSize } from "src/components/BsDynamic.vue"

export interface DynamicBottomSheetProps {
  modelValue: boolean
  title?: string
  initialSize?: DynamicSize
  half?: string
  full?: string
  hideCloseButton?: boolean
  showBackdrop?: boolean
  hideDragHandle?: boolean
  zIndex?: number
}

export interface SimpleBottomSheetProps {
  modelValue?: boolean
  props?: Record<string, any>
  title?: string
  height?: string | number
  showBackdrop?: boolean
  hideCloseButton?: boolean
  hideDragHandle?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
  zIndex?: number
}
