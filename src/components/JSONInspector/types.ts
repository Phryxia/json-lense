export interface SearchParameters {
  keyword: string
  isMatchCase: boolean
  isMatchWord: boolean
  isRegexUsed: boolean
}

export type JSONSearchResult = {
  /** Line number starts from 0 where search target exists */
  lineIndex: number
  /** Multiple keyword might be exists in one line */
  tokenId: number
  /** Character position starts from 0 where search target starts */
  beginPosInToken: number
  /** Character position where search target ends */
  endPosInToken: number
}
