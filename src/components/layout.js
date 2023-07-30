import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const [theme, setTheme] = useState()

  useEffect(() => {
    setTheme(window.__theme)
    window.__onThemeChange = setTheme
  }, [setTheme])

  function handleToggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    window.__setPreferredTheme(next)
  }

  return (
    <div
      className="mx-auto grid max-w-2xl gap-20 px-5 py-10 auto-cols-[100%]"
      data-is-root-path={isRootPath}
    >
      <header className="flex h-12 items-end justify-between">
        {isRootPath ? (
          <h1 className="font-montserrat text-[2rem] font-black">
            <Link to="/">{title}</Link>
          </h1>
        ) : (
          <Link className="font-montserrat text-2xl font-black" to="/">
            {title}
          </Link>
        )}
        {theme && (
          <ThemeToggle dark={theme === 'dark'} onToggle={handleToggleTheme} />
        )}
        {/* <Social /> */}
      </header>
      <main>{children}</main>
      {isRootPath && (
        <footer className="flex justify-end">
          <Social />
        </footer>
      )}
    </div>
  )
}

function Social() {
  return (
    <div className="flex gap-x-3">
      {[
        {
          label: 'GitHub',
          icon: <Icon.GitHub />,
          link: 'https://github.com/hewonjeong',
        },
        {
          label: 'X formerly known as Twitter',
          icon: <Icon.X />,
          link: 'https://x.com/hewonjeong',
        },
      ].map(({ label, icon, link }) => (
        <a
          key={label}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition hover:text-gray-950 dark:hover:text-gray-50/90"
          href={link}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      aria-label={dark ? 'Activate light mode' : 'Activate dark mode'}
      onClick={onToggle}
      className="p-1"
    >
      <DarkModeSwitch checked={dark} onChange={() => {}} />
    </button>
  )
}

const Icon = {
  GitHub() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="-2 -2 24 24"
        fill="currentColor"
      >
        <path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0" />
      </svg>
    )
  },
  X() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="-2 -2 28 28"
        fill="currentColor"
      >
        <g>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </g>
      </svg>
    )
  },
}

export default Layout
