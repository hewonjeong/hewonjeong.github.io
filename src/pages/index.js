import { Link, graphql } from 'gatsby'
import React from 'react'

import Layout from '../components/layout'
import Seo from '../components/seo'

export default function Home({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <div className="space-y-16">
        {posts.map(({ node }) => {
          const {
            fields: { slug },
            frontmatter: { title, description, date, tags },
          } = node

          return (
            <Post
              key={slug}
              slug={slug}
              title={title}
              description={description}
              date={date}
              tags={tags}
            />
          )
        })}
      </div>
    </Layout>
  )
}

function Post({ title, description, slug, date, tags }) {
  return (
    <article>
      <Link className="group grid w-full gap-3 transition-all" to={slug}>
        <header>
          <h2 className="inline text-2xl font-bold transition-all group-hover:bg-gray-950 group-hover:text-gray-50">
            {title}
          </h2>
          <time className="pl-2 align-bottom text-[13px] text-gray-400">
            {date}
          </time>
        </header>
        <section>
          <p dangerouslySetInnerHTML={{ __html: description }} />
        </section>
      </Link>
    </article>
  )
}

export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
