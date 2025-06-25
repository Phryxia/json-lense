export interface InlineContent {
  text: string
}

export interface LineContent {
  type: 'line'
  /** line position index starts from 0 */
  line: number
  /** actual visible contents */
  children?: InlineContent[]
}

/**
 * @note
 * Every `lineBegin` and `lineEnd` of `NestedContent` must be unique
 */
export interface NestedContent {
  type: 'block'
  /** begining line index which will be folded */
  lineBegin: number
  /** end line index which will be folded (inclusive) */
  lineEnd: number
  children?: (LineContent | NestedContent)[]
}
