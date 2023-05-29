import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'

export default function SEO({ description, title, tags = [], children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description ?? site.siteMetadata.description

  return (
    <>
      <title>{[title, site.siteMetadata.title].join(' | ')}</title>
      <meta name="description" content={metaDescription} />
      {tags.length && <meta name="keywords" content={tags.join(',')} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}
