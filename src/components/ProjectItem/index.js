import './index.css'

const ProjectItem = props => {
  const {project} = props
  const {name, imageUrl} = project
  return (
    <li className="proect-item">
      <img className="item-img" src={imageUrl} alt={name} />
      <p className="item-name">{name}</p>
    </li>
  )
}

export default ProjectItem
