import React from 'react'

export default function HTML(props) {
  const { headComponents, preBodyComponents, body, postBodyComponents } = props

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {headComponents}
      </head>
      <body>
        <ThemeScript />
        {preBodyComponents}
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        {postBodyComponents}
      </body>
    </html>
  )
}

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: `(${String(setColorsByTheme)})()` }}
    />
  )
}

function setColorsByTheme() {
  window.__onThemeChange = function () {}

  function appendMeta(content) {
    const head = document.head
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    meta.setAttribute('content', content)
    head.appendChild(meta)
  }

  function removeMeta() {
    const head = document.head
    const meta = document.querySelector('meta[name="theme-color"]')
    if (!head || !meta) return
    head.removeChild(meta)
  }

  function setTheme(newTheme) {
    window.__theme = newTheme
    preferredTheme = newTheme
    removeMeta()

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      appendMeta('#171717')
    } else {
      document.documentElement.classList.remove('dark')
      appendMeta('#ffffff')
    }

    window.__onThemeChange(newTheme)
  }

  let preferredTheme

  try {
    preferredTheme = localStorage.getItem('theme')
  } catch (err) {}

  window.__setPreferredTheme = function (newTheme) {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addListener(function (e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light')
  })

  setTheme(preferredTheme || (query.matches ? 'dark' : 'light'))
}
