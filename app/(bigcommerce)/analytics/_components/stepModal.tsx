import { Modal } from "react-bootstrap"
import { useState } from "react"
import Image from "next/image"
import { basePath } from "@/next.config"

export default function Home(Props: any) {
  return (
    <>
      <Modal show={Props.show} onHide={Props.onHide} centered size="lg">
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5">
           {` We can't find the Google Analytics (Ecommerce enabled) code placed correctly on your website. Kindly follow below steps and try again.`}
          </h1>
        </Modal.Header>
        <Modal.Body>
          <h5 className="Text--headingLg">GA4</h5>


          <h5 className="Text--headingSm mt-24">{`1. Go to Admin › Data Streams.`}</h5>
          <div className="howWork-modalImg mb-16">
            <Image src={`${basePath}/images/analytics/ga1.png`} width={709} height={262} alt=""/>
          </div>


          <h5 className="Text--headingSm mt-24">{`2. On the next screen you should see the Measurement ID in the top right corner.`}</h5>
          <div className="howWork-modalImg mb-16">
            <Image src={`${basePath}/images/analytics/ga2.png`} width={709} height={262} alt=""/>
          </div>


          <h5 className="Text--headingSm mt-24">{`3. In the BigCommerce control panel, Go to Advanced Settings Data solutions (formerly Web Analytics).`}</h5>
          <div className="howWork-modalImg widthAuto mb-16">
            <Image src={`${basePath}/images/analytics/ua4.png`} width={709} height={262} alt=""/>
          </div>


          <h5 className="Text--headingSm mt-24">{`4. Select Google Analytics 4 from Data Solutions.`}</h5>
          <div className="howWork-modalImg mb-16">
            <Image src={`${basePath}/images/analytics/ga5.png`} width={709} height={262} alt=""/>
          </div>


          <h5 className="Text--headingSm mt-24">{`5. Paste the Measurement ID.`}</h5>
          <div className="howWork-modalImg mb-16">
            <Image src={`${basePath}/images/analytics/ga6.png`} width={709} height={262} alt=""/>
          </div>


          <div className="howWork-modalImg">
            <p className="mb-0">{`6. If you are using any app for privacy/cookies, then it may hide the code and our app couldn't detect it even it's there. In such cases, to directly connect the Google Analytics to SEOKart. In case nothing works, please contact us over chat. We will put all the efforts to make it work for you.`}</p>
          </div>


          <h5 className="Text--headingSm mt-24"></h5>

        </Modal.Body>
      </Modal>
    </>)
}