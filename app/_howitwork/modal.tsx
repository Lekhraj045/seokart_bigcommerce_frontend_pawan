import { Modal } from "react-bootstrap"
import { useState } from "react"
import Image from "next/image"
import { basePath } from "@/next.config"

export default function Home(Props: any) {
  const [howitwork, setHowitwork] = useState(false)
  return (
    <>
      <div className="flex align-item-center headHow-work" onClick={() => {
          setHowitwork(true)
        }}>
      How it works
        <div className="headInfo-icon">
          <Image src={`${basePath}/images/info-icon.svg`} alt='' width={20} height={20} />
        </div>
      </div>
      <Modal className="infoModal-box" show={howitwork} onHide={() => setHowitwork(false)}>
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5">
            {Props.page === 'dashboard' && 'How to use the SEOKart App'}
            {Props.page === 'richsnippet' && 'How to use the Rich Snippets Feature'}
            {Props.page === 'ranktracker' && 'How to use the Rank Tracker Feature'}
            {Props.page === 'bulkoptimizer' && 'How to use the Bulk Optimizer Feature'}
            {Props.page === 'imageoptimizer' && 'How to use the Image Optimizer Feature'}
            {Props.page === 'urleditor' && 'How to use the URL Editor Feature'}
            {Props.page === '404fixer' && 'How to use the 404 Fixer Feature'}
            {Props.page === 'analytics' && 'How to Connect Google Analytics 4'}
            {Props.page === 'seoaudit' && 'How to use the SEO Optimizer Feature'}
            {Props.page === 'pagespeed' && 'How to use the Page-Speed Optimization Feature'}
            {!Props.page && 'How it Works'} 
          </h1>
        </Modal.Header>
        <Modal.Body>
        {Props.page == 'dashboard' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/X2ukZpVQOiA?si=aaE2NoGzSvsEsnlV&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  Welcome to this step-by-step guide on how to use the SEOKart App to optimize your store for increased traffic and orders. By following this guide, you&#39;ll learn how to fully utilize the app&#39;s features to improve your store&#39;s SEO score.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Open the SEOKart App. You&#39;ll see a dashboard displaying your store&#39;s overall SEO score and various other SEO factors.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Navigate to the <span className="textBold">SEO Optimizer</span> feature on the left-hand side panel.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images3.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: Click on the <span className="textBold">Tool Tip</span> button in each feature to understand how it works.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: Identify your 25 best-selling products or categories. Click on the <span className="textBold">Optimize</span> button to Optimize your product or category to enhance their SEO Score.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image4.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: The red crosses indicate errors that need fixing to improve your store&#39;s SEO. Use the SEOKart App&#39;s <span className="textBold">AI Assist</span> feature to generate Meta Tags and product descriptions.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image5.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: After optimizing your bestsellers, move on to optimizing the remaining products.
                </p>

                <p>
                  <span className="textBold">Step 7</span>: Next, fix any 404 errors by visiting the <span className="textBold">404 Fixer</span> feature.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image7.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: The 404 Fixer will display all broken links on your website and their locations. To fix a broken link, enter a valid URL and redirection URL in the input box in SEO Optimizer. Save your changes.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image8.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: Once you&#39;ve fixed the broken links, use the One Click <span className="textBold">Rich Snippets</span> feature.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image10.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: Activate the toggles for the snippets you need and fill out the required details.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images9.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 11</span>: For a better understanding, read the description or use the <span className="textBold">How it Works</span> tooltip.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image10.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 12</span>: Next, fix any blank meta tags using the <span className="textBold">Bulk Optimizer</span> feature. Select the predefined labels, save a template, and preview it before updating the blank meta text of product or categories. Turn on the <span className="textBold">Cruise Control</span> to automate this process for future pages on your store.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image13.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 13</span>: Now, let&#39;s optimize your product images using the <span className="textBold">Image Optimizer</span> feature.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images12.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 14</span>: Go to the <span className="textBold">Settings</span> icon and activate the toggles for the settings you need.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image14.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 15</span>: After selecting the labels you want to optimize, turn on the <span className="textBold">Cruise Control</span> to automatically optimize future product images on your store. Save your settings.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/image15.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 16</span>: <span className="textBold">Optimize</span> your images using the Optimize button located next to each image.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images16.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 17</span>: After completing these steps, track your rankings using the <span className="textBold">Rank Tracker</span> feature. This will help you monitor your store&#39;s keyword ranking.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images17.jpg`} alt="" />
                </div>

                <p>
                  By following these steps, you&#39;ll effectively optimize your store, leading to improved rankings and increased orders.
                </p>
              </div>
            </>
          }

          {Props.page == 'pagespeed' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/vmhu59ugfjg?si=9BCilUb8JSBriSwm&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  Welcome to the brief guide! This article will guide you on how to use the Page Speed Optimization feature in the SEOKart and request a specialist to optimize your store&#39;s page speed.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Navigate to the left-hand side menu panel and select the <span className="textBold">Page Speed</span> feature.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/page-speed/image1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Here, you&#39;ll see the page speed of your store&#39;s home page, product page, and category page. You can also check the speed of any URL using custom tab.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/page-speed/image2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: If your store pages have a low page speed, click on the <span className="textBold">Request</span> button to avail the free Basic Page Speed Optimization Service.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/page-speed/image4.jpg`} alt="" />
                </div>

                <p>
                  This service is exclusively free for SEOKart users. We will optimize images, minify, JS, and CSS wherever needed for a home page, one product page, and one category page. You should see a few points increase in your homepage speed on desktop.
                </p>

                <p>
                  That&#39;s how you use the Page Speed Optimization feature and request a specialist to optimize your store&#39;s page speed.
                </p>
              </div>
            </>
          }

          {Props.page == 'report_restore' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/trzpTp1t_p0?si=UAhr7Mc2ag_oWLMT&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  In this tutorial, you&#39;ll learn how to use the Report and Restore feature in the SEOKart app. This feature allows you to generate reports and revert changes you made on your store&#39;s web pages.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Navigate to the <span className="textBold">Help</span> section in the left-hand side menu panel.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image1.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Click on the <span className="textBold">Report and Restore</span> tab.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image2.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: Turn on the toggle to receive weekly or monthly reports.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image3.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: Choose the type of page you&#39;d like to restore from the dropdown menu.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image5.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Select the timeline for restoration from the options today, yesterday, the last seven days, or a custom date range.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image6.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image7.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: Click <span className="textBold">OK</span> to save your selected date range.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image8.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: Select the pages you want to restore.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image9.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: Choose the field you want to restore, such as name or description.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image10.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image11.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: Click the <span className="textBold">Restore</span> button to revert changes. You have the option to restore pages to the oldest version or revert to the most recent changes.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image12.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: To generate a report, click the <span className="textBold">Report</span> button and refresh the page.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image13.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 11</span>: Once the report is generated, download it using the <span className="textBold">Download</span> button.
                </p>

                <p>
                  <span className="textBold">Step 12</span>: You can also check the restore history from the <span className="textBold">Restore</span> tab.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/report-restore/image14.png`} alt="" />
                </div>

                <p>
                  And that&#39;s it! You&#39;ve now learned how to use the Report and Restore feature in the SEOKart app.
                </p>
              </div>
            </>
          }

          {Props.page == 'richsnippet' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/_eoBle0cy5A?si=mqZQpUSlzzS5CKey&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>In this article, you&#39;ll learn how to use the Rich Snippets feature in the SEOKart app to enhance your store&#39;s visibility and click-through rate (CTR).</p>   

                <p>Step 1: Navigate to the Rich Snippets feature from the left-hand side menu panel.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image1.jpg`} alt="" />
                </div>

                <p>Step 2: You&#39;ll see a console message indicating that you haven&#39;t added any rich snippets to your store yet.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image2.jpg`} alt="" />
                </div>

                <p>Step 3: Turn on the toggles and fill in the required details to add different types of snippets to your store. Start with the product snippet for your store.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image3.jpg`} alt="" />
                </div>

                <p>Step 4: Click on the toggle button to turn it on.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image4.jpg`} alt="" />
                </div>

                <p>Step 5: Enter the details asked such as the app you&#39;re using for customer reviews, brand name, and the validity period for your store&#39;s product price.</p>

                <p>Step 6: Click on the Update button to save your settings.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image5.jpg`} alt="" />
                </div>

                <p>Step 7: Next, set up the homepage snippet. Turn it on and click continue.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image6.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image7.jpg`} alt="" />
                </div>

                <p>Step 8: Now you need to fill the details asked such as your brand&#39;s logo, URL name, business type, phone number, email, social media profile, price range and more.</p>

                <p>The default business type is &quot;organization,&quot; which is compatible with Google. You can also choose from the various options that suits your business.</p>
                
                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image8.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image9.jpg`} alt="" />
                </div>

                <p>Step 9: There are additional toggle options like breadcrumbs and blog post. Breadcrumbs help with navigation and understanding a website&#39;s page hierarchy. Toggle it on as well and click continue.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image10.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image11.jpg`} alt="" />
                </div>

                <p>Step 10: The second snippet is for blog posts. Toggle it on and click continue to add an article snippet for your store on the Google search results page.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image12.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image13.jpg`} alt="" />
                </div>

                <p>Step 11: Lastly, click on the Update button to update the settings.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image14.jpg`} alt="" />
                </div>

                <p>Step 12: The final Rich Snippet option is for FAQs. Enter the URL of the page where you want to add the FAQ snippet and toggle it on.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image15.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image16.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image17.jpg`} alt="" />
                </div>

                <p>Step 13: Click continue, then add the FAQs with answers and update your settings.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image18.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image19.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image20.jpg`} alt="" />
                </div>

                <p>Step 14: Check the console to see if it has updated its snippets. Click on a snippet to view information about it.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/richsnippets-bigcommerce/image21.jpg`} alt="" />
                </div>

                <p>And that&#39;s it! You&#39;ve successfully added rich snippets to your store using the SEOKart app.</p>
              </div>
            </>
          }

          {Props.page == 'ranktracker' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/f8UvGg3pSzU?si=hxtQp9HC39teh-9Z&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  In this article, you&#39;ll learn how to use the Rank Tracker feature in the SEOKart app to monitor your keyword rankings.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Start by selecting the <span className="textBold">Rank Tracker</span> option from the left-hand side menu panel.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Click the <span className="textBold">Add Keyword</span> button to begin keyword tracking.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: In the keyword input box, type in the keyword you want to track.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image3.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: You can also search keyword suggestions, by clicking on the <span className="textBold">view more keywords</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image4.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Enter your keyword and select from the various suggestions that appear.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image5.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: Click on the plus icon to add your chosen keywords to your keyword rank tracker.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image7.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: Then choose your <span className="textBold">Google</span> location and the device you want to track. You can also select the search engine, which is set to google.com by default.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image11.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: Select your preferred language and save your specifications by clicking the <span className="textBold">Submit</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image13.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: For a comparative analysis, add your competitors. Type them into the Input box or use the provided suggestions, then click <span className="textBold">Submit</span>.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image14.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image15.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: Return to the previous screen to view the ranking of your chosen keywords.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image16.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 11</span>: Click the eye button to check the best &amp; worst position of the keywords over time.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/image17.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 12</span>: You can track SERP features where your keyword ranks, such as site links, images, videos, and featured snippets.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/rank-tracker/images18.jpg`} alt="" />
                </div>

                <p>
                  And that&#39;s it! You&#39;ve successfully used the Rank Tracker in the SEOKart app to monitor your keyword rankings.
                </p>
              </div>
            </>
          }


          {Props.page == 'bulkoptimizer' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/4ZTzueUdxMA?si=XuEy6DxPt44bPlq5&amp;rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  In this article, you&apos;ll learn how to use the <span className="textBold">Bulk Optimizer</span> feature in the SEOKart app to optimize your store&apos;s title tag, meta description, and alt text in bulk.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Navigate to the Bulk Optimizer option on the left side of the menu panel.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Choose the label you want to add to optimize your store. For instance, let&apos;s select the <span className="textBold">Product Name</span> label, add a separator, and your brand name.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/images2.jpg`} alt="" />
                </div>

                <p>
                  Check the live preview on the right side of the screen to see how the modified title text will appear.
                </p>

                <p>
                  <span className="textBold">Step 3</span>: Click on the <span className="textBold">Update</span> option, then select the <span className="textBold">Save and Update</span> button. Although the Update all option is available, we recommend updating only blanks using the Bulk Optimizer.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image4.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image5.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: When prompted, select <span className="textBold">yes</span>. The status of your request will show as pending.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image6.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image7.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Your request will be completed soon based on the number of URLs.
                </p>

                <p>
                  <span className="textBold">Step 6</span>: Activate the <span className="textBold">Cruise Control</span> feature to automatically optimize the title text of your store&apos;s new pages.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image8.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: To optimize Meta Description and Alt text, repeat the previous steps and select the appropriate labels. For example, create a meta description template using your product name, the price label, and your store name.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image10.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image15.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: Check the preview again. If everything looks fine, proceed with the <span className="textBold">Save and update all blanks</span> option.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image17.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image18.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: When prompted, select <span className="textBold">yes</span>. The status will again show as pending.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image19.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: Your request will be completed soon based on the number of URLs.
                </p>

                <p>
                  <span className="textBold">Step 11</span>: Activate the <span className="textBold">Cruise Control</span> feature to automatically optimize the meta description of your store&apos;s new pages.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/bulk-optimizer/image23.jpg`} alt="" />
                </div>

                <p>
                  You can monitor your bulk optimization requests through the Bulk Optimizer history and Cruise Control history. Congratulations, you&apos;ve now mastered the use of the Bulk Optimizer feature in the SEOKart app!
                </p>
              </div>
            </>
          }


          {Props.page == 'imageoptimizer' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/pFefTTyj1_E?si=8TRAIow6HLeLpJTW&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  Welcome to this tutorial where you&#39;ll learn how to optimize your store&#39;s product images using the SEOKart app.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Navigate to the <span className="textBold">Image Optimizer</span> option on the menu panel located on the left side of your screen. This will open a screen displaying all your store&#39;s images along with details like file name, alt text, and size.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images12.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Click on the <span className="textBold">Settings</span> icon to access optimization options. Here, you&#39;ll find several settings that you can activate to optimize your images.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: Enable the <span className="textBold">Cruise Control</span> setting. This feature automatically optimizes all new product images on your store within 24 hours, excluding existing ones.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: Adjust the <span className="textBold">File Name</span> setting. You can automate the file names using different dynamic labels. We recommend adding at least the name label.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image3.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Set up <span className="textBold">Alt Text Optimization</span>. You&#39;ll find the same dynamic labels as in the previous step. Again, we recommend adding at least the name label.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image4.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: Configure the <span className="textBold">File Size Optimization</span> setting. This allows you to optimize the image quality. We recommend setting the quality at medium. If you want to convert the image from PNG to JPEG, turn on the <span className="textBold">Toggle</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image7.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: After making these changes, click on the <span className="textBold">Save</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image8.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: Click on the <span className="textBold">Back</span> button to return to the previous screen.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image9.jpg`} alt="" />
                </div>

                <p>
                  Please note - optimizing images using the app changes the URLs of the images, and this change cannot be reversed. If you use any third-party app for checkout, search bar, or any other purpose related to the images, it may not index the optimized images. Therefore, we recommend checking the optimized images on your store on the product page, search and checkout to ensure that the optimized images are displaying correctly.
                </p>

                <p>
                  <span className="textBold">Step 9</span>: Click on the <span className="textBold">Optimize</span> button to start optimizing your images.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image10.jpg`} alt="" />
                </div>

                <p>This process may take a few seconds.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image11.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: Your image should now be optimized. You can check the preview once it&#39;s optimized and compare the changes. If you prefer the original image, you can restore it by clicking on the restore button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image12.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 11</span>: If you want to optimize <span className="textBold">all</span> the images at once, select the All checkbox option and then click on the <span className="textBold">Optimize</span> button. This will optimize all the images of your store as per your saved setting.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/image-optimizer/image14.jpg`} alt="" />
                </div>

                <p>
                  We highly recommend optimizing a few images manually and checking them on your store to ensure there are no issues before you proceed with bulk optimization.
                </p>

                <p>
                  And that&#39;s it! You&#39;re now ready to enjoy a faster loading store with optimized images.
                </p>
              </div>
            </>
          }


          {Props.page == 'urleditor' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/tTZAj-7RoAo?si=L1M1MaKXXcipPz9F&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  This article will guide you through the process of using the URL Editor feature in the SEOKart app. By the end of this tutorial, you&#39;ll know how to change and manage your store&#39;s URLs.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Navigate to the URL Editor feature on the left-hand side menu panel of the SEOKart app.
                </p>

                <p>
                  <span className="textBold">Step 2</span>: Once you&#39;re on the URL Editor page, you&#39;ll see a list of all your store&#39;s URLs.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/URL-editor/image1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 3</span>: At the top of the page, there&#39;s a dropdown menu where you select the type of webpage you&#39;re working with.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/URL-editor/images2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: You&#39;ll notice three columns. The first column displays your current store URL. The second column is where you&#39;ll input your new URL, and the third column shows the redirect URL, which is typically the new URL you&#39;ve just added.
                </p>

                <p>
                  <span className="textBold">Step 5</span>: To add a new URL, click on the New URL input box in the second column and type in your new slug. For example, &quot;lumen&quot;.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/URL-editor/image3.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: After entering your new URL, click the Save button to update the URL.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/URL-editor/image4.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: You&#39;ll see that your old URL has been updated and redirected to the new URL. If you want to delete this change and redirection, simply click on the Delete button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/URL-editor/image5.jpg`} alt="" />
                </div>

                <p>
                  And that&#39;s it! You&#39;ve successfully used the URL Editor feature in the SEOKart app. Remember, only SEO Experts should use this feature, as incorrect changes can affect your store&#39;s traffic.
                </p>
              </div>
            </>
          }

          {Props.page == '404fixer' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/I09n4i0l-i0?si=wN9sbytXsRC27Ajp&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  In this article, you&#39;ll learn how to fix broken URLs in your store using the SEOKart. This guide will walk you through two methods to resolve this issue.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: From the left-hand side menu panel, navigate to the <span className="textBold">404 Fixer</span> option. Here, you&#39;ll find all the broken links in your store that need fixing. The first column displays broken links, the second column shows where the URL is found, and the third column lets you insert a detailed URL to fix the broken link.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image1.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: There are two ways to fix broken links. The first method involves visiting the source page inside the SEO Optimizer and fixing the link. The second method is to redirect the broken URL to a valid webpage. We recommend fixing the broken URL instead of redirecting it as an SEO best practice.
                </p>

                <p>
                  <span className="textBold">Step 3</span>: To use the first method, navigate to the <span className="textBold">SEO Optimizer</span> option.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image2.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: Go to the page where the broken link is found and click on the optimize button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image3.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Then scroll down to the content issues. Here, you&#39;ll see the broken links. Click on the number. This action will show you the broken link and the anchor text.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image4.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/images5.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: Click on the anchor text and edit the link. Enter the correct URL.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image6.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image7.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 7</span>: Save your changes. Then, click on the <span className="textBold">Save all</span> option. You&#39;ll see that the error is now fixed.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image8.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image9.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: If you prefer to use the second method, return to the <span className="textBold">404 Fixer</span>. Here, you&#39;ll see the broken URL and where it&#39;s found. You&#39;ll also notice that one of the errors has been removed since we&#39;ve already fixed it.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image10.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image11.png`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: Enter the correct URL in the Redirect URL column and click on the <span className="textBold">Save</span> button. Refresh the page to complete the redirection.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image12.png`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/404-fixer/image13.png`} alt="" />
                </div>

                <p>
                  And that&#39;s it! You&#39;ve now learned how to fix a broken URL by either correcting it or redirecting it.
                </p>
              </div>
            </>
          }

          {Props.page == 'analytics' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/Ka1VP6P8iE0?si=5cIptsciZdiQBgyO&rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>This article will guide you on how to link Google Analytics with SEOKart app through your BigCommerce account.</p>

                <p><span className="textBold">Step 1</span>: Start by logging into your BigCommerce account. Navigate to the Menu panel on the left side of the screen.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image1.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 2</span>: Proceed to Settings, scroll down to Advanced Settings, and then select Data Solutions. Here, you&apos;ll find Google Analytics 4. Click on the Connect button.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image13.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image14.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 3</span>: You&apos;ll be prompted to enter a code from your Google Analytics 4 account. To find this, switch to your GA4 account.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image15.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 4</span>: In your GA4 account, navigate to the Admin Panel located at the bottom left corner.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image2.jpg`} alt="" />
                </div>
                
                <p><span className="textBold">Step 5</span>: From the left menus, select Data Collection and Modification, then proceed to Data Streams.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image3.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image4.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 6</span>: Click on the web button.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image5.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 7</span>: In the first input box, enter your website URL.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image6.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image7.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 8</span>: Next, enter your Stream name.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image8.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 9</span>: Click on Create &amp; continue. You&apos;ll be prompted to install this. Click on Next. You&apos;ll find a code here.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image9.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 10</span>: Copy this code and return to your BigCommerce account. Paste the copied code and click on Connect. You&apos;ve now successfully added Google Analytics to your BigCommerce account.</p>

                <p><span className="textBold">Step 11</span>: To add this to the SEOKart app, navigate to the Apps section from the bigcommerce menu panel.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image10.jpg`} alt="" />
                </div>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image11.jpg`} alt="" />
                </div>

                <p><span className="textBold">Step 12</span>: Choose SEOKart from the left-hand menu panel. Go to the analytics section and click on Connect.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/analytics-bigcommerce/image12.jpg`} alt="" />
                </div>
                
                <p><span className="textBold">Step 13</span>: Select your Mail ID. A dialog box will appear with your details. Click on the Submit button. You&apos;ve now successfully connected Google Analytics 4 with the SEOKart app.</p>
              </div>
            </>
          }

          {Props.page == 'seoaudit' &&
            <>
              <div className="how-work-modalArea">
                <div className="VA-videoArea">
                  <div className="VA-videobox">
                    <iframe
                      src="https://www.youtube.com/embed/W7KP2gCL258?si=2NoMjJvi_pnc-tqi&amp;rel=0"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <p>
                  Welcome to this tutorial on optimizing your store for SEO using the SEOKart app. By the end of this guide, you’ll know how to improve your store’s SEO score and make it more SEO-friendly.
                </p>

                <p>
                  <span className="textBold">Step 1</span>: Open the SEOKart app to view your store’s overall SEO score and other SEO functions on the dashboard. Identify the actions needed to improve this score.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/dashboard/images1.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 2</span>: Locate the <span className="textBold">SEOKart menu panel</span> on the left side of the screen. Click on the <span className="textBold">SEO Optimizer</span>.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image1.jpg`} alt="" />
                </div>

                <p>This will display the SEO score of all your pages.</p>

                <p>
                  <span className="textBold">Step 3</span>: Identify pages with low scores. Optimize these by clicking on the <span className="textBold">Optimize</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image2.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 4</span>: After clicking <span className="textBold">Optimize</span>, you’ll receive a detailed on-page SEO report for that page. This report includes issues with meta tags, content, images, and URL. Red crosses indicate errors, while green marks indicate proper optimization. Fix these errors to optimize your page.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image3.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 5</span>: Monitor your SEO score in real-time as you fix these issues.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image20.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 6</span>: Utilize the <span className="textBold">AI Assist</span> feature to generate page suggestions and further optimize it.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image4.jpg`} alt="" />
                </div>

                <p>
                  The <span className="textBold">AI Assist</span> feature can generate meta tags &amp; category descriptions.
                </p>

                <p>
                  <span className="textBold">Step 7</span>: Improve a product’s SEO score by identifying and entering a relevant target keyword. For example, if the page is about a Canvas Laundry Card, use this as the target keyword.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image5.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 8</span>: Address issues with the title length, which should be 40 to 60 characters, including spaces and the target keyword. Write a title or use the <span className="textBold">AI Assist</span> feature.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image6.jpg`} alt="" />
                </div>

                <p>
                  Click on the <span className="textBold">AI</span> button to generate a title text using the target keyword.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image7.jpg`} alt="" />
                </div>

                <p>
                  Click on the <span className="textBold">Use it</span> button to apply the generated title to your page.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image8.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 9</span>: Modify the <span className="textBold">AI</span> suggestion if needed, or click on the AI button again to generate a new suggestion.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image9.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 10</span>: Create a meta description for the page, which should be 120 to 160 characters. Click on the <span className="textBold">AI Assist</span> button to generate a meta description.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image11.jpg`} alt="" />
                </div>

                <p>
                  Click on the <span className="textBold">Use it</span> button to apply the generated meta description to your page.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image12.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 11</span>: Fix content issues like broken links, HTTP links, and spelling errors by clicking on the error number. This will show you the error and how to fix it.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image13.jpg`} alt="" />
                </div>

                <p>If the spelling error is a brand or product name, you can choose to ignore it.</p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image14.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 12</span>: Address image-related issues. If images are missing alt text, add relevant alt text.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image16.jpg`} alt="" />
                </div>

                <p>
                  For example, add “Canvas Laundry Card” as the alt text.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image17.jpg`} alt="" />
                </div>

                <p>
                  <span className="textBold">Step 13</span>: Continue fixing these red cross issues to improve your page’s SEO score.
                </p>

                <p>
                  <span className="textBold">Step 14</span>: Check for any URL-related issues and take appropriate action.
                </p>

                <p>
                  <span className="textBold">Note:</span> This might require an expert and is optional.
                </p>

                <p>
                  <span className="textBold">Step 15</span>: Save all updates by clicking on the <span className="textBold">Save all</span> button.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image18.jpg`} alt="" />
                </div>

                <p>
                  Congratulations, your page is now optimized! Repeat these steps to optimize other pages of your store as well.
                </p>

                <div className="featuresModal-img">
                  <Image src={`${basePath}/images/features/seo-optimizer/image19.jpg`} alt="" />
                </div>
              </div>

            </>
          }
        </Modal.Body>
      </Modal>
    </>)
}