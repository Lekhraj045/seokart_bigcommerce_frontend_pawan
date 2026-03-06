'use client'

import { Api } from "@/app/_api/apiCall"
import dynamic from "next/dynamic"
import { useEffect, useState, useCallback } from "react"
import { Spinner } from "react-bootstrap"
import { Pagination } from 'rsuite'

const Channel = dynamic(() => import('@/app/_components/channelList'), { ssr: false })
const Howitwork = dynamic(() => import('@/app/_howitwork/modal'), { ssr: false })
const Upgrade = dynamic(() => import('@/app/_components/upgradeButton'), { ssr: false })
const Single = dynamic(() => import('./_components/single'), { ssr: false })

export default function Home() {
  const [type, setType] = useState('not_fixed')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // ✅ Reset page when filter or limit changes
  useEffect(() => {
    setCurrentPage(1)
  }, [type, limit])

  const getInternalLinkList = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await Api('404Fixer/getInternalLinkList', {
        filter_type: type,
        page: currentPage,
        limit: limit
      })

      setItems(data?.data || [])
      setTotal(data?.total_page_count || 0)

    } catch (err) {
      console.error("API Error:", err)
      setItems([])
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [type, currentPage, limit])

  useEffect(() => {
    getInternalLinkList()
  }, [getInternalLinkList])

  return (
    <div className="content-frame-main">
      <div className="content-frame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left">
          <h1 className="Text--headingLg flex align-item-center gap-2">
            404 Fixer
            <Howitwork page='404fixer' />
            <Channel />
          </h1>
        </div>
        <Upgrade />
      </div>

      <div className="image-optimizerMain">
        <div className="card">

          {/* Filter */}
          <div className="d-flex justify-content-between">
            <div className="d-flex align-item-center gap-3">
              <div className="custom-dropi without-labelDropi">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-select"
                >
                  <option value='all'>Errors - All</option>
                  <option value='fixed'>Errors - Fixed</option>
                  <option value='not_fixed'>Errors - Not Fixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* List Area */}
          <div className="optimizerList-area">

            {loading && (
              <div className='text-center my-4'>
                <Spinner />
              </div>
            )}

            {!loading && error && (
              <div className="text-danger text-center my-4">
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="text-center my-4">
                No records found.
              </div>
            )}

            {!loading && !error && items.map((item: any) => (
              <Single
                key={item.id || item.url}  // ⚠️ Use unique backend id ideally
                item={item}
              />
            ))}

            {/* Pagination */}
            {!loading && !error && total > 0 && (
              <Pagination
                total={total}
                limit={limit}
                limitOptions={[5, 10, 20]}
                prev
                next
                first
                last
                layout={['limit', 'pager', 'skip', '-']}
                maxButtons={4}
                ellipsis
                boundaryLinks
                activePage={currentPage}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeLimit={(newLimit) => setLimit(newLimit)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
