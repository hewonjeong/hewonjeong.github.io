import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkSmartpants from 'remark-smartypants'
import Link from '../Link'
import Time from '../Time'
import './markdown.css'
import { remarkMdxEvalCodeBlock } from './mdx'
import darkTheme from './themes/dark.json'
import lightTheme from './themes/light.json'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const filename = `./public/${params.slug}/index.md`
  const file = await readFile(filename, 'utf8')
  const postComponents = await importPostComponents(params.slug)
  const { content, data } = matter(file)

  return (
    <article>
      <h1 className="text-[2.5rem] leading-tight font-bold break-keep">
        {data.title}
      </h1>
      <Time value={data.date} className="mt-2" />
      <div className="markdown mt-10">
        <MDXRemote
          source={content}
          components={{
            a: Link as any,
            img: (props) => <StaticImage {...props} slug={params.slug} />,
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
                    theme: {
                      light: lightTheme,
                      dark: darkTheme,
                    },
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

function isRemote(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

type StaticImageProps = {
  slug: string
} & Omit<React.ComponentProps<'img'>, 'width' | 'height' | 'ref'>

async function StaticImage({ slug, src, ...props }: StaticImageProps) {
  if (!src) throw new Error('src is required')
  if (isRemote(src)) throw new Error('Remote images are not supported')

  const file = await readFile(`./public/${slug}/${src}`)
  const placeholder = await getPlaiceholder(file, { size: 32 })

  return (
    <Image
      src={`./${slug}/${src}`}
      alt=""
      placeholder="blur"
      blurDataURL={placeholder.base64}
      unoptimized
      {...props}
      width={placeholder.metadata.width}
      height={placeholder.metadata.height}
    />
  )
}
