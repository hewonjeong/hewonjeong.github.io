import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import overnight from 'overnight/themes/Overnight-Slumber.json'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkSmartpants from 'remark-smartypants'
import Link from '../Link'
import Time from '../Time'
import './markdown.css'
import { remarkMdxEvalCodeBlock } from './mdx'

overnight.colors['editor.background'] = 'var(--code-bg)'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const filename = './public/' + params.slug + '/index.md'
  const file = await readFile(filename, 'utf8')
  const postComponents = await importPostComponents(params.slug)
  const { content, data } = matter(file)

  return (
    <article>
      <h1 className="text-[2.5rem] leading-tight font-bold text-[--title] break-keep">
        {data.title}
      </h1>
      <Time value={data.date} className="mt-2" />
      <div className="markdown mt-10">
        <MDXRemote
          source={content}
          components={{
            a: Link as any,
            ...postComponents,
          }}
          options={{
            mdxOptions: {
              useDynamicImport: true,
              remarkPlugins: [
                remarkGfm,
                remarkSmartpants as any,
                [remarkMdxEvalCodeBlock, filename],
              ],
              rehypePlugins: [
                [
                  rehypePrettyCode as any,
                  {
                    defaultLang: 'plaintext',
                    theme: overnight,
                  },
                ],
              ],
            },
          }}
        />
        <hr />
      </div>
    </article>
  )
}

function isNotFoundError(e: unknown) {
  return e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND'
}

async function importPostComponents(slug: string) {
  try {
    const components = await import(`../../public/${slug}/components.js`)
    return components
  } catch (e: unknown) {
    if (isNotFoundError(e)) return {}

    throw e
  }
}

export async function generateStaticParams() {
  const entries = await readdir('./public/', { withFileTypes: true })
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  return dirs.map((dir) => ({ slug: dir }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const file = await readFile(`./public/${params.slug}/index.md`, 'utf8')
  const { data } = matter(file)

  return {
    title: `${data.title} — Hewon Jeong`,
    description: data.spoiler,
  }
}
