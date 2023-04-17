import React from 'react'

const Footer = () => {
  return (
    <footer>
      <Link link="https://github.com/hewonjeong" text="github" />
      <Dot />
      <Link link="https://mobile.twitter.com/hewonjeong" text="twitter" />
    </footer>
  )
}

const Dot = () => ' • '

const Link = ({ link, text }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  )
}

export default Footer
