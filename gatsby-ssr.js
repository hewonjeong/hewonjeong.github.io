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
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.__onThemeChange(newTheme)
  }

  var preferredTheme

  try {
    preferredTheme = localStorage.getItem('theme')
  } catch (err) {}

  window.__setPreferredTheme = function (newTheme) {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  var query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addListener(function (e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light')
  })

  setTheme(preferredTheme || (query.matches ? 'dark' : 'light'))
}
