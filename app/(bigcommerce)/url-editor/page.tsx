'use client'

import dynamic from "next/dynamic"
const Channel = dynamic(() => import('@/app/_components/channelList'), { ssr: false })
const Howitwork = dynamic(() => import('@/app/_howitwork/modal'), { ssr: false })
const Upgrade = dynamic(() => import('@/app/_components/upgradeButton'), { ssr: false })
const Item = dynamic(() => import('./_components/item'), { ssr: false })

export default function Home() {
  return (<>
    <div className="content-frame-main">
      <div className="content-frame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left flex align-item-center gap-2">
          <h1 className="Text--headingLg flex align-item-center gap-2">
            URL Editor
            <Howitwork page='urleditor' />            
          </h1>
          <Channel />
        </div>
        <div className="content-frameHead-right">
          <Upgrade />
        </div>
      </div>
      <Item />
    </div>
  </>)
}