/**
 * LowCarbonImage — drop-in <img> replacement that disappears in
 * low-carbon mode.
 *
 * In normal mode it renders a plain <img> with the passed props.
 * In low-carbon mode the .lc-image class hits the `display: none`
 * rule in index.css, so the network never has to fetch the asset.
 *
 * Use this for everything decorative — logos, illustrations, OG-style
 * graphics. Avoid it for content-critical images (those should stay
 * regardless of the toggle).
 *
 * — Mirabelle
 */
import type { ImgHTMLAttributes } from 'react'

export function LowCarbonImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { className, loading, ...rest } = props
  return (
    <img
      {...rest}
      loading={loading ?? 'lazy'}
      decoding="async"
      className={`lc-image ${className ?? ''}`}
    />
  )
}
