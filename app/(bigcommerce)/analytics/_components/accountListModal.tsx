'use client'


import { memo, useCallback, useEffect, useState } from 'react'
import { Api } from '@/app/_api/apiCall'
import { Modal } from 'react-bootstrap'
import Select from "react-select"

function Home(Props: any) {
  const [account, setAccount] = useState('')
  const [property, setProperty] = useState('')
  const [currency, setCurrency] = useState('')

  const [accountList, setAccountList] = useState({ loading: true, data: [] })
  const [propertyList, setPropertyList] = useState({ loading: true, data: [] })


  const getAnalyticsAccountList = () => {
    setAccountList({ loading: true, data: [] })
    Api('getAnalyticsAccountList').then((json: any) => {
      const accountList = Object.values(json.data.domain_list)
      const ListArr: any = accountList.map((item: any) => ({ label: item.name, value: item.id }));
      setAccountList({ loading: false, data: ListArr })
      setAccount(json.data.domain_list[0].id)
    })
  }

  const getAnalyticsPropertyGA4 = useCallback(() => {
    setPropertyList({ loading: true, data: [] })
    if (account) {
      Api('getAnalyticsPropertyGA4', { account_id: account }).then((json: any) => {
        const ListArr = json.data.properties.map((item: any) => ({ label: item.name, value: item.name }));
        setPropertyList({ loading: false, data: ListArr })
        setCurrency(json.data.properties[0].currencyCode)
        setProperty(json.data.properties[0].name)
      })
    }

  }, [account])


  const updateGoogleProperty = () => {
    if (account) {
      Api('updateGoogleProperty', { account_id: account, property_id: property, currency: currency }).then((json: any) => {
        window.location.reload();
      })
    }

  }



  useEffect(() => {
    getAnalyticsAccountList()
  }, [])

  useEffect(() => {
    getAnalyticsPropertyGA4()
  }, [getAnalyticsPropertyGA4])

  return (
    <>
      <Modal show={Props.show} onHide={Props.onHide} centered={true} size="sm">
        <Modal.Header closeButton={true}><h1>Connect Google Analytics</h1></Modal.Header>
        <Modal.Body>
          <div className="keyword-suggestionModal">
            <div className="row">


              <div className="col-md-12 col-sm-12 mb-22">
                <Select
                  value={accountList.data.find((item: any) => item.value == account)}
                  onChange={(selectedValue: any) => setAccount(selectedValue.value)}
                  options={accountList.data}
                />
              </div>

              <div className="col-md-12 col-sm-12 mb-22">
                <Select
                  value={propertyList.data.find((item: any) => item.value == property)}
                  onChange={(selectedValue: any) => setProperty(selectedValue.value)}
                  options={propertyList.data}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-primary' onClick={updateGoogleProperty}>Submit</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default memo(Home)