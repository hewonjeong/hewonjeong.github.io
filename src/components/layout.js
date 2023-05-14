import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'

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
      className="mx-auto grid max-w-2xl gap-14 px-5 py-10 "
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
          <button onClick={handleToggleTheme} className="text-3xl">
            {theme === 'dark' ? '🌝' : '☀️'}
          </button>
        )}
        {/* <Social /> */}
      </header>
      <main>{children}</main>
    </div>
  )
}

function Social() {
  return (
    <div className="flex gap-x-2">
      {[
        {
          label: 'GitHub',
          icon: <Icon.GitHub />,
          link: 'https://github.com/hewonjeong',
        },
        {
          label: 'Twitter',
          icon: <Icon.Twitter />,
          link: 'https://twitter.com/hewonjeong',
        },
      ].map(({ label, icon, link }) => (
        <a
          key={label}
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-primary-dark text-gray-400 transition hover:text-gray-950"
          href={link}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

const Icon = {
  GitHub() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.33em"
        height="1.33em"
        viewBox="0 -2 24 24"
        fill="currentColor"
      >
        <path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0" />
      </svg>
    )
  },
  Twitter() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1.33em"
        height="1.33em"
        fill="currentColor"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
      </svg>
    )
  },
}

export default Layout
