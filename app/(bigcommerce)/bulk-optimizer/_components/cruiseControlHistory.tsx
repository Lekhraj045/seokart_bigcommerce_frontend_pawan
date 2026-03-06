import DataTable from 'react-data-table-component';
import { useEffect, useRef, useState, useMemo } from 'react'
import { Api } from '@/app/_api/apiCall'
import { Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { basePath } from '@/next.config';



export default function Home() {
  const [data, setData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterText, setFilterText] = useState('');

  const getCruiseControlHistory = () => {
    Api('bulkOptimizer/getCruiseControlHistory').then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    getCruiseControlHistory()
  }, [])

  useEffect(() => {
    if (filterText.length > 0)
      setFilterData(data.filter((item: any) => (item.item_type.toLowerCase().includes(filterText.toLowerCase())) || (item.template_type.toLowerCase().includes(filterText.toLowerCase()))))
    else
      setFilterData([])
  }, [filterText])

  const columns = [
    {
      name: 'Date',
      selector: (row: any) => row.date,
      maxWidth: '10%'
    },
    {
      name: 'Item Type',
      selector: (row: any) => row.item_type,
      maxWidth: '10%'
    },
    {
      name: 'Template Type',
      selector: (row: any) => row.template_type,
      maxWidth: '12%'
    },
    {
      name: 'Updated Items',
      selector: (row: any) => row.total_update,
      maxWidth: '10%'
    },
    {
      name: 'Template Value',
      selector: (row: any) => row.template_value
    }
  ];



  return (<>
    {loading ? <Spinner animation='grow' /> :
      <>
        <div className='flex justify-between items-start md:items-center gap-3 mb-3 flex-col md:flex-row'>
          <h2 className="text-base font-bold text-[#303030]">Cruise Control History</h2>
          <div className='custom-input icon-input tab-fullWidth tab-textLeft'>
            {(filterData.length > 0 || data.length > 0) &&
              <>
                <i className="input-icon"><Image src={`${basePath}/images/search-icon.svg`} alt="" width={20} height={21} /></i>
                <input type='text'
                  className='form-control'
                  placeholder="Item type / Update type"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
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