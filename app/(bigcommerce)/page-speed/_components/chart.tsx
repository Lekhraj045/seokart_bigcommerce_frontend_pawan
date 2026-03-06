import { Chart } from "react-google-charts";


export default function Home({ chartData }: { chartData: any }) {
  const desktopData = chartData?.desktop?.map((item: any) => {
    return [item.key, Number(item.value)];
  });

  const mobileData = chartData?.mobile?.map((item: any) => {
    return [item.key, Number(item.value)];
  });


  const options = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
    vAxis: { minValue: 1, maxValue: 100 }
  };


  return (<>
    {desktopData &&
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={[["Date", "Score"], ...desktopData]}
        options={{ ...options, title: 'Desktop Chart' }}
      />}

    {mobileData &&
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={[["Date", "Score"], ...mobileData]}
        options={{ ...options, title: 'Mobile Chart' }}
      />}
  </>)
}