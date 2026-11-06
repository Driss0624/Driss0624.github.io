import LinkCard from '../components/LinkCard.jsx'
import links from '../data/links.json'
// Card thumbnails are AI-generated illustrations (tool: ChatGPT image generation),
// imported in src/components/linkImages.js.
import './Links.css'

function Links() {
  // A link without a URL yet (e.g. a channel not created) is left off the page.
  const visibleLinks = links.links.filter((link) => link.url)

  return (
    <div className="links">
      <header className="links-header">
        <h1 className="links-header__title">Links</h1>
        <p className="links-header__intro">{links.intro}</p>
      </header>

      <ul className="link-grid">
        {visibleLinks.map((link) => (
          <LinkCard key={link.title} {...link} />
        ))}
      </ul>
    </div>
  )
}

export default Links
