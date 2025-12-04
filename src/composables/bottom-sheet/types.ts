import type { Ref } from 'vue'

/**
 * Gesture state for tracking drag/swipe interactions
 */
export interface GestureState {
    startY: number
    currentY: number
    startHeight: number
}

/**
 * Touch tracking state for backdrop interactions
 */
export interface BackdropTouchState {
    startY: number
    startTime: number
    isActive: boolean
}

/**
 * Content touch tracking state
 */
export interface ContentTouchState {
    isActive: boolean
    startY: number
}

/**
 * Resize observer cleanup function
 */
export type CleanupFunction = () => void

/**
 * Size calculation result
 */
export interface SizesPx {
    small: number
    medium: number
    large: number
}
