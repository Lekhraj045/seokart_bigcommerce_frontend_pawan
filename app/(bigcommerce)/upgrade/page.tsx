'use client'
import { basePath } from '@/next.config'
import { Tabs, Tab, Row, Col, Nav, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap'
import Image from 'next/image'
import { useEffect, useState, useContext } from 'react'
import { Api } from '@/app/_api/apiCall'
import Content from './_components/content'
import SeoPricingTable from './_components/SeoPricingTable'
import AppPricingTable from './_components/AppPricingTable'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'


// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { GlobalContext } from '@/app/_context/global'
import { differenceInDays } from 'date-fns'

export default function Home() {
  const search = useSearchParams()

  const productArray = [1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000, 2000000]
  const [product, setProduct] = useState<any>(1000)
  const [keyword, setKeyword] = useState<any>(100)
  const [planProduct, setPlanProduct] = useState<any>(0)
  const [planKeyword, setPlanKeyword] = useState<any>(0)
  const [appPrice, setAppPrice] = useState(0)
  const [seoPrice, setSeoPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [planId, setPlanId] = useState(1)
  const [paypalPlanId, setPaypalPlanId] = useState<any>('')
  const [paymentStatus, setPaymentStatus] = useState('cancelled')
  const [currentPlanName, setCurrentPlanName] = useState('pro')
  const [liveProduct, setLiveProduct] = useState(0)
  const [planName, setPlanName] = useState('')

  const [showInnerPage, setShowInnerPage] = useState(false)


  const [activeTab, setActiveTab] = useState('app')


  const { userStatus } = useContext(GlobalContext)
  const [daysDiff, setDaysDiff] = useState(5)
  const [trialLoading, setTrialLoading] = useState(true)

  const getTrialInfo = () => {
    setTrialLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/freeTrial`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shop: localStorage.getItem('shop') }),
      method: 'POST'
    }).then((json) => json.json())
      .then((data) => {
        setTrialLoading(false)
        const date = new Date((data.freeTrialDate) * 1000)
        const daysDiff = differenceInDays(new Date(), date)
        setDaysDiff(daysDiff)
      })
  }

  const getCurrentPlan = () => {
    Api('payment/getCurrentPlan').then(({ data }) => {
      setPaymentStatus(data.payment_status)
      setCurrentPlanName(data.plan_name)
      setLiveProduct(data.total_live_product)
      if (data.proPlanData.plan_id) {
        setPlanId(data.proPlanData?.plan_id)
        setProduct(data.proPlanData?.plan_product)
        setKeyword(data.proPlanData?.plan_keyword)
        setPlanProduct(data.proPlanData?.plan_product)
        setPlanKeyword(data.proPlanData?.plan_keyword)
      }
      else {
        setProduct(productArray.find((item: any) => item > data.total_live_product))
      }

    })
  }

  const getPlanPrice = () => {
    setLoading(true)
    Api('payment/getPlanPrice', { product: product, keyword: keyword }).then(({ data }) => {
      setLoading(false)
      setPlanId(data.id)
      setAppPrice(data.price)
    })
  }

  const cancelPaidPlan = () => {
    Api('payment/cancelPaidPlan').then((data) => {
      window.location.reload()
    })
  }

  useEffect(() => {
    getPlanPrice()
  }, [product, keyword])

  useEffect(() => {
    getCurrentPlan()
    getTrialInfo()
  }, [])


  useEffect(() => {
    setActiveTab(search?.get('tab') ?? 'app')
  }, [search])


  return (<>
    <div className="content-frame-main">
      {showInnerPage ?
        <>
          <Content
            setShowInnerPage={() => setShowInnerPage(false)}
            planName={planName}
            price={planName == 'pro' ? appPrice : seoPrice}
            paypalPlanId={paypalPlanId}
            planId={planId}
          />
        </> :
        <>
          <div className="py-3 lg:py-6 flex justify-between items-start md:items-center gap-3 flex-col md:flex-row">
            <div className="content-frameHead-left flex flex-col">
              <div className='flex flex-col'>
                <h1 className="Text--headingLg flex align-item-center gap-2">
                  Managed Ecommerce SEO Plans
                </h1>
                <p className="text-xs text-[#616161] mt-0.5">Choose a plan and adjust deliverables. Totals update instantly based on your selections.</p>
              </div>
            </div>

            <div className="invoiceLink-mobile">
              <Link href='/invoices'>
                <button type="button" className="btn-primary white-iconBtn d-flex align-item-center gap-1">Invoices</button>
              </Link>
            </div>
          </div>


          <div className="pricing-main !w-full">
            <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={(e: any) => setActiveTab(e)}>
              <div className='pricingTable-top mb-4 md:mb-0'>
                <div className='pricingTable-top-inner flex-1'>
                  <Link href='/invoices' className='invoiceLink-tab'>
                    <button type="button" className="btn-primary white-iconBtn d-flex align-item-center gap-1">Invoices</button>
                  </Link>

                  <div className='card !p-2 !m-0'>
                    <Nav variant="tabs" className="d-grid grid-column-2" >
                      <Nav.Item>
                        <Nav.Link eventKey="app" className='text-center' style={{ "textDecoration": "none" }}>App</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="seoServices" className='text-center' style={{ "textDecoration": "none" }}> SEO Services</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="app">
                  <div className="pricing-area">
                    <AppPricingTable
                      paymentStatus={paymentStatus}
                      currentPlanName={currentPlanName}
                      liveProduct={liveProduct}
                      planProduct={planProduct}
                      planKeyword={planKeyword}
                      product={product}
                      setProduct={setProduct}
                      keyword={keyword}
                      setKeyword={setKeyword}
                      appPrice={appPrice}
                      loading={loading}
                      setShowInnerPage={setShowInnerPage}
                      setPlanName={setPlanName}
                      setPaypalPlanId={setPaypalPlanId}
                      cancelPaidPlan={cancelPaidPlan}
                    />
                  </div>
                </Tab.Pane>


                <Tab.Pane eventKey="seoServices">
                  <div className="pricing-area seoServicesTab">
                    <SeoPricingTable
                      paymentStatus={paymentStatus}
                      currentPlanName={currentPlanName}
                      setShowInnerPage={setShowInnerPage}
                      setSeoPrice={setSeoPrice}
                      setPlanName={setPlanName}
                      setPaypalPlanId={setPaypalPlanId}
                    />
                  </div>
                </Tab.Pane>
              </Tab.Content>

            </Tab.Container>

          </div>
        </>}
    </div>

  </>)
}