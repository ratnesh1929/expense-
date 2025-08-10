// Helper functions for the app

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
} 