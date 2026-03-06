'use client'

import Image from "next/image"
import { basePath } from "@/next.config"
import { Api } from "@/app/_api/apiCall"
import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"
import LinkModal from './linkModal'
import SpellModal from './spellModal'
import { useParams } from "next/navigation"

export default function Home(Props: any) {
  const param = useParams()
  const [linkModalShow, setLinkModalShow] = useState(false)
  const [spellModalShow, setSpellModalShow] = useState(false)
  const [linkType, setLinkType] = useState('internal')
  const [spellStatus, setSpellStatus] = useState(Props.spellStatus)

  const [spellCount, setSpellCount] = useState(Props.spellErrorDescriptionCount.data)

  useEffect(() => {
    setSpellCount(Props.spellErrorDescriptionCount.data)
  }, [Props.spellErrorDescriptionCount.data])

  const updateSpellErrorStatus = (spellStatus: any) => {
    Api('updateSpellErrorStatus', { type: spellStatus, id: param.id })
  }

  useEffect(() => {
    setSpellStatus(Props.spellStatus)
  }, [Props.spellStatus])



  return (<>
    <LinkModal
      show={linkModalShow}
      onHide={() => setLinkModalShow(false)}
      itemName={Props.itemName}
      targetKeyword={Props.targetKeyword}
      titleTag={Props.titleTag}
      metaDescription={Props.metaDescription}
      description={Props.description}
      linkType={linkType}
    />

    <SpellModal
      show={spellModalShow}
      onHide={() => setSpellModalShow(false)}
      itemName={Props.itemName}
      targetKeyword={Props.targetKeyword}
      titleTag={Props.titleTag}
      metaDescription={Props.metaDescription}
      description={Props.description}
      count={spellCount}
      updateSpellCount={(count: any) => {
        setSpellCount(count)
      }}
      getAuditScoreOnChange={() => Props.getAuditScoreOnChange()}
    />
    <div className="flex flex-col gap-3">
      <div className="d-flex align-item-center gap-2">
        {(Props.tKDescriptionIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.tKDescriptionIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No Target Keyword present in the description</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.loremIpsumDescriptionIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.loremIpsumDescriptionIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No Lorem Ipsum content in the description</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.internalBrokenCount.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.internalBrokenCount.data ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No Internal Broken Links <a href="#" className="btn btn-default px-2" onClick={(e) => {
          e.preventDefault()
          setLinkType('internal')
          setLinkModalShow(true)
        }}>{Props.internalBrokenCount.data}</a></p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.externalBrokenCount.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.externalBrokenCount.data ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No External Broken Links <a href="#" className="btn btn-default px-2" onClick={(e) => {
          e.preventDefault()
          setLinkType('external')
          setLinkModalShow(true)
        }}>{Props.externalBrokenCount.data}</a></p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.httpCount.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.httpCount.data ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No HTTP Links <a href="#" className="btn btn-default px-2" onClick={(e) => {
          e.preventDefault()
          setLinkType('http')
          setLinkModalShow(true)
        }}>{Props.httpCount.data}</a></p>
      </div>

      <div className="spelling-listIssues">
        <div className="d-flex align-item-center gap-2 mb-2">
          {(Props.spellErrorDescriptionCount.loading) ?
            <div className="w-4 h-4 max-w-4 max-h-4">
              <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
            </div> :
            <span><Image src={`${basePath}/images/${(spellCount && spellStatus == 'on') ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
          <p>No Spelling Errors in the description <a href="#" className="btn btn-default px-2" onClick={(e) => {
            e.preventDefault()
            setSpellModalShow(true)
          }}>{spellStatus === 'on' ? spellCount : 0}</a></p>
        </div>

        <div className="custom-dropi without-labelDropi">
          <select className="form-select" aria-label="Default select example" value={spellStatus} onChange={(e) => {
            const newSpellStatus = e.target.value
            setSpellStatus(newSpellStatus)
            updateSpellErrorStatus(newSpellStatus)
            // Update parent component's spellStatus
            if (Props.updateSpellStatus) {
              Props.updateSpellStatus(newSpellStatus)
            }
            // Update spellErrorDescriptionCount to 0 if spellStatus is not "on"
            if (newSpellStatus !== 'on' && Props.updateSpellErrorCount) {
              Props.updateSpellErrorCount(0)
            }
            Props.getAuditScoreOnChange()
          }}>
            <option value='off_store'>OFF for this Store</option>
            <option value='on'>On</option>
            <option value='off_page'>OFF for this Page</option>
          </select>
        </div>
      </div>
    </div>
  </>)
}