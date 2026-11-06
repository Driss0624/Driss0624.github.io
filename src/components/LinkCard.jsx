import { FaExternalLinkAlt } from 'react-icons/fa'
import { linkImages } from './linkImages.js'
import './LinkCard.css'

// Shows the URL without the protocol or a trailing slash, e.g. github.com/Driss0624.
const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function LinkCard({ title, url, image, imageAlt, description }) {
  const imageSrc = linkImages[image]

  return (
    <li className="link-card">
      <a
        className="link-card__anchor"
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${title} (opens in a new tab)`}
      >
        {imageSrc && (
          <img
            className="link-card__image"
            src={imageSrc}
            alt={imageAlt}
            width="1280"
            height="720"
            loading="lazy"
          />
        )}
        <div className="link-card__body">
          <h2 className="link-card__title">{title}</h2>
          <p className="link-card__description">{description}</p>
          <p className="link-card__url">
            {displayUrl(url)} <FaExternalLinkAlt aria-hidden="true" />
          </p>
        </div>
      </a>
    </li>
  )
}

export default LinkCard
