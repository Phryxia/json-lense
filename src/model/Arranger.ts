import type { NestedContent } from './Content'

/**
 * Arrange inmemory data into NestedContent
 */
export interface Arranger {
  name: string
  arrange(data: any): NestedContent[]
}
