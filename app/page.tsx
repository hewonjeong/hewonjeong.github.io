import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { brand } from './fonts'
import Link from './Link'
import { Post } from './types'

export const metadata = {
  title: 'Hewon Jeong',
  description: 'A personal blog by Hewon Jeong',
  alternates: {
    types: {
      'application/atom+xml': 'https://hewonjeong.github.io/atom.xml',
      'application/rss+xml': 'https://hewonjeong.github.io/rss.xml',
    },
  },
}

export async function getPosts() {
  const entries = await readdir('./public/', { withFileTypes: true })
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  const fileContents = await Promise.all(
    dirs.map((dir) => readFile('./public/' + dir + '/index.md', 'utf8'))
  )
  const posts = dirs.map((slug, i) => {
    const fileContent = fileContents[i]
    const { data } = matter(fileContent)
    return { slug, ...data } as Post
  })

  posts.sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? 1 : -1))

  return posts
}

export default async function Home() {
  const posts = await getPosts()
  return (
    <div className="relative -top-[10px] flex flex-col gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="block py-4 hover:scale-[1.005]"
          href={`/${post.slug}/`}
        >
          <article>
            <PostTitle post={post} />
            <PostMeta post={post} />
            <PostSubtitle post={post} />
          </article>
        </Link>
      ))}
    </div>
  )
}

function PostTitle({ post }: { post: Post }) {
  return (
    <h2
      className={[
        brand.className,
        'text-[28px] font-black',
        'text-[--lightLink] dark:text-[--darkLink]',
      ].join(' ')}
    >
      {post.title}
    </h2>
  )
}

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-[13px] text-gray-700 dark:text-gray-300">
      {new Date(post.date).toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </p>
  )
}

function PostSubtitle({ post }: { post: Post }) {
  return <p className="mt-1">{post.spoiler}</p>
}
