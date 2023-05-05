import * as React from 'react'
import { Link } from 'gatsby'

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div
      className="mx-auto grid max-w-2xl gap-14 px-5 py-10 font-sans antialiased"
      data-is-root-path={isRootPath}
    >
      <header>
        {isRootPath ? (
          <h1 className="font-montserrat text-[2rem] font-black">
            <Link to="/">{title}</Link>
          </h1>
        ) : (
          <Link className="font-montserrat text-2xl font-black" to="/">
            {title}
          </Link>
        )}
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
