import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image'

export default function Home({ data,url }: { data: any,url:any }) {
  return (<>
    <div className="PageSpeed-MainBox">
      <div className="PageSpeed-BoxInner d-flex align-content-center justify-content-between">
        <div className="PageSpeed-LeftArea">
          <div className="PageSpeed-ProgressBar" style={{ "width": "120px", "height": "120px" }}>
            <CircularProgressbar
              value={data.score}
              text={data.score}
              background
              strokeWidth={6}
              backgroundPadding={1}
              styles={buildStyles({
                backgroundColor: (data.score > 89 ? '#E5FAEF' : (data.score > 49 && data.score < 90) ? '#FFF6EA' : '#FFEAEA'),
                textColor: (data.score > 89 ? '#008800' : (data.score > 49 && data.score < 90) ? '#E9931C' : '#CC0000'),
                pathColor: (data.score > 89 ? '#00CC66' : (data.score > 49 && data.score < 90) ? '#FFAA33' : '#FF3333'),
                trailColor: "transparent",
                textSize: "30"
              })}
            />
          </div>
          <div className="PageSpeed-Left-content">
            <h2 className="Text--headingXl">Performance</h2>
            <p>Values are estimated and may vary. <br />
              Go to <a href={`https://pagespeed.web.dev/report?url=${url}`} target="_blank">Google Page Speed Insights</a> to get detailed information.
            </p>

            <div className="PageSpeed-ScoreScale">
              <ul>
                <li className="PageSpeed-ScoreScale-Range ScoreScale-Range-Fail">0-49</li>
                <li className="PageSpeed-ScoreScale-Range ScoreScale-Range-Average">50–89</li>
                <li className="PageSpeed-ScoreScale-Range ScoreScale-Range-Success">90–100</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="PageSpeed-RightArea">
          <div className="PageSpeed-Result-Img">
            <Image src={data.img_data} width={375} height={260} alt="" />
          </div>
        </div>
      </div>

      <div className="pageSpeed-metrics">
        <h2 className="Text--headingXl">Performance</h2>
        <div className="row mt-22">
          <div className="col-md-6 col-sm-12">
            <div className="PageSpeed-Metrics-Box d-flex mb-18">
              <div className="MetricsIcon-Red"></div>
              <div className="PageSpeed-Metrics-Text">
                <h6 className="Text--headingMd">First Contentful Paint</h6>
                <h3 className="Text--headingXl red-text">{data.first_contentful_pain}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="PageSpeed-Metrics-Box d-flex mb-18">
              <div className="MetricsIcon-Yellow"></div>
              <div className="PageSpeed-Metrics-Text">
                <h6 className="Text--headingMd">Largest Contentful Paint</h6>
                <h3 className="Text--headingXl red-text">{data.largest_contentful_pain}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="PageSpeed-Metrics-Box d-flex mb-18">
              <div className="MetricsIcon-Green"></div>
              <div className="PageSpeed-Metrics-Text">
                <h6 className="Text--headingMd">Total Blocking Time</h6>
                <h3 className="Text--headingXl red-green">{data.total_blocking_time}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="PageSpeed-Metrics-Box d-flex mb-18">
              <div className="MetricsIcon-Green"></div>
              <div className="PageSpeed-Metrics-Text">
                <h6 className="Text--headingMd">Cumulative Layout Shift</h6>
                <h3 className="Text--headingXl red-green">{data.layout_shift}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="PageSpeed-Metrics-Box d-flex mb-0">
              <div className="MetricsIcon-Red"></div>
              <div className="PageSpeed-Metrics-Text">
                <h6 className="Text--headingMd">Speed Index</h6>
                <h3 className="Text--headingXl red-text">{data.speed_index}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </>)
}