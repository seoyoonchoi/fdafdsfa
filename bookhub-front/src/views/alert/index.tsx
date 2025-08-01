import { Route } from 'react-router-dom'
import AlertPage from './AlertPage'

function Alert() {
  return (
    <Route path="/alert" element={<AlertPage />} />
  )
}

export default Alert