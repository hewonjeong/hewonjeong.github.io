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
        <meta name="theme-color" content="white" />
        <ThemeScript />
        {headComponents}
      </head>
      <body>
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

  function updateMeta(content) {
    document
      .querySelector('meta[name=theme-color]')
      .setAttribute('content', content)
  }

  function setTheme(newTheme) {
    window.__theme = newTheme
    preferredTheme = newTheme
    updateMeta(newTheme === 'dark' ? '#171717' : '#ffffff')

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
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
