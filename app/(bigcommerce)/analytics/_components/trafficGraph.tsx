import dynamic from "next/dynamic";
const Chart = dynamic(()=>import("react-google-charts"),{ssr:false})

export default function Home({ traffic }: { traffic: any }) {
  const data = [
    ["Traffic", "Traffic"],
    ["Organic", Math.round(traffic.organic)],
    ["Direct", Math.round(traffic.direct)],
    ["Social", Math.round(traffic.social)],
    ["Referral", Math.round(traffic.referral)],
    ["Paid", Math.round(traffic.paid)],
  ];
  const options = {
    legend: 'none'
  };

  return (<>
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={'100%'}
      height={"400px"}
    />
  </>)
}
