/**
 * Size limits for content that becomes a frame.
 *
 * A frame is stored whole, broadcast whole to every viewer on each edit, and
 * returned whole to agents on every get_frame call. Every path that turns
 * outside content into a frame is bounded here, in one place, so the numbers
 * are set against each other rather than picked in isolation.
 */

/** The largest HTML document any acquisition path turns into a frame: a
 *  webpage import, a Context.dev capture, or a snippet snapshot. */
export const MAX_FRAME_HTML_BYTES = 3_000_000

/** CSS that stays in an imported frame after unused rules are pruned. Sized
 *  to leave room for the page's own markup under MAX_FRAME_HTML_BYTES. */
export const MAX_IMPORT_CSS_BYTES = 2_000_000

/** Raw stylesheet bytes fetched from a site before pruning. Bounds what an
 *  untrusted host can make the server download, and must fit one bundled
 *  stylesheet since real sites ship one multi-megabyte sheet per product. */
export const MAX_IMPORT_CSS_FETCH_BYTES = 8_000_000

/** Sitemap and HTML bytes read per document while discovering a site's pages. */
export const MAX_DISCOVERY_BYTES = 2_000_000

/** Read a per-minute rate limit from the environment, keeping `fallback` when
 *  the variable is unset. Guards against a blank (`SYNC_INGESTS_PER_MIN=`) or
 *  non-numeric value silently becoming `0`, which would disable the limit
 *  rather than leave it at its default; every limit stays at least 1/min. */
export function perMinuteEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : fallback
}
