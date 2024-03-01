import HomeLink from '../HomeLink'

type Props = { children: React.ReactNode }
export default function Layout({ children }: Props) {
  return (
    <>
      {children}
      <footer className="flex items-center justify-between">
        <span className="text-neutral-500">
          Hewon Jeong © {new Date().getFullYear()}
        </span>
        <div>Socials Here!</div>
      </footer>
    </>
  )
}
