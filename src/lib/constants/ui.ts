// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const

// Toast notification durations
export const TOAST_DURATIONS = {
  success: 3000,
  error: 5000,
  info: 4000,
  warning: 4000,
} as const

// Haptic feedback patterns
export const HAPTIC_PATTERNS = {
  tap: 50,
  success: [100, 50, 100],
  error: [200, 100, 200],
  warning: 150,
  longPress: 100,
} as const

// Chart dimensions
export const CHART_DIMENSIONS = {
  height: 192,
  minHeight: 192,
  aspectRatio: "auto",
} as const
