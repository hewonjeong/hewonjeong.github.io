import { brand } from './fonts'
import Link from './Link'
import { getPosts } from './posts'
import { Post } from './types'

export const metadata = {
  title: 'All Posts — Hewon Jeong',
  description: 'A personal blog by Hewon Jeong',
  alternates: {
    types: {
      'application/atom+xml': 'https://hewonjeong.github.io/atom.xml',
      'application/rss+xml': 'https://hewonjeong.github.io/rss.xml',
    },
  },
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
    <h2 className="text-[28px] font-bold text-[--lightLink] dark:text-[--darkLink]">
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
