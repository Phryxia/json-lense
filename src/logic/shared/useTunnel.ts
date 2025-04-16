import { useRef } from 'react'

/**
 * React 클로저의 엔티티를 React 외부의 특정 공간에 연결해준다.
 */
export function useTunnel<T>(value: T) {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}
