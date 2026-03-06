import { Modal, Button, ListGroup, Badge } from 'react-bootstrap'

export default function Home(Props: any) {
  const getModalTitle = () => {
    if (Props.type === "titleTag") {
      return "Empty Title Tags"
    } else if (Props.type === "metaDescription") {
      return "Empty Meta Description"
    }
    return "Empty Title Tag"
  }

  return (
    <>
      <Modal show={Props.show} onHide={Props.handleClose}>
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5">{getModalTitle()}</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="dashboard-bulkOptimizer-modal">
            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Home:</div>
              <div className="DBM-left">{Props.home}</div>
            </div>

            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Product:</div>
              <div className="DBM-left">{Props.product}</div>
            </div>

            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Category:</div>
              <div className="DBM-left">{Props.category}</div>
            </div>

            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Brands:</div>
              <div className="DBM-left">{Props.brand}</div>
            </div>

            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Pages:</div>
              <div className="DBM-left">{Props.page}</div>
            </div>

            <div className="dashboard-bulkModal-list flex align-item-center justify-content-between">
              <div className="DBM-left">Blogs:</div>
              <div className="DBM-left">{Props.blog}</div>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </>)
}