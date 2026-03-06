import { useEffect, useState } from "react"
import { Spinner } from 'react-bootstrap'
import { basePath } from "@/next.config"
import Image from "next/image"


export default function Home({ type, url, getPageSpeedData, childTab }: { type: any, url: any, getPageSpeedData: any, childTab: any }) {
  const [inputUrl, setInputUrl] = useState(url)
  const [buttonLoading, setButtonLoading] = useState(false)




  const handleOnClickAnalyze = () => {
    setButtonLoading(true)
    getPageSpeedData('', 1, inputUrl, type).then(() => {
      setButtonLoading(false)
    })
  }




  useEffect(() => {
    setInputUrl(url)
  }, [url])



  return (<>
    <div className="PageSpeed-URL-Area">
      <div className="PageSpeed-Url-Box">
        <div className="PageSpeed-Url-img">
          <Image src={`${basePath}/images/pageSpeed-url.svg`} width="30" height="30" alt="" />
        </div>
        <div className="custom-input flex-grow-1">
          <input type="text" className="form-control" value={inputUrl} onChange={(event: any) => setInputUrl(event.target.value)} disabled={type != 'custom' ? true : false} />
        </div>
        {childTab != 'history' &&
          <button className="custom-btn" onClick={handleOnClickAnalyze} disabled={(inputUrl && !buttonLoading) ? false : true}>{buttonLoading ? <Spinner size="sm" /> : 'Analyze'}</button>
        }
      </div>
    </div>
  </>)
}