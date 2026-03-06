import DataTable from 'react-data-table-component';
import { useEffect, useRef, useState, memo } from 'react'
import { Api } from '@/app/_api/apiCall'
import { Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { basePath } from '@/next.config';



function Home() {
  const [data, setData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterText, setFilterText] = useState('')
  const [queueStatus, setQueueStatus] = useState({ loading: true, message: '', message_code: null })

  const getBulkOptimizerHistory = () => {
    Api('bulkOptimizer/getBulkOptimizerHistory').then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }

  const getQueueStatus = () => {
    setQueueStatus({ loading: true, message: '', message_code: null })
    Api('bulkOptimizer/getQueueStatus').then((data) => {
      getBulkOptimizerHistory()
      setQueueStatus({ loading: false, message: data.message, message_code: data.message_code })
    })
  }

  useEffect(() => {
    getBulkOptimizerHistory()
    getQueueStatus()
  }, [])

  useEffect(() => {
    if (filterText.length > 0)
      setFilterData(data.filter((item: any) => (item.item_type.toLowerCase().includes(filterText.toLowerCase())) || (item.update_type.toLowerCase().includes(filterText.toLowerCase()))))
    else
      setFilterData([])
  }, [filterText])

  const columns = [
    {
      name: 'Created Date',
      selector: (row: any) => row.date,
      maxWidth: '12%'
    },
    {
      name: 'Completed Date',
      selector: (row: any) => row.complete_date,
      maxWidth: '12%'
    },
    {
      name: 'Item Type',
      selector: (row: any) => row.item_type,
      maxWidth: '10%'
    },
    {
      name: 'Update Type',
      selector: (row: any) => row.update_type,
      maxWidth: '10%'
    },
    {
      name: 'Template Type',
      selector: (row: any) => row.template_type,
      maxWidth: '10%'
    },
    {
      name: 'Total Items',
      selector: (row: any) => row.total_items,
      maxWidth: '5%'
    },
    {
      name: 'Updated Items',
      selector: (row: any) => row.update_items,
      maxWidth: '5%'
    },
    {
      name: 'Template Value',
      selector: (row: any) => row.template_value
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      format: (row: any) => { return (<span className={`badge badge-${row.status == 1 ? 'success' : 'danger'}`}>{row.status == 1 ? 'Completed' : 'Pending'}</span>) },
      maxWidth: '5%',
      right: true
    },
  ];



  return (<>
    {loading ? <Spinner animation='grow' /> :
      <>
        <div className='flex justify-start lg:justify-between items-start md:items-center gap-3 mb-3 flex-col md:flex-row'>
          <div className="flex gap-2 flex-col xl:flex-row">
            <h2 className="text-base font-bold text-[#303030]">Bulk Optimizer History</h2>
            <span className={`badge ${queueStatus.message_code === 1 ? 'badge-success' : ''} !rounded-full break-words whitespace-normal md:whitespace-nowrap text-left`}>{queueStatus.message}</span>
          </div>

          <div className='flex justify-end items-center gap-3 w-full lg:w-auto'>
            <div className="bulk-optimizerTab--headRight d-flex gap-3 align-item-center">
              {queueStatus.loading ? <Spinner size='sm'/> :
                <>
                  <button type="button" className="custom-btn black-iconBtn !w-[32px] !h-[32px] !p-0" onClick={getQueueStatus}>
                    <Image src={`${basePath}/images/refresh-icon.svg`} alt="" width={20} height={21} />
                  </button>
                </>
              }
            </div>

            
              {(filterData.length > 0 || data.length > 0) &&
                <>
                  <div className='custom-input icon-input flex-1 md:flex-none'>
                    <i className="input-icon"><Image src={`${basePath}/images/search-icon.svg`} alt="" width={20} height={21} /></i>
                    <input type='text'
                      className='form-control'
                      placeholder="Item type / Update type"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>
                </>
              }
            
          </div>
        </div>
        <div className='custom-table customDataTable'>
          <DataTable
            columns={columns}
            data={filterText.length > 0 ? filterData : data}
            pagination
          />
        </div>
      </>}
  </>)
}

export default memo(Home)