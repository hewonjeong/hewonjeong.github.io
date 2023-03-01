import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

import './global.scss'

Wordpress2016.overrideThemeStyles = () => {
  return {
    blockquote: {
      marginLeft: 0,
      marginRight: 0,
      lineHeight: '1.9rem',
      color: 'inherit',
      fontStyle: 'inherit',
      borderWidth: '0.25rem',
    },
    'ul, ol': {
      marginLeft: '1.2rem',
    },
    li: {
      marginBottom: 'calc(1rem / 2)',
    },
    'h1, h2, h3': {
      fontFamily: 'inherit',
    },
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    'a.anchor': {
      boxShadow: 'none',
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
