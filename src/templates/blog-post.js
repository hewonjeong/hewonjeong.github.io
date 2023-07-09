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
            <time
              dateTime={post.frontmatter.dateTime}
              className="text-gray-400"
            >
              {post.frontmatter.date}
            </time>
          </header>
          <section
            className={'markdown max-w-[40rem]'}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
        <hr className="mb-8 mt-16 border-gray-200 dark:border-neutral-700" />
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
    <nav className="grid md:grid-cols-2 gap-4">
      {previous && (
        <Link
          to={previous.link}
          rel="prev"
          className="border-solid border-gray-200 dark:border-neutral-700 grid gap-2 border rounded-md py-4 px-4 group"
        >
          <small className="text-sm text-gray-400">Previous</small>
          <span
            className={
              'truncate max-w-full w-fit group-hover:underline leading-tight'
            }
          >
            {previous.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          to={next.link}
          rel="next"
          className="border-solid border-gray-200 dark:border-neutral-700 grid gap-2 border rounded-md py-4 px-4 group"
        >
          <small className="text-sm text-gray-400 justify-self-end">Next</small>
          <span
            className={
              'truncate max-w-full w-fit justify-self-end group-hover:underline leading-tight'
            }
          >
            {next.title}
          </span>
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
