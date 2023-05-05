import { Link, graphql } from 'gatsby'
import React from 'react'

import Footer from '../components/footer'
import Layout from '../components/layout'
import Seo from '../components/seo'

export default function Home({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
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
      <Footer />
    </Layout>
  )
}

function Post({ title, description, slug, date, tags }) {
  return (
    <article>
      <header>
        <h3>
          <Link to={slug}>{title}</Link>
        </h3>
        <small>
          {date}
          {tags && (
            <>
              {' • '}
              <ul>
                {tags.map(tag => (
                  <li key={tag}>
                    <Link to="/">{tag}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </small>
      </header>
      <section>
        <p dangerouslySetInnerHTML={{ __html: description }} />
      </section>
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
