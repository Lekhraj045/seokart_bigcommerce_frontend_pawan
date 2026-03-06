import { Modal } from "react-bootstrap"

export default function Home(Props: any) {
  return (<>

    <Modal centered show={Props.show} onHide={Props.handleClose} backdrop="static">
      <Modal.Header><h4>Alert</h4></Modal.Header>
      <Modal.Body><h4><p>SEOKart recommends thoroughly reviewing and editing any AI-generated content before utilizing it for your store to ensure it maintains a human-like tone, high quality, accuracy, and professional standard.</p></h4></Modal.Body>
      <Modal.Footer>
        <button onClick={Props.handleClose} className="custom-btn">I understand</button>
      </Modal.Footer>
    </Modal>

  </>)
}