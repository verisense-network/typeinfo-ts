import { Suspense } from 'react'
import routes from '~react-pages'
import { useRoutes } from 'react-router-dom'

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}

export default App
