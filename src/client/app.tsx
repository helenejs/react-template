import './app.css'
import { useMethod } from '@helenejs/react'

export function App() {
  const method = useMethod({
    method: 'hello',
  })

  if (method.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>{method.result}</div>
  )
}
