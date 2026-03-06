'use client'
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Error() {
  return (
    <div className='container-fluid bg-dark text-white'>
      <Container className="mt-5">
        <Row>
          <Col className="text-center">
            <h1 className="display-3">SEOKart</h1>
            <h3>You are Not Authorized to Access This Page!</h3>
            <p className="lead">If you think this is just by an error, kindly refresh or logout and access this app again. Also, kindly check your internet connection if that is causing this.</p>
            <p className="lead">If you still find the issue unresolved, please contact info@seokart.com. We will do everything to resolve this issue for you.</p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}