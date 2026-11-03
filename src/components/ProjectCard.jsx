import { FaGithub } from 'react-icons/fa'
import { projectImages } from './projectImages.js'
import './ProjectCard.css'

function ProjectCard({ name, image, imageAlt, tech = [], description, link, linkLabel }) {
  const imageSrc = projectImages[image]

  return (
    <li className="project-card">
      {imageSrc && (
        <img
          className="project-card__image"
          src={imageSrc}
          alt={imageAlt}
          width="1280"
          height="720"
          loading="lazy"
        />
      )}
      <div className="project-card__body">
        <h3 className="project-card__name">{name}</h3>
        <ul className="project-card__tech" aria-label={`${name} tech stack`}>
          {tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="project-card__description">{description}</p>
        {link && (
          <a className="project-card__link" href={link} target="_blank" rel="noreferrer">
            <FaGithub aria-hidden="true" /> {linkLabel}
          </a>
        )}
      </div>
    </li>
  )
}

export default ProjectCard
