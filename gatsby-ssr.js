import React from 'react'

export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  setPreBodyComponents(<ThemeScript />)
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

  function setTheme(newTheme) {
    window.__theme = newTheme
    preferredTheme = newTheme
    const meta = document.querySelector('meta[name="theme-color"]')

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      meta.setAttribute('content', '#171717')
    } else {
      document.documentElement.classList.remove('dark')
      meta.setAttribute('content', 'white')
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
  const initialTheme = preferredTheme || (query.matches ? 'dark' : 'light')

  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = initialTheme === 'dark' ? '#171717' : 'white'
  document.getElementsByTagName('head')[0].appendChild(meta)

  setTheme(initialTheme)
}
