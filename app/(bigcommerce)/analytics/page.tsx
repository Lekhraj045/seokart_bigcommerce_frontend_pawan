'use client'

import ChannelList from "@/app/_components/channelList"
import Howitwork from '@/app/_howitwork/modal'
import { basePath } from "@/next.config"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import StepModal from './_components/stepModal'
import { Api } from "@/app/_api/apiCall"
import { DateRangePicker, Stack } from 'rsuite';
import { format, subDays } from "date-fns"
import Spinner from '@/app/_components/loading'
const { combine, afterToday, allowedRange } = DateRangePicker;
//import RevenueGraph from './_components/revenueGraph'
const RevenueGraph = dynamic(()=>import('./_components/revenueGraph'),{ssr:false,loading:()=><>Loading...</>})
//import OrderGraph from './_components/orderGraph'
const OrderGraph = dynamic(()=>import('./_components/orderGraph'),{ssr:false,loading:()=><>Loading...</>})
//import TrafficGraph from './_components/trafficGraph'
const TrafficGraph = dynamic(()=>import('./_components/trafficGraph'),{ssr:false,loading:()=><>Loading...</>})
//import ConversionGraph from './_components/conversionGraph'
const ConversionGraph = dynamic(()=>import('./_components/conversionGraph'),{ssr:false,loading:()=><>Loading...</>})
//import HistoryGraph from './_components/historyGraph'
const HistoryGraph = dynamic(()=>import('./_components/historyGraph'),{ssr:false,loading:()=><>Loading...</>})
import AccountListModal from './_components/accountListModal'


