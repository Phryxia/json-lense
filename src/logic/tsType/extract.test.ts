import { describe, it, expect } from 'vitest'
import { extractTsType } from './extract'

describe('tsType/extract', () => {
  it('should extract primitive type', () => {
    expect(extractTsType(true)).toBe('boolean')
    expect(extractTsType(1)).toBe('number')
    expect(extractTsType('s')).toBe('string')
    expect(extractTsType(null)).toBe('null')
    expect(extractTsType(undefined)).toBe('undefined')
  })

  it('should extract array type', () => {
    expect(extractTsType([1, 's', null])).toMatchObject([
      'number',
      'string',
      'null',
    ])
    expect(extractTsType([[]])).toMatchObject([[]])
  })

  it('should extract object type', () => {
    expect(extractTsType({ a: 1, b: 's', c: null })).toMatchObject({
      a: { meta: 'object', type: 'number' },
      b: { meta: 'object', type: 'string' },
      c: { meta: 'object', type: 'null' },
    })
    expect(extractTsType({ a: { b: 1 } })).toMatchObject({
      a: { meta: 'object', type: { b: { meta: 'object', type: 'number' } } },
    })
  })
})
