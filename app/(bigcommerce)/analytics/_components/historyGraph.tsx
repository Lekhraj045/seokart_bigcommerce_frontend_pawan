import dynamic from "next/dynamic";
import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { Api } from "@/app/_api/apiCall";
const Chart = dynamic(() => import("react-google-charts"), { ssr: false })

export default function Home() {
  const [organic, setOrganic] = useState(true);
  const [direct, setDirect] = useState(true);
  const [social, setSocial] = useState(true);
  const [referral, setReferral] = useState(true);
  const [paid, setPaid] = useState(true);



  const [graphData, setGraphData] = useState([])
  const [jsonData, setJsonData] = useState([])

  const getGAData = () => {
    Api('getGaData', { organic: organic, direct: direct, social: social, referral: referral, paid: paid }).then((json) => {
      setJsonData(json.data)

      let date = json.data.date
      let totalOrders = json.data.total_orders
      let totalRevenue = json.data.total_revenue
      let totalTraffic = json.data.total_searches


      let commonData: any = [["Date", "Orders", "Traffic", "Revenue"]]

      date.map((item: any, key: any) => {
        commonData.push([item, totalOrders[key], totalTraffic[key], totalRevenue[key]])
      })
      if (json.data)
        setGraphData(commonData)

    })
  }


  useEffect(() => {
    getGAData()
  }, [organic, direct, social, referral, paid])

  const data = graphData;
  const options = {
    legend: { position: 'top', alignment: 'end' },
    series: {
      0: { axis: "Orders" },
      1: { axis: "Traffic" },
      2: { axis: "Revenue" }
    },
  };

  return (<>
    <div className="card">
      {jsonData.length ?
        <div className="analytics-featuresGraph">
          <div className="d-flex align-content-center gap-3 analytics-featuresRadio-box">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={organic} onChange={() => setOrganic(!organic)} />
              <label className="form-check-label">
                Organic
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={direct} onChange={() => setDirect(!direct)} />
              <label className="form-check-label">
                Direct
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={social} onChange={() => setSocial(!social)} />
              <label className="form-check-label">
                Social
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={referral} onChange={() => setReferral(!referral)} />
              <label className="form-check-label">
                Referral
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={paid} onChange={() => setPaid(!paid)} />
              <label className="form-check-label">
                Paid
              </label>
            </div>
          </div>

          <div className="featuresGraph-box">
            <Chart
              chartType="Line"
              data={data}
              options={options}
              width={'100%'}
              height={'600px'}
            />
          </div>
        </div>
        :
        'No data available to display'
      }
    </div>

  </>)
}
