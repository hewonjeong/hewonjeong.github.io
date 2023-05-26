import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Seo from '../components/seo'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <article className="grid gap-8 auto-cols-[100%]">
          <header className="grid gap-2">
            <h1 className="text-[2.5rem] font-black leading-tight">
              {post.frontmatter.title}
            </h1>
            <time dataTime={post.frontmatter.date} className="text-gray-400">
              {post.frontmatter.date}
            </time>
          </header>
          <section
            className={'markdown max-w-[40rem]'}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
        <hr className="mb-6 mt-16 border-gray-300" />
        <Nav
          pages={[
            previous && {
              link: previous.fields.slug,
              title: previous.frontmatter.title,
            },
            next && {
              link: next.fields.slug,
              title: next.frontmatter.title,
            },
          ]}
        />
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      tags={post.frontmatter.tags}
    />
  )
}

function Nav({ pages }) {
  const [previous, next] = pages
  return (
    <nav className="flex border-solid border-t-gray-400">
      {previous && (
        <Link
          to={previous.link}
          rel="prev"
          className={'mr-auto h-fit leading-none ' + linkStyle}
        >
          ← {previous.title}
        </Link>
      )}
      {next && (
        <Link
          to={next.link}
          rel="next"
          className={'ml-auto h-fit leading-none ' + linkStyle}
        >
          {next.title} →
        </Link>
      )}
    </nav>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        dateTime: date(formatString: "YYYY-MM-DD")
        description
        tags
      }
      fields {
        slug
      }
    }
  }
`

const linkStyle = [
  'hover:transition-colors',
  'hover:duration-100',
  'hover:ease-in',
  'underline',
  'decoration-1',
  'underline-offset-[3px]',
  'hover:bg-gray-950',
  'hover:text-gray-50',
  'hover:no-underline',
  'dark:hover:bg-gray-50/90',
  'dark:hover:text-neutral-950',
].join(' ')
