import { useMemo, useState } from "react"
import { Modal, Spinner } from "react-bootstrap"
import { Api } from "@/app/_api/apiCall"
import Image from "next/image"
import { basePath } from "@/next.config"
import _ from "lodash"

export default function Home(Props: any) {
  const [keyword, setKeyword] = useState('')
  const [suggestKeywords, setSuggestKeywords] = useState({ data: [], loading: false })

  const debouncedGetGoogleSuggestedKeyword = useMemo(
    () =>
      _.debounce((keywordVal: string) => {
        setSuggestKeywords({ data: [], loading: true })
        Api('getGoogleSuggestedKeyword', { keyword: keywordVal }).then(({ data }) => {
          setSuggestKeywords({ data: data, loading: false })
        })
      }, 500),
    [],
  )

  return (
    <>
      <Modal centered show={Props.show} onHide={Props.handleClose}>
        <Modal.Header closeButton><h1 className="modal-title fs-5" >Keywords Suggestions</h1></Modal.Header>
        <Modal.Body>
          <div className="keyword-suggestionModal">
            <div className="custom-searchIcon">
              <div className="custom-input">
                <span>Enter Keyword</span>
                <input type="text" placeholder="Enter Keyword" value={keyword} onChange={(event: any) => {
                  const value = event.target.value
                  setKeyword(value)
                  debouncedGetGoogleSuggestedKeyword(value)
                }} className="form-control pr-50" />
                <button type="button" className="competitor-clearBtn"><Image src={`${basePath}/images/search-icon.svg`} width={20} height={21} alt='' /></button>
              </div>
            </div>

            <div className="keywordSuggestion-field mt-20">
              <div className="custom-table competitor-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestKeywords.loading ? <tr><td><Spinner size="sm" /></td></tr> :
                      suggestKeywords?.data?.map((item: any, key: any) => (
                        <tr key={key}>
                          <td>{item}</td>
                          <td><button type="button" className="icon-btn" onClick={()=>{Props.handleAddKeyword(item)}}><Image src={`${basePath}/images/add-icon.svg`} width={20} height={21} alt='' /></button></td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>)
}