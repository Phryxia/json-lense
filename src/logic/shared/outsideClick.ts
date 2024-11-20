export function checkOutside(
  e: MouseEvent,
  predicate: HTMLElement | ((checking: HTMLElement) => boolean),
) {
  if (e.target instanceof HTMLElement) {
    let current = e.target as HTMLElement | null

    while (current) {
      if (
        typeof predicate === 'function'
          ? predicate(current)
          : current === predicate
      )
        return false
      current = current.parentElement
    }
  }
  return true
}
