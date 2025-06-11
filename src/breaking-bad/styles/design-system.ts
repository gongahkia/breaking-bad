// Design System
const styles = {
  // Layout
  layout: {
    container: "w-screen h-screen flex flex-col bg-gray-100 overflow-hidden",
    header: "text-center py-6 bg-white shadow-sm border-b border-gray-200 flex-shrink-0",
    main: "flex-1 bg-white shadow-2xl m-4 rounded-3xl overflow-hidden",
    footer: "text-center py-4 bg-white border-t border-gray-200 text-xs text-gray-400 flex-shrink-0",
    content: "h-full p-8",
  },

  // Typography
  typography: {
    h1: "text-3xl font-bold text-gray-900 mb-1",
    h2: "text-2xl font-bold text-gray-800 mb-2",
    h3: "text-xl font-semibold text-gray-800 mb-2",
    h4: "text-lg font-semibold text-gray-800 mb-2",
    subtitle: "text-gray-500 text-base",
    body: "text-sm text-gray-600",
    small: "text-xs text-gray-500",
  },

  // Form Elements
  form: {
    label: "block text-sm font-medium text-gray-600 mb-2",
    input: "w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400",
    inputDisabled: "w-full px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200",
    button: {
      base: "px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200",
      primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50",
      secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl",
    },
  },

  // Cards
  card: {
    base: "bg-white rounded-lg border border-gray-200 shadow-sm",
    header: "p-4 border-b border-gray-200",
    body: "p-4",
    footer: "p-4 border-t border-gray-200",
  },

  // Grid
  grid: {
    container: "grid gap-4",
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },

  // Status Messages
  status: {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800",
  },

  // Animations
  animation: {
    spin: "animate-spin",
    pulse: "animate-pulse",
    fadeIn: "animate-fade-in",
    slideIn: "animate-slide-in",
  },

  // Loading States
  loading: {
    spinner: "h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin",
    overlay: "absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 animate-pulse",
  },
} as const;

export { styles }; 