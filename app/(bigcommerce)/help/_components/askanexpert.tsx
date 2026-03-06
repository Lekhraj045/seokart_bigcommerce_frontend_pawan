'use client'

import { useState,useEffect } from "react"
import { Api } from "@/app/_api/apiCall"
import { toast } from "react-toastify"
import { Spinner } from "react-bootstrap"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams()
  const urlSubject = searchParams?.get('subject') || null
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [subject, setSubject] = useState('Page Speed Improvement')
  const [query, setQuery] = useState('')
  const [btnLoading,setBtnLoading] = useState(false)

  const [error, setError] = useState({ name: false, email: false, validEmail: false, website: false, query: false })

  const submitQuery = ()=>{
    setBtnLoading(true)
    Api('askAnExpert',{
      name:name,
      email:email,
      website:website,
      subject:subject,
      yourquery:query
    }).then(()=>{
      setName('')
      setEmail('')
      setWebsite('')
      setQuery('')
      setBtnLoading(false)
      toast.success('Thanks for Query. We will contact soon.')
    })
  }

  
  const getUserDetails = () => {
    Api('getStoreInfo',{}).then((json)=>{
      if (json.status_code == 200) {
        setName(json.data.owner_name)
        setEmail(json.data.email)
        setWebsite(json.data.domain)
      }
    })
  }


  useEffect(() => {
    getUserDetails()
  }, [])

  useEffect(() => {
    // Update subject if URL parameter is present
    if (urlSubject) {
      setSubject(urlSubject)
    }
  }, [urlSubject])

  return (<>
    <div className="ask-expertArea">
      <div className="row">
        <div className="col-md-4">
          <div className="ask-expertLeft">
            <h5 className="Text--headingLg">Ask An Expert</h5>
            <p>{`We would love to answer all the queries you may have, regarding SEO. Being SEOKart's loyal customer, all consultancies are free.`}</p>
          </div>
        </div>

        <div className="col-md-8">
          <div className="ask-expertRight">
            <div className="card">
              <div className="row mt-2">
                <div className="col-md-12">
                  <div className="custom-input mb-26">
                    <span>Your Name</span>
                    <input type="text" className="form-control" value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.trim() == '') {
                          setError((error) => ({ ...error, name: true }))
                        } else {
                          setError((error) => ({ ...error, name: false }))
                        }
                      }}
                    />
                    {error.name && <p className="red-text">Name is Required.</p>}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="custom-input mb-26">
                    <span>Your Email</span>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => {
                        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (e.target.value.trim() == '') {
                          setError((error) => ({ ...error, email: true }))
                        } else {
                          setError((error) => ({ ...error, email: false }))
                        }
                        if(emailPattern.test(e.target.value.trim())){
                          setError((error) => ({ ...error, validEmail: false }))
                        }else{
                          setError((error) => ({ ...error, validEmail: true }))
                        }
                      }}
                    />
                    {error.email && <p className="red-text">Email is Required.</p>}
                    {error.validEmail && <p className="red-text">Email is Invalid.</p>}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="custom-input mb-26">
                    <span>Your Website</span>
                    <input type="text" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.trim() == '') {
                          setError((error) => ({ ...error, website: true }))
                        } else {
                          setError((error) => ({ ...error, website: false }))
                        }
                      }}
                    />
                    {error.website && <p className="red-text">Website is Required.</p>}
                  </div>
                </div>

                <div className="col-md-12 mb-26">
                  <div className="custom-dropi">
                    <span>Select Subject</span>
                    <select className="form-select" aria-label="Default select example" value={subject} onChange={(e) => setSubject(e.target.value)}>
                      <option value="Page Speed Improvement">Page Speed Improvement</option>
                      <option value="SEO Consultancy">SEO Consultancy</option>
                      <option value="Managed Services">Managed Services</option>
                      <option value="Feature request/Report a bug">Feature request/Report a bug</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="custom-textarea">
                    <span className="textarea-heading">Your Query</span>
                    <textarea className="form-control" value={query} onChange={(e) => setQuery(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value.trim() == '') {
                        setError((error) => ({ ...error, query: true }))
                      } else {
                        setError((error) => ({ ...error, query: false }))
                      }
                    }}
                    ></textarea>
                    {error.query && <p className="red-text">Query is Required.</p>}
                  </div>
                </div>

                <div className="full-btn mt-22">
                  <button type="button" onClick={submitQuery} className={`custom-btn ${(name.trim() && email.trim() && website.trim() && query.trim() && !error.validEmail) ? '' : 'btn-disable'}`} disabled={(name.trim() && email.trim() && website.trim() && query.trim() && !error.validEmail) ? false :true }>{btnLoading ? <Spinner size="sm"/> : 'Submit Query'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}