import './TimelineEntry.css'

function TimelineEntry({ title, organization, location, dates, details = [] }) {
  return (
    <li className="timeline-entry">
      <div className="timeline-entry__heading">
        <div>
          <h3 className="timeline-entry__title">{title}</h3>
          <p className="timeline-entry__organization">
            {organization}
            {location && <span className="timeline-entry__location"> · {location}</span>}
          </p>
        </div>
        <p className="timeline-entry__dates">{dates}</p>
      </div>
      {details.length > 0 && (
        <ul className="timeline-entry__details">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default TimelineEntry
