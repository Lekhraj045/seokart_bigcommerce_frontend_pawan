import { Api } from "@/app/_api/apiCall";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import Image from "next/image";
import { basePath } from "@/next.config";

export default function Home(Props: any) {
  const params = useParams();
  const router = useRouter();

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
    const channelObj = JSON.parse(localStorage?.getItem("channel") ?? "");
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
          <div className="flex flex-col">
            <h1>Duplicate Pages</h1>
            <p>{homeUrl}</p>
          </div>
        </Modal.Header>
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
                    <th>Page URL</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateList.length === 0 ? (
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
                    duplicateList.map((item: any, key: any) => (
                      <tr key={key}>
                        <td>
                          <div className="flex">
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  {homeUrl}
                                  {item.url}
                                </Tooltip>
                              }
                            >
                              <div className="truncate max-w-[300px]">
                                {item.url}
                              </div>
                            </OverlayTrigger>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-[220px] break-words">
                            {item.item_name}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => {
                              router.push(
                                `/seo-audit/${item.id || item.item_id}`,
                              );
                              Props.onHide();
                            }}
                          >
                            Optimize
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
