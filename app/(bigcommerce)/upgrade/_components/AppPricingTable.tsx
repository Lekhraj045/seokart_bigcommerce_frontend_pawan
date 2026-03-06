'use client'

import { useState } from 'react'
import { OverlayTrigger, Tooltip, Spinner, Modal, Button } from 'react-bootstrap'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, HashNavigation } from 'swiper/modules';


const PRODUCT_OPTIONS = [1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000, 2000000]
const KEYWORD_OPTIONS = [100, 200, 300, 400, 500]

function FeatureCell({ title, tooltipContent }: { title: string; tooltipContent: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="font-medium text-[13px] flex items-center gap-2">
        {title}
        <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipContent}</Tooltip>}>
          <span className="cursor-help ml-1 font-semibold text-[13px]">
            <div className="infoIconUpgrade">
              <Icon
                source={InfoIcon}
              />
            </div>
          </span>
        </OverlayTrigger>
      </div>
    </div>
  )
}

function IncludedBadge() {
  return (
    <div className="inline-flex items-center gap-2 w-full">
      <span className="w-[18px] h-[18px] rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-600 font-black text-xs flex-shrink-0">✓</span>
      <span className="text-gray-500 text-xs">Included</span>
    </div>
  )
}

function NotIncludedBadge() {
  return (
    <div className="inline-flex items-center gap-2 w-full">
      <span className="w-[18px] h-[18px] rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 font-black text-xs flex-shrink-0">✗</span>
      <span className="text-gray-500 text-xs">Available in Pro Plan</span>
    </div>
  )
}

export default function AppPricingTable(props: {
  paymentStatus: string
  currentPlanName: string
  liveProduct: number
  planProduct: number
  planKeyword: number
  product: number
  setProduct: (v: number) => void
  keyword: number
  setKeyword: (v: number) => void
  appPrice: number
  loading: boolean
  setShowInnerPage: (v: boolean) => void
  setPlanName: (v: string) => void
  setPaypalPlanId: (v: string) => void
  cancelPaidPlan: () => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [freePlanButtonLoading, setFreePlanButtonLoading] = useState(false)

  const isFreeCurrent = props.paymentStatus !== 'completed'
  const isProCurrent =
    props.paymentStatus === 'completed' &&
    props.currentPlanName === 'pro' &&
    props.product === props.planProduct &&
    props.keyword === props.planKeyword

  const handleCancelPaidPlan = () => {
    setFreePlanButtonLoading(true)
    props.cancelPaidPlan()
    setModalOpen(false)
  }

  const handleChoosePro = () => {
    props.setShowInnerPage(true)
    props.setPlanName('pro')
    props.setPaypalPlanId(process.env.NEXT_PUBLIC_PLANID1 ?? '')
  }

  const rowClass = 'grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] border-b border-gray-200 min-h-[52px]'
  const cellClass = 'p-3 pr-3.5 border-r border-gray-200 min-h-[52px] gap-2.5 pt-4'
  const cellClassLast = 'relative p-3 pr-3.5 min-h-[52px] pt-4 border-r-0'
  const altRow = 'bg-gray-50 hover:bg-slate-50 transition-colors'
  const valueClass = 'text-gray-700 text-sm'

  console.log('liveProduct', props.liveProduct)

  return (
    <>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Body>Are you sure you want to cancel the paid plan and downgrade to the free plan?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>No</Button>
          <Button variant="primary" onClick={handleCancelPaidPlan} disabled={freePlanButtonLoading}>
            {freePlanButtonLoading ? <Spinner size="sm" animation="border" /> : 'Yes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='mobilePricingTable block md:hidden mb-4'>
        <Swiper
          spaceBetween={30}
          hashNavigation={{
            watchState: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation, HashNavigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className='border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)] max-md:rounded-2xl'>
              <div className='border-b border-gray-200 min-h-[52px] bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl'>
                <div className={`${cellClass} pt-4`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm inline-block w-fit">Free Plan</span>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <h5 className="text-lg font-semibold">US$ 0</h5>
                      <span className="text-xs text-gray-500">/ month</span>
                    </div>
                    <div className="text-gray-500 text-xs mb-2">50 Products • 10 Keywords</div>
                    <div className="mt-2">
                      {isFreeCurrent ? (
                        <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                      ) : (
                        <button type="button" className="btn-default w-full" onClick={() => setModalOpen(true)} disabled={freePlanButtonLoading}>
                          {freePlanButtonLoading ? 'Processing…' : 'Choose this Plan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Products" tooltipContent="Our plans are designed on the basis of number of products your store has." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>50</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Keywords Rank Tracking" tooltipContent="You can track Google Rankings of the keywords for your website and competitors, every week (Monthly for Free Plan)." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>10</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Advanced SEO Audit" tooltipContent="Audit & Optimize all the pages of your website based on top 15 SEO parameters." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>50 Pages</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Rank Tracking Frequency" tooltipContent="Keywords Rank Tracking will be done every week/month as per your plan." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>Monthly</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Image Optimizer" tooltipContent="Optimize images by adding Alt Tags and compress the size so that the page loads faster." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>50 Images</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Bulk Optimizer" tooltipContent="Bulk Optimize all the title tags, meta descriptions and alt tags in one click!" />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>50 Pages</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="SEO Rich Snippets" tooltipContent="Add SEO Rich Snippets in less than 2 minutes and get better CTR." />
                    </div>
                    <div className='p-3 pr-3.5'><span className={valueClass}>Limited Access</span></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Cruise Control (Auto SEO)" tooltipContent="Put Bulk Optimizer on Auto mode and it will work on every new added product/category or brand automatically." />
                    </div>
                    <div className='p-3 pr-3.5'><NotIncludedBadge /></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Analytics" tooltipContent="Connect your Google Analytics account to SEOKart and see detailed analytics inside our Dashboard." />
                    </div>
                    <div className='p-3 pr-3.5'><IncludedBadge /></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="URL Editor" tooltipContent="Edit URLs and Redirect old URLs in seconds." />
                    </div>
                    <div className='p-3 pr-3.5'><IncludedBadge /></div>
                  </div>
                </div>

                <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                  <div className='flex justify-between items-center'>
                    <div className='p-3 pr-3.5'>
                      <FeatureCell title="Sub-users Access" tooltipContent="You can give access to the other users of your store." />
                    </div>
                    <div className='p-3 pr-3.5'><IncludedBadge /></div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className='border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)] max-md:rounded-2xl'>
              <div className='border-b border-gray-200 min-h-[52px] bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl'>
                <div className={`${cellClass} pt-4`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm inline-block w-fit">Pro Plan</span>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-lg font-semibold">US$</span>
                      {props.loading ? <Spinner size="sm" animation="border" /> : <span className="text-lg font-semibold">{props.appPrice}</span>}
                      <span className="text-xs text-gray-500">/ month</span>
                    </div>
                    <div className="text-gray-500 text-xs mb-2">{props.product} Products • {props.keyword} Keywords</div>
                    <div className="mt-2">
                      {isProCurrent ? (
                        <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                      ) : (
                        <button type="button" className="btn-default w-full" onClick={handleChoosePro} disabled={props.loading}>Choose Pro</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className=''>
                  <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                    <div className='flex flex-col gap-1'>
                      <FeatureCell title="Products" tooltipContent="Our plans are designed on the basis of number of products your store has." />
                    </div>
                    <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                      <select
                        className="w-full form-select"
                        value={String(props.product)}
                        onChange={(e) => props.setProduct(Number(e.target.value))}
                      >
                        {PRODUCT_OPTIONS.map((val) => (
                          <option key={val} value={val} disabled={props.liveProduct > val}>
                            {val} {props.planProduct === val ? '(Current Plan)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                    <div className='flex flex-col gap-1'>
                      <FeatureCell title="Keywords Rank Tracking" tooltipContent="You can track Google Rankings of the keywords for your website and competitors, every week (Monthly for Free Plan)." />
                    </div>
                    <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                      <select
                        className="w-full form-select"
                        value={String(props.keyword)}
                        onChange={(e) => props.setKeyword(Number(e.target.value))}
                      >
                        {KEYWORD_OPTIONS.map((val) => (
                          <option key={val} value={val}>{val} {props.planKeyword === val ? '(Current Plan)' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Rank Tracking Frequency" tooltipContent="Keywords Rank Tracking will be done every week/month as per your plan." />
                      </div>
                      <div className={cellClassLast}><span className={valueClass}>Weekly</span></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Image Optimizer" tooltipContent="Optimize images by adding Alt Tags and compress the size so that the page loads faster." />
                      </div>
                      <div className={cellClassLast}><span className={valueClass}>Unlimited</span></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Bulk Optimizer" tooltipContent="Bulk Optimize all the title tags, meta descriptions and alt tags in one click!" />
                      </div>
                      <div className={cellClassLast}><span className={valueClass}>Unlimited</span></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="SEO Rich Snippets" tooltipContent="Add SEO Rich Snippets in less than 2 minutes and get better CTR." />
                      </div>
                      <div className={cellClassLast}><span className={valueClass}>Full Access</span></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Cruise Control (Auto SEO)" tooltipContent="Put Bulk Optimizer on Auto mode and it will work on every new added product/category or brand automatically." />
                      </div>
                      <div className={cellClassLast}><IncludedBadge /></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Analytics" tooltipContent="Connect your Google Analytics account to SEOKart and see detailed analytics inside our Dashboard." />
                      </div>
                      <div className={cellClassLast}><IncludedBadge /></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-white hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="URL Editor" tooltipContent="Edit URLs and Redirect old URLs in seconds." />
                      </div>
                      <div className={cellClassLast}><IncludedBadge /></div>
                    </div>
                  </div>

                  <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 hover:bg-slate-50 transition-colors'>
                    <div className='flex justify-between items-center'>
                      <div className='p-3 pr-3.5'>
                        <FeatureCell title="Sub-users Access" tooltipContent="You can give access to the other users of your store." />
                      </div>
                      <div className={cellClassLast}><IncludedBadge /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="mb-6 text-gray-900 mt-4 hidden md:block w-[80%] mx-auto">
        <div className="border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)] max-md:rounded-2xl">
          {/* Header row */}
          <div className={`${rowClass} bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl`}>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] gap-2.5 pt-4 flex items-center">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">What&apos;s included</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  Hover
                  <div className="infoIconUpgrade">
                    <Icon
                      source={InfoIcon}
                      tone="base"
                    />
                  </div>
                  for details
                </p>
              </div>
            </div>

            <div className={`${cellClass} pt-4`}>
              <div className="flex flex-col gap-0.5">
                <span className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm inline-block w-fit">Free Plan</span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">US$ 0</h5>
                  <span className="text-xs text-gray-500">/ month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">50 Pages • 10 Keywords</div>
                <div className="mt-2">
                  {isFreeCurrent ? (
                    <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                  ) : (
                    <button type="button" className="btn-default w-full" onClick={() => setModalOpen(true)} disabled={freePlanButtonLoading}>
                      {freePlanButtonLoading ? 'Processing…' : 'Choose this Plan'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={`${cellClassLast} pt-4`}>
              <div className="flex flex-col gap-0.5">
                <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm inline-block w-fit">Pro Plan</span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-lg font-semibold">US$</span>
                  {props.loading ? <Spinner size="sm" animation="border" /> : <span className="text-lg font-semibold">{props.appPrice}</span>}
                  <span className="text-xs text-gray-500">/ month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">{props.product} Products • {props.keyword} Keywords</div>
                <div className="mt-2">
                  {isProCurrent ? (
                    <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                  ) : (
                    <button type="button" className="btn-default w-full" onClick={handleChoosePro} disabled={props.loading}>Choose Pro</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products row */}
          <div className={`${rowClass} ${altRow}`}>
            <div className={cellClass}>
              <FeatureCell title="Products" tooltipContent="Our plans are designed on the basis of number of products your store has." />
            </div>
            <div className={cellClass}><span className={valueClass}>Limited</span></div>
            <div className={cellClassLast}>
              <div className='custom-dropi without-labelDropi'>
                <select
                  className="w-full form-select"
                  value={String(props.product)}
                  onChange={(e) => props.setProduct(Number(e.target.value))}
                >
                  {PRODUCT_OPTIONS.map((val) => (
                    <option key={val} value={val} disabled={props.liveProduct > val}>
                      {val} {props.planProduct === val ? '(Current Plan)' : ''}
                    </option>
                  ))}
                </select>                
              </div>
            </div>
          </div>

          {/* Keywords Rank Tracking row */}
          <div className={rowClass}>
            <div className={cellClass}>
              <FeatureCell title="Keywords Rank Tracking" tooltipContent="You can track Google Rankings of the keywords for your website and competitors, every week (Monthly for Free Plan)." />
            </div>
            <div className={cellClass}><span className={valueClass}>10</span></div>
            <div className={cellClassLast}>
              <div className='custom-dropi without-labelDropi'>
                <select
                  className="w-full form-select"
                  value={String(props.keyword)}
                  onChange={(e) => props.setKeyword(Number(e.target.value))}
                >
                  {KEYWORD_OPTIONS.map((val) => (
                    <option key={val} value={val}>{val} {props.planKeyword === val ? '(Current Plan)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced SEO Audit row */}
          <div className={`${rowClass} ${altRow}`}>
            <div className={cellClass}>
              <FeatureCell title="Advanced SEO Audit" tooltipContent="Audit & Optimize all the pages of your website based on top 15 SEO parameters." />
            </div>
            <div className={cellClass}><span className={valueClass}>50 Pages</span></div>
            <div className={cellClassLast}><span className={valueClass}>Unlimited</span></div>
          </div>

          {/* Rank Tracking Frequency row */}
          <div className={rowClass}>
            <div className={cellClass}>
              <FeatureCell title="Rank Tracking Frequency" tooltipContent="Keywords Rank Tracking will be done every week/month as per your plan." />
            </div>
            <div className={cellClass}><span className={valueClass}>Monthly</span></div>
            <div className={cellClassLast}><span className={valueClass}>Weekly</span></div>
          </div>

          {/* Image Optimizer row */}
          <div className={`${rowClass} ${altRow}`}>
            <div className={cellClass}>
              <FeatureCell title="Image Optimizer" tooltipContent="Optimize images by adding Alt Tags and compress the size so that the page loads faster." />
            </div>
            <div className={cellClass}><span className={valueClass}>50 Images</span></div>
            <div className={cellClassLast}><span className={valueClass}>Unlimited</span></div>
          </div>

          {/* Bulk Optimizer row */}
          <div className={rowClass}>
            <div className={cellClass}>
              <FeatureCell title="Bulk Optimizer" tooltipContent="Bulk Optimize all the title tags, meta descriptions and alt tags in one click!" />
            </div>
            <div className={cellClass}><span className={valueClass}>50 Pages</span></div>
            <div className={cellClassLast}><span className={valueClass}>Unlimited</span></div>
          </div>

          {/* SEO Rich Snippets row */}
          <div className={`${rowClass} ${altRow}`}>
            <div className={cellClass}>
              <FeatureCell title="SEO Rich Snippets" tooltipContent="Add SEO Rich Snippets in less than 2 minutes and get better CTR." />
            </div>
            <div className={cellClass}><span className={valueClass}>Limited Access</span></div>
            <div className={cellClassLast}><span className={valueClass}>Full Access</span></div>
          </div>

          {/* Cruise Control row */}
          <div className={rowClass}>
            <div className={cellClass}>
              <FeatureCell title="Cruise Control (Auto SEO)" tooltipContent="Put Bulk Optimizer on Auto mode and it will work on every new added product/category or brand automatically." />
            </div>
            <div className={cellClass}><NotIncludedBadge /></div>
            <div className={cellClassLast}><IncludedBadge /></div>
          </div>

          {/* Analytics row */}
          <div className={`${rowClass} ${altRow}`}>
            <div className={cellClass}>
              <FeatureCell title="Analytics" tooltipContent="Connect your Google Analytics account to SEOKart and see detailed analytics inside our Dashboard." />
            </div>
            <div className={cellClass}><IncludedBadge /></div>
            <div className={cellClassLast}><IncludedBadge /></div>
          </div>

          {/* URL Editor row */}
          <div className={rowClass}>
            <div className={cellClass}>
              <FeatureCell title="URL Editor" tooltipContent="Edit URLs and Redirect old URLs in seconds." />
            </div>
            <div className={cellClass}><IncludedBadge /></div>
            <div className={cellClassLast}><IncludedBadge /></div>
          </div>

          {/* Sub-users Access row */}
          <div className={`${rowClass} ${altRow} md:border-b-0 rounded-b-2xl`}>
            <div className={cellClass}>
              <FeatureCell title="Sub-users Access" tooltipContent="You can give access to the other users of your store." />
            </div>
            <div className={cellClass}><IncludedBadge /></div>
            <div className={cellClassLast}><IncludedBadge /></div>
          </div>
        </div>
      </div>
    </>
  )
}
