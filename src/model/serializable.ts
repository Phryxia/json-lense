export type Serializable =
  | null
  | undefined
  | boolean
  | string
  | number
  | Serializable[]
  | { [Key in string]: Serializable }
