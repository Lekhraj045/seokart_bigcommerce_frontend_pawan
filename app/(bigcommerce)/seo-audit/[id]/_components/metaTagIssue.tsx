'use client'

import Image from "next/image"
import { basePath } from "@/next.config"
import { Api } from "@/app/_api/apiCall"
import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"
import DuplicateModal from './duplicateModal'

export default function Home(Props: any) {
  const [duplicateModalShow, setDuplicateModalShow] = useState(false)
  const [type, setType] = useState('title_tag')

  return (<>
    <DuplicateModal
      show={duplicateModalShow}
      onHide={() => setDuplicateModalShow(false)}
      type={type}
      itemName={Props.itemName}
      targetKeyword={Props.targetKeyword}
      titleTag={Props.titleTag}
      metaDescription={Props.metaDescription}
      description={Props.description}
    />
    <div className="flex flex-col gap-3">
      <div className="d-flex align-item-center gap-2">
        {(Props.titleLengthIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.titleLengthIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>Title length (40 to 60)</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.metaDescriptionLengthIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.metaDescriptionLengthIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>Meta Description length (120 to 160)</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.tKTitleIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.tKTitleIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>Target Keyword present in the Title Tag</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.tKMetaDescriptionIssue.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.tKMetaDescriptionIssue.data ? 'check-circle-icon.svg' : 'alert-diamond-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>Target Keyword present in the Meta Description</p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.duplicateTitleCount.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.duplicateTitleCount.data ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No Duplicate Title Tags <a href="#" className="btn btn-default px-2" onClick={(e) => {
          e.preventDefault()
          setType('title_tag')
          setDuplicateModalShow(true)
        }}>{Props.duplicateTitleCount.data}</a></p>
      </div>

      <div className="d-flex align-item-center gap-2">
        {(Props.duplicateMetaDescriptionCount.loading) ?
          <div className="w-4 h-4 max-w-4 max-h-4">
            <Spinner size="sm" className="w-4 h-4 max-w-4 max-h-4" />
          </div> :
          <span><Image src={`${basePath}/images/${Props.duplicateMetaDescriptionCount.data ? 'alert-diamond-icon.svg' : 'check-circle-icon.svg'}`} alt="" width={16} height={16} className="w-4 h-4 max-w-4 max-h-4" /></span>}
        <p>No Duplicate Meta Descriptions <a href="#" className="btn btn-default px-2" onClick={(e) => {
          e.preventDefault()
          setType('meta_description')
          setDuplicateModalShow(true)
        }}>{Props.duplicateMetaDescriptionCount.data}</a></p>
      </div>
    </div>
  </>)
}