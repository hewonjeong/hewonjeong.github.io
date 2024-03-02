import { generateFeed } from '../feed'
import { metadata } from '../page'
import { getPosts } from '../posts'

export async function GET() {
  const posts = await getPosts()
  const feed = generateFeed(posts, metadata)
  return new Response(feed.atom1())
}
