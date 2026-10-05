import { afterEach, describe, expect, it } from 'vitest'
import { perMinuteEnv } from '../server/limits.ts'

/* The per-minute rate limits each read their environment variable through this
 * helper, so its fallback behaviour is what keeps a blank or malformed value
 * from silently disabling a limit. */
describe('perMinuteEnv', () => {
  const KEY = 'DOOP_TEST_PER_MIN'
  const cleanup = () => delete process.env[KEY]
  afterEach(cleanup)
  cleanup()

  it('falls back when the variable is unset', () => {
    expect(perMinuteEnv(KEY, 30)).toBe(30)
  })

  it('reads a positive integer from the environment', () => {
    process.env[KEY] = '120'
    expect(perMinuteEnv(KEY, 30)).toBe(120)
  })

  it('ignores a blank value instead of disabling the limit', () => {
    process.env[KEY] = '   '
    expect(perMinuteEnv(KEY, 30)).toBe(30)
  })

  it('ignores a non-numeric value', () => {
    process.env[KEY] = 'lots'
    expect(perMinuteEnv(KEY, 30)).toBe(30)
  })

  it('never drops below 1, and floors fractions', () => {
    process.env[KEY] = '0'
    expect(perMinuteEnv(KEY, 30)).toBe(1)
    process.env[KEY] = '7.9'
    expect(perMinuteEnv(KEY, 30)).toBe(7)
  })
})
