import dynamic from "next/dynamic";
const Chart = dynamic(()=>import("react-google-charts"),{ssr:false})

export default function Home({ revenue }: { revenue: any }) {
  const data = [
    ["Revenue", "Revenue"],
    ["Organic", Math.round(revenue.organic)],
    ["Direct", Math.round(revenue.direct)],
    ["Social", Math.round(revenue.social)],
    ["Referral", Math.round(revenue.referral)],
    ["Paid", Math.round(revenue.paid)],
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
