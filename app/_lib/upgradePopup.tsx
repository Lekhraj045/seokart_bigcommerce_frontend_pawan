import { Modal} from "react-bootstrap"

export default function Home(Props: any) {
  return (<>

    <Modal centered show={Props.show} onHide={Props.handleClose} backdrop="static">
      <Modal.Header><h4>Alert</h4></Modal.Header>
      <Modal.Body><h4>The 10 days free trial is ended. Please upgrade to the paid plan.</h4></Modal.Body>
      <Modal.Footer>
        <button className="custom-btn" onClick={Props.handleNo}>Cancel</button>
        <button className="custom-btn" onClick={Props.handleYes}>Upgrade</button>
      </Modal.Footer>
    </Modal>

  </>)
}