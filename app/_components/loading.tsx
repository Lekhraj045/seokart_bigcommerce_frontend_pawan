import { Spinner } from 'react-bootstrap'

export default function Home() {
  return (<>
    <div className="container d-flex align-items-center justify-content-center" style={{ "minHeight": "100vh" }}>
      <div>
        <Spinner animation="border" />
      </div>
    </div>
  </>)
}