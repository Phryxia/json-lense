import { useCallback, useReducer } from 'react'
import { Pool } from './pool'

interface UsePoolState<T> {
  pool: Pool<T>
  values: T[]
}

type UsePoolActions<T> = ['create', T] | ['remove', number] | ['clear']

export function usePool<T>(initialValues: T[] = []) {
  const [{ values }, dispatch] = useReducer(reducer, {
    pool: new Pool<T>(initialValues),
    values: initialValues,
  })

  const create = useCallback(
    (value: T) => dispatch(['create', value]),
    [dispatch],
  )
  const remove = useCallback(
    (id: number) => dispatch(['remove', id]),
    [dispatch],
  )
  const clear = useCallback(() => dispatch(['clear']), [dispatch])

  return {
    values,
    create,
    remove,
    clear,
  }
}

function reducer<T>({ pool }: UsePoolState<T>, action: UsePoolActions<T>) {
  switch (action[0]) {
    case 'create':
      pool.create(action[1])
      break
    case 'remove':
      pool.remove(action[1])
      break
    case 'clear':
      pool.clear()
      break
  }

  return {
    pool,
    values: [...pool],
  }
}
