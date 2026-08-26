import { describe, it, expect } from 'vitest'
import { safeString, safeNumber, safeArray, safeObject, truncate } from '@/lib/safe-data'

describe('safeString', () => {
  it('returns string as-is', () => expect(safeString('hello')).toBe('hello'))
  it('returns fallback for non-string', () => expect(safeString(123, 'default')).toBe('default'))
  it('returns empty string as default fallback', () => expect(safeString(null)).toBe(''))
})

describe('safeNumber', () => {
  it('returns number as-is', () => expect(safeNumber(42)).toBe(42))
  it('parses numeric string', () => expect(safeNumber('42')).toBe(42))
  it('returns fallback for non-numeric', () => expect(safeNumber('abc', 0)).toBe(0))
})

describe('safeArray', () => {
  it('returns array as-is', () => expect(safeArray([1, 2])).toEqual([1, 2]))
  it('returns fallback for non-array', () => expect(safeArray('not array', [1])).toEqual([1]))
})

describe('safeObject', () => {
  it('returns object as-is', () => expect(safeObject({ a: 1 })).toEqual({ a: 1 }))
  it('returns fallback for non-object', () => expect(safeObject(null, { a: 1 })).toEqual({ a: 1 }))
})

describe('truncate', () => {
  it('returns short string unchanged', () => expect(truncate('hi', 10)).toBe('hi'))
  it('truncates long string', () => expect(truncate('hello world', 5)).toBe('hello...'))
})
