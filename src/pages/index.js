import { Link, graphql } from 'gatsby'
import React, { Fragment } from 'react'

import Footer from '../components/footer'
import Layout from '../components/layout'
import Seo from '../components/seo'

export default function Home({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <div className="space-y-14">
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
      <Footer />
    </Layout>
  )
}

function Post({ title, description, slug, date, tags }) {
  return (
    <article>
      <Link className="group grid w-full gap-2 transition-all " to={slug}>
        <header className="space-y-2">
          <h2 className="text-2xl font-bold">
            <span className="transition-all group-hover:bg-gray-950 group-hover:text-gray-50">
              {title}
            </span>
          </h2>
          <small className="inline-flex text-[13px]">
            <time>{date}</time>
            {tags && <span className="mx-1"> • </span>}
            {tags && (
              <ul className="flex">
                {tags.map((tag, i) => (
                  <Fragment key={tag}>
                    <li>
                      {i > 0 && ', '}
                      <Link to="/">{tag}</Link>
                    </li>
                  </Fragment>
                ))}
              </ul>
            )}
          </small>
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
