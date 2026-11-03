import { FaFileDownload } from 'react-icons/fa'
import ProjectCard from '../components/ProjectCard.jsx'
import TimelineEntry from '../components/TimelineEntry.jsx'
import portfolio from '../data/portfolio.json'
// Project images are AI-generated illustrations (tool: ChatGPT image generation),
// imported in src/components/projectImages.js.
import './Portfolio.css'

function Portfolio() {
  const { intro, resume, education, work, projects } = portfolio

  return (
    <div className="portfolio">
      <header className="portfolio-header">
        <div>
          <h1 className="portfolio-header__title">Portfolio</h1>
          <p className="portfolio-header__intro">{intro}</p>
        </div>
        <a
          className="portfolio-header__resume"
          href={`${import.meta.env.BASE_URL}${resume.file}`}
          download={resume.downloadName}
        >
          <FaFileDownload aria-hidden="true" /> {resume.label}
        </a>
      </header>

      <section className="portfolio-section portfolio-section--alt" aria-labelledby="education">
        <h2 id="education" className="portfolio-section__title">
          Education
        </h2>
        <ul className="timeline">
          {education.map((entry) => (
            <TimelineEntry key={entry.organization} {...entry} />
          ))}
        </ul>
      </section>

      <section className="portfolio-section" aria-labelledby="work">
        <h2 id="work" className="portfolio-section__title">
          Work
        </h2>
        <ul className="timeline">
          {work.map((entry) => (
            <TimelineEntry key={`${entry.organization}-${entry.title}`} {...entry} />
          ))}
        </ul>
      </section>

      <section className="portfolio-section portfolio-section--alt" aria-labelledby="projects">
        <h2 id="projects" className="portfolio-section__title">
          Projects
        </h2>
        <ul className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Portfolio
