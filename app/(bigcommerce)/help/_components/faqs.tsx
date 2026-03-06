import { Accordion, Card } from 'react-bootstrap'
import { useState, useCallback, useEffect } from 'react';

export default function Home() {
	const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

	const handleToggle = (index: string) => {
	setOpenAccordions((prev) => ({
		...prev,
		[index]: !prev[index],
	}));
	};

	const [search, setSearch] = useState('')
	const [faqData, setFaqData] = useState([
		{
			category: 'General',
			visible: true,
			faqs: [
				{
					question: 'How SEOKart can help my store?',
					answer: '<p>SEOKart is an all-in-one DIY SEO app that can help you with optimizing your store for Google.</p><p>Using its advanced features like SEO Optimizer, Image Optimizer, Bulk Optimizer, Rich Snippets, etc, you can optimize your store with the best practices of SEO, and get better rankings on Google.</p><p>You can also track the rankings on multiple keywords.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'There are tens of other apps which do SEO, why should I use SEOKart?',
					answer: "<p>The SEOKart app is built by professionals having 15+ years of experience in the field of SEO. The app works on the basics of SEO and does not try to 'overdo' anything.</p><p> With the right mix of features like rich snippets, image optimization, and bulk optimization, we offer an advanced SEO Optimizer that checks every product and category page of your store on the 15 most important SEO Factors. </p>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'What will happen to the changes on my store, I made using SEOKart after I uninstall it?',
					answer: ' <p>All the changes will be permanent and will remain in your store even after you uninstall our app. </p><p>Please note that the script for the Rich Snippets put by our app will be removed on the uninstallation of our app.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'Why do I get a malware alert when I open the SEOKart app?',
					answer: ' <p>As you are using our app inside BigCommerce/Shopify platform, some anti-virus chrome plugins may show an alert or intervene in the functionality of our app. </p><p>In this scenario, please raise a ticket by sending an email to <a href="">hi@seokart.com</a> and we will take care of that. </p>',
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: 'Best Practices',
			visible: true,
			faqs: [
				{
					question: 'How can I get the best out of the SEOKart app?',
					answer: '<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/X2ukZpVQOiA?si=aaE2NoGzSvsEsnlV&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>Start optimizing your categories and best seller products inside our advanced SEO Optimizer. Try to get a score over 90 by following the 15 different issues mentioned there. </p><p>You can also optimize the images using the Image Optimizer feature and turn Rich Snippets On to get a better conversion rate.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'What are the best practices to do SEO for my store?',
					answer: '<p>You should start with identifying the right keywords. If you sell Leather Shoes in the USA, then your keywords can be "Buy Leather Shoes", "Leather Shoes Online" etc. </p><p>You should have different keywords for your home page, categories, and product pages.</p> <p>Once you identify the keywords, start writing the Title Tag, Meta Description, and Products/Category descriptions including the keyword(s). Our app can help you do that with its advanced features. </p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How can I optimize hundreds of products in a short period?',
					answer: "<p>That's not a good idea. If you still want to do it, use our Bulk Optimizer, and start updating the Title Tag and Meta Descriptions of all the products which don't have them. </p><p>Once done, start optimizing the categories and bestseller products manually using our advanced SEO Optimizer. </p><p>You don't need to optimize hundreds of products in a month.</p><p>Even if you optimize as little as 50 products every month, then also you can expect a boost in store traction and revenue.</p>",
					visible: true,
					toggleOpen: false
				}
			]

		},
		{
			category: 'SEO Optimizer',
			visible: true,
			faqs: [
				{
					question: 'How does SEO Optimizer feature work in SEOKart?',
					answer: "<div class='VA-videoArea'><div class='VA-videobox'><iframe src='https://www.youtube.com/embed/W7KP2gCL258?si=2NoMjJvi_pnc-tqi&rel=0' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe></div></div>SEO Optimizer helps you in evaluating Google's (and other search engines') critical ranking factors and in highlighting and fixing the store optimization issues in the following easy steps:<ol><li> Click the SEO Optimizer feature on the app’s sidebar.</li><li>This SEO Optimizer feature audits upto 100 pages in a trial plan and all of the website pages in a paid plan.</li><li>By clicking on Pages, you will be able to find all of your web pages audited by the app.<ul><li>You can filter the pages as All, Home, Categories, or Products from the dropdown above the name section.</li><li>You can also sort the pages as per alphabetical order from A-Z, Z-A, low to high or high to low SEO score and latest added, as shown in the below- provided image:<div class='Auditimg'><span> <img src='https://app.seokart.com/shop_app/images/faqnew/faq1.jpg'></span></div></li><li>You can find the fields of Name, Type, Meta Description, Content, Images, Broken, and URL section. </li><li>On the right of all these sections, is the SEO Score for the particular page and the OPTIMIZE action button, which allows you to edit and fix the errors. <div class='Auditimg AI-audit-fullImg'><span><img src='https://app.seokart.com/shop_app/images/faqnew/faq2.png'></span></div></li><li>Click on the OPTIMIZE action button, for the page you want to rectify first or you may also search the page by mentioning the name of that page in the search bar on the right.</li><li>The next page will show you the different parameters with the option to edit your page, Keyword, Title Tag, Meta Description, Content, Image, and URL.</li></ul></li></ol>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to find the target Keyword?',
					answer: '<p> Finding the right Keyword for your page is the most important thing in achieving the top ranking in search results. For best rankings, it is recommended that you do deep research about your target customers, and marketplace to find the most accurate keywords.</p><p>The app also provides you with relevant suggestions for the right keywords for your page by mentioning the related word(s) in the Keyword field, as shown in the image.</p><p>For example, since we are working on the “dust pan” product page in our example image, the right Keyword would be “dust pan for sale” or “buy dust pan online”.</p><p>(You can also add the Keyword by clicking on the “+” sign next to the "Keyword" for tracking your store ranking on that particular keyword)</p><div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq3.png" /></span></div>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to resolve Title Tag issues?',
					answer: '<p>After selecting the Keyword, check your existing Title Tag if it has the keyword included in it as it is or not. If not, then edit the Title Tag so that it includes the keyword selected by you.</p><p> As you edit the Title Tag as per the keyword, keep in concern that its length should be in between 40 - 60 characters count including space as specified on the left side of the page.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to resolve Meta Description issues?',
					answer: '<p>Hover to the Meta Description section on a single audit page. Edit your existing Meta Description so that it includes the target Keyword as it is and the Meta Description length should be between 120 - 160 characters including spaces.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to fix issues in content?',
					answer: '<p>Scroll to the description field and edit it in a way to include the target Keyword as it is.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to add the Alt text to the primary image?',
					answer: '<p>Check for the primary image issues whether the Alt text is present or not. For images without ALT text, you can change, and update those images from the Image Issues section. You can add the ALT text from this section. By clicking on “OPTIMIZE” you may update it overall to decrease the size of the image and update the file name as per the Image Optimizer settings.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to fix URL issues?',
					answer: ' <p>Scroll to the URL field and you will be able to find the errors with the URL. You can edit the URL and redirect the older one to the new URL of your choice.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How I will come to know that all the errors are fixed?',
					answer: '<p>After updating all the criteria correctly, you will find the green tick next to all the factors under issues. Any factors showing a red cross must be updated.   Also, you would see an instant upgrade in your SEO score.</p><div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq4.png" alt=""></span></div>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to save all the changes done while auditing the page?',
					answer: '<ul><li>Click Save All to save the changes and stay on the current page.</li><li>Click Save All & Exit to save the changes, exit the page and return to the main SEO Optimizer page.</li><li>You can also return to the SEO Optimizer page by clicking on Back on the top left corner of the screen.</li></ul><div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq5.png"></span></div><p>Simply repeat the process to optimize all the pages under your free/paid plan, one by one.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'What if my store includes products or services with words/brands that are grammatically incorrect and are showing spelling errors?',
					answer: '<p>If you think the Spelling Errors are acceptable, the SEO Optimizer feature provides you the access to turn off the spelling error factor which can be restricted on a single page or can be implemented on the complete store.</p><div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq6.png" alt=""></span></div><p>You can also ignore the spelling errors from the description, by clicking on the numerical value in front of spelling errors.</p><p>Next, you will be required to click on "Ignore it" to remove that particular word from errors. You can also undo and restore the changes made to ignore the spelling error as well. SEOKart supports 11 languages for evaluating spellings.</p><div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq7.png" alt=""></span></div>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to restore or reverse the changes made in SEO Optimizer?',
					answer: '<p>The SEO Optimizer feature not only optimizes your SEO score but also gives you the freedom to reverse the changes up to the past 2 updates done by you. If you find that the changes made by you are not helping you to enhance your SEO or you did any change mistakingly, you may reverse and restore the original criteria for the page.</p><p><strong>Steps:</strong></p><ul><li>Click Restore  on the right of the Meta field and you will see timestamps for each of your last 2 updates.</li><li>Click on the timestamp you want to restore the changes to.</li><li>Save and all the changes you have done will get reversed.</li></ul>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'What is the short or alternate method to fix the errors on the store pages?',
					answer: '<p>You can fix the issues by targeting the required pages with errors.</p><ul><li>Clicking on the Errors  action button on the SEO Optimizer page opens up a page specifying all the issues on your store i.e., Meta Tag issues, Content issues, Images issues, Broken Link issues, and URL issues as you scroll down the page.<div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq8.png" alt=""></span></div></li><li>Click on the scroll bar next to the number of errors, you would be able to find the pages with the issues and the option to OPTIMIZE the SEO score by resolving the issues as done in the above method of SEO Optimizer.<div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq9.png" alt=""></span></div></li></ul>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How much time does the SEO Optimizer feature take to audit the pages?',
					answer: '<p>Your SEO score will upgrade instantly as soon as you update all the required factors as per the Google ranking metrics.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How much SEO score can be considered good to enable a higher rank on my store page?',
					answer: '<p>An SEO score above 90% is considered good enough to enhance your Google ranking.</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to fix the duplicate Title Tags or duplicate Meta Description issue?',
					answer: '<p>Under the Meta Tag issues section, you will find the option to resolve any Duplicate Title Tags or Duplicate Meta Descriptions issues, by clicking on the numerical value in the bracket.</p><div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq10.png" alt=""></span></div><p>This will open a dialog box from where you can edit and fix the error(s).</p>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to synchronize the changes in the SEOKart app that are made on the store outside the SEOKart app?',
					answer: '<p>SEOKart audits all the changes in the store pages automatically if they are done inside SEOKart. If you are not sure whether the changes made outside SEOKart synched in or not, you can click Sync on the top right of the SEO Optimizer page.</p><p>It will, then, complete the automatic synchronization of the updates done on those pages which are not updated on SEOKart. The Sync feature is included in the paid plan only. </p>',
					visible: true,
					toggleOpen: false
				}
			]

		},
		{
			category: 'Bulk Optimizer',
			visible: true,
			faqs: [
				{
					question: 'How does Bulk Optimizer feature work in SEOKart?',
					answer: '<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/4ZTzueUdxMA?si=XuEy6DxPt44bPlq5&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>Bulk Optimizer is an outstanding feature of SEOKart to bulk update the Title Tags, Meta Description, and Alt text of store pages in a few easy steps as mentioned below:</p><ul><li>Click on the “Bulk Optimizer” action button on the sidebar of your SEOKart dashboard.</li><li>Select the type of pages as Product, Category/Collection, Brand, or Blogs.<div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq11.png" ></span></div></li><li>Select the factor you want to update in bulk as Title Tag, Meta Description, or Alt Text.</li><li>Below the Title Template box are the criteria you are required to select, which will create the Template for the respective factor. For example, in the image shown below, we have selected the criteria for creating Title Tag as “Product Name", "Type", "SKU" & "Price”.<div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq12.png"></span></div></li><li>On the right side in “Live Preview”, you will see a live preview of how the Title Tag will be shown.</li><li>After selecting all the criteria, click the Update button at the bottom. Then click on the “Save” button to save this template in your data for future use and click on the “Save & Update All” button to save and update the Title Tag for all the products/pages on your store.</li><li>Once all updates are done, it will say “Completed” under the “Status”. Also, you can see the status of the ongoing updates in the “Pending Queue” area on the top right side of the page.</li></ul>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to bulk update all the pages which have got blank Title Tags?',
					answer: '<p>Our Bulk Optimizer feature enables you to update all those pages of your store which have got blank Title Tags.</p><ul><li>Select the type of pages as Product, Category/Collection, Brand, or Blogs.</li><li>Click on the Title Tag option.</li><li>Select the criteria to create the Title Tag template.</li><li>Click on the “Update” button below the Template.</li><li>Select “Save & Update All Blanks” to update all the pages which have got blank Title Tags.</li><li>You can also select the blank pages between the required serial numbers on your store, for which you want to add the Title Tags.<div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq13.png" alt=""></span></div></li><li>Select “Yes” to continue to update with Bulk Optimizer.</li><li>Stay on the page or leave the page to complete any other tasks on your desktop. Meanwhile, our Bulk Optimizer completes its updates.</li><li>Once all the updates are done, you will see “Completed” under “Status”.</li></ul>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to bulk update all the pages which have got blank Meta Descriptions?',
					answer: "<p>Our bulk optimizer feature enables you to update all the pages of your store with blank Meta Descriptions.</p><ul><li>Select the type of pages as Product, Category/Collection, Brand, or Blogs.</li><li>Click on the Meta Description option. </li><li>Select the criteria to create the Meta Description Template.</li><li>Click “Update” below the Template.</li><li>Select “Save & Update All Blanks” to update all the pages with blank Meta Descriptions.</li><li>You can also select the blank pages between the required page numbers on your store, for which you want to add the Meta Descriptions</li><li>Select “Yes” to continue updating with Bulk Optimizer.</li><li>Once all update is done, you would be able to see “Completed” under “Status”.</li></ul>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to add Alt Text to primary images on product pages in bulk?',
					answer: "<p>The Bulk Optimizer feature fixes all the issues related to the missing Alt text in primary images on product pages.</p><ul><li>Select “Products” from the scroll bar.</li><li>Click “Alt Text” above the Template field.</li><li>Mention the Alt Text for the primary images in the Alt Text Template.</li><li>Click  “Update” button below the Template.</li><li>Select “Save & Update All Blanks” to update all the pages with blank Alt Texts on primary images.</li><li>Select “Yes” to continue to update with Bulk Optimizer and this will initiate the automatic update.</li><li>Stay on the page or leave the page to complete any other tasks on your desktop. Meanwhile, our Bulk Optimizer completes its updates.</li><li>You can also select the product pages between the required serial numbers on your store, for which you want to add the Alt Texts.</li><li>Once all update is done, you will see “Completed” under “Status”.</li></ul>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to view the Bulk Optimizer history?',
					answer: '<p>You may easily review the update done by you via Bulk Optimizer.</p><ul><li>Scroll down to the Bulk Optimizer page to view the history of your updates.</li><li>You can see all the data of updates as shown in the image provided below:</li></ul><div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq14.png" alt=""></span></div>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to bulk update Title Tags, Meta Descriptions, and Alt Texts in Bulk Optimizer for some specific products/pages?',
					answer: '<p>Bulk Optimizer has the option to customize the pages which you want to update.</p><ul><li>Create the Template.</li><li>Scroll down the Bulk Optimizer page.</li><li>Click “Update:</li><li>Select “Save & Update Custom” down the page.</li><li>Select the pages for which you want to do the bulk update. You can also search the page by name. Also, you can select all the pages or those with empty Title Tag only.<div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq15.png" alt=""></span></div></li><li>Click “Submit” to continue.</li><li>Select “Yes” to continue updating with Bulk Optimizer.</li><li>Once all update is done, you would be able to see “Completed” under “Status”.</li></ul>',
					visible: true,
					toggleOpen: false
				},
				{
					question: 'Do I need to undergo a Bulk Optimizer update for every new page added to my store.',
					answer: " <p>You do not need to update the newly added page through Bulk Optimizer. You are just required to turn On the “Cruise Control” option provided on the Bulk Optimizer page. It will automatically update the blank Title Tag, Meta Description, and Alt Text to the primary image as per the Template set by you,  for the recently added page on your store. In Cruise Control History, you can also view the pages updated by Bulk Optimizer automatically.</p>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How many character counts can be added to the Title Tag template?',
					answer: "<p>The maximum character count limit for Title Tag and Meta Description is  225 characters including spaces. Also, keep the character length for Title Tags and Meta Description as recommended in our SEO Optimizer tool, to meet the standards of the Google algorithm for ranking.</p>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How many store pages I can update with Bulk Optimizer in my free plan for SEOKart app?',
					answer: "<p>You can update 100 pages of your store with Bulk Optimizer under the free plan. Under the paid plan, you can update unlimited pages of your store.</p>",
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How much time does it take to update the store pages through Bulk Optimizer?',
					answer: "<p>It may take some time to update all the pages depending upon the number of pages. You may leave the page and process other important tasks meanwhile the update is in progress.</p>",
					visible: true,
					toggleOpen: false
				}
			]

		},
		{
			category: 'Image Optimizer',
			visible: true,
			faqs: [
				{
					question: 'How Image Optimizer feature works in the SEOKart app?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/pFefTTyj1_E?si=8TRAIow6HLeLpJTW&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The image Optimizer feature enables you the platform to optimize the images of your product pages.</p>
                  <ul>
                  <li>Click “ Image Optimizer” on your SEOKart dashboard. </li>
                  <li>Click “Settings” on the right side of the page.</li>
                  <li>Add/Edit the File Name.</li>
                  <li>Add/Edit the Alt Text.</li>
                  <li>Update the File size as High, Medium, or Low as required.</li>
                  <li>If needed, convert the format of the image from PNG to JPEG by clicking on the “YES” button in the “File Size Optimization” section.</li>
                  <li>You may “On” or “Off” the update for any section.</li>
                  <li>After updating all the sections, click “SAVE”.</li>
                  <li>To update multiple images, select the checkboxes left to the file names and click "Optimize" on top of the page.</li>
                  <li>To update the images one by one, click “Optimize” next to each product.</li>
                  </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to save the Alt Text for images without changing the File Name and File Size.',
					answer: `<p>Fill the Alt Text fields for the required products and then click  “Save Alt Text”.All the updates would be implemented on the Alt.Texts.</p>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to restore the changes done in images File Name, Alt Text, File Size, or File ',
					answer: `<p>Click "Restore" button to reverse all the changes done by you in the images via the Image Optimizer feature. You can find the "Restore" button next to Optimize button. You can restore the original images within 3 days of the update only.</p>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How many images are optimized by using Image Optimizer in the free plan?',
					answer: `<p> You can optimize up to 200 images via Image Optimizer in our free plan.In the paid plan, you can optimize unlimited images from your store pages.</p>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to review the changes done by Image Optimizer?',
					answer: `<p> Once the image is optimized, click on "Preview" button, and you will be able to find the option to preview the changes as shown below. </p>
              <div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq16.png" alt=""></span></div>
              <p>You can see the changes as per the image quality, File Name, File Size, and Alt Text.</p>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: 'Analytics',
			visible: true,
			faqs: [
				{
					question: 'What is the Analytics feature and how does it connect SEOKart to Google Analytics?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/Ka1VP6P8iE0?si=5cIptsciZdiQBgyO&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The analytics feature links the store to Google Analytics and provides the exact measures of the traffic, orders, and revenue over the website.</p>
          <ul>
          <li>Click "Connect Google Analytics" on top of the Analytics page.</li>
          <li>You will see a pop-up with the instructions to link the Google Analytics.</li>
          <li>In case, you are unable to connect to Google Analytics, kindly contact us for support. You can email us on <a href="mailto:hi@SEOKart.com">hi@SEOKart.com</a> and our experts will assist you with the same.</li>
          </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How does Analytics help to check the website performance?',
					answer: ` <p>Analytics display the website traffic, revenue, orders, and conversion rate as shown in the image provided below:</p>
          <div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq17.png" alt=""></span></div>
           <p>You can also check the website performance for specific time window.</p>
           <p>Also, you will get a graphical representation of the web traffic, revenue, and orders for 13 months, as shown in the example image:</p>
           <div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq18.png" alt=""></span></div>`,
					visible: true,
					toggleOpen: false
				}
			]

		},
		{
			category: 'Ranking',
			visible: true,
			faqs: [
				{
					question: 'How does the Ranking feature work in SEOKart?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/f8UvGg3pSzU?si=hxtQp9HC39teh-9Z&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The ranking feature is provided to search for the appropriate Keywords for the store pages and add Keywords to track the weekly or monthly ranking of website accordingly.</p>
              <ul>
              <li>Click “Ranking” from the “SEOKart” sidebar.</li>
              <li>Scroll right on the next page and click the “ ADD KEYWORD” button.</li>
              <li>You will get a page to add Keywords as shown in the below-provided image:
              <div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq19.png" alt=""></span></div>
              </li>
                <li>Mention the Keywords you want to track ranking in the Keyword field.</li>
              <li>On the right of the page, you can see some suggestions and you can add keywords by clicking on the “+” sign from the “Keywords Suggestion” field.</li>
              <li>Below the Keyword field, select the location, device on which you are operating, search engine, and language.</li>
              <li>After adding the keywords, you can add your top 3 competitors in the “Add Competitors” filed below the screen. Also, you can add competitors from the “Competitor Suggestions “.</li>
              <li>Click on “Submit” after adding all the details.</li>
              </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How can I compare the ranking of my website after adding the keywords?',
					answer: `<p>The Ranking feature provides you with a detailed analysis of your previous and latest ranking after adding the keywords.</p>
              <ul>
              <li>Click on the drop box next to the Keyword.</li>
              <li>You will be able to see the changes in ranking as shown in the image provided below:
              <div class="Auditimg AI-audit-fullImg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq20.png" alt=""></span></div>
              
              </li>
              <li>The “Extremes” filed shows you the best and the worst position of your store.</li>
                <li>You can also view the graphic representation of the changes in your ranking in the graph.</li>
              <li>Scroll down the screen to view how your website looks on Google as per ranked pages in search results.</li>
              </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How many keywords can be added for Keyword Rank Tracking in the free plan?',
					answer: `<p>You can add 25 keywords for Keyword Rank Tracking in our free plan. The charges for adding more keywords depend upon the number of keywords you want to add and can be checked in detail in the “Upgrade” section of the SEOKart app.</p>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'What if I am not getting any keyword suggestions?',
					answer: `<p>The keywords suggestions are generated automatically based on the trend of the popularity of  your website. If your domain is new, you may not be getting any suggestions and you may be required to wait unless your domain gets old.</p>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: 'Rich Snippets',
			visible: true,
			faqs: [
				{
					question: 'How Rich Snippets feature works in SEOKart?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/_eoBle0cy5A?si=mqZQpUSlzzS5CKey&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>Rich Snippets are the features of your store pages you want to be highlighted in your website's listing on Google, along with the Meta tags, such as product reviews, price, or rating. Our Rich Snippets feature enables you to check the eligibility of your website pages to apply the rich snippets as per the Google testing tool and to apply the rich snippets on the required pages.</p>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to add Rich Snippets to Products?',
					answer: `<ul><li>Click "Rich Snippets" from the menu.</li> 
          <li>Scroll down the page and press the “Enable Product Snippet” button.</li>
          <li>This will open a new tab on Shopify where you can ON/OFF the product rich snippet. </li>
          <li>Add/edit all the data you want to be highlighted as Rich Snippets.</li>
          <li>You can add a source of review, Brand name, and price of the product.</li></ul>
          <span> <img src='https://app.seokart.com/shop_app/images/faqnew/faq23.png'></span>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: ' How to add Rich Snippets to Home Page?',
					answer: `<ul><li>Click "Rich Snippets" from the menu. </li> 
          <li>Scroll down the page and press the “Enable Home Page Rich Snippet” button.</li>
          <li>This will open a new tab on Shopify where you can ON/OFF the home page rich snippet. </li>
          <li>Add/edit all the data you want to be highlighted as Rich Snippets.</li></ul>
          <span> <img src='https://app.seokart.com/shop_app/images/faqnew/faq24.png'></span>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to add Rich Snippets to FAQ Page?',
					answer: `<ul><li>Click "Rich Snippets" from the menu. </li> 
          <li>Scroll down the page and press the “Enable FAQ Snippet” button.</li>
          <li>This will open a new tab on Shopify where you can ON/OFF the FAQ rich snippet. </li>
          <li>Add the question and answer you want to show in FAQ Snippet.</li></ul>
          <span> <img src='https://app.seokart.com/shop_app/images/faqnew/faq22.png'></span>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: '404 Error',
			visible: true,
			faqs: [
				{
					question: 'How 404 Error feature works in SEOKart app?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/I09n4i0l-i0?si=wN9sbytXsRC27Ajp&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The 404 Error feature helps you to review all your website pages with broken links and to fix the issues by redirecting the URL to the new link.</p>
          <ul>
          <li>Click “404 Error” on the SEOKart dashboard.</li>
          <li>Select the Errors-Not Fixed option from the drop box.
          <div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq21.png" alt=""></span></div>
          
          </li>
          <li>Add the redirect URL which you think is relevant and save the changes. Follow the same process to fix the 404 error issue for other pages as well.</li>
          </ul>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: 'URL Editor',
			visible: true,
			faqs: [
				{
					question: 'How URL Editor feature works in SEOKart app?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/tTZAj-7RoAo?si=L1M1MaKXXcipPz9F&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The URL Editor feature works to fix all the issues related to the URL. The issues are:</p>
          <ol>
          <li>URL length</li>
          <li>Whether the URL is having the keyword or not.</li>
          <li>Broken URL</li>
          </ol>
          <p>To update the URL:</p>
          <ul>
          <li>Click “URL Editor” from the SEOKart sidebar.</li>
          <li>Select the type of pages for which you want to update the URL, ie., Products, Category, Brand, Pages, or Blog.
          <div class="Auditimg"><span><img src="https://app.seokart.com/shop_app/images/faqnew/faq21.png" alt=""></span></div>
          </li>
          <li>Add the new URL and save the changes.</li>
          </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How many URLs can be updated by URL Editor?',
					answer: `<p>You can edit as many URLs of your store in the URL Editor feature.</p>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
		{
			category: 'Report/Restore',
			visible: true,
			faqs: [
				{
					question: 'How does the Monthly/Weekly Report Feature work in the SEOKart app?',
					answer: `<div class="VA-videoArea"><div class="VA-videobox"><iframe src="https://www.youtube.com/embed/trzpTp1t_p0?si=UAhr7Mc2ag_oWLMT&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div><p>The Report/Restore feature works to provide you a report of the overall performance of your store including SEO Optimizer, Keyword Ranking and Google Analytics.</p>
          <ul>
          <li>Mention the email address on which you want to get the SEO report for your store. We use your registered email address to send reports by default. </li>
          <li>Select On/Off to enable reporting or select Off to disable the reporting option</li>
          <li>Select the frequency as Monthly or Weekly for which you want to get the report.</li>
          <li>The weekly or monthly reports are shared on the mentioned/ default email address every Monday or the 1st of every month respectively.</li>
          </ul>`,
					visible: true,
					toggleOpen: false
				},
				{
					question: 'How to restore changes done in Name, Title Tag, Meta Description, Description, and URL of website pages?',
					answer: ` <p>In the Report/Restore feature of SEOKart, you get the option to restore the changes done in Name, Title Tags, Meta Description, Description and URL for up to the past 2 updates. You also get the Table Fields to select the criteria you want to restore as well as you can download reports for the required criteria or pages.</p>`,
					visible: true,
					toggleOpen: false
				}
			]
		},
	]);



	const searchFaq = useCallback(() => {
		const categoryResults = [];
		for (const category of faqData) {
			const results = []; let isAnyFaqVisible = 0
			for (const faq of category.faqs) {
				if (faq.question.toLowerCase().includes(search.toLowerCase())) {
					isAnyFaqVisible = 1
					results.push({ ...faq, visible: true })
				} else {
					results.push({ ...faq, visible: false })
				}
			}
			if (isAnyFaqVisible) {
				categoryResults.push({ ...category, faqs: results, visible: true })
			} else {
				categoryResults.push({ ...category, faqs: results, visible: false })
			}

		}
		setFaqData(categoryResults)
	}, [search])

	useEffect(() => {
		searchFaq()
	}, [searchFaq])

	return (<>
		<div className="faqs-area">
			<div className="row">
				<div className="col-md-3">
					<div className="faqs-left">
						<div className="card">
							<div className="custom-input icon-input without-labelInput">
								<i className="input-icon"><img src="images/search-icon.svg" alt="" /></i>
								<input type="text" placeholder="Search FAQs" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} />
							</div>
						</div>

						<div className="card">
							<div className="FAQs-list">
								<ul key={1}>
									{faqData.map((item, key) => (
										<>
											<li key={key}><a href={`#${item.category.replaceAll(' ', '')}`}>{item.category}</a></li>
										</>

									))}

								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-9">
					<div className="faqs-right">
						<div className="card">
						{faqData.map((items, i) => (
							<div key={i}>
							{items.visible && (
								<>
								<h5 className={`Text--headingLg ${i === 0 ? 'mt-0' : ''}`} id={`${items.category.replaceAll(' ', '')}`}>{items.category}</h5>
								{items.faqs.map((item, j) => {
									const index = `${i}-${j}`; // unique key for each FAQ
									return (
									item.visible && (
										<div className="faqCollapse-box" key={index}>
										<Accordion activeKey={openAccordions[index] ? "0" : null}>
											<Accordion.Item eventKey="0">
											<Accordion.Header onClick={() => handleToggle(index)}>
												<div className="d-flex justify-content-between w-100 align-items-center">
												<div dangerouslySetInnerHTML={{ __html: item.question }} />
												<img
													src={openAccordions[index] ? "images/minus-accordion.svg" : "images/plus-accordion.svg"}
													alt="toggle icon"
													className="ms-2"
													style={{ width: "20px", height: "20px" }}
												/>
												</div>
											</Accordion.Header>
											<Accordion.Body>
												<div dangerouslySetInnerHTML={{ __html: item.answer }} />
											</Accordion.Body>
											</Accordion.Item>
										</Accordion>
										</div>
									)
									);
								})}
								</>
							)}
							</div>
						))}
						</div>
					</div>
					</div>
			</div>
		</div>
	</>)
}