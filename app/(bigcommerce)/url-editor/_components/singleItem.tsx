import { basePath } from "@/next.config"
import Image from "next/image"
import { useEffect, useState } from "react"
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import { toast } from "react-toastify"
import { Api } from "@/app/_api/apiCall"

export default function Home({ item, itemType, refresh }: { item: any, itemType: any, refresh: any }) {
  const [homeUrl, setHomeUrl] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)


  const updateUrlData = () => {
    setButtonLoading(true)
    Api('urlEditor/updateUrlData', {
      item_id: item.id ?? item.category_id,
      new_url: newUrl,
      old_url: (itemType == 'category') ? item.url.path : (itemType == 'page') ? item.url : item.custom_url.url,
      redirect_url: redirectUrl,
      item_type: itemType
    }).then(() => {
      toast.success('URL is updated.')
      refresh()
    })
  }

  const deleteRedirectUrl = () => {
    setButtonLoading(true)
    Api('urlEditor/deleteRedirectUrl', {
      item_id: item.id ?? item.category_id,
      item_type: itemType
    }).then(() => {
      toast.success('URL is deleted.')
      refresh()
    })
  }

  useEffect(() => {
    const channelObj = JSON.parse(localStorage.getItem('channel') ?? '')
    setHomeUrl(channelObj.domain)
  }, [])
  return (<>
    <div className={item.url_status == 1 ? 'groupLink-box' : ''}>
      <div className={item.url_status == 1 ? 'groupLink-inner' : ''}>

        {item.url_status == 1 &&
          item.old_url_db.map((singleItem: any, key: any) => (
            <div className="optimizerList-box d-flex align-item-center gap-3" key={key}>
              <div className="optimizerProduct-img">
                {item.url_tiny ?
                  <Image src={item.url_tiny} width={38} height={38} alt="" />
                  :
                  <Image src={`${basePath}/images/noimage.jpg`} width={38} height={38} alt="" />}
              </div>

              <div className="optimizerProduct-imgfeild flex-grow-1 d-flex align-item-center gap-3">
                <div className="custom-input link-iconDropi flex-grow-1">
                  <span>
                    Current URL
                    <a href={`${homeUrl}${item.old_url_db[key]}`} target="_blank"><Image src={`${basePath}/images/link-icon.svg`} width={16} height={16} alt="" /></a>
                  </span>
                  <input type="text" className="form-control" value={`${homeUrl}${item.old_url_db[key]}`} disabled />
                </div>

                <div className="custom-input flex-grow-1">
                  <span>New URL</span>
                  <input type="text" className="form-control" value={`${homeUrl}${item.new_url_db[key]}`} disabled />
                </div>

                <div className="custom-input flex-grow-1">
                  <span>Redirect URL</span>
                  <input type="text" className="form-control" value={`${homeUrl}${item.redirect_url_db[key]}`} disabled />
                </div>
              </div>

              <div className="optimizerProduct-actionInfo d-flex align-item-center gap-3">
                <button type="button" className="btn btn-default url-savedBtn btn-disable">Saved</button>
              </div>
            </div>
          ))
        }

        <div className="optimizerList-box d-flex align-item-center gap-3">
          <div className="optimizerProduct-img">
            {item.url_tiny ?
              <Image src={item.url_tiny} width={38} height={38} alt="" />
              :
              <Image src={`${basePath}/images/noimage.jpg`} width={38} height={38} alt="" />}
          </div>

          <div className="URLEditor-inputList">
            <div className="custom-input link-iconDropi flex-grow-1">
              <span>
                Current URL
                <a href={`${homeUrl}${itemType == 'category' ? item.url.path : (itemType == 'page') ? item.url : item.custom_url.url}`} target="_blank"><Image src={`${basePath}/images/link-icon.svg`} width={16} height={16} alt="" /></a>
              </span>
              <input type="text" className="form-control" value={`${homeUrl}${itemType == 'category' ? item.url.path : (itemType == 'page') ? item.url : item.custom_url.url}`} disabled />
            </div>

            <div className="custom-input prefix-input flex-grow-1">
              <span>New URL</span>
              <OverlayTrigger overlay={<Tooltip>{homeUrl}</Tooltip>}>
                <div className="urlEditor-prefix">{homeUrl}</div>
              </OverlayTrigger>

              <input type="text" className="form-control" value={newUrl} onChange={(e) => {
                setRedirectUrl(e.target.value)
                setNewUrl(e.target.value)
              }} />
              <div className={`keyword-count ${(homeUrl.length + newUrl.length) > 48 && 'red-text'}`}>{homeUrl.length + newUrl.length}</div>
            </div>

            <div className="custom-input prefix-input flex-grow-1">
              <span>Redirect URL</span>
              <OverlayTrigger overlay={<Tooltip>{homeUrl}</Tooltip>}>
                <div className="urlEditor-prefix">{homeUrl}</div>
              </OverlayTrigger>
              <input type="text" className="form-control" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} />
              <div className={`keyword-count ${(homeUrl.length + redirectUrl.length) > 48 && 'red-text'}`}>{homeUrl.length + redirectUrl.length}</div>
            </div>
          </div>

          <div className="optimizerProduct-actionInfo d-flex align-item-center gap-2">
            {buttonLoading ? <Spinner size="sm" /> :
              <>
                <button type="button" className={`btn btn-default ${item.url_status == 0 && 'url-savedBtn'} ${(newUrl.length == 0 || buttonLoading) && 'btn-disable'}`} disabled={(newUrl.length == 0 || buttonLoading)} onClick={updateUrlData}>Save</button>
                {item.url_status == 1 &&
                  <button type="button" className="btn btn-default" onClick={deleteRedirectUrl}><Image src={`${basePath}/images/delete-icon.svg`} width={20} height={20} alt="" /></button>
                }
              </>}
           
          </div>
        </div>
      </div>
    </div>
  </>)
}