export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<F>) =>
    new Promise<ReturnType<F>>((resolve) => {
      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = setTimeout(() => resolve(fn(...args)), delay)
    })
}
