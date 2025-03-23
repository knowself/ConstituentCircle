'use client'

export default function EnvScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = {
          CONVEX_URL: "${process.env.NEXT_PUBLIC_CONVEX_URL || ''}",
          ENV: "${process.env.NODE_ENV}"
        };`
      }}
    />
  )
}
