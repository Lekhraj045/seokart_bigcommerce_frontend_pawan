import Image from "next/image"
import { basePath } from "@/next.config"
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import dynamic from "next/dynamic";
import Payment from './payment'
import { useEffect } from 'react'




const PLAN_DISPLAY_NAMES: Record<string, string> = {
  pro: 'Pro',
  startup: 'Startup',
  professional: 'Growth',
  enterprise: 'Scale',
}

export default function Home(Props: any) {
  const planDisplayName = PLAN_DISPLAY_NAMES[Props.planName] ?? Props.planName

  return (<>
    <div className="content-frame-head flex justify-content-between align-item-center">
      <div className="content-frameHead-left">
        <h1 className="Text--headingLg flex align-item-center gap-2">
          <button type="button" className="headBack-btn" onClick={Props.setShowInnerPage}>
            <Image src={`${basePath}/images/back-icon.svg`} alt='' width={20} height={20} />
          </button>
          Back
        </h1>
      </div>
    </div>

    <div className="pricing-Detailsmain">
      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <p className="text-subbed mb-2">{planDisplayName}</p>
            <h5 className="Text--headingLg mb-0">US$ {Props.price}/Month</h5>
          </div>

          <div className="card">
            {Props.planName == 'pro' ?
              <div className="d-grid grid-column-2 gap-24">
                <div className="card-border">
                  <h5 className="text-lg">Products</h5>
                  <p className="mb-0">Our plans are designed on the basis of number of products your store has.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Keywords Rank Tracking</h5>
                  <p className="mb-0">You can track Google Rankings of the keywords for your website and competitors, every week (Monthly for Free Plan).</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Advanced SEO Audit</h5>
                  <p className="mb-0">Audit & Optimize all the pages of your website based on top 15 SEO parameters.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Rank Tracking Frequency</h5>
                  <p className="mb-0">Keywords Rank Tracking will be done every week/month as per your plan.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Image Optimizer</h5>
                  <p className="mb-0">Optimize images by adding Alt Tags and compress the size so that the page loads faster.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Bulk Optimizer</h5>
                  <p className="mb-0">Bulk Optimize all the title tags, meta descriptions and alt tags in one click!</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">SEO Rich Snippets</h5>
                  <p className="mb-0">Add SEO Rich Snippets in less than 2 minutes and get better CTR</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Cruise Control (Auto SEO)</h5>
                  <p className="mb-0">Put Bulk Optimizer on Auto mode and it will work on every new added product/category or brand automatically.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">Analytics</h5>
                  <p className="mb-0">Connect your Google Analytics account to SEOKart and see detailed analytics inside our Dashboard.</p>
                </div>

                <div className="card-border">
                  <h5 className="text-lg">URL Editor</h5>
                  <p className="mb-0">Edit URLs and Redirect old URLs in seconds.</p>
                </div>




                <div className="card-border">
                  <h5 className="text-lg">Sub-Users Access</h5>
                  <p className="mb-0">You can give access to the other users of your store.</p>
                </div>
              </div> :
              Props.planName == 'startup' ?
                <div className="d-grid grid-column-2 gap-24">
                  <div className="card-border">
                    <h5 className="text-lg">Site Health & Technical Foundation</h5>
                    <p className="mb-0">Fixes crawl issues, broken links, redirects, image optimization, and overall technical health.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">Entity-First Product & Page Optimization</h5>
                    <p className="mb-0">Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">Authority Link Building</h5>
                    <p className="mb-0">Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">Brand Mentions Across Communities</h5>
                    <p className="mb-0">Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">SEO Content for Ecommerce Buyers</h5>
                    <p className="mb-0">SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">Search & AI Visibility Tracking</h5>
                    <p className="mb-0">Tracks rankings and AI search visibility across Google and AI-driven search platforms.</p>
                  </div>

                  <div className="card-border">
                    <h5 className="text-lg">Performance Reports & Growth Actions</h5>
                    <p className="mb-0">Monthly report showing work done, impact, visibility trends, and next-month priorities.</p>
                  </div>


                </div> :
                Props.planName == 'professional' ?
                  <div className="d-grid grid-column-2 gap-24">
                    <div className="card-border">
                      <h5 className="text-lg">Site Health & Technical Foundation</h5>
                      <p className="mb-0">Fixes crawl issues, broken links, redirects, image optimization, and overall technical health.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Entity-First Product & Page Optimization</h5>
                      <p className="mb-0">Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Authority Link Building</h5>
                      <p className="mb-0">Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Brand Mentions Across Communities</h5>
                      <p className="mb-0">Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">SEO Content for Ecommerce Buyers</h5>
                      <p className="mb-0">SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Search & AI Visibility Tracking</h5>
                      <p className="mb-0">Tracks rankings and AI search visibility across Google and AI-driven search platforms.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Performance Reports & Growth Actions</h5>
                      <p className="mb-0">Monthly report showing work done, impact, visibility trends, and next-month priorities.</p>
                    </div>


                  </div> :

                  <div className="d-grid grid-column-2 gap-24">
                    <div className="card-border">
                      <h5 className="text-lg">Site Health & Technical Foundation</h5>
                      <p className="mb-0">Fixes crawl issues, broken links, redirects, image optimization, and overall technical health.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Entity-First Product & Page Optimization</h5>
                      <p className="mb-0">Optimizes products, collections, and pages using entities, metadata, headings, and intent keywords.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Authority Link Building</h5>
                      <p className="mb-0">Earns contextual backlinks from relevant, authoritative websites to improve trust and rankings.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Brand Mentions Across Communities</h5>
                      <p className="mb-0">Unlinked brand mentions on Reddit, Quora, forums, and directories for discovery and trust signals.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">SEO Content for Ecommerce Buyers</h5>
                      <p className="mb-0">SEO content like guides, comparisons, and listicles to attract discovery and buyer-intent traffic.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Search & AI Visibility Tracking</h5>
                      <p className="mb-0">Tracks rankings and AI search visibility across Google and AI-driven search platforms.</p>
                    </div>

                    <div className="card-border">
                      <h5 className="text-lg">Performance Reports & Growth Actions</h5>
                      <p className="mb-0">Monthly report showing work done, impact, visibility trends, and next-month priorities.</p>
                    </div>


                  </div>
            }

            <div className="full-btn mt-24">
              <button type="button" className="custom-btn" onClick={Props.setShowInnerPage}>Change Plan</button>
            </div>
          </div>
        </div>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID ?? '',
            components: "buttons",
            intent: "subscription",
            vault: true,
          }}
        >
          <Payment Props={Props} />
        </PayPalScriptProvider>
      </div>
    </div>
  </>)
}