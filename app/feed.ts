import { Feed } from 'feed'
import { Post } from './types'

const SITE_URL = 'https://overreacted.io/'

export function generateFeed(
  posts: Post[],
  metadata: { title: string; description: string }
) {
  const feed = new Feed({
    author: {
      name: 'Dan Abramov',
      email: 'dan.abramov@gmail.com',
      link: SITE_URL,
    },
    description: metadata.description,
    favicon: `${SITE_URL}/icon.png`,
    feedLinks: { atom: `${SITE_URL}atom.xml`, rss: `${SITE_URL}rss.xml` },
    generator: 'Feed for Node.js',
    id: SITE_URL,
    image: 'https://github.com/gaearon.png',
    link: SITE_URL,
    title: metadata.title,
    copyright: '',
  })

  posts.forEach((post) =>
    feed.addItem({
      date: new Date(post.date),
      description: post.spoiler,
      id: `${SITE_URL}${post.slug}/`,
      link: `${SITE_URL}${post.slug}/`,
      title: post.title,
    })
  )

  return feed
}
