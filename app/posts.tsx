import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { Post } from './types'

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
