import { Chart } from "react-google-charts";
import { useRef, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";

export default function Home({
  item,
  show,
  onHide,
}: {
  item: any;
  show: any;
  onHide: any;
}) {
  let best_position = item.all_array["0"].rank_group;
  let worst_position = item.all_array["0"].rank_group;

  let best_date = item.date1["0"];
  let worst_date = item.date1["0"];

  const bestWorstPosition = () => {
    item.all_array.forEach((element: any, index: any) => {
      if (best_position > element.rank_group) {
        best_position = element.rank_group;
        best_date = item.date1[index];
      }

      if (worst_position < element.rank_group) {
        worst_position = element.rank_group;
        worst_date = item.date1[index];
      }
    });
  };

  useEffect(() => {
    bestWorstPosition();
  }, [item]);

  const result = item.date.map(function (date: any, index: any) {
    return [date, item.position[index]];
  });
  const data = [["Date", "Rank"], ...result.reverse()];

  const options = {
    hAxis: { title: "Date", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 1, maxValue: 100, direction: -1 },
  };
  return (
    <>
      <Modal show={show} onHide={onHide} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="keyword-detailsModal">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                {item.position[1] && (
                  <>
                    <div className="custom-table mb-22">
                      <table className="table">
                        <thead>
                          <tr>
                            <th colSpan={3} className="text-align-left">
                              Comparison to{" "}
                              {format(new Date(item.date1[1]), "dd MMM yyyy")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Current Ranking:</td>
                            <td>{item.position[0]}</td>
                            <td>
                              {format(new Date(item.date1[0]), "dd MMM yyyy")}
                            </td>
                          </tr>

                          <tr>
                            <td>Comparison:</td>
                            <td>{item.position[1]}</td>
                            <td>
                              {format(new Date(item.date1[1]), "dd MMM yyyy")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="custom-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th colSpan={3} className="text-align-left">
                          Extremes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Best Position:</td>
                        <td>{best_position}</td>
                        <td>{format(new Date(best_date), "dd MMM yyyy")}</td>
                      </tr>

                      <tr>
                        <td>Worst Position:</td>
                        <td>{worst_position}</td>
                        <td>{format(new Date(worst_date), "dd MMM yyyy")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="keywordDetails-modal-chart">
                  {item.position.length > 1 ? (
                    <Chart
                      chartType="AreaChart"
                      data={data}
                      options={options}
                      height="300px"
                    />
                  ) : (
                    <p>No Historic Data Available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="keyword-snippets">
              <div className="custom-table addedKeyword-table noDataTable">
                <p className="keyword-rankSnippet-heading">
                  Your Website ranking and your competitors websites ranking on
                  Google for this keyword
                </p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th className="text-align-left">
                        Ranked page and snippet
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.all_array[0].rank_group != 100 && (
                      <tr>
                        <td>
                          <span className="badge badge-success">
                            {item.all_array[0].rank_group}
                          </span>
                        </td>
                        <td className="text-align-left">
                          <div className="keyword-rankSnippet">
                            <p className="keyword-rankSnippetTitle">
                              {item.all_array[0].title}
                            </p>
                            <p className="keyword-rankSnippetLink">
                              <a href={item.all_array[0].url} target="_blank">
                                {item.all_array[0].url}
                              </a>
                            </p>
                            <p className="keyword-rankSnippetInfo">
                              {item.all_array[0].description}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {item.is_cmpt1 == 1 &&
                      item.cmp1_all[0].rank_group != 100 && (
                        <tr>
                          <td>
                            <span className="badge badge-danger">
                              {item.cmp1_all[0].rank_group}
                            </span>
                          </td>
                          <td className="text-align-left">
                            <div className="keyword-rankSnippet">
                              <p className="keyword-rankSnippetTitle">
                                {item.cmp1_all[0].title}
                              </p>
                              <p className="keyword-rankSnippetLink">
                                <a href={item.cmp1_all[0].url} target="_blank">
                                  {item.cmp1_all[0].url}
                                </a>
                              </p>
                              <p className="keyword-rankSnippetInfo">
                                {item.cmp1_all[0].description}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}

                    {item.is_cmpt2 == 1 &&
                      item.cmp2_all[0].rank_group != 100 && (
                        <tr>
                          <td>
                            <span className="badge badge-danger">
                              {item.cmp2_all[0].rank_group}
                            </span>
                          </td>
                          <td className="text-align-left">
                            <div className="keyword-rankSnippet">
                              <p className="keyword-rankSnippetTitle">
                                {item.cmp2_all[0].title}
                              </p>
                              <p className="keyword-rankSnippetLink">
                                <a href={item.cmp2_all[0].url} target="_blank">
                                  {item.cmp2_all[0].url}
                                </a>
                              </p>
                              <p className="keyword-rankSnippetInfo">
                                {item.cmp2_all[0].description}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}

                    {item.is_cmpt3 == 1 &&
                      item.cmp3_all[0].rank_group != 100 && (
                        <tr>
                          <td>
                            <span className="badge badge-danger">
                              {item.cmp3_all[0].rank_group}
                            </span>
                          </td>
                          <td className="text-align-left">
                            <div className="keyword-rankSnippet">
                              <p className="keyword-rankSnippetTitle">
                                {item.cmp3_all[0].title}
                              </p>
                              <p className="keyword-rankSnippetLink">
                                <a href={item.cmp3_all[0].url} target="_blank">
                                  {item.cmp3_all[0].url}
                                </a>
                              </p>
                              <p className="keyword-rankSnippetInfo">
                                {item.cmp3_all[0].description}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
