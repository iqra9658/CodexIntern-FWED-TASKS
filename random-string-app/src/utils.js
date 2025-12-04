export const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~`'
}

// Use Crypto API if available for better randomness
export function secureRandomInt(max) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // create a Uint32 array with a single element
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return arr[0] % max
  }

  return Math.floor(Math.random() * max)
}

export function generateRandomString(length = 12, { lower = true, upper = true, digits = true, symbols = false } = {}) {
  const sets = []
  if (lower) sets.push(CHARSETS.lower)
  if (upper) sets.push(CHARSETS.upper)
  if (digits) sets.push(CHARSETS.digits)
  if (symbols) sets.push(CHARSETS.symbols)

  if (sets.length === 0) return ''

  const charset = sets.join('')
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[secureRandomInt(charset.length)]
  }
  return result
}

export async function copyToClipboard(text) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for browsers without clipboard API
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}