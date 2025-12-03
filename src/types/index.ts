import type { Component } from 'vue'

export type SheetSize = 'small' | 'medium' | 'large'
export type SheetMode = 'dynamic' | 'auto-fit' | 'fixed'

export interface BottomSheetProps {
  modelValue?: boolean
  component?: Component
  props?: Record<string, any>
  title?: string
  mode?: SheetMode
  initialSize?: SheetSize
  maxHeight?: string
  showHandle?: boolean
  showCloseButton?: boolean
  showBackdrop?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
  zIndex?: number
  clickToCollapse?: boolean
}

export interface SheetInstance {
  id: string
  component: Component
  props?: Record<string, any>
  size: SheetSize
  scrollPosition: number
  mode: SheetMode
  title?: string
  showHandle?: boolean
  showCloseButton?: boolean
  allowResize?: boolean
}

export interface SheetOptions {
  mode?: SheetMode
  initialSize?: SheetSize
  allowResize?: boolean
  maxHeight?: string
  showHandle?: boolean
  showCloseButton?: boolean
  showBackdrop?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
  title?: string
}

export interface GestureState {
  isDragging: boolean
  startY: number
  currentY: number
  deltaY: number
  velocity: number
}

export interface SheetState {
  currentSize: SheetSize
  mode: SheetMode
  scrollTop: number
  contentHeight: number
  isVisible: boolean
}

// Component metadata for auto-configuration
export interface BottomSheetMetadata {
  mode?: SheetMode
  initialSize?: SheetSize
  allowResize?: boolean
  maxHeight?: string
  hasInternalScroll?: boolean
}

// Extend Vue component type to include bottomSheet metadata
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    bottomSheet?: BottomSheetMetadata
  }
}