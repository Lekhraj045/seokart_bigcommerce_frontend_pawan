'use client'

import { Api } from '@/app/_api/apiCall';
import ChannelList from '@/app/_components/channelList'
import Howitwork from '@/app/_howitwork/modal'
import { useEffect, useState, useCallback, useContext } from 'react';
import { debounce } from 'lodash';
import { Pagination } from 'rsuite';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import { basePath } from '@/next.config';
import Image from 'next/image';
import Upgrade from '@/app/_components/upgradeButton'
import Singleimage from './_components/singleImage'
import Link from 'next/link'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/app/_components/confirmation'
import Hamburger from '../../_components/hamburger'
import UpgradePopup from '@/app/_lib/upgradePopup'
import { GlobalContext } from '@/app/_context/global'
import ImageModal, { ImageModalRef } from './_components/imageModal';
import { useRef } from 'react';

export default function Home() {
  const router = useRouter()
  let componentKey = 0
  const [imageList, setImageList] = useState({ data: [], loading: true })
  const [quota, setQuota] = useState({ used: 0, limit: 0, optimizedImage: 0, inProgressImage: 0, restoredImage: 0 })
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [masterCheckbox, setMasterCheckbox] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [updatedAltText, setUpdatedAltText] = useState<any>({})
  const [updateAltTextBtnLoading, setUpdateAltTextBtnLoading] = useState(false)
  const [checkedImage, setCheckedImage] = useState<any>({})
  const [masterButtonLoading, setMasterButtonLoading] = useState(false)
  const [allProductButton, setAllProductButton] = useState(false)
  const [optimizeConfirmModalShow, setOptimizeConfirmModalShow] = useState(false)
  const [restoreConfirmModalShow, setRestoreConfirmModalShow] = useState(false)
  const [jobStatus, setJobStatus] = useState(false)
  const [jobStatusLoad, setJobStatusLoad] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const { userStatus,trialDays } = useContext(GlobalContext)
  const imageModalRef = useRef<ImageModalRef>(null)



  const getImageList = useCallback(debounce((pageLink: number, searchKeyword = '') => {
    Api('imageOptimizer/getImageList', { filter_type: filter, page_link: pageLink, search_keyword: searchKeyword, limit: limit }).then((data) => {
      setImageList({ data: data.data, loading: false })
      setTotal(data.totalProductCount)
    })
  }, searchKeyword ? 3000 : 0), [limit, filter]);




  useEffect(() => {
    setCurrentPage(1)
    getImageList(1, searchKeyword)
  }, [limit, filter, searchKeyword])


  const updateAltText = () => {

    setUpdateAltTextBtnLoading(true)
    Api('imageOptimizer/updateAltText', { alt_data: JSON.stringify(Object.values(updatedAltText)) }).then((data) => {
      setUpdateAltTextBtnLoading(false)
      toast.success('Your changes are saved.')
    })
  }

  const handleMasterOptimize = () => {


    if (allProductButton == true) {
      setOptimizeConfirmModalShow(true)
    } else {
      const checkedImageArray = Object.values(checkedImage)
      const filterArray = checkedImageArray.filter((item: any) => item.is_optimize == 0)
      if (filterArray.length == 0) {
        toast.error('Please select Images.')
      } else {
        setMasterCheckbox(false)
        setMasterButtonLoading(true)
        Api('imageOptimizer/checkboxImageOptimize', { bulk_img_data: JSON.stringify(Object.values(checkedImage)) }).then((data: any) => {
          if (data.status_code == 200) {
            setMasterButtonLoading(false)
            setImageList({ data: [], loading: true })
            getImageList(currentPage, searchKeyword)
            toast.success('Your image is queued for optimization. It may take up to a few hours depending on the queue our server has.')
          }
          if (data.status_code == 202) {
            setMasterButtonLoading(false)
            imageModalRef.current?.openModal()
          }
          if (data.status_code == 204 || data.status_code == 203) {
            setMasterButtonLoading(false)
            toast.error(data.message)
          }
        })
      }
    }

  }

  const handleMasterRestore = () => {

    if (allProductButton == true) {
      setRestoreConfirmModalShow(true)
    } else {
      const checkedImageArray = Object.values(checkedImage)
      const filterArray = checkedImageArray.filter((item: any) => item.is_optimize == 1)
      if (filterArray.length == 0) {
        toast.error('Please select Images.')
      } else {
        setMasterCheckbox(false)
        setMasterButtonLoading(true)
        Api('imageOptimizer/checkboxRestoreImage', { bulk_img_data: JSON.stringify(Object.values(checkedImage)) }).then((data: any) => {
          if (data.status_code == 200) {
            setMasterButtonLoading(false)
            setImageList({ data: [], loading: true })
            getImageList(currentPage, searchKeyword)
            toast.success('Your image is queued for Restore. It may take up to a few hours depending on the queue our server has.')
          }
          if (data.status_code == 202) {
            setMasterButtonLoading(false)
            imageModalRef.current?.openModal()
          }
          if (data.status_code == 204 || data.status_code == 203) {
            setMasterButtonLoading(false)
            toast.error(data.message)
          }
        })
      }
    }

  }

  const BulkImageOptimize = () => {

    setAllProductButton(false)
    setMasterCheckbox(false)
    setMasterButtonLoading(true)
    Api('imageOptimizer/BulkImageOptimize').then((data) => {
      if (data.status_code == 200) {
        setMasterButtonLoading(false)
        toast.success('Your image is queued for optimization. It may take up to a few hours depending on the queue our server has.')
      }
      if (data.status_code == 202) {
        setMasterButtonLoading(false)
        imageModalRef.current?.openModal()
      }
      if (data.status_code == 204 || data.status_code == 203) {
        setMasterButtonLoading(false)
        toast.error(data.message)
      }
    })
  }

  const RestoreBulkOptimizeImage = () => {

    setAllProductButton(false)
    setMasterCheckbox(false)
    setMasterButtonLoading(true)
    Api('imageOptimizer/RestoreBulkOptimizeImage').then((data) => {
      if (data.status_code == 200) {
        setMasterButtonLoading(false)
        toast.success('Your image is queued for Restore. It may take up to a few hours depending on the queue our server has.')
      }
      if (data.status_code == 202) {
        setMasterButtonLoading(false)
        imageModalRef.current?.openModal()
      }
      if (data.status_code == 204 || data.status_code == 203) {
        setMasterButtonLoading(false)
        toast.error(data.message)
      }
    })
  }

  const getImgJobStatus = () => {
    setJobStatusLoad(true)
    Api('imageOptimizer/getImgJobStatus').then(({ data }) => {
      setJobStatusLoad(false)
      setJobStatus(!!data.isJobRunning)
    })
  }

  const getImagesCount = () => {
    Api('imageOptimizer/getImagesCount').then(({ data }) => {
      setQuota({ used: data.total_used_image, limit: data.optimize_limit, optimizedImage: data.total_optimized_image, inProgressImage: data.total_inprogress_image, restoredImage: data.total_restored_image })

    })
  }

  useEffect(() => {
    getImgJobStatus()
    getImagesCount()
  }, [])

  return (<>
    
    <ConfirmModal show={optimizeConfirmModalShow} handleClose={() => setOptimizeConfirmModalShow(false)}
      message={<><p>This process can not be stopped once it gets started. We suggest you first optimize some of the images manually before going for bulk optimization to check if everything works fine for your store.</p>
        <p>Also, please note that you may need to manage and check with any 3rd party App/Service you are using for search/display/indexing of images.</p></>}
      handleYes={() => {
        BulkImageOptimize()
        setOptimizeConfirmModalShow(false)
      }}
      handleNo={() => setOptimizeConfirmModalShow(false)}
    />


    <ConfirmModal show={restoreConfirmModalShow} handleClose={() => setRestoreConfirmModalShow(false)}
      message={<><p>This process can not be stopped once it gets started. We suggest you first restore some of the images manually before going for bulk optimization to check if everything works fine for your store.</p>
        <p>Also, please note that you may need to manage and check with any 3rd party App/Service you are using for search/display/indexing of images.</p></>}
      handleYes={() => {
        RestoreBulkOptimizeImage()
        setRestoreConfirmModalShow(false)
      }}
      handleNo={() => setRestoreConfirmModalShow(false)}
    />
    <div className="content-frame-main">
      <div className="content-frame-head flex justify-content-between align-item-center gap-2">
        <div className="content-frameHead-left flex align-item-center gap-2">
          <h1 className="Text--headingLg flex align-item-center gap-2 mb-0">
            Image Optimizer
            <Howitwork page='imageoptimizer' />
          </h1>
          <ChannelList />
        </div>

        <div className="content-frameHead-right imageOptimizer-headRight">
          <div className="badge badge-success"> Quota Used: {quota.used} /{quota.limit}</div>

          <div className="d-flex align-item-center gap-2">
            {jobStatusLoad ? <Spinner size='sm' /> :
              <div className={`badge badge-${jobStatus ? 'warning' : 'success'}`}>{jobStatus ? 'Image optimization running..' : 'No pending queue.'}</div>}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>
                Optimized: {quota.optimizedImage}<br />
                In Progress: {quota.inProgressImage}<br />
                Restored: {quota.restoredImage}
              </Tooltip>}
            >
              <Image src={`${basePath}/images/info-icon.svg`} alt='' width={20} height={20} />
            </OverlayTrigger>
          </div>
          <Upgrade />
          <Hamburger />
        </div>
      </div>

      <div className="image-optimizerMain">
        <div className="card">
          <div className="d-flex justify-content-between gap-2 image-optimizerFilter">
            <div className="d-flex align-item-center gap-3 image-optimizerFilter-left">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={masterCheckbox} onChange={() => setMasterCheckbox(!masterCheckbox)} />
              </div>
              {masterButtonLoading ? <Spinner size='sm' /> :
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Optimize</Tooltip>}>
                    <button type="button" className={`custom-btn black-iconBtn ${Object.keys(checkedImage).length == 0 ? 'btn-disable' : ''}`} onClick={handleMasterOptimize}>
                      <Image src={`${basePath}/images/optimize-icon.svg`} width={21} height={21} alt='' />
                    </button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Restore</Tooltip>}>
                    <button type="button" className={`custom-btn black-iconBtn ${Object.keys(checkedImage).length == 0 ? 'btn-disable' : ''}`} onClick={handleMasterRestore}>
                      <Image src={`${basePath}/images/restore-icon.svg`} width={21} height={21} alt='' />
                    </button>
                  </OverlayTrigger>
                </>}


            </div>

            <div className="d-flex align-item-center gap-3 image-optimizerFilter-right">
              <div className="custom-input icon-input without-labelInput">
                <i className="input-icon"><Image src={`${basePath}/images/search-icon.svg`} width={20} height={20} alt='' /></i>
                <input type="text" placeholder="Search" className="form-control" value={searchKeyword} onChange={(e) => {
                  setImageList({ data: [], loading: true })
                  setSearchKeyword(e.target.value)
                }} />
              </div>

              <ImageModal ref={imageModalRef} />

              {/* <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Setting</Tooltip>}>
                <Link href='/image-optimizer-setting'>
                  <button type="button" className="custom-btn black-iconBtn">
                    <Image src={`${basePath}/images/setting-icon.svg`} width={20} height={21} alt='' />
                  </button>
                </Link>

              </OverlayTrigger> */}

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Refresh</Tooltip>}>
                <button type="button" className="custom-btn black-iconBtn" onClick={() => {
                  setImageList({ data: [], loading: true })
                  getImageList(currentPage, searchKeyword)
                }}>
                  <Image src={`${basePath}/images/refresh-icon.svg`} width={20} height={21} alt='' />
                </button>
              </OverlayTrigger>



              <button type="button" className="custom-btn whitespace-nowrap" onClick={updateAltText} disabled={updateAltTextBtnLoading}>
                {updateAltTextBtnLoading ? <Spinner size='sm' /> : 'Save Alt Text'}
              </button>
            </div>
          </div>

          {masterCheckbox &&
            <div className="AllSelected-box">
              {allProductButton == false &&
                <div className="AllSelected-inner">{limit} products on this page are selected <button type="button" className="plain-btn" onClick={() => {
                  setAllProductButton(true)
                }}>Select all {total} products</button></div>}
              {allProductButton &&
                <div className="AllSelected-inner">{total} products are selected <button type="button" className="plain-btn" onClick={() => {
                  setAllProductButton(false)
                  setMasterCheckbox(false)
                }}>Clear Selection</button></div>}
            </div>
          }


          <div className="optimizerList-area">
            {imageList.loading ? <div className='text-center'><Spinner /></div> :
              <>
                {imageList.data.length > 0 ?
                  <>
                    {imageList.data.map((product: any, key) => (
                      <div className={product.length > 1 ? 'groupLink-box' : ''} key={key}>
                        <div className={product.length > 1 ? 'groupLink-inner' : ''}>
                          {product.map((image: any, key: any) => (
                            <Singleimage
                              key={key}
                              componentKey={componentKey++}
                              image={image}
                              checkbox={masterCheckbox}
                              setUpdatedAltText={(newObj: any, componentKey: any) => {
                                setUpdatedAltText((updatedAltText: any) => ({ ...updatedAltText, [componentKey]: newObj }))
                              }}
                              setCheckedImage={(checked: any, newObj: any, componentKey: any) => {
                                if (checked == true) {
                                  setCheckedImage((checkedImage: any) => ({ ...checkedImage, [componentKey]: newObj }))
                                } else {
                                  setCheckedImage((checkedImage: any) => {
                                    const updatedImage = { ...checkedImage }
                                    delete updatedImage[componentKey]
                                    return updatedImage
                                  })
                                }
                              }}
                              openSettingsModal={() => imageModalRef.current?.openModal()}
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                  </> :
                  <>
                    No product found
                  </>}

              </>
            }




            <Pagination total={total} limit={limit} limitOptions={[5, 10, 20]} prev={true} next={true} first={true} last={true}
              layout={['limit', 'pager', 'skip', '-']}
              maxButtons={4}
              ellipsis={true}
              boundaryLinks={true}
              activePage={currentPage}
              onChangePage={(page) => {
                setImageList({ data: [], loading: true })
                setCurrentPage(page)
                getImageList(page, searchKeyword)
              }}
              onChangeLimit={(limit) => {
                setImageList({ data: [], loading: true })
                setLimit(limit)
              }}
            />
          </div>
        </div>
      </div>
    </div >
  </>)
} 