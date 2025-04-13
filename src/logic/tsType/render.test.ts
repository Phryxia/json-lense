import { describe, it, expect, test } from 'vitest'
import { RenderedType, renderTsType } from './render'
import { extractTsType } from './extract'

describe('tsType/render', () => {
  it('should render primitive type as is', () => {
    expect(renderTsType(extractTsType(true), [])).toMatchObject({
      typeName: 'Type',
      ts: 'type Type = boolean',
    })
    expect(renderTsType(extractTsType(0), [])).toMatchObject({
      typeName: 'Type',
      ts: 'type Type = number',
    })
    expect(renderTsType(extractTsType(''), [])).toMatchObject({
      typeName: 'Type',
      ts: 'type Type = string',
    })
    expect(renderTsType(extractTsType(null), [])).toMatchObject({
      typeName: 'Type',
      ts: 'type Type = null',
    })
    expect(renderTsType(extractTsType(undefined), [])).toMatchObject({
      typeName: 'Type',
      ts: 'type Type = undefined',
    })
  })

  describe('should properly render array type', () => {
    test('empty', () => {
      expect(renderTsType(extractTsType([]), [])).toMatchObject({
        typeName: 'Type',
        ts: 'type Type = []',
      })
    })

    it('should add sub indices for each elements in array', () => {
      expect(renderTsType(extractTsType([0, 1, 2]), [])).toMatchObject({
        typeName: 'Type',
        ts: 'type Type = [Type_0, Type_1, Type_2]',
      })
    })

    it('should add sub types first', () => {
      const results: RenderedType[] = []
      renderTsType(extractTsType([0, 1, 2]), results)

      expect(results).toMatchObject([
        { typeName: 'Type_0', ts: 'type Type_0 = number' },
        { typeName: 'Type_1', ts: 'type Type_1 = number' },
        { typeName: 'Type_2', ts: 'type Type_2 = number' },
        { typeName: 'Type', ts: 'type Type = [Type_0, Type_1, Type_2]' },
      ])
    })

    it('should add nested sub indices properly', () => {
      const results: RenderedType[] = []
      renderTsType(extractTsType([0, [1, 2]]), results)

      expect(results).toMatchObject([
        { typeName: 'Type_0', ts: 'type Type_0 = number' },
        { typeName: 'Type_1_0', ts: 'type Type_1_0 = number' },
        { typeName: 'Type_1_1', ts: 'type Type_1_1 = number' },
        { typeName: 'Type_1', ts: 'type Type_1 = [Type_1_0, Type_1_1]' },
        { typeName: 'Type', ts: 'type Type = [Type_0, Type_1]' },
      ])
    })
  })

  describe('should properly render object type', () => {
    test('empty', () => {
      expect(renderTsType(extractTsType({}), [])).toMatchObject({
        typeName: 'Type',
        ts: 'type Type = {  }',
      })
    })

    describe('should add path of properties', () => {
      test('single', () => {
        expect(renderTsType(extractTsType({ a: 0 }), [])).toMatchObject({
          typeName: 'Type',
          ts: 'type Type = { a: Type_a; }',
        })
      })

      test('multiple', () => {
        expect(renderTsType(extractTsType({ a: 0, b: 1 }), [])).toMatchObject({
          typeName: 'Type',
          ts: 'type Type = { a: Type_a; b: Type_b; }',
        })
      })
    })

    it('should add sub types first', () => {
      const results: RenderedType[] = []
      renderTsType(extractTsType({ a: 0, b: 1 }), results)

      expect(results).toMatchObject([
        { typeName: 'Type_a', ts: 'type Type_a = number' },
        { typeName: 'Type_b', ts: 'type Type_b = number' },
        { typeName: 'Type', ts: 'type Type = { a: Type_a; b: Type_b; }' },
      ])
    })

    it('should add nested sub indices properly', () => {
      const results: RenderedType[] = []
      renderTsType(extractTsType({ a: 0, b: { c: 1, d: 2 } }), results)

      expect(results).toMatchObject([
        { typeName: 'Type_a', ts: 'type Type_a = number' },
        { typeName: 'Type_b_c', ts: 'type Type_b_c = number' },
        { typeName: 'Type_b_d', ts: 'type Type_b_d = number' },
        {
          typeName: 'Type_b',
          ts: 'type Type_b = { c: Type_b_c; d: Type_b_d; }',
        },
        { typeName: 'Type', ts: 'type Type = { a: Type_a; b: Type_b; }' },
      ])
    })
  })
})
