'use client'

import { useCallback, useMemo, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, HashNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { Icon } from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';

const UNIT = {
  base: { startup: 299, professional: 299, enterprise: 299 },
  pages: 4,
  links: 150,
  mentions: 10,
  content: 150,
}

const DEFAULTS = {
  startup: { pages: 25, links: 3, mentions: 5, content: 0 },
  professional: { pages: 50, links: 5, mentions: 10, content: 1 },
  enterprise: { pages: 100, links: 7, mentions: 20, content: 2 },
}

const OPTIONS = {
  pages: {
    startup: [25, 50, 100, 150, 200],
    professional: [50, 100, 150, 200],
    enterprise: [100, 200, 300, 500],
  },
  links: {
    startup: [3, 5, 7, 10],
    professional: [5, 7, 10],
    enterprise: [7, 10, 15],
  },
  mentions: {
    startup: [5, 10, 20, 30],
    professional: [10, 20, 30, 40],
    enterprise: [20, 30, 40, 50],
  },
  content: {
    startup: [0, 1, 2, 3, 4],
    professional: [1, 2, 3, 4],
    enterprise: [2, 3, 4],
  },
}

const money = (n: number) => `$${Math.round(n)}`

type PlanKey = 'startup' | 'professional' | 'enterprise'

function FeatureCell({
  title,
  tooltipContent,
  subtitle,
}: {
  title: string
  tooltipContent: string
  subtitle?: string
}) {
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
      {subtitle && <div className="text-gray-500 text-xs">{subtitle}</div>}
    </div>
  )
}

function IncludedBadge() {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="w-[18px] h-[18px] rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-600 font-black text-xs flex-shrink-0">✓</span>
      <span className="text-gray-500 text-xs">Included</span>
    </div>
  )
}

