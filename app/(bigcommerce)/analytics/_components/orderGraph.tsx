import dynamic from "next/dynamic";
const Chart = dynamic(()=>import("react-google-charts"),{ssr:false})

export default function Home({ order }: { order: any }) {
  const data = [
    ["Type", "Order"],
    ["Organic", Number(order.organic)],
    ["Direct", Number(order.direct)],
    ["Social", Number(order.social)],
    ["Referral", Number(order.referral)],
    ["Paid", Number(order.paid)],
  ];
  const options = {
    legend: { position: 'none' }
  };

  return (<>
    <Chart
      chartType="Bar"
      data={data}
      options={options}
      width={'100%'}
      height={"400px"}
    />
  </>)
}
