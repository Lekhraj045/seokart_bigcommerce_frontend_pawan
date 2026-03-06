import { Api } from "@/app/_api/apiCall"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Modal, Spinner } from "react-bootstrap"
import { basePath } from "@/next.config"
import Image from "next/image"

export default function Home(Props: any) {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [link, setLink] = useState([])
  const [httpLink, setHttpLink] = useState([])

  const getItemIssueDetails = () => {
    setLoading(true)
    Api('getItemIssueDetails', {
      id: params.id,
      type: 'content_issues',
      item_name: Props.itemName,
      target_keyword: Props.targetKeyword,
      title_tag: Props.titleTag,
      meta_description: Props.metaDescription,
      description: Props.description,
    }).then(({ data }) => {
      setLoading(false)
      setLink(data.detailsData.broken_link)
      setHttpLink(data.detailsData.http_value)
    })
  }


  // Filter data based on linkType
  const getFilteredData = () => {
    if (Props.linkType == 'internal') {
      return link.filter((item: any) => item.type == 1)
    } else if (Props.linkType == 'external') {
      return link.filter((item: any) => item.type == 2)
    } else if (Props.linkType == 'http') {
      return httpLink
    }
    return []
  }

  const filteredData = getFilteredData()
  const hasData = filteredData.length > 0

  return (<>
    <Modal show={Props.show} onHide={Props.onHide} centered={true} size="lg" onShow={getItemIssueDetails}>
      <Modal.Header closeButton={true}><h1>Link</h1></Modal.Header>
      <Modal.Body>
        <div className="custom-table keywordSuggestion-table">
          {loading ? (
            <div className="text-center py-3">
              <Spinner size="sm" />
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Anchor Text</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {!hasData ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="d-flex flex-column align-items-center justify-content-center py-3">
                        <Image
                          src={`${basePath}/images/no-data-found.svg`}
                          width={60}
                          height={60}
                          alt=""
                        />
                        <p className="mt-2 font-bold">Data Not Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {Props.linkType == 'internal' && filteredData.map((item: any, key: any) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{item.text}</td>
                        <td>{item.link} <a href={item.link} target="_blank"><Image src={`${basePath}/images/link-icon.svg`} width={16} height={16} alt="" /></a></td>
                      </tr>
                    ))}

                    {Props.linkType == 'external' && filteredData.map((item: any, key: any) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{item.text}</td>
                        <td>{item.link} <a href={item.link} target="_blank"><Image src={`${basePath}/images/link-icon.svg`} width={16} height={16} alt="" /></a></td>
                      </tr>
                    ))}

                    {Props.linkType == 'http' && filteredData.map((item: any, key: any) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{item.text}</td>
                        <td>{item.link} <a href={item.link} target="__blank"><Image src={`${basePath}/images/link-icon.svg`} width={16} height={16} alt="" /></a></td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Modal.Body>
    </Modal >
  </>)
}