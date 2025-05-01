import { describe, expect, it } from 'vitest'
import { escapeForTypeScript } from './escape'

describe('escapeType', () => {
  it('should escape single quote character', () => {
    expect(escapeForTypeScript("'")).toBe("\\'")
  })

  it('should not escape general escape sequence', () => {
    expect(escapeForTypeScript('\n')).toBe('\\n')
    expect(escapeForTypeScript("\\'")).toBe("\\\\\\'")
    expect(escapeForTypeScript('\\')).toBe('\\\\')
  })
})
