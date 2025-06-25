import type { Arranger } from '@src/model/Arranger'
import type {
  InlineContent,
  LineContent,
  NestedContent,
} from '@src/model/Content'

export const JsonArranger: Arranger = {
  name: 'JsonArranger',
  arrange(data: any): NestedContent[] {
    return [arrangeJson(data).content]
  },
}

interface JsonArrangerResult {
  content: NestedContent
  /** nextOffset is the line number after the last line of the content */
  nextOffset: number
}

function arrangeJson(data: any, offset = 0): JsonArrangerResult {
  if (!data || typeof data !== 'object') {
    return {
      content: {
        type: 'block',
        lineBegin: offset,
        lineEnd: offset,
        children: [arrangePrimitive(data, offset)],
      },
      nextOffset: offset + 1,
    }
  }
  if (data instanceof Array) {
    return arrangeArray(data, offset)
  }
  return arrangeObject(data, offset)
}

function arrangePrimitive(
  data: boolean | number | string | undefined | null,
  offset = 0,
): LineContent {
  return {
    type: 'line',
    line: offset,
    children: [
      {
        text: typeof data === 'string' ? `"${data}"` : '' + data,
      },
    ],
  }
}

function arrangeArray(data: unknown[], offset = 0): JsonArrangerResult {
  const lineBegin = offset
  const children = [
    {
      type: 'line',
      line: offset,
      children: [{ text: '[' }],
    },
  ] as (LineContent | NestedContent)[]
  offset += 1

  for (let index = 0; index < data.length; ++index) {
    const { content, nextOffset } = arrangeJsonRaw(data[index], offset)
    children.push(insertComma(content, index === data.length - 1))
    offset = nextOffset
  }

  children.push({
    type: 'line',
    line: offset,
    children: [{ text: ']' }],
  })
  offset += 1

  return {
    content: {
      type: 'block',
      lineBegin,
      lineEnd: offset - 1,
      children,
    },
    nextOffset: offset,
  }
}

function arrangeObject(
  data: Record<string, any>,
  offset = 0,
): JsonArrangerResult {
  const lineBegin = offset
  const children = [
    {
      type: 'line',
      line: offset,
      children: [{ text: '{' }],
    },
  ] as (LineContent | NestedContent)[]
  offset += 1

  const keys = Object.keys(data)
  for (let index = 0; index < keys.length; ++index) {
    const key = keys[index]
    const { content, nextOffset } = arrangeJsonRaw(data[key], offset)
    const keyContent = { text: `"${key}": ` }

    children.push(
      insertComma(
        arrangeObjectEntry(content, keyContent),
        index >= keys.length - 1,
      ),
    )
    offset = nextOffset
  }

  children.push({
    type: 'line',
    line: offset,
    children: [{ text: '}' }],
  })
  offset += 1

  return {
    content: {
      type: 'block',
      lineBegin,
      lineEnd: offset - 1,
      children,
    },
    nextOffset: offset,
  }
}

/**
 * Insert comma at the last LineContent of its children
 * If it's the last content, no comma will be inserted
 */
function insertComma(
  content: LineContent | NestedContent,
  isLast: boolean,
): LineContent | NestedContent {
  if (content.type === 'line') {
    return insertCommaForLine(content, isLast)
  }
  return insertCommaForNested(content, isLast)
}

function insertCommaForLine(
  content: LineContent,
  isLast: boolean,
): LineContent {
  if (isLast) return content

  return {
    ...content,
    children: [...(content.children ?? []), { text: ',' }],
  }
}

function insertCommaForNested(
  content: NestedContent,
  isLast: boolean,
): NestedContent {
  if (isLast) return content

  return {
    ...content,
    children: content.children?.map((child, index, list) =>
      index === list.length - 1 ? insertComma(child, false) : child,
    ),
  }
}

function arrangeObjectEntry(
  content: LineContent | NestedContent,
  keyContent: InlineContent,
): LineContent | NestedContent {
  if (content.type === 'line') {
    return arrangeObjectEntryForLine(content, keyContent)
  }
  return arrangeObjectEntryForNested(content, keyContent)
}

function arrangeObjectEntryForLine(
  content: LineContent,
  keyContent: InlineContent,
): LineContent {
  return {
    ...content,
    children: [keyContent, ...(content.children ?? [])],
  }
}

function arrangeObjectEntryForNested(
  content: NestedContent,
  keyContent: InlineContent,
): NestedContent {
  return {
    type: 'block',
    lineBegin: content.lineBegin,
    lineEnd: content.lineEnd,
    /*
      "a": {
        ...
      } 
    */
    children: content.children?.map((child, index) =>
      index === 0
        ? {
            type: 'line',
            line: content.lineBegin,
            // currently children[0] must be bracket
            children: [keyContent, ...((child as LineContent).children ?? [])],
          }
        : child,
    ),
  }
}

function arrangeJsonRaw(
  data: any,
  offset = 0,
): {
  content: LineContent | NestedContent
  nextOffset: number
} {
  if (!data || typeof data !== 'object') {
    return {
      content: arrangePrimitive(data, offset),
      nextOffset: offset + 1,
    }
  }
  if (data instanceof Array) {
    return arrangeArray(data, offset)
  }
  return arrangeObject(data, offset)
}
