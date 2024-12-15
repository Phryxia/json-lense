import { useCallback, useReducer, useRef } from 'react'

export function useSafeReducer<State, Action>(
  updater: (state: State, action: Action) => State,
  initialState: State,
) {
  const ref = useRef(initialState)
  const [, update] = useReducer(() => Math.random(), 0)

  const dispatch = useCallback((action: Action) => {
    ref.current = updater(ref.current, action)
    update()
  }, [])

  return [ref.current, dispatch] as const
}
