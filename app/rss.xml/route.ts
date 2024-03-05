import { metadata } from '../page'
import { getPosts } from '../posts'
import { generateFeed } from '../feed'

export async function GET() {
  const posts = await getPosts()
  const feed = generateFeed(posts, metadata)

  return new Response(feed.rss2())
}
