import { skillIcons } from './skillIcons.js'
import './SkillCard.css'

function SkillCard({ name, icon, description }) {
  const Icon = skillIcons[icon]

  return (
    <li className="skill-card">
      {Icon && <Icon aria-hidden="true" className="skill-card__icon" />}
      <h3 className="skill-card__name">{name}</h3>
      <p className="skill-card__description">{description}</p>
    </li>
  )
}

export default SkillCard
