import { describe, it, expect, test } from 'vitest'
import { renderTsType } from './render'
import { extractTsType } from './extract'

describe('tsType/render', () => {
  it('should render primitive type as is', () => {
    expect(renderTsType(extractTsType(true))).toBe('type Type = boolean')
    expect(renderTsType(extractTsType(0))).toBe('type Type = number')
    expect(renderTsType(extractTsType(''))).toBe('type Type = string')
    expect(renderTsType(extractTsType(null))).toBe('type Type = null')
    expect(renderTsType(extractTsType(undefined))).toBe('type Type = undefined')
  })

  describe('should properly render array type', () => {
    test('empty', () => {
      expect(renderTsType(extractTsType([]))).toBe('type Type = []')
    })

    it('should add subtypes for each element in array', () => {
      expect(renderTsType(extractTsType([0, 1, 2]))).toBe(
        'type Type = [number, number, number]',
      )
    })

    it('should add nested sub indices properly', () => {
      expect(renderTsType(extractTsType([0, [1, 2]]))).toBe(
        'type Type = [number, [number, number]]',
      )
    })
  })

  describe('should properly render object type', () => {
    test('empty', () => {
      expect(renderTsType(extractTsType({}))).toBe('type Type = {  }')
    })

    describe('should add path of properties', () => {
      test('single', () => {
        expect(renderTsType(extractTsType({ a: 0 }))).toBe(
          'type Type = { a: number; }',
        )
      })

      test('multiple', () => {
        expect(renderTsType(extractTsType({ a: 0, b: 1 }))).toBe(
          'type Type = { a: number; b: number; }',
        )
      })
    })

    it('should add nested sub indices properly', () => {
      expect(renderTsType(extractTsType({ a: 0, b: { c: 1, d: 2 } }))).toBe(
        'type Type = { a: number; b: { c: number; d: number; }; }',
      )
    })

    it('should add optional properties', () => {
      expect(
        renderTsType({
          a: { meta: 'object', type: 'number', isOptional: true },
          b: { meta: 'object', type: 'number', isOptional: false },
        }),
      ).toBe('type Type = { a?: number; b: number; }')
    })
  })

  describe('should properly render union type', () => {
    it('should add sub types first and remove duplicated one', () => {
      expect(
        renderTsType({
          meta: 'union',
          types: ['number', 'number', 'string', 'null', 'undefined'],
        }),
      ).toBe('type Type = number | string | null | undefined')
    })
  })
})
