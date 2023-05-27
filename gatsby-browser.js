import './src/styles/Montserrat.css'
import './src/styles/global.css'
import './src/styles/prism.css'

export function shouldUpdateScroll({
  routerProps: { location },
  getSavedScrollPosition,
}) {
  window.history.scrollRestoration = 'manual'
  const currentPosition = getSavedScrollPosition(location)
  window.setTimeout(() => window.scrollTo(...currentPosition), 1)

  return false
}
