import React from "react"
import { rhythm } from "../utils/typography"

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: rhythm(2.5),
        paddingTop: rhythm(1),
      }}
    >
      <Link link="https://github.com/hewonjeong" text="github" />
      <Dot />
      <Link link="https://mobile.twitter.com/hewonjeong" text="twitter" />
    </footer>
  )
}

const Dot = () => " • "

const Link = ({ link, text }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  )
}
export default Footer