export default function SeoPricingTable(props: {
  paymentStatus: string
  currentPlanName: string
  setShowInnerPage: (v: boolean) => void
  setSeoPrice: (v: number) => void
  setPlanName: (v: string) => void
  setPaypalPlanId: (v: string) => void
}) {
  const [deliverables, setDeliverables] = useState<Record<PlanKey, { pages: number; links: number; mentions: number; content: number }>>({
    startup: DEFAULTS.startup,
    professional: DEFAULTS.professional,
    enterprise: DEFAULTS.enterprise,
  })

  const updateDeliverable = useCallback((plan: PlanKey, field: keyof typeof DEFAULTS.startup, value: number) => {
    setDeliverables((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [field]: value },
    }))
  }, [])

  const calc = useCallback(
    (plan: PlanKey) => {
      const d = deliverables[plan]
      const total =
        UNIT.base[plan] +
        d.pages * UNIT.pages +
        d.links * UNIT.links +
        d.mentions * UNIT.mentions +
        d.content * UNIT.content
      return { ...d, total }
    },
    [deliverables]
  )

  const totals = useMemo(
    () => ({
      startup: calc('startup').total,
      professional: calc('professional').total,
      enterprise: calc('enterprise').total,
    }),
    [calc]
  )

  const summary = useCallback(
    (plan: PlanKey) => {
      const d = deliverables[plan]
      const parts = [`${d.pages} pages`, `${d.links} links`, `${d.mentions} mentions`]
      if (d.content) parts.push(`${d.content} content`)
      return parts.join(' • ')
    },
    [deliverables]
  )

  const handleChoosePlan = useCallback(
    (plan: PlanKey) => {
      const total = calc(plan).total
      props.setShowInnerPage(true)
      props.setSeoPrice(total)
      props.setPlanName(plan)
      if (plan === 'startup') props.setPaypalPlanId(process.env.NEXT_PUBLIC_PLANID2 ?? '')
      else if (plan === 'professional') props.setPaypalPlanId(process.env.NEXT_PUBLIC_PLANID3 ?? '')
      else if (plan === 'enterprise') props.setPaypalPlanId(process.env.NEXT_PUBLIC_PLANID4 ?? '')
    },
    [calc, props]
  )

  const isCurrent = (plan: string) => props.paymentStatus === 'completed' && props.currentPlanName === plan

  return (
    <>

      <div className='mobilePricingTable block md:hidden mb-4'>
        <Swiper
          spaceBetween={30}
          hashNavigation={{ watchState: true }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, HashNavigation]}
          className="mySwiper"
        >
          {/* Startup */}
          <SwiperSlide>
            <div className='border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)]'>
              <div className='border-b border-gray-200 min-h-[52px] bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl p-4'>
                <span className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Startup</span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.startup)}</h5>
                  <span className="text-xs text-gray-500">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">{summary('startup')}</div>
                {isCurrent('startup') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="btn-default w-full" onClick={() => handleChoosePlan('startup')}>Start with Startup</button>
                )}
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Site Health & Technical Foundation" tooltipContent="Fixes crawl issues, broken links, redirects, image optimization, and overall technical health." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Entity-First Product & Page Optimization" tooltipContent="Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.startup.pages)} onChange={(e) => updateDeliverable('startup', 'pages', Number(e.target.value))}>{OPTIONS.pages.startup.map((v) => <option key={v} value={v}>{v} pages</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Authority Link Building" tooltipContent="Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.startup.links)} onChange={(e) => updateDeliverable('startup', 'links', Number(e.target.value))}>{OPTIONS.links.startup.map((v) => <option key={v} value={v}>{v} links</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Brand Mentions Across Communities" tooltipContent="Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals." /><div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.startup.mentions)} onChange={(e) => updateDeliverable('startup', 'mentions', Number(e.target.value))}>{OPTIONS.mentions.startup.map((v) => <option key={v} value={v}>{v} mentions</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="SEO Content for Ecommerce Buyers" tooltipContent="SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.startup.content)} onChange={(e) => updateDeliverable('startup', 'content', Number(e.target.value))}>{OPTIONS.content.startup.map((v) => <option key={v} value={v}>{v} content</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Search & AI Visibility Tracking" tooltipContent="Tracks rankings and AI search visibility across Google and AI-driven search platforms." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Performance Reports & Growth Actions" tooltipContent="Monthly report showing work done, impact, visibility trends, and next-month priorities." />
                <IncludedBadge />
              </div>

              <div className='p-3 flex justify-between items-center'>
                <span className="text-sm font-bold">Total</span>
                <h5 className="text-lg font-semibold">{money(totals.startup)}</h5>
              </div>
            </div>
          </SwiperSlide>

          {/* Growth (Professional) */}
          <SwiperSlide>
            <div className='border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)]'>
              <div className='border-b border-gray-200 min-h-[52px] bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl p-4 relative'>
                <span className="absolute top-[1px] left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#303030] px-2.5 py-1 text-[11px] text-white shadow-lg z-10">Most Popular</span>
                <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Growth</span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.professional)}</h5>
                  <span className="text-xs text-gray-500">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">{summary('professional')}</div>
                {isCurrent('professional') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="custom-btn w-full" onClick={() => handleChoosePlan('professional')}>Choose Growth</button>
                )}
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Site Health & Technical Foundation" tooltipContent="Fixes crawl issues, broken links, redirects, image optimization, and overall technical health." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Entity-First Product & Page Optimization" tooltipContent="Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.professional.pages)} onChange={(e) => updateDeliverable('professional', 'pages', Number(e.target.value))}>{OPTIONS.pages.professional.map((v) => <option key={v} value={v}>{v} pages</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Authority Link Building" tooltipContent="Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.professional.links)} onChange={(e) => updateDeliverable('professional', 'links', Number(e.target.value))}>{OPTIONS.links.professional.map((v) => <option key={v} value={v}>{v} links</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Brand Mentions Across Communities" tooltipContent="Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals." />
                <div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.professional.mentions)} onChange={(e) => updateDeliverable('professional', 'mentions', Number(e.target.value))}>{OPTIONS.mentions.professional.map((v) => <option key={v} value={v}>{v} mentions</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="SEO Content for Ecommerce Buyers" tooltipContent="SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic." /><div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.professional.content)} onChange={(e) => updateDeliverable('professional', 'content', Number(e.target.value))}>{OPTIONS.content.professional.map((v) => <option key={v} value={v}>{v} content</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Search & AI Visibility Tracking" tooltipContent="Tracks rankings and AI search visibility across Google and AI-driven search platforms." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Performance Reports & Growth Actions" tooltipContent="Monthly report showing work done, impact, visibility trends, and next-month priorities." />
                <IncludedBadge />
              </div>

              <div className='p-3 flex justify-between items-center'>
                <span className="text-sm font-bold">Total</span>
                <h5 className="text-lg font-semibold">{money(totals.professional)}</h5>
              </div>
            </div>
          </SwiperSlide>

          {/* Scale (Enterprise) */}
          <SwiperSlide>
            <div className='border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)]'>
              <div className='border-b border-gray-200 min-h-[52px] bg-gradient-to-b from-blue-500/5 to-white rounded-t-2xl p-4'>
                <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Scale</span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.enterprise)}</h5>
                  <span className="text-xs text-gray-500">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2">{summary('enterprise')}</div>
                {isCurrent('enterprise') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="btn-default w-full" onClick={() => handleChoosePlan('enterprise')}>Go Scale</button>
                )}
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Site Health & Technical Foundation" tooltipContent="Fixes crawl issues, broken links, redirects, image optimization, and overall technical health." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Entity-First Product & Page Optimization" tooltipContent="Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords." /><div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.enterprise.pages)} onChange={(e) => updateDeliverable('enterprise', 'pages', Number(e.target.value))}>{OPTIONS.pages.enterprise.map((v) => <option key={v} value={v}>{v} pages</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Authority Link Building" tooltipContent="Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings." /><div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.enterprise.links)} onChange={(e) => updateDeliverable('enterprise', 'links', Number(e.target.value))}>{OPTIONS.links.enterprise.map((v) => <option key={v} value={v}>{v} links</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="Brand Mentions Across Communities" tooltipContent="Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals." /><div className='custom-dropi without-labelDropi w-full sm:w-auto'>
                  <select className="w-full form-select" value={String(deliverables.enterprise.mentions)} onChange={(e) => updateDeliverable('enterprise', 'mentions', Number(e.target.value))}>{OPTIONS.mentions.enterprise.map((v) => <option key={v} value={v}>{v} mentions</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-2'>
                <FeatureCell title="SEO Content for Ecommerce Buyers" tooltipContent="SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic." />
                <div className='custom-dropi without-labelDropi w-full sm:w-full'>
                  <select className="w-full form-select" value={String(deliverables.enterprise.content)} onChange={(e) => updateDeliverable('enterprise', 'content', Number(e.target.value))}>{OPTIONS.content.enterprise.map((v) => <option key={v} value={v}>{v} content</option>)}
                  </select>
                </div>
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-white flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Search & AI Visibility Tracking" tooltipContent="Tracks rankings and AI search visibility across Google and AI-driven search platforms." />
                <IncludedBadge />
              </div>

              <div className='border-b border-gray-200 min-h-[52px] bg-gray-50 flex justify-between items-center p-3 gap-2'>
                <FeatureCell title="Performance Reports & Growth Actions" tooltipContent="Monthly report showing work done, impact, visibility trends, and next-month priorities." />
                <IncludedBadge />
              </div>

              <div className='p-3 flex justify-between items-center rounded-b-2xl'>
                <span className="text-sm font-bold">Total</span>
                <h5 className="text-lg font-semibold">{money(totals.enterprise)}</h5>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="mb-6 text-gray-900 mt-4 hidden md:block">
        <div className="border border-gray-200 rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)] max-md:rounded-2xl">
          {/* Header row - exact Shopify classes */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] bg-gradient-to-b from-blue-500/5 to-white border-b border-gray-200 rounded-t-2xl">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 pt-5">
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

            <div className="relative p-3 pr-3.5 border-r border-gray-200 min-h-[52px] pt-4">
              <div className="flex flex-col gap-0.5 relative z-0">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Startup</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.startup)}</h5>
                  <span className="text-xs text-gray-500 font-normal">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2 font-normal">{summary('startup')}</div>
                {isCurrent('startup') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="btn-default w-full" onClick={() => handleChoosePlan('startup')}>Start with Startup</button>
                )}
                <div className="mt-1.5 text-[11.5px] text-gray-500 font-normal">Pay securely • Cancel anytime</div>
              </div>
            </div>

            <div className="relative p-3 pr-3.5 border-r border-gray-200 min-h-[52px] pt-4">
              <span className="absolute top-[-12px] left-1/2 translate-x-[-50%] inline-flex items-center gap-1.5 rounded-full bg-[#303030] px-2.5 py-1 text-[11px] tracking-wide text-white shadow-lg z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 ring-[3px] ring-green-500/20" aria-hidden />Most Popular
              </span>
              <div className="flex flex-col gap-0.5 relative z-0">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Growth</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.professional)}</h5>
                  <span className="text-xs text-gray-500 font-normal">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2 font-normal">{summary('professional')}</div>
                {isCurrent('professional') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="custom-btn w-full" onClick={() => handleChoosePlan('professional')}>Choose Growth</button>
                )}
                <div className="mt-1.5 text-[11.5px] text-gray-500 font-normal">Most popular plan</div>
              </div>
            </div>

            <div className="relative p-3 pr-3.5 min-h-[52px] pt-4 border-r-0">
              <div className="flex flex-col gap-0.5 relative z-0">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-2.5 py-1 rounded-full text-xs whitespace-nowrap shadow-sm">Scale</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h5 className="text-lg font-semibold">{money(totals.enterprise)}</h5>
                  <span className="text-xs text-gray-500 font-normal">/month</span>
                </div>
                <div className="text-gray-500 text-xs mb-2 font-normal">{summary('enterprise')}</div>
                {isCurrent('enterprise') ? (
                  <button type="button" className="btn-default btn-disable w-full cursor-not-allowed" disabled>Current Plan</button>
                ) : (
                  <button type="button" className="btn-default w-full" onClick={() => handleChoosePlan('enterprise')}>Go Scale</button>
                )}
                <div className="mt-1.5 text-[11.5px] text-gray-500 font-normal">For high-volume stores</div>
              </div>
            </div>
          </div>

          {/* Site Health & Technical Foundation */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 hover:bg-slate-50 transition-colors bg-gray-50">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="Site Health & Technical Foundation"
                tooltipContent="Fixes crawl issues, broken links, redirects, image optimization, and overall technical health."
                subtitle="Included in all plans"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5"><IncludedBadge /></div>
          </div>

          {/* Entity-First Product & Page Optimization */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-white hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0 md:border-b-0">
              <FeatureCell
                title="Entity-First Product & Page Optimization"
                tooltipContent="Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords."
                subtitle="Select number of pages to optimize"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.startup.pages)}
                    onChange={(e) => updateDeliverable('startup', 'pages', Number(e.target.value))}
                    aria-label="Pages startup"
                  >
                    {OPTIONS.pages.startup.map((v) => (
                      <option key={v} value={v}>{v} pages</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.professional.pages)}
                    onChange={(e) => updateDeliverable('professional', 'pages', Number(e.target.value))}
                    aria-label="Pages professional"
                  >
                    {OPTIONS.pages.professional.map((v) => (
                      <option key={v} value={v}>{v} pages</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.enterprise.pages)}
                    onChange={(e) => updateDeliverable('enterprise', 'pages', Number(e.target.value))}
                    aria-label="Pages enterprise"
                  >
                    {OPTIONS.pages.enterprise.map((v) => (
                      <option key={v} value={v}>{v} pages</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Link Building */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-gray-50 hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="Authority Link Building"
                tooltipContent="Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings."
                subtitle="Select monthly link quantity"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.startup.links)}
                    onChange={(e) => updateDeliverable('startup', 'links', Number(e.target.value))}
                    aria-label="Links startup"
                  >
                    {OPTIONS.links.startup.map((v) => (
                      <option key={v} value={v}>{v} links</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.professional.links)}
                    onChange={(e) => updateDeliverable('professional', 'links', Number(e.target.value))}
                    aria-label="Links professional"
                  >
                    {OPTIONS.links.professional.map((v) => (
                      <option key={v} value={v}>{v} links</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.enterprise.links)}
                    onChange={(e) => updateDeliverable('enterprise', 'links', Number(e.target.value))}
                    aria-label="Links enterprise"
                  >
                    {OPTIONS.links.enterprise.map((v) => (
                      <option key={v} value={v}>{v} links</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Mentions Across Communities */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-white hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="Brand Mentions Across Communities"
                tooltipContent="Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals."
                subtitle="Select monthly mention quantity"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.startup.mentions)}
                    onChange={(e) => updateDeliverable('startup', 'mentions', Number(e.target.value))}
                    aria-label="Mentions startup"
                  >
                    {OPTIONS.mentions.startup.map((v) => (
                      <option key={v} value={v}>{v} mentions</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.professional.mentions)}
                    onChange={(e) => updateDeliverable('professional', 'mentions', Number(e.target.value))}
                    aria-label="Mentions professional"
                  >
                    {OPTIONS.mentions.professional.map((v) => (
                      <option key={v} value={v}>{v} mentions</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.enterprise.mentions)}
                    onChange={(e) => updateDeliverable('enterprise', 'mentions', Number(e.target.value))}
                    aria-label="Mentions enterprise"
                  >
                    {OPTIONS.mentions.enterprise.map((v) => (
                      <option key={v} value={v}>{v} mentions</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content for Ecommerce Buyers */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-gray-50 hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="SEO Content for Ecommerce Buyers"
                tooltipContent="SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic."
                subtitle="Optional content pieces per month"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.startup.content)}
                    onChange={(e) => updateDeliverable('startup', 'content', Number(e.target.value))}
                    aria-label="Content startup"
                  >
                    {OPTIONS.content.startup.map((v) => (
                      <option key={v} value={v}>{v} content</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.professional.content)}
                    onChange={(e) => updateDeliverable('professional', 'content', Number(e.target.value))}
                    aria-label="Content professional"
                  >
                    {OPTIONS.content.professional.map((v) => (
                      <option key={v} value={v}>{v} content</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5">
              <div className="flex-1">
                <div className='custom-dropi without-labelDropi'>
                  <select
                    className="w-full form-select"
                    value={String(deliverables.enterprise.content)}
                    onChange={(e) => updateDeliverable('enterprise', 'content', Number(e.target.value))}
                    aria-label="Content enterprise"
                  >
                    {OPTIONS.content.enterprise.map((v) => (
                      <option key={v} value={v}>{v} content</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Search & AI Visibility Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-white hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="Search & AI Visibility Tracking"
                tooltipContent="Tracks rankings and AI search visibility across Google and AI-driven search platforms."
                subtitle="Included in all plans"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5"><IncludedBadge /></div>
          </div>

          {/* Performance Reports & Growth Actions */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] border-b border-gray-200 bg-gray-50 hover:bg-slate-50 transition-colors">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <FeatureCell
                title="Performance Reports & Growth Actions"
                tooltipContent="Monthly report showing work done, impact, visibility trends, and next-month priorities."
                subtitle="Included in all plans"
              />
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0"><IncludedBadge /></div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5"><IncludedBadge /></div>
          </div>

          {/* Total row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] bg-white rounded-b-2xl">
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <div className="text-[#303030] text-sm font-bold">Total (auto-calculated)</div>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <h5 className="text-lg font-semibold">{money(totals.startup)}</h5>
            </div>
            <div className="p-3 pr-3.5 border-r border-gray-200 min-h-[52px] flex items-center gap-2.5 last:border-r-0">
              <h5 className="text-lg font-semibold">{money(totals.professional)}</h5>
            </div>
            <div className="p-3 pr-3.5 border-r-0 min-h-[52px] flex items-center gap-2.5">
              <h5 className="text-lg font-semibold">{money(totals.enterprise)}</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