export default function Home(Props: any) {
  const [stepModal, setStepModal] = useState(false)
  const [startDate, setStartDate] = useState<any>(subDays(new Date(), 29))
  const [endDate, setEndDate] = useState<any>(new Date())
  const [cStartDate, cSetStartDate] = useState<any>(subDays(new Date(), 59))
  const [cEndDate, cSetEndDate] = useState<any>(subDays(new Date(), 30))
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  const [revenue, setRevenue] = useState<any>({ organic: 0, direct: 0, social: 0, referral: 0, paid: 0, organicDiff: 0, directDiff: 0, socialDiff: 0, referralDiff: 0, paidDiff: 0 })
  const [order, setOrder] = useState({ organic: 0, direct: 0, social: 0, referral: 0, paid: 0, organicDiff: 0, directDiff: 0, socialDiff: 0, referralDiff: 0, paidDiff: 0 })
  const [traffic, setTraffic] = useState({ organic: 0, direct: 0, social: 0, referral: 0, paid: 0, organicDiff: 0, directDiff: 0, socialDiff: 0, referralDiff: 0, paidDiff: 0 })
  const [conversion, setConversion] = useState({ organic: 0, direct: 0, social: 0, referral: 0, paid: 0, organicDiff: 0, directDiff: 0, socialDiff: 0, referralDiff: 0, paidDiff: 0 })


  const [totalRevenue, setTotalRevenue] = useState(5000)
  const [totalOrder, setTotalOrder] = useState(0)
  const [totalTraffic, setTotalTraffic] = useState(0)
  const [totalConversion, setTotalConversion] = useState(0)

  const [totalRevenueDiff, setTotalRevenueDiff] = useState(3000)
  const [totalOrderDiff, setTotalOrderDiff] = useState(0)
  const [totalTrafficDiff, setTotalTrafficDiff] = useState(0)
  const [totalConversionDiff, setTotalConversionDiff] = useState(0)

  const [currency, setCurrency] = useState('')

  const intervalId = useRef<any>('')

  const [accountListModalOpen, setAccountListModalOpen] = useState(false)


  const getAnalyticsData = () => {
    setLoading(true)
    Api('getAnalyticsData', {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      cstart_date: format(cStartDate, 'yyyy-MM-dd'),
      cend_date: format(cEndDate, 'yyyy-MM-dd')
    }).then((json: any) => {
      setLoading(false)
      setIsConnected(!!json.is_connected)

      if (json.is_connected == 1) {
        const total = json.data.rows.total
        const data = json.data.rows.data
        const diff = json.data.rows.diff

        setTotalRevenue(total.total_revenue)
        setTotalOrder(total.total_order)
        setTotalTraffic(total.total_traffic)
        setTotalConversion(total.total_conversion)

        setTotalRevenueDiff(total.total_revenue_diff)
        setTotalOrderDiff(total.total_order_diff)
        setTotalTrafficDiff(total.total_traffic_diff)
        setTotalConversionDiff(total.total_conversion_diff)

        setCurrency(json.data.currency)

        setRevenue({ organic: data[2][1], direct: data[0][1], social: data[3][1], referral: data[1][1], paid: data[4][1], organicDiff: diff[2][1], directDiff: diff[0][1], socialDiff: diff[3][1], referralDiff: diff[1][1], paidDiff: diff[4][1] })

        setOrder({ organic: data[2][2], direct: data[0][2], social: data[3][2], referral: data[1][2], paid: data[4][2], organicDiff: diff[2][2], directDiff: diff[0][2], socialDiff: diff[3][2], referralDiff: diff[1][2], paidDiff: diff[4][2] })

        setTraffic({ organic: data[2][3], direct: data[0][3], social: data[3][3], referral: data[1][3], paid: data[4][3], organicDiff: diff[2][3], directDiff: diff[0][3], socialDiff: diff[3][3], referralDiff: diff[1][3], paidDiff: diff[4][3] })

        setConversion({ organic: data[2][4], direct: data[0][4], social: data[3][4], referral: data[1][4], paid: data[4][4], organicDiff: diff[2][4], directDiff: diff[0][4], socialDiff: diff[3][4], referralDiff: diff[1][4], paidDiff: diff[4][4] })
      }

    })
  }

  const disconnectAnalytics = () => {
    Api('disconnectAnalytics').then(() => {
      getAnalyticsData()
    })
  }

  const checkAnalyticsCode = () => {
    Api('checkAnalyticsCode').then(({ data }) => {
      if (data.code_present == 'yes') {
        getAuthUrl()
      } else {
        setStepModal(true)
      }
    })
  }

  const accountList = () => {
    Api('getAnalyticsData', {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      cstart_date: format(cStartDate, 'yyyy-MM-dd'),
      cend_date: format(cEndDate, 'yyyy-MM-dd')
    }).then((json: any) => {
      if (json.is_connected == 2) {
        clearInterval(intervalId.current);
        setAccountListModalOpen(true)
      }
    })
  }

  const getAuthUrl = () => {
    Api('getAuthUrl').then((data) => {
      var x = screen.width / 2 - 450 / 2;
      var y = screen.height / 2 - 600 / 2;
      window.open(data.data.callback_uri, 'name', 'height=600,width=450,left=' + x + ',top=' + y)
      intervalId.current = setInterval(accountList, 4000);
    })
  }

  useEffect(() => {
    getAnalyticsData()
  }, [])
  return (<>
    {accountListModalOpen &&
      <AccountListModal show={accountListModalOpen} onHide={() => setAccountListModalOpen(false)} />}
    <StepModal show={stepModal} onHide={() => setStepModal(false)} />
    <div className="content-frame-main">
      <div className="content-frame-head ga-connectFrame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left flex align-item-center gap-2">
          <h1 className="Text--headingLg mb-0 flex align-item-center gap-2">
            Analytics <Howitwork page='analytics' />      
          </h1>          
          <ChannelList />
        </div>

        <div className="content-frameHead-right">

          {isConnected ?
            <>
              <div className="ga-connectedHead-right">
                <div className="ga-connect-date d-flex gap-3">
                  <DateRangePicker value={[startDate, endDate]} onChange={(value: any) => {
                    setStartDate(value[0])
                    setEndDate(value[1])
                  }}
                    shouldDisableDate={combine(afterToday(), allowedRange(new Date('2006-01-01'), new Date()))}
                  />

                  <DateRangePicker value={[cStartDate, cEndDate]} onChange={(value: any) => {
                    cSetStartDate(value[0])
                    cSetEndDate(value[1])
                  }}
                    shouldDisableDate={combine(afterToday(), allowedRange(new Date('2006-01-01'), new Date()))}
                  />
                </div>
                <div className="ga-connectedBtn gap-3 flex">
                  <button type="button" className="btn-primary headBtn-link" onClick={getAnalyticsData}>Apply</button>
                  <button type="button" className="btn-primary headBtn-link ga-disconnect-btn" onClick={disconnectAnalytics}>Disconnect GA</button>
                </div>
              </div>
            </>
            :
            <>
              <button type="button" className="btn-primary headBtn-link" onClick={checkAnalyticsCode}>Connect Google Analytics</button>
              <div className="headInfo-icon" onClick={() => setStepModal(true)}>
                <Image src={`${basePath}/images/info-icon.svg`} alt='' width={20} height={20} />
              </div>
            </>
          }


        </div>
      </div>

      {loading ? <Spinner /> : isConnected ?
        <div className="analytics-graphArea">
          <div className="d-grid grid-column-4 gap-24">
            <div className="card">
              <h5 className="Text--headingSm mt-0">Revenue</h5>
              <div className="analytics-graphBox">
                <div className="analytics-graph">
                  <RevenueGraph revenue={revenue} />
                </div>
              </div>
              <div className="analytics-graphInfo">
                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0">Total</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{currency} {Math.round(totalRevenue).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${totalRevenueDiff < 0 ? 'badge-danger' : totalRevenueDiff > 0 ? 'badge-success' : ''}`}>
                      {totalRevenueDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        totalRevenueDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(totalRevenueDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsBlue__Bg"></span> Organic</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(revenue.organic).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${revenue.organicDiff < 0 ? 'badge-danger' : revenue.organicDiff > 0 ? 'badge-success' : ''}`}>
                      {revenue.organicDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        revenue.organicDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(revenue.organicDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsRed__Bg"></span> Direct</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(revenue.direct).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${revenue.directDiff < 0 ? 'badge-danger' : revenue.directDiff > 0 ? 'badge-success' : ''}`}>
                      {revenue.directDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        revenue.directDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(revenue.directDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsOrange__Bg"></span> Social</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(revenue.social).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${revenue.socialDiff < 0 ? 'badge-danger' : revenue.socialDiff > 0 ? 'badge-success' : ''}`}>
                      {revenue.socialDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        revenue.socialDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(revenue.socialDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsGreen__Bg"></span> Referral</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(revenue.referral).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${revenue.referralDiff < 0 ? 'badge-danger' : revenue.referralDiff > 0 ? 'badge-success' : ''}`}>
                      {revenue.referralDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        revenue.referralDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(revenue.referralDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsPurple__Bg"></span> Paid</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(revenue.paid).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${revenue.paidDiff < 0 ? 'badge-danger' : revenue.paidDiff > 0 ? 'badge-success' : ''}`}>
                      {revenue.paidDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        revenue.paidDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(revenue.paidDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h5 className="Text--headingSm mt-0">Orders</h5>
              <div className="analytics-graphBox">
                <div className="analytics-graph">
                  <OrderGraph order={order} />
                </div>
              </div>
              <div className="analytics-graphInfo">
                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0">Total</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(totalOrder).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${totalOrderDiff < 0 ? 'badge-danger' : totalOrderDiff > 0 ? 'badge-success' : ''}`}>
                      {totalOrderDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        totalOrderDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.round(totalOrderDiff).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsBlue__Bg"></span> Organic</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(order.organic).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${order.organicDiff < 0 ? 'badge-danger' : order.organicDiff > 0 ? 'badge-success' : ''}`}>
                      {order.organicDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        order.organicDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(order.organicDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsRed__Bg"></span> Direct</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(order.direct).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${order.directDiff < 0 ? 'badge-danger' : order.directDiff > 0 ? 'badge-success' : ''}`}>
                      {order.directDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        order.directDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(order.directDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsOrange__Bg"></span> Social</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(order.social).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${order.socialDiff < 0 ? 'badge-danger' : order.socialDiff > 0 ? 'badge-success' : ''}`}>
                      {order.socialDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        order.socialDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(order.socialDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsGreen__Bg"></span> Referral</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(order.referral).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${order.referralDiff < 0 ? 'badge-danger' : order.referralDiff > 0 ? 'badge-success' : ''}`}>
                      {order.referralDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        order.referralDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(order.referralDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsPurple__Bg"></span> Paid</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(order.paid).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${order.paidDiff < 0 ? 'badge-danger' : order.paidDiff > 0 ? 'badge-success' : ''}`}>
                      {order.paidDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        order.paidDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(order.paidDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h5 className="Text--headingSm mt-0">Traffic</h5>
              <div className="analytics-graphBox">
                <div className="analytics-graph">
                  <TrafficGraph traffic={traffic} />
                </div>
              </div>
              <div className="analytics-graphInfo">
                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0">Total</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(totalTraffic).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${totalTrafficDiff < 0 ? 'badge-danger' : totalTrafficDiff > 0 ? 'badge-success' : ''}`}>
                      {totalTrafficDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        totalTrafficDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(totalTrafficDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsBlue__Bg"></span> Organic</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(traffic.organic).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${traffic.organicDiff < 0 ? 'badge-danger' : traffic.organicDiff > 0 ? 'badge-success' : ''}`}>
                      {traffic.organicDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        traffic.organicDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(traffic.organicDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsRed__Bg"></span> Direct</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(traffic.direct).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${traffic.directDiff < 0 ? 'badge-danger' : traffic.directDiff > 0 ? 'badge-success' : ''}`}>
                      {traffic.directDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        traffic.directDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(traffic.directDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsOrange__Bg"></span> Social</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(traffic.social).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${traffic.socialDiff < 0 ? 'badge-danger' : traffic.socialDiff > 0 ? 'badge-success' : ''}`}>
                      {traffic.socialDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        traffic.socialDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(traffic.socialDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsGreen__Bg"></span> Referral</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(traffic.referral).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${traffic.referralDiff < 0 ? 'badge-danger' : traffic.referralDiff > 0 ? 'badge-success' : ''}`}>
                      {traffic.referralDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        traffic.referralDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(traffic.referralDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsPurple__Bg"></span> Paid</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.round(traffic.paid).toLocaleString()}</span>
                    <span className={`badge keywordBadge ${traffic.paidDiff < 0 ? 'badge-danger' : traffic.paidDiff > 0 ? 'badge-success' : ''}`}>
                      {traffic.paidDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        traffic.paidDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(Math.round(traffic.paidDiff)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h5 className="Text--headingSm mt-0">Key Event Rate</h5>
              <div className="analytics-graphBox">
                <div className="analytics-graph">
                  <ConversionGraph conversion={conversion} />
                </div>
              </div>
              <div className="analytics-graphInfo">
                {/* <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0">Total</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(totalConversion*100)/100}%</span>
                    <span className={`badge keywordBadge ${totalConversionDiff < 0 ? 'badge-danger' : totalConversionDiff > 0 ? 'badge-success' : ''}`}>
                      {totalConversionDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        totalConversionDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(totalConversionDiff).toFixed(2)}%
                    </span>
                  </div>
                </div> */}

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsBlue__Bg"></span> Organic</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(conversion.organic*100)/100}%</span>
                    <span className={`badge keywordBadge ${conversion.organicDiff < 0 ? 'badge-danger' : conversion.organicDiff > 0 ? 'badge-success' : ''}`}>
                      {conversion.organicDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        conversion.organicDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(conversion.organicDiff).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsRed__Bg"></span> Direct</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(conversion.direct*100)/100}%</span>
                    <span className={`badge keywordBadge ${conversion.directDiff < 0 ? 'badge-danger' : conversion.directDiff > 0 ? 'badge-success' : ''}`}>
                      {conversion.directDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        conversion.directDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(conversion.directDiff).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsOrange__Bg"></span> Social</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(conversion.social*100)/100}%</span>
                    <span className={`badge keywordBadge ${conversion.socialDiff < 0 ? 'badge-danger' : conversion.socialDiff > 0 ? 'badge-success' : ''}`}>
                      {conversion.socialDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        conversion.socialDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(conversion.socialDiff).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsGreen__Bg"></span> Referral</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(conversion.referral*100)/100}%</span>
                    <span className={`badge keywordBadge ${conversion.referralDiff < 0 ? 'badge-danger' : conversion.referralDiff > 0 ? 'badge-success' : ''}`}>
                      {conversion.referralDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        conversion.referralDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(conversion.referralDiff).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="analytics-graphInfo--box d-flex justify-content-between align-items-center">
                  <h5 className="Text--headingSm mb-0"><span className="analyticsPurple__Bg"></span> Paid</h5>
                  <div className="d-flex align-item-center gap-3">
                    <span className="keywordCompetitor-rank">{Math.floor(conversion.paid*100)/100}%</span>
                    <span className={`badge keywordBadge ${conversion.paidDiff < 0 ? 'badge-danger' : conversion.paidDiff > 0 ? 'badge-success' : ''}`}>
                      {conversion.paidDiff == 0 ? <Image src={`${basePath}/images/equal-arrow.svg`} width={20} height={20} alt="" /> :
                        conversion.paidDiff < 0 ? <Image src={`${basePath}/images/down-arrow.svg`} width={20} height={20} alt="" /> :
                          <Image src={`${basePath}/images/up-arrow.svg`} width={20} height={20} alt="" />}
                      {Math.abs(conversion.paidDiff).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HistoryGraph />
        </div>
        : <div className="analytics-connectArea position-relative">
          <Image src={`${basePath}/images/analytics/dashboard-ga-connect.png`} width={1529} height={512} alt='' />
          <button type="button" className="btn btn-default" onClick={checkAnalyticsCode}>Please Connect SEOKart to Google Analytics</button>
        </div>}




    </div>

  </>)
}