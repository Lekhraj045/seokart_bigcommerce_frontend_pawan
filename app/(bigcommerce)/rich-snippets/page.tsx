"use client"

import { useEffect, useState } from "react"
import { Tabs, Tab, Spinner, Accordion } from "react-bootstrap"
import Select from "react-select"
import RangeSlider from "rsuite/RangeSlider"
import "rsuite/RangeSlider/styles/index.css"
import { toast } from "react-toastify"
import Confirmation from "@/app/_components/confirmation"
import ChannelList from "@/app/_components/channelList"
import UpgradeButton from "@/app/_components/upgradeButton"
import PriceValidJson from "./_components/priceValid.json"
import businessTypeJson from "./_components/businessType.json"
import reviewAppJson from "./_components/reviewApp.json"
import Howitwork from '@/app/_howitwork/modal'
import { basePath } from "@/next.config"
import { Api } from "@/app/_api/apiCall"
import Image from "next/image"
import Hamburger from '../../_components/hamburger'


export default function Home() {
  const [platform, setPlatform] = useState('bigcommerce')
  const [homeUrl, setHomeUrl] = useState('')
  const [product, setProduct] = useState({ count: 0, url: [] })
  const [blog, setBlog] = useState({ count: 0, url: [] })
  const [category, setCategory] = useState({ count: 0, url: [] })
  const [brand, setBrand] = useState({ count: 0, url: [] })
  const [page, setPage] = useState({ count: 0, url: [] })

  const [homeStatus, setHomeStatus] = useState<boolean>(false)
  const [breadcrumbStatus, setBreadcrumbStatus] = useState<boolean>(false)
  const [sitelinkSearchStatus, setSitelinkSearchStatus] = useState<boolean>(false)
  const [blogPostStatus, setBlogPostStatus] = useState<boolean>(false)
  const [productStatus, setProductStatus] = useState<boolean>(false)
  const [faqStatus, setFaqStatus] = useState<boolean>(false)

  const [countryList, setCountryList] = useState<any>([])
  const [selectedCountry, setSelectedCountry] = useState<any>('US')

  const [reviewApp, setReviewApp] = useState('bigcommerce')
  const [brandName, setBrandName] = useState('')
  const [priceValid, setPriceValid] = useState({ value: 1, duration: 'day' })

  const [businessType, setBusinessType] = useState<any>("Organization")
  const [homeLogo, setHomeLogo] = useState('')
  const [storeName, setStoreName] = useState('')
  const [singleImageUrl, setSingleImageUrl] = useState('')
  const [multiImageUrl, setMultiImageUrl] = useState<any>({})
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState('')
  const [businessFaxNumber, setBusinessFaxNumber] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [storeAddress2, setStoreAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [snapchatUrl, setSnapchatUrl] = useState('')
  const [pinterestUrl, setPinterestUrl] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [currency, setCurrency] = useState('')

  const [faqUrl, setFaqUrl] = useState('')
  const [faqs, setFaqs] = useState<any>({})

  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)

  const [confProductModal, setConfProductModal] = useState(false)
  const [confHomeModal, setConfHomeModal] = useState(false)
  const [confBreadcrumbModal, setConfBreadcrumbModal] = useState(false)
  const [confSitelinkModal, setConfSitelinkModal] = useState(false)
  const [confBlogpostModal, setConfBlogpostModal] = useState(false)
  const [confFaqModal, setConfFaqModal] = useState(false)

  const alertAddMsg = `Are you sure you want to install the rich snippets' code?`
  const alertRemoveMsg = `Are you sure you want to remove the rich snippets' code?`




  const getRichSnippetsStatus = () => {
    Api('getRichSnippetsStatus').then(({ data }) => {
      getSnippetsAllData()
      setHomeStatus(data.status.home_status === 'true' ? true : false)
      setBreadcrumbStatus(data.status.breadcrumb_status === 'true' ? true : false)
      setSitelinkSearchStatus(data.status.sitelink_search_status === 'true' ? true : false)
      setBlogPostStatus(data.status.blog_post_status === 'true' ? true : false)
      setProductStatus(data.status.product_status === 'true' ? true : false)
      setFaqStatus(data.status.faq_status === 'true' ? true : false)
      setCurrency(data.storeInfo.currency_symbol)
    })
  }

  const getItemCountNdUrl = () => {
    Api('getItemCountNdUrl').then(({ data }) => {
      setProduct({ count: data.product?.count ?? 0, url: data.product?.urls ?? [] })
      setCategory({ count: data.category?.count ?? 0, url: data.category?.urls ?? [] })
      setBlog({ count: data.blog?.count ?? 0, url: data.blog?.urls ?? [] })
      setBrand({ count: data.brand?.count ?? 0, url: data.brand?.urls ?? [] })
      setPage({ count: data.page?.count ?? 0, url: data.page?.urls ?? [] })
    })
  }

  const updateAllData = (type: any = '') => {
    setUpdateLoading(true)
    const productObj = {
      product_review: reviewApp,
      product_brand_name: brandName,
      pvu_days: priceValid.value,
      pvu_duration: priceValid.duration
    }

    const homeObj = {
      home_logo: homeLogo,
      home_business_name: storeName,
      home_business_type: businessType,
      home_image: { sngl_img: singleImageUrl, mltpl_img: Object.values(multiImageUrl) },
      home_business_phone: businessPhoneNumber,
      home_business_fax: businessFaxNumber,
      home_business_email: businessEmail,
      home_business_address: storeAddress,
      home_business_address2: storeAddress2,
      home_business_city: city,
      home_business_state: state,
      home_business_zip: zipCode,
      home_business_country: selectedCountry,
      home_business_facebook: facebookUrl,
      home_business_twitter: twitterUrl,
      home_business_instagram: instagramUrl,
      home_business_youtube: youtubeUrl,
      home_business_linkedin: linkedinUrl,
      home_business_snapchat: snapchatUrl,
      home_business_pinterest: pinterestUrl,
      home_price_start: priceRange.min,
      home_price_end: priceRange.max

    }

    Api('addRichSnnipetsScriptData', {
      product_data: JSON.stringify(productObj),
      product_status: (type == 'product') ? String(!productStatus) : String(productStatus),
      faq_data: JSON.stringify({ faq_url: faqUrl, all_data: Object.values(faqs) }),
      faq_status: (type == 'faq') ? String(!faqStatus) : String(faqStatus),
      home_data: JSON.stringify(homeObj),
      home_status: (type == 'home') ? String(!homeStatus) : String(homeStatus),
      blog_post_status: (type == 'blogPost') ? String(!blogPostStatus) : String(blogPostStatus),
      breadcrumb_status: (type == 'breadCrumb') ? String(!breadcrumbStatus) : String(breadcrumbStatus),
      sitelink_search_status: (type == 'sitelink') ? String(!sitelinkSearchStatus) : String(sitelinkSearchStatus)
    }).then((data) => {
      setUpdateLoading(false)
    })


  }



  const getSnippetsAllData = () => {
    Api('getSnippetsAllData').then(({ data }) => {
      setLoading(false)

      const product = JSON.parse(data.product)
      const homePage = JSON.parse(data.home_page)
      const faq = JSON.parse(data.faq)

      Api('getCountry').then(({ data }) => {
        setCountryList(data.map((item: any) => ({ label: item.location_name, value: item.country_iso_code })))
        setSelectedCountry(homePage.home_business_country)
      })


      setReviewApp(product.product_review)
      setBrandName(product.product_brand_name)
      setPriceValid({ value: product.pvu_days, duration: product.pvu_duration })

      setHomeLogo(homePage.home_logo ?? '')
      setStoreName(homePage.home_business_name ?? '')
      setBusinessType(homePage.home_business_type)
      setSingleImageUrl(homePage.home_image.sngl_img ?? '')
      setMultiImageUrl({ ...homePage.home_image.mltpl_img })
      setBusinessPhoneNumber(homePage.home_business_phone ?? '')
      setBusinessFaxNumber(homePage.home_business_fax ?? '')
      setBusinessEmail(homePage.home_business_email ?? '')
      setStoreAddress(homePage.home_business_address ?? '')
      setStoreAddress2(homePage.home_business_address2 ?? '')
      setCity(homePage.home_business_city ?? '')
      setState(homePage.home_business_state ?? '')
      setZipCode(homePage.home_business_zip ?? '')
      setFacebookUrl(homePage.home_business_facebook ?? '')
      setTwitterUrl(homePage.home_business_twitter ?? '')
      setInstagramUrl(homePage.home_business_instagram ?? '')
      setYoutubeUrl(homePage.home_business_youtube ?? '')
      setLinkedinUrl(homePage.home_business_linkedin ?? '')
      setSnapchatUrl(homePage.home_business_snapchat ?? '')
      setPinterestUrl(homePage.home_business_pinterest ?? '')
      setPriceRange({ min: Number(homePage.home_price_start), max: Number(homePage.home_price_end) })

      setFaqUrl(faq?.faq_url ?? '')
      setFaqs(faq?.all_data ?? {})


    })
  }

  useEffect(() => {
    const channelObj = JSON.parse(localStorage.getItem('channel') ?? '')
    setHomeUrl(channelObj.domain)
    setPlatform(channelObj.platform)
    getItemCountNdUrl()
    getRichSnippetsStatus()

  }, [])


  return (<>

    <Confirmation
      message={productStatus ? alertRemoveMsg : alertAddMsg}
      show={confProductModal}
      handleNo={() => setConfProductModal(false)}
      handleYes={() => {
        setConfProductModal(false)
        setProductStatus((productStatus) => !productStatus)
        updateAllData('product')
        toast.success("Information updated.")
      }} />

    <Confirmation
      message={homeStatus ? alertRemoveMsg : alertAddMsg}
      show={confHomeModal}
      handleNo={() => setConfHomeModal(false)}
      handleYes={() => {
        setConfHomeModal(false)
        updateAllData('home')
        if (localStorage.getItem('manage_service') == '1') {
          setHomeStatus((homeStatus) => !homeStatus)
          toast.success("Information updated.")
        } else {
          setHomeStatus(false)
          toast.error("Please Upgrade Your Account.")
        }

      }} />

    <Confirmation
      message={breadcrumbStatus ? alertRemoveMsg : alertAddMsg}
      show={confBreadcrumbModal}
      handleNo={() => setConfBreadcrumbModal(false)}
      handleYes={() => {
        setConfBreadcrumbModal(false)
        updateAllData('breadCrumb')
        if (localStorage.getItem('manage_service') == '1') {
          setBreadcrumbStatus((breadcrumbStatus) => !breadcrumbStatus)
          toast.success("Information updated.")
        } else {
          setBreadcrumbStatus(false)
          toast.error("Please Upgrade Your Account.")
        }

      }} />

    <Confirmation
      message={sitelinkSearchStatus ? alertRemoveMsg : alertAddMsg}
      show={confSitelinkModal}
      handleNo={() => setConfSitelinkModal(false)}
      handleYes={() => {
        setConfSitelinkModal(false)
        updateAllData('siteLink')
        if (localStorage.getItem('manage_service') == '1') {
          setSitelinkSearchStatus((sitelinkSearchStatus) => !sitelinkSearchStatus)
          toast.success("Information updated.")
        } else {
          setSitelinkSearchStatus(false)
          toast.error("Please Upgrade Your Account.")
        }

      }} />

    <Confirmation
      message={blogPostStatus ? alertRemoveMsg : alertAddMsg}
      show={confBlogpostModal}
      handleNo={() => setConfBlogpostModal(false)}
      handleYes={() => {
        setConfBlogpostModal(false)
        updateAllData('blogPost')
        if (localStorage.getItem('manage_service') == '1') {
          setBlogPostStatus((blogPostStatus) => !blogPostStatus)
          toast.success("Information updated.")
        } else {
          setBlogPostStatus(false)
          toast.error("Please Upgrade Your Account.")
        }

      }} />

    <Confirmation
      message={faqStatus ? alertRemoveMsg : alertAddMsg}
      show={confFaqModal}
      handleNo={() => setConfFaqModal(false)}
      handleYes={() => {
        setConfFaqModal(false)
        updateAllData('faq')
        if (localStorage.getItem('manage_service') == '1') {
          setFaqStatus((faqStatus) => !faqStatus)
          
        } else {
          setFaqStatus(false)
          toast.error("Please Upgrade Your Account.")
        }

      }} />

    <div className="content-frame-main">
      <div className="content-frame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left flex align-item-center gap-2">
          <h1 className="Text--headingLg flex align-item-center gap-2 mb-0">
            Rich Snippets
            <Howitwork page='richsnippet' />
          </h1>
          <ChannelList />
        </div>
        <div className="content-frameHead-right">
          <UpgradeButton />
          <Hamburger />
        </div>
      </div>
      {platform == 'bigcommerce' ?
        <div className="richSnippets-Area">
          <Accordion defaultActiveKey={['0', '1']}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Console</Accordion.Header>
              <Accordion.Body>
                <div className="richSnippets-consoleArea">
                  {loading ? <div className="text-center"><Spinner variant="" /></div> :

                    <Tabs
                      defaultActiveKey="home"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="home" title={<>Home Page <div className={`badge badge-${homeStatus ? 'success' : 'danger'}`}>{homeStatus ? 1 : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {homeStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>The code is successfully installed on your home page. To check if the code is working fine, please click on below sample link:</p>
                                <ul>
                                  <li><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}`} target="_blank">{homeUrl}</a></p></li>
                                </ul>
                                <p>If you find any issues, you can turn the code OFF and inform our support team via chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Home Page/Categories/Pages section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <ul>
                                  <li><p>Local Business Snippet (Business Name, Website, Description, Address, Contact Details, Social Media Profiles, Price Range)</p></li>
                                  <li><p>Logo Snippet</p></li>
                                  <li><p>SiteLinks Search Snippet on Home Page</p></li>
                                  <li><p>Breadcrumbs Snippet on the Whole Website</p></li>
                                  <li><p>Article Snippet on All the Blog Posts</p></li>
                                </ul>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Product" title={<>Products <div className={`badge badge-${productStatus ? 'success' : 'danger'}`}>{productStatus ? product.count : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {productStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>{`The code is successfully installed on your products' pages. To check if the code is working fine, please click on below sample links:`}</p>
                                <ul>
                                  {product.url.map((item, key) => (
                                    <li key={key}><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}${item}`} target="_blank">{homeUrl}{item}</a></p></li>
                                  ))}
                                </ul>
                                <p>If you find any issues, you can put the code OFF and inform our support team via Chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Products section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <ul>
                                  <li><p>Product Name & Description</p></li>
                                  <li><p>Product Featured Image</p></li>
                                  <li><p>Brand</p></li>
                                  <li><p>Availability, Price</p></li>
                                  <li><p>Aggregate Rating</p></li>
                                  <li><p>Total Ratings Count</p></li>
                                </ul>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Blog" title={<>Blog Post <div className={`badge badge-${blogPostStatus ? 'success' : 'danger'}`}>{blogPostStatus ? blog.count : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {blogPostStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>The code is successfully installed on your Blog Posts. To check if the code is working fine, please click on below sample links:</p>
                                <ul>
                                  {blog.url.map((item, key) => (
                                    <li key={key}><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}${item}`} target="_blank">{homeUrl}{item}</a></p></li>
                                  ))}
                                </ul>
                                <p>If you find any issues, you can put the code OFF and inform our support team via Chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Home Page/Categories/Others section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <p>Article Snippet on All the Blog Posts</p>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Category" title={<>Categories <div className={`badge badge-${breadcrumbStatus ? 'success' : 'danger'}`}>{breadcrumbStatus ? category.count : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {breadcrumbStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>The code is successfully installed on your Categories . To check if the code is working fine, please click on below sample links:</p>
                                <ul>
                                  {category.url.map((item, key) => (
                                    <li key={key}><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}${item}`} target="_blank">{homeUrl}{item}</a></p></li>
                                  ))}
                                </ul>
                                <p>If you find any issues, you can put the code OFF and inform our support team via Chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Home Page/Categories/Others section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <p>Breadcrumbs Snippet on the Whole Website</p>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Brand" title={<>Brand <div className={`badge badge-${breadcrumbStatus ? 'success' : 'danger'}`}>{breadcrumbStatus ? brand.count : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {breadcrumbStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>The code is successfully installed on your Collections. To check if the code is working fine, please click on below sample links:</p>
                                <ul>
                                  {brand.url.map((item, key) => (
                                    <li key={key}><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}${item}`} target="_blank">{homeUrl}{item}</a></p></li>
                                  ))}
                                </ul>
                                <p>If you find any issues, you can put the code OFF and inform our support team via Chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Home Page/Categories/Others section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <p>Breadcrumbs Snippet on the Whole Website</p>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Page" title={<>Pages <div className={`badge badge-${breadcrumbStatus ? 'success' : 'danger'}`}>{breadcrumbStatus ? page.count : 0}</div></>}>
                        <div className="consoleArea-tabDetails">
                          <div className="consoleTab-box">
                            {breadcrumbStatus ?
                              <>
                                <h4 className="green-text">Rich Snippet code is successfully installed!</h4>
                                <p>The code is successfully installed on your Collections. To check if the code is working fine, please click on below sample links:</p>
                                <ul>
                                  {page.url.map((item, key) => (
                                    <li key={key}><p><a href={`https://search.google.com/test/rich-results?url=${homeUrl}${item}`} target="_blank">{homeUrl}{item}</a></p></li>
                                  ))}
                                </ul>
                                <p>If you find any issues, you can put the code OFF and inform our support team via Chat.</p>
                              </>
                              :
                              <>
                                <h4 className="red-text">Rich Snippet code is not installed!</h4>
                                <p>To install it, please scroll below to the Home Page/Categories/Others section, and put it ON. Once ON, the SEOKart app will place the code on your website for the below rich snippets:</p>
                                <p>Breadcrumbs Snippet on the Whole Website</p>
                                <p>You can also scroll below to FAQ section and put FAQ snippet on FAQ or any other Page.</p>
                                <p className="red-text">Please note that once you place our code, it will disable any similar codes placed by other Apps.</p>
                              </>
                            }
                          </div>
                        </div>
                      </Tab>

                    </Tabs>}
                </div>
              </Accordion.Body>
            </Accordion.Item >
            <Accordion.Item eventKey="1">
              <Accordion.Header> Products</Accordion.Header>

              <div className="vc-toggle-container">
                <label className="vc-small-switch">
                  <input type="checkbox" className="vc-switch-input" checked={productStatus} onChange={() => {
                    setConfProductModal(true)
                  }} />
                  <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                  <span className="vc-switch-handle"></span>
                </label>
              </div>

              <Accordion.Body>
                {loading ? <div className="text-center"><Spinner variant="" /></div> :
                  <div className="richSnippets-productArea">
                    <div className="richSnippets-productBox">
                      <div className="richSnippets-productLeft">
                        <h3>Source Of Review</h3>
                        <p>Please select the app your store is using to get customer reviews.</p>
                      </div>

                      <div className="richSnippets-productRight">
                        <div className="autoSearch-dropi snippets-businessBox">
                          <span className="autoSearch-dropiHeadig">Product Review App</span>
                          <Select
                            value={reviewAppJson.data.find((item: any) => (item.value == reviewApp))}
                            onChange={(selectedValue: any) => setReviewApp(selectedValue.value)}
                            options={reviewAppJson.data}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="richSnippets-productBox">
                      <div className="richSnippets-productLeft">
                        <h3>Default Brand Name</h3>
                        <p>Enter the Brand Name you want the app to use when no Brand Name is available for a product.</p>
                      </div>

                      <div className="richSnippets-productRight">
                        <div className="custom-input big-input snippets-businessBox">
                          <span>Brand Name</span>
                          <input type="text" className="form-control" value={brandName} onChange={((event) => {
                            setBrandName(event.target.value)
                          })} />
                        </div>
                      </div>
                    </div>

                    <div className="richSnippets-productBox">
                      <div className="richSnippets-productLeft">
                        <h3>Price Valid Until</h3>
                        <p>Please select a default value to tell Google how long your product prices are valid. By default, we have set it to 3 months.</p>
                      </div>

                      <div className="richSnippets-productRight price-valid-until">

                        <div className="headChannel-dropi custom-dropi big-dropi snippets-businessBox">
                          <div className="autoSearch-dropi snippets-businessBox">
                            <span className="autoSearch-dropiHeadig">Select Number</span>
                            <Select
                              value={PriceValidJson.data.find((item: any) => (item.value == priceValid.value))}
                              onChange={(selectedValue: any) => setPriceValid((oldValue) => ({ ...oldValue, value: selectedValue.value }))}
                              options={PriceValidJson.data}
                            />
                          </div>
                        </div>

                        <div className="headChannel-dropi custom-dropi big-dropi snippets-businessBox">
                          <div className="autoSearch-dropi snippets-businessBox">
                            <span className="autoSearch-dropiHeadig">Select Duration</span>
                            <Select
                              value={PriceValidJson.data1.find((item: any) => (item.value == priceValid.duration))}
                              onChange={(selectedValue: any) => setPriceValid((oldValue) => ({ ...oldValue, duration: selectedValue.value }))}
                              options={PriceValidJson.data1}
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="text-align-right">
                      <button type="button" onClick={()=>{
                        toast.success("Information updated.")
                        updateAllData()
                      }} className="custom-btn" disabled={updateLoading}>{updateLoading ? <Spinner size="sm" /> : 'Update'}</button>
                    </div>
                  </div>}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header> Home Page

              </Accordion.Header>
              <div className="vc-toggle-container">
                <label className="vc-small-switch">
                  <input type="checkbox" className="vc-switch-input" checked={homeStatus} onChange={() => {
                    setConfHomeModal(true)
                  }} />
                  <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                  <span className="vc-switch-handle"></span>
                </label>
              </div>
              <Accordion.Body>
                <div className="richSnippets-productArea">
                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>Logo</h3>
                      <p>{`Please enter the URL of your website's logo.`}</p>
                    </div>

                    <div className="richSnippets-productRight">
                      <div className="custom-input big-input snippets-businessBox">
                        <span>Logo</span>
                        <input type="text" placeholder="Logo URL" className="form-control" value={homeLogo} onChange={((event) => {
                          setHomeLogo(event.target.value)
                        })} />
                      </div>
                    </div>
                  </div>

                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>Store Name</h3>
                      <p>{`Please enter your store's name as known by your customers.`}</p>
                    </div>

                    <div className="richSnippets-productRight">
                      <div className="custom-input big-input snippets-businessBox">
                        <span>Store Name</span>
                        <input type="text" placeholder="Business Name" className="form-control" value={storeName} onChange={((event) => {
                          setStoreName(event.target.value)
                        })} />

                      </div>
                    </div>
                  </div>

                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>Business Type</h3>
                      <p>{`Please select the category of your store. The default category is Organization, which works fine with Google.`}</p>
                      <p>{`However, if you choose another specific category, you may need to add mandatory images' URLs.`}</p>





                    </div>

                    <div className="richSnippets-productRight snippets-businessType">
                      <div className="autoSearch-dropi snippets-businessBox">
                        <span className="autoSearch-dropiHeadig">Business Type</span>
                        <Select
                          value={businessTypeJson.business.find((item: any) => (item.value == businessType))}
                          onChange={(selectedValue: any) => setBusinessType(selectedValue.value)}
                          options={businessTypeJson.business}
                        />
                      </div>


                      <div className="custom-input big-input snippets-businessBox">
                        <span>Enter Image URL</span>
                        <input type="text" placeholder="Enter Image URL" className="form-control" value={singleImageUrl} onChange={((event) => {
                          setSingleImageUrl(event.target.value)
                        })} />
                      </div>

                      {Object.keys(multiImageUrl).map((key: any) => (
                        <div className="custom-input big-input snippets-businessBox snippets-addImage-box" key={key}>
                          <span>Enter Image URL</span>
                          <input type="text" className="form-control" value={multiImageUrl[key].img_url} onChange={((event) => {
                            setMultiImageUrl((multiImageUrl: any) => ({ ...multiImageUrl, [key]: { img_url: event.target.value } }))
                          })} />
                          <button type="button" className="snippets-imageClose" onClick={() => {
                            setMultiImageUrl((multiImageUrl: any) => {
                              const updatedImageUrl = { ...multiImageUrl }
                              delete updatedImageUrl[key]
                              return updatedImageUrl
                            })
                          }}>
                            <Image src={`${basePath}/images/delete-icon.svg`} width={20} height={20} alt="" />
                          </button>
                        </div>
                      ))}


                      <div className="text-align-left">
                        <button className="custom-btn" onClick={() => {
                          setMultiImageUrl((multiImageUrl: any) => ({ ...multiImageUrl, [Object.keys(multiImageUrl).length + 1]: { 'img_url': '' } }))
                        }}>Add Image URL</button>
                      </div>
                    </div>
                  </div>

                  <div className="richSnippets-productBox richSnippets-contactDetails">
                    <div className="richSnippets-productLeft">
                      <h3>Address & Contact Details</h3>
                      <p>{`Please provide your store's contact details and address.`}</p>
                    </div>

                    <div className="richSnippets-productRight snippets-businessType">
                      <div className="row snippetsAddress-box">
                        <div className="col-md-6 col-sm-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Business Phone Number</span>
                            <input type="text" placeholder="Business Phone Number" className="form-control" value={businessPhoneNumber} onChange={((event) => {
                              setBusinessPhoneNumber(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Business Fax Number</span>
                            <input type="text" placeholder="Business Fax Number" className="form-control" value={businessFaxNumber} onChange={((event) => {
                              setBusinessFaxNumber(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Business Email</span>
                            <input type="text" placeholder="Business Email" className="form-control" value={businessEmail} onChange={((event) => {
                              setBusinessEmail(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Store Address</span>
                            <input type="text" placeholder="Strees Address" className="form-control" value={storeAddress} onChange={((event) => {
                              setStoreAddress(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Store Address 2 (OPTIONAL)</span>
                            <input type="text" placeholder="Strees Address" className="form-control" value={storeAddress2} onChange={((event) => {
                              setStoreAddress2(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>City</span>
                            <input type="text" placeholder="City" className="form-control" value={city} onChange={((event) => {
                              setCity(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>State/Province</span>
                            <input type="text" placeholder="State/Provence" className="form-control" value={state} onChange={((event) => {
                              setState(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Zip/Postal Code</span>
                            <input type="text" placeholder="Zip/Postel Code" className="form-control" value={zipCode} onChange={((event) => {
                              setZipCode(event.target.value)
                            })} />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="autoSearch-dropi snippets-businessBox mb-18">
                            <span className="autoSearch-dropiHeadig">Country</span>
                            <Select
                              value={countryList.find((item: any) => item.value == selectedCountry)}
                              onChange={(selectedValue: any) => setSelectedCountry(selectedValue.value)}
                              options={countryList}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>Social Media Profiles</h3>
                      <p>{`Please enter the social media profiles' URLs.`}</p>
                    </div>

                    <div className="richSnippets-productRight snippets-businessType">
                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>Facebook URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/facebook-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Facebook Username" className="form-control" value={facebookUrl} onChange={((event) => {
                          setFacebookUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>X (Formerly Twitter) URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/twitter-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Twitter Username" className="form-control" value={twitterUrl} onChange={((event) => {
                          setTwitterUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>Instagram URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/instagram-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Instagram Username" className="form-control" value={instagramUrl} onChange={((event) => {
                          setInstagramUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>YouTube URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/youtube-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Youtube Username" className="form-control" value={youtubeUrl} onChange={((event) => {
                          setYoutubeUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>LinkedIn URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/linkedin-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Linkedin Username" className="form-control" value={linkedinUrl} onChange={((event) => {
                          setLinkedinUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>Snapchat URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/snapchat-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Richsnippet Username" className="form-control" value={snapchatUrl} onChange={((event) => {
                          setSnapchatUrl(event.target.value)
                        })} />
                      </div>

                      <div className="custom-input big-input icon-input snippets-businessBox">
                        <span>Pinterest URL</span>
                        <i className="input-icon"><Image src={`${basePath}/images/pinterest-icon.svg`} width={14} height={14} alt="" /></i>
                        <input type="text" placeholder="Enter Pinterest Username" className="form-control" value={pinterestUrl} onChange={((event) => {
                          setPinterestUrl(event.target.value)
                        })} />
                      </div>
                    </div>
                  </div>

                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>Price Range</h3>
                      <p>Please select the price range of the products you sell in your store.</p>
                    </div>

                    <div className="richSnippets-productRight snippetsRange-area">
                      <p>Price Range for Your Store</p>
                      <div className="snippetsMinMax-area">
                        <div className="scippets-rangeMin">Min: {currency}{priceRange.min.toLocaleString()}</div>
                        <div className="scippets-rangeMax">Max: {currency}{priceRange.max.toLocaleString()}</div>
                      </div>
                      <RangeSlider
                        value={[priceRange.min, priceRange.max]}
                        min={0}
                        max={10000}
                        onChange={(data: any) => {
                          setPriceRange({ min: data[0], max: data[1] })
                        }}
                        tooltip={true}
                      />


                    </div>
                  </div>

                  <div className="richSnippets-productBox snippets-fullBox">
                    <div className="richSnippets-productLeft">
                      <h3>
                        Breadcrumbs
                        <div className="vc-toggle-container">
                          <label className="vc-small-switch">
                            <input type="checkbox" className="vc-switch-input" checked={breadcrumbStatus} onChange={() => {
                              setConfBreadcrumbModal(true)
                            }} />
                            <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                            <span className="vc-switch-handle"></span>
                          </label>
                        </div>
                      </h3>
                      <p>{`This will add a Breadcrumb snippet on listing of all the pages of your store on Google. A Breadcrumb trail on a page indicates the page's position in the store hierarchy, and it may help users understand and explore a store effectively.`}</p>
                    </div>
                  </div>

                  {/* <div className="richSnippets-productBox snippets-fullBox">
                    <div className="richSnippets-productLeft">
                      <h3>
                        Sitelinks Search
                        <div className="vc-toggle-container">
                          <label className="vc-small-switch">
                            <input type="checkbox" className="vc-switch-input" checked={sitelinkSearchStatus} onChange={() => {
                              setConfSitelinkModal(true)
                            }} />
                            <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                            <span className="vc-switch-handle"></span>
                          </label>
                        </div>
                      </h3>
                      <p>This will add a search box snippet on the home page listing on Google. A Sitelinks search box is a quick way for people to search your store or app immediately on the search results page.</p>
                    </div>
                  </div> */}

                  <div className="richSnippets-productBox snippets-fullBox">
                    <div className="richSnippets-productLeft">
                      <h3>
                        Blog Posts
                        <div className="vc-toggle-container">
                          <label className="vc-small-switch">
                            <input type="checkbox" className="vc-switch-input" checked={blogPostStatus} onChange={() => {
                              setConfBlogpostModal(true)
                            }} />
                            <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                            <span className="vc-switch-handle"></span>
                          </label>
                        </div>
                      </h3>
                      <p>This will add an Article snippet to the listing of all the blog posts on your website on Google. It can enhance the appearance of your blog posts in Google Search results.</p>
                    </div>
                  </div>

                  <div className="text-align-right tab-textLeft">
                    <button type="button" className="custom-btn" onClick={()=>{
                      toast.success("Information updated.")
                      updateAllData()
                    }} disabled={updateLoading}>{updateLoading ? <Spinner size="sm" /> : 'Update'}</button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header> FAQs Page


              </Accordion.Header>
              <div className="vc-toggle-container">
                <label className="vc-small-switch">
                  <input type="checkbox" className="vc-switch-input" checked={faqStatus} onChange={() => {
                    if (faqUrl.trim() == '') {
                      toast.error('Please enter the URL of the page where you want to install the FAQ Snippet.')
                      return false
                    }
                    setConfFaqModal(true)
                  }} />
                  <span className="vc-switch-label" data-on="ON" data-off="OFF"></span>
                  <span className="vc-switch-handle"></span>
                </label>
              </div>
              <Accordion.Body>
                <div className="richSnippets-productArea">
                  <div className="richSnippets-productBox">
                    <div className="richSnippets-productLeft">
                      <h3>FAQs SNIPPET</h3>
                      <p>{`Please provide the URL of the page on your store where you want to use the FAQs snippet. It's best to use this on your actual FAQs page. Google may display the FAQs snippet alongside the listing of that page.`}</p>
                    </div>

                    <div className="richSnippets-productRight">
                      <div className="custom-input big-input snippets-businessBox">
                        <span>Enter URL</span>
                        <input type="text" placeholder="Enter URL" className="form-control" value={faqUrl} onChange={((event) => {
                          setFaqUrl(event.target.value)
                        })} />
                      </div>


                      {Object.keys(faqs).map((key) => (
                        <div className="snippetsAdd-faqBox" key={key}>
                          <button type="button" className="snippetsFaq-closeBtn" onClick={() => {
                            setFaqs((faqs: any) => {
                              const updatedFaqs = { ...faqs }
                              delete updatedFaqs[key]
                              return updatedFaqs
                            })
                          }}><Image src={`${basePath}/images/close-icon.svg`} width={20} height={20} alt="" /></button>
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Enter Question</span>
                            <input type="text" placeholder="Enter Question" className="form-control" value={faqs[key].faq_question} onChange={((event) => {
                              setFaqs((faqs: any) => ({ ...faqs, [key]: { ...faqs[key], faq_question: event.target.value } }))
                            })} />
                          </div>
                          <div className="custom-input big-input snippets-businessBox">
                            <span>Enter Answer</span>
                            <input type="text" placeholder="Enter Answer" className="form-control" value={faqs[key].faq_answer} onChange={((event) => {
                              setFaqs((faqs: any) => ({ ...faqs, [key]: { ...faqs[key], faq_answer: event.target.value } }))
                            })} />
                          </div>
                        </div>

                      ))}


                      <div className="text-align-left">
                        <button type="button" className="custom-btn mb-22" onClick={() => {
                          setFaqs((faqs: any) => ({ ...faqs, [Object.keys(faqs).length + 1]: { 'faq_question': '', 'faq_answer': '' } }))
                        }}>Add FAQ</button>
                      </div>
                    </div>
                  </div>

                  <div className="text-align-right tab-textLeft">
                    <button type="button" className="custom-btn" onClick={()=>{
                      toast.success("Information updated.")
                      updateAllData()
                    }} disabled={updateLoading}>{updateLoading ? <Spinner size="sm" /> : 'Update'}</button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion >

        </div>
        :
        <>
          <div className="richSnippets-Area">
            <div className="richSnippets-consoleArea">
              <h3>This feature will work on stencil themes only.</h3>
            </div>
          </div>

        </>

      }

    </div>

  </>

  )
}
