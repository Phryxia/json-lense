import { describe, expect, it } from 'vitest'
import { JsonArranger } from './JsonArranger'
import { NestedContent } from '@src/model/Content'

describe('JsonArranger', () => {
  it('should arrange primitive values as single line', () => {
    expect(JsonArranger.arrange(true)).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 0,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: 'true' }],
          },
        ],
      },
    ])

    expect(JsonArranger.arrange(42)).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 0,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '42' }],
          },
        ],
      },
    ])

    expect(JsonArranger.arrange('babo')).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 0,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '"babo"' }],
          },
        ],
      },
    ])

    expect(JsonArranger.arrange(null)).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 0,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: 'null' }],
          },
        ],
      },
    ])

    expect(JsonArranger.arrange(undefined)).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 0,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: 'undefined' }],
          },
        ],
      },
    ])
  })

  it('should arrange array with opening and closing bracket', () => {
    expect(JsonArranger.arrange([])).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 1,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '[' }],
          },
          {
            line: 1,
            type: 'line',
            children: [{ text: ']' }],
          },
        ],
      },
    ])
  })

  it('should arrange array with single element without comma', () => {
    expect(JsonArranger.arrange([42])).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 2,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '[' }],
          },
          {
            line: 1,
            type: 'line',
            children: [{ text: '42' }],
          },
          {
            line: 2,
            type: 'line',
            children: [{ text: ']' }],
          },
        ],
      },
    ])
  })

  it('should arrange array with multiple elements with commas', () => {
    expect(JsonArranger.arrange([1, 2])).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 3,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '[' }],
          },
          {
            line: 1,
            type: 'line',
            children: [{ text: '1' }, { text: ',' }],
          },
          {
            line: 2,
            type: 'line',
            children: [{ text: '2' }],
          },
          {
            line: 3,
            type: 'line',
            children: [{ text: ']' }],
          },
        ],
      },
    ])
  })

  it('should arrange empty object with opening and closing braces', () => {
    expect(JsonArranger.arrange({})).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 1,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '{' }],
          },
          {
            line: 1,
            type: 'line',
            children: [{ text: '}' }],
          },
        ],
      },
    ])
  })

  it('should arrange object with single key-value pair without comma', () => {
    expect(JsonArranger.arrange({ key: 'value' })).toMatchObject<
      NestedContent[]
    >([
      {
        lineBegin: 0,
        lineEnd: 2,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '{' }],
          },
          {
            line: 1,
            type: 'line',
            children: [{ text: '"key": ' }, { text: '"value"' }],
          },
          {
            line: 2,
            type: 'line',
            children: [{ text: '}' }],
          },
        ],
      },
    ])
  })

  it('should arrange object with multiple key-value pairs with commas', () => {
    expect(JsonArranger.arrange({ a: 1, b: 2 })).toMatchObject<NestedContent[]>(
      [
        {
          lineBegin: 0,
          lineEnd: 3,
          type: 'block',
          children: [
            {
              line: 0,
              type: 'line',
              children: [{ text: '{' }],
            },
            {
              line: 1,
              type: 'line',
              children: [{ text: '"a": ' }, { text: '1' }, { text: ',' }],
            },
            {
              line: 2,
              type: 'line',
              children: [{ text: '"b": ' }, { text: '2' }],
            },
            {
              line: 3,
              type: 'line',
              children: [{ text: '}' }],
            },
          ],
        },
      ],
    )
  })

  /*
    {
      "a": [
        4,
        2
      ]
    }
  */
  it('should arrange nested object-array with correct new line', () => {
    expect(JsonArranger.arrange({ a: [4, 2] })).toMatchObject<NestedContent[]>([
      {
        lineBegin: 0,
        lineEnd: 5,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '{' }],
          },
          {
            type: 'block',
            lineBegin: 1,
            lineEnd: 4,
            children: [
              {
                line: 1,
                type: 'line',
                children: [{ text: '"a": ' }, { text: '[' }],
              },
              {
                line: 2,
                type: 'line',
                children: [{ text: '4' }, { text: ',' }],
              },
              {
                line: 3,
                type: 'line',
                children: [{ text: '2' }],
              },
              {
                line: 4,
                type: 'line',
                children: [{ text: ']' }],
              },
            ],
          },
          {
            line: 5,
            type: 'line',
            children: [{ text: '}' }],
          },
        ],
      },
    ])
  })

  /*
    {
      "a": {
        "b": 1
      }
    }
  */
  it('should arrange nested object-object with correct new line', () => {
    expect(JsonArranger.arrange({ a: { b: 1 } })).toMatchObject<
      NestedContent[]
    >([
      {
        lineBegin: 0,
        lineEnd: 4,
        type: 'block',
        children: [
          {
            line: 0,
            type: 'line',
            children: [{ text: '{' }],
          },
          {
            type: 'block',
            lineBegin: 1,
            lineEnd: 3,
            children: [
              {
                line: 1,
                type: 'line',
                children: [{ text: '"a": ' }, { text: '{' }],
              },
              {
                line: 2,
                type: 'line',
                children: [{ text: '"b": ' }, { text: '1' }],
              },
              {
                line: 3,
                type: 'line',
                children: [{ text: '}' }],
              },
            ],
          },
          {
            line: 4,
            type: 'line',
            children: [{ text: '}' }],
          },
        ],
      },
    ])
  })

  it('should handle complex structures', () => {
    expect(
      JsonArranger.arrange({
        a: [0, true],
        b: {
          c: null,
          d: 'babo',
        },
      }),
    )
      /*
        {
          "a": [
            0, 
            true
          ],
          "b": {
            "c": null,
            "d": "babo"
          }
        }
      */
      .toMatchObject<NestedContent[]>([
        {
          lineBegin: 0,
          lineEnd: 9,
          type: 'block',
          children: [
            // {
            {
              line: 0,
              type: 'line',
              children: [{ text: '{' }],
            },
            // "a": ...
            {
              type: 'block',
              lineBegin: 1,
              lineEnd: 4,
              children: [
                {
                  line: 1,
                  type: 'line',
                  children: [{ text: '"a": ' }, { text: '[' }],
                },
                {
                  line: 2,
                  type: 'line',
                  children: [{ text: '0' }, { text: ',' }],
                },
                {
                  line: 3,
                  type: 'line',
                  children: [{ text: 'true' }],
                },
                {
                  line: 4,
                  type: 'line',
                  children: [{ text: ']' }, { text: ',' }],
                },
              ],
            },
            // "b": ...
            {
              type: 'block',
              lineBegin: 5,
              lineEnd: 8,
              children: [
                {
                  line: 5,
                  type: 'line',
                  children: [{ text: '"b": ' }, { text: '{' }],
                },
                {
                  line: 6,
                  type: 'line',
                  children: [
                    { text: '"c": ' },
                    { text: 'null' },
                    { text: ',' },
                  ],
                },
                {
                  line: 7,
                  type: 'line',
                  children: [{ text: '"d": ' }, { text: '"babo"' }],
                },
                {
                  line: 8,
                  type: 'line',
                  children: [{ text: '}' }],
                },
              ],
            },
            // }
            {
              line: 9,
              type: 'line',
              children: [{ text: '}' }],
            },
          ],
        },
      ])
  })
})
