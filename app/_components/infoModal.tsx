import { useState } from "react"
import { Modal} from "react-bootstrap"

export default function Home(Props: any) {
  const [show,setShow] = useState(true)

  return (<>
  <Modal centered show={show} onHide={()=>setShow(false)} backdrop="static">
      <Modal.Header><h4>{Props.heading}</h4></Modal.Header>
      <Modal.Body><h4>{Props.message}</h4></Modal.Body>
      <Modal.Footer className="justify-content-center">
        <button className="custom-btn" onClick={()=>setShow(false)}>Close</button>
      </Modal.Footer>
    </Modal>

  </>)
}