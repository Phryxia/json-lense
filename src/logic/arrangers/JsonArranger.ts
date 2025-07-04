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
        children: [
          {
            type: 'line',
            line: offset,
            children: [arrangePrimitive(data)],
          },
        ],
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
): InlineContent {
  return {
    text: typeof data === 'string' ? `"${data}"` : '' + data,
  }
}

function arrangeArray(
  data: unknown[],
  offset = 0,
  indent = 0,
): JsonArrangerResult {
  const lineBegin = offset
  const children = [
    {
      type: 'line',
      line: offset,
      children: [createIndent(indent), { text: '[' }].filter(Boolean),
    },
  ] as (LineContent | NestedContent)[]
  offset += 1

  for (let index = 0; index < data.length; ++index) {
    const { content, nextOffset } = arrangeJsonRaw(
      data[index],
      offset,
      indent + 1,
    )
    children.push(insertComma(content, index === data.length - 1, indent + 1))
    offset = nextOffset
  }

  children.push({
    type: 'line',
    line: offset,
    children: [createIndent(indent)!, { text: ']' }].filter(Boolean),
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
  indent = 0,
): JsonArrangerResult {
  const lineBegin = offset
  const children = [
    {
      type: 'line',
      line: offset,
      children: [createIndent(indent), { text: '{' }].filter(Boolean),
    },
  ] as (LineContent | NestedContent)[]
  offset += 1

  const keys = Object.keys(data)
  for (let index = 0; index < keys.length; ++index) {
    const key = keys[index]
    const { content, nextOffset } = arrangeJsonRaw(
      data[key],
      offset,
      indent + 1,
    )
    const keyContent = { text: `"${key}": ` }

    children.push(
      insertComma(
        arrangeObjectEntry(
          removeFirstLineIndent(content),
          keyContent,
          indent + 1,
        ),
        index >= keys.length - 1,
      ),
    )
    offset = nextOffset
  }

  children.push({
    type: 'line',
    line: offset,
    children: [createIndent(indent)!, { text: '}' }].filter(Boolean),
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

function removeFirstLineIndent<T extends NestedContent | LineContent>(
  content: T,
): T {
  if (content.type === 'block') {
    return {
      ...content,
      children: content.children?.map((child, index) =>
        index === 0 ? removeFirstLineIndent(child) : child,
      ),
    }
  }

  // line
  const firstIndent = content.children?.findIndex((line) =>
    line.text.match(/^(?:  )+$/),
  )

  if (firstIndent === -1) return content

  return {
    ...content,
    children: content.children?.filter((_, index) => index !== firstIndent),
  }
}

/**
 * Insert comma at the last LineContent of its children
 * If it's the last content, no comma will be inserted
 */
function insertComma(
  content: LineContent | NestedContent,
  isLast: boolean,
  indent = 0,
): LineContent | NestedContent {
  if (content.type === 'line') {
    return insertCommaForLine(content, isLast, indent)
  }
  return insertCommaForNested(content, isLast, indent)
}

function insertCommaForLine(
  content: LineContent,
  isLast: boolean,
  indent = 0,
): LineContent {
  if (isLast)
    return {
      ...content,
      children: [createIndent(indent)!, ...(content.children ?? [])].filter(
        Boolean,
      ),
    }

  return {
    ...content,
    children: [
      createIndent(indent)!,
      ...(content.children ?? []),
      { text: ',' },
    ].filter(Boolean),
  }
}

function insertCommaForNested(
  content: NestedContent,
  isLast: boolean,
  indent = 0,
): NestedContent {
  if (isLast) return content

  return {
    ...content,
    children: content.children?.map((child, index, list) =>
      index === list.length - 1 ? insertComma(child, false, indent) : child,
    ),
  }
}

function arrangeObjectEntry(
  content: LineContent | NestedContent,
  keyContent: InlineContent,
  indent = 0,
): LineContent | NestedContent {
  if (content.type === 'line') {
    return arrangeObjectEntryForLine(content, keyContent, indent)
  }
  return arrangeObjectEntryForNested(content, keyContent, indent)
}

function arrangeObjectEntryForLine(
  content: LineContent,
  keyContent: InlineContent,
  indent = 0,
): LineContent {
  return {
    ...content,
    children: [
      createIndent(indent)!,
      keyContent,
      ...(content.children ?? []),
    ].filter(Boolean),
  }
}

function arrangeObjectEntryForNested(
  content: NestedContent,
  keyContent: InlineContent,
  indent = 0,
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
            children: [
              createIndent(indent)!,
              keyContent,
              ...((child as LineContent).children ?? []),
            ].filter(Boolean),
          }
        : child,
    ),
  }
}

function arrangeJsonRaw(
  data: any,
  offset = 0,
  indent = 0,
): {
  content: LineContent | NestedContent
  nextOffset: number
} {
  if (!data || typeof data !== 'object') {
    return {
      content: {
        type: 'line',
        line: offset,
        children: [arrangePrimitive(data)],
      },
      nextOffset: offset + 1,
    }
  }
  if (data instanceof Array) {
    return arrangeArray(data, offset, indent)
  }
  return arrangeObject(data, offset, indent)
}

function createIndent(indent: number): InlineContent | null {
  if (!indent) return null

  return {
    text: ' '.repeat(indent * 2),
  }
}
