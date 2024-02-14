import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from '../Link'
import { sans } from '../fonts'
import remarkSmartpants from 'remark-smartypants'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkMdxEvalCodeBlock } from './mdx'
import overnight from 'overnight/themes/Overnight-Slumber.json'
import './markdown.css'

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
      <h1
        className={[
          sans.className,
          'text-[40px] font-black leading-[44px] text-[--title]',
        ].join(' ')}
      >
        {data.title}
      </h1>
      <p className="mt-2 text-[13px] text-gray-700 dark:text-gray-300">
        {new Date(data.date).toLocaleDateString('en', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
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
                remarkSmartpants as any,
                [remarkMdxEvalCodeBlock, filename],
              ],
              rehypePlugins: [
                [
                  rehypePrettyCode as any,
                  {
                    theme: overnight,
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </article>
  )
}

async function importPostComponents(slug: string) {
  try {
    return import('../../public/' + slug + '/components.js')
  } catch (e: unknown) {
    if (e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND') {
      return {}
    }

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
    title: data.title + ' — overreacted',
    description: data.spoiler,
  }
}
