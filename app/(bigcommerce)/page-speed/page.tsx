'use client'
import ChannelList from '@/app/_components/channelList'
import Howitwork from '@/app/_howitwork/modal'
import UpgradeButton from "@/app/_components/upgradeButton"
import { Tabs, Tab, Spinner } from 'react-bootstrap'
import Parenttabcontent from './_components/parentTabContent'
import { Api } from '@/app/_api/apiCall'
import { useEffect, useState } from 'react'
import Childtabcontent from './_components/childTabContent'
import Chart from './_components/chart'
import Link from 'next/link'
import Hamburger from '../../_components/hamburger'

export default function Home() {
  const [homeUrl, setHomeUrl] = useState()
  const [productUrl, setProductUrl] = useState()
  const [categoryUrl, setCategoryUrl] = useState()
  const [loading, setLoading] = useState(true)

  const [desktopData, setDesktopData] = useState<any>({})
  const [mobileData, setMobileData] = useState<any>({})
  const [desktopDataLoading, setDesktopDataLoading] = useState(true)
  const [mobileDataLoading, setMobileDataLoading] = useState(true)

  const [parentTab, setParentTab] = useState('home')
  const [childTab, setChildTab] = useState<string>('desktop')

  const [chartData, setChartData] = useState({ data: [], loading: true })

  const getPageSpeedUrl = () => {
    Api('pageSpeed/getPageSpeedUrl').then(({ data }) => {
      setLoading(false)
      setHomeUrl(data.homUrl)
      setProductUrl(data.productUrl)
      setCategoryUrl(data.categoryUrl)

      getPageSpeedData('desktop', 0, data.homUrl, 'home')
      getPageSpeedData('mobile', 0, data.homUrl, 'home')

      getPageSpeedHistory(data.homUrl)
    })
  }

  const getPageSpeedData = (strategy: any, analyze: any, url: any, type: any) => {
    strategy = (strategy == '') ? childTab : strategy
    if (strategy == 'desktop') {
      setDesktopDataLoading(true)
    } else {
      setMobileDataLoading(true)
    }

    return Api('pageSpeed/getPageSpeedData', {
      strategy: strategy,
      analyze: analyze,
      url: url,
      is_custom_url: type == 'custom' ? 1 : 0,
      type: type
    }).then(({ data }) => {
      if (strategy == 'desktop') {
        setDesktopDataLoading(false)
        setDesktopData(data)
      } else {
        setMobileDataLoading(false)
        setMobileData(data)
      }
      getPageSpeedHistory(url)

    })
  }


  const getPageSpeedHistory = (url: any) => {
    Api('pageSpeed/getPageSpeedHistory', { url: url }).then(({ data }) => {
      setChartData({ data: data, loading: false })
    })
  }

  useEffect(() => {
    getPageSpeedUrl()
  }, [])

  return (<>
    <div className="content-frame-main">
      <div className="content-frame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left flex align-item-center gap-2">
          <h1 className="Text--headingLg flex align-item-center gap-2 mb-0">
            Page Speed <Howitwork page='pagespeed' />         
          </h1>
          <ChannelList />
        </div>

        <div className="content-frameHead-right">
          <UpgradeButton />
          <Hamburger />
        </div>
      </div>
      <div className="page-speedMain">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="card">
              <Tabs
                defaultActiveKey="home"
                onSelect={(key: any) => {
                  setParentTab(key)
                  if (key != 'custom') {
                    const url = (key == 'home' ? homeUrl : (key == 'product') ? productUrl : categoryUrl)
                    getPageSpeedData('desktop', 0, url, key)
                    getPageSpeedData('mobile', 0, url, key)
                    getPageSpeedHistory(url)
                  } else {
                    setDesktopData({})
                    setMobileData({})
                  }

                }}
              >
                <Tab eventKey="home" title="Home">
                  {loading ? <Spinner /> :
                    <Parenttabcontent childTab={childTab} type='home' url={homeUrl} getPageSpeedData={(strategy: any, analyze: any, url: any, type: any) => getPageSpeedData(strategy, analyze, url, type)} />}
                </Tab>
                <Tab eventKey="product" title="Product">
                  {loading ? <Spinner /> :
                    <Parenttabcontent childTab={childTab} type='product' url={productUrl} getPageSpeedData={(strategy: any, analyze: any, url: any, type: any) => getPageSpeedData(strategy, analyze, url, type)} />}
                </Tab>
                <Tab eventKey="category" title="Category">
                  {loading ? <Spinner /> :
                    <Parenttabcontent childTab={childTab} type='category' url={categoryUrl} getPageSpeedData={(strategy: any, analyze: any, url: any, type: any) => getPageSpeedData(strategy, analyze, url, type)} />}
                </Tab>
                <Tab eventKey="custom" title="Custom">
                  <Parenttabcontent childTab={childTab} type='custom' url='' getPageSpeedData={(strategy: any, analyze: any, url: any, type: any) => getPageSpeedData(strategy, analyze, url, type)} />
                </Tab>
              </Tabs>
            </div>

            <div className="card">
              <Tabs
                defaultActiveKey="desktop"
                className="mb-3"
                onSelect={(key: any) => {
                  setChildTab(key)
                }}
              >
                <Tab eventKey="desktop" title="Desktop">
                  {desktopDataLoading ? <Spinner /> : (desktopData?.score > 0) ? <Childtabcontent data={desktopData} url={parentTab=='home' ? homeUrl : parentTab=='product' ? productUrl :categoryUrl }/> : 'No data found'}
                </Tab>
                <Tab eventKey="mobile" title="Mobile">
                  {mobileDataLoading ? <Spinner /> : (mobileData?.score > 0) ? <Childtabcontent data={mobileData} url={parentTab=='home' ? homeUrl : parentTab=='product' ? productUrl :categoryUrl } /> : 'No data found'}
                </Tab>
                {(parentTab != 'custom') &&
                  <Tab eventKey="history" title="History">
                    {chartData.loading ? <Spinner /> :
                      <Chart chartData={chartData.data} />}
                  </Tab>}
              </Tabs>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="card">
              <h2 className="Text--headingXl">Page-Speed Optimization</h2>

              <p>{`Our experts can manually improve your website's Page-Speed on both Mobile and Desktop. Please take a backup before we proceed.`}</p>

              <p>For a limited time, we are offering this service exclusively to SEOKart users at no cost!</p>

              <div className="PageSpeed-Price">
                <span>$ 149</span> $ 0
              </div>
              <p>(For a Limited Time)</p>
              <div className="full-btn">
                <Link href='help'>
                  <button type="button" className="custom-btn whitespace-nowrap">Request Free Page-Speed Optimization</button>
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}