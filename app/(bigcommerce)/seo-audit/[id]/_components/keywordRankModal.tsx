import { Modal, Spinner } from "react-bootstrap"
import Select from "react-select"
import { useState, useEffect } from "react"
import { Api } from "@/app/_api/apiCall"
import { toast } from 'react-toastify'

export default function Home(Props: any) {
  const [keyword, setKeyword] = useState(Props.targetKeyword)
  const [countryList, setCountryList] = useState<any>([])
  const [selectedCountry, setSelectedCountry] = useState<any>('US')
  const [languageList, setLanguageList] = useState<any>([])
  const [selectedLanguage, setSelectedLanguage] = useState<any>('English')
  const [device, setDevice] = useState<any>('monitor')
  const [searchEngineList, setSearchEngineList] = useState<any>([])
  const [selectedSearchEngine, setSelectedSearchEngine] = useState<any>('google.com')
  const [addKeywordBtnLoading, setAddKeywordBtnLoading] = useState(false)

  const deviceList = [{ label: "Desktop", value: "monitor" }, { label: 'Mobile', value: 'smartphone' }]

  const getCountry = () => {
    Api('getCountry').then(({ data }) => {
      setCountryList(data.map((item: any) => ({ label: item.location_name, value: item.country_iso_code })))
    })
  }

  const getLanguage = () => {
    Api('getLanguage').then(({ data }) => {
      setLanguageList(data.map((item: any) => ({ label: item.language_name, value: item.language_name })))
    })
  }

  const getSearchEngine = () => {
    Api('getSearchEngine', { country: countryList.find((item: any) => item.value == selectedCountry)?.label }).then(({ data }) => {
      setSearchEngineList(data.map((item: any) => ({ label: item.se_name, value: item.se_name })))
    })
  }

  const addKeyword = () => {
    if (keyword.length == 0) {
      toast.error('Input Keyword')
      return false
    }
    setAddKeywordBtnLoading(true)
    Api('addKeywords',
      {
        keywords: keyword,
        search_en: selectedSearchEngine,
        search_en_language: selectedLanguage,
        country_name: countryList.find((item: any) => (item.value == selectedCountry)).label,
        device: device,
        country_iso_code: selectedCountry
      }).then((data) => {
        setAddKeywordBtnLoading(false)
        setKeyword('')
        toast.success(data.message)
      })
  }

  useEffect(() => {
    getCountry()
    getLanguage()
  }, [])

  useEffect(() => {
    getSearchEngine()
  }, [selectedCountry])

  useEffect(() => {
    setKeyword(Props.targetKeyword)
  }, [Props.targetKeyword])
  return (<>
    <Modal show={Props.show} onHide={Props.onHide} centered={true} size="lg">
      <Modal.Header closeButton={true}><h1>Add Keyword to Rank Tracker</h1></Modal.Header>
      <Modal.Body>
        <div className="keyword-suggestionModal">
          <div className="row">
            <div className="col-md-12 mb-22">
              <div className="custom-input">
                <span>Enter Keyword</span>
                <input type="text" className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
            </div>

            <div className="col-md-6 col-sm-12 mb-22">
              <Select
                value={countryList.find((item: any) => item.value == selectedCountry)}
                onChange={(selectedValue: any) => setSelectedCountry(selectedValue.value)}
                options={countryList}
              />
            </div>

            <div className="col-md-6 col-sm-12 mb-22">
              <Select
                value={deviceList.find((item: any) => item.value == device)}
                onChange={(selectedValue: any) => setDevice(selectedValue.value)}
                options={deviceList}
              />
            </div>

            <div className="col-md-6 col-sm-12 mb-22">
              <Select
                value={searchEngineList.find((item: any) => item.value == selectedSearchEngine)}
                onChange={(selectedValue: any) => setSelectedSearchEngine(selectedValue.value)}
                options={searchEngineList}
              />
            </div>

            <div className="col-md-6 col-sm-12 mb-22">
              <Select
                value={languageList.find((item: any) => item.value == selectedLanguage)}
                onChange={(selectedValue: any) => setSelectedLanguage(selectedValue.value)}
                options={languageList}
              />
            </div>



            <div className="full-btn">
              <button className="custom-btn" onClick={addKeyword}>{addKeywordBtnLoading ? <Spinner size='sm' /> : 'Add'}</button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </>)
}