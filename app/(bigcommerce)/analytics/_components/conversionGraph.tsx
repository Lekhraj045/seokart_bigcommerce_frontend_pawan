import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-google-charts"), { ssr: false })

export default function Home({ conversion }: { conversion: any }) {
  const data = [
    ["Type", "Key Event Rate"],
    ["Organic", Number(conversion.organic)],
    ["Direct", Number(conversion.direct)],
    ["Social", Number(conversion.social)],
    ["Referral", Number(conversion.referral)],
    ["Paid", Number(conversion.paid)],
  ];
  const options = {
    legend: { position: 'none' },
    bars: 'horizontal'
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
