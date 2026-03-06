import { Api } from "@/app/_api/apiCall";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";

export default function Home(Props: any) {
  const params = useParams();

  const [duplicateList, setDuplicateList] = useState([]);
  const [homeUrl, setHomeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const getItemIssueDetails = () => {
    setLoading(true);
    Api("getItemIssueDetails", {
      id: params.id,
      type: Props.type,
      item_name: Props.itemName,
      target_keyword: Props.targetKeyword,
      title_tag: Props.titleTag,
      meta_description: Props.metaDescription,
      description: Props.description,
    }).then(({ data }) => {
      setLoading(false);
      setDuplicateList(data.detailsData);
    });
  };

  useEffect(() => {
    const channelObj = JSON.parse(localStorage.getItem("channel") ?? "");
    setHomeUrl(channelObj.domain);
  }, []);

  return (
    <>
      <Modal
        show={Props.show}
        onHide={Props.onHide}
        centered={true}
        size="lg"
        onShow={getItemIssueDetails}
      >
        <Modal.Header closeButton={true}>
          <h1>Duplicate Pages</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="custom-table keywordSuggestion-table">
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Page URL</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateList.map((item: any, key: any) => (
                    <tr key={key}>
                      <td>
                        {homeUrl}
                        {item.url}
                      </td>
                      <td>{item.item_name}</td>
                      <td>
                        <button type="button" className="icon-btn">
                          <img src="images/add-icon.svg" alt="" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
