import SkillCard from '../components/SkillCard.jsx'
import home from '../data/home.json'
// AI-generated illustrations (tool: ChatGPT image generation).
import heroImage from '../assets/images/home-hero.webp'
import softSkillsImage from '../assets/images/home-soft-skills.webp'
import './Home.css'

function Home() {
  const { intro, technicalSkills, softSkills } = home

  return (
    <div className="home">
      <section className="home-section home-intro" aria-labelledby="home-name">
        <div className="home-intro__text">
          <h1 id="home-name" className="home-intro__name">
            {intro.name}
          </h1>
          <p className="home-intro__tagline">{intro.tagline}</p>
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="home-intro__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        <figure className="home-figure">
          <img
            src={heroImage}
            alt="Portrait of Driss Elhail in a navy blazer and white T-shirt"
            width="1254"
            height="1254"
          />
        </figure>
      </section>

      <section className="home-section home-section--alt" aria-labelledby="technical-skills">
        <h2 id="technical-skills" className="home-section__title">
          Technical Skills
        </h2>
        <ul className="skill-grid">
          {technicalSkills.map((skill) => (
            <SkillCard key={skill.name} {...skill} />
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="soft-skills">
        <h2 id="soft-skills" className="home-section__title">
          Soft Skills
        </h2>
        <div className="home-soft">
          <figure className="home-figure">
            <img
              src={softSkillsImage}
              alt="Illustration of three developers collaborating at a whiteboard, in purple tones"
              width="1254"
              height="1254"
              loading="lazy"
            />
          </figure>
          <ul className="skill-grid">
            {softSkills.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Home
