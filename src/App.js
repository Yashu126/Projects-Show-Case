import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from './components/Header'
import ProjectItem from './components/ProjectItem'
// This is the list (static data) used in the application. You can move it to any component if needed.
const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]
const apiStatusConsts = {
  initial: 'INITIAL',
  isLoading: 'LOADING',
  onSuccess: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConsts.initial,
    projectId: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConsts.isLoading})
    const {projectId} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${projectId}`,
    )
    if (response.ok) {
      const data = await response.json()
      const modifiedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      console.log(modifiedData)
      this.setState({
        apiStatus: apiStatusConsts.onSuccess,
        projectsList: modifiedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConsts.failure})
    }
  }

  changeTab = event => {
    this.setState({projectId: event.target.value}, this.getProjects)
  }

  tryAgain = () => {
    this.getProjects()
  }

  renderLoading = () => (
    <div data-testid="loader" className="loader-con">
      <Loader color="#328af2" type="ThreeDots" />
    </div>
  )

  renderFailure = () => (
    <div className="loader-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="fail">Oops! Something Went Wrong</h1>
      <p className="fail">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="try-btn" type="button" onClick={this.tryAgain}>
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul-project-con">
        {projectsList.map(each => (
          <ProjectItem key={each.id} project={each} />
        ))}
      </ul>
    )
  }

  renderHomPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConsts.isLoading:
        return this.renderLoading()
      case apiStatusConsts.failure:
        return this.renderFailure()
      case apiStatusConsts.onSuccess:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    const {projectId} = this.state
    return (
      <div className="app-con">
        <Header />
        <div className="main-con">
          <select
            className="select-con"
            value={projectId}
            onChange={this.changeTab}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderHomPage()}
        </div>
      </div>
    )
  }
}

export default App
