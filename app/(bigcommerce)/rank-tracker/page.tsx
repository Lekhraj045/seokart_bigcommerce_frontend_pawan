"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import { Api } from "@/app/_api/apiCall";
import Select from "react-select";
import Image from "next/image";
import Chart from "./_components/chart";
import ChannelList from "@/app/_components/channelList";
import Howitwork from "@/app/_howitwork/modal";
import { basePath } from "@/next.config";
import { toast } from "react-toastify";
import Confirmation from "@/app/_components/confirmation";
import Centerspinner from "@/app/_components/loading";
import Hamburger from "../../_components/hamburger";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function Home() {
  const [limit, setLimit] = useState(0);
  const [used, setUsed] = useState(0);
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const sortList = [
    { label: "Latest", value: "latest" },
    { label: "Rank (Low to High)", value: "rank_l_to_h" },
    { label: "Rank (High to Low)", value: "rank_h_to_l" },
    { label: "Keyword (A to Z)", value: "name_a_to_z" },
    { label: "Keyword (Z to A)", value: "name_z_to_a" },
  ];

  const [competitor1, setCompetitor1] = useState("");
  const [competitor2, setCompetitor2] = useState("");
  const [competitor3, setCompetitor3] = useState("");

  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState<any>({});

  const currentSelectedKeyword = useRef("");

  const [keywordList, setKeywordList] = useState({ data: [], loading: true });
  const [confKeywordDelete, setConfKeywordDelete] = useState(false);

  const fetchKeywordRankingList = (searchVal: string, sortVal: string) => {
    setKeywordList({ data: [], loading: true });
    Api("getKeywordRankingList", { sort: sortVal, search: searchVal }).then(
      ({ data }) => {
        setLimit(data.keyword_limit);
        setUsed(data.used_keyword_count);
        setCompetitor1(data.response.cmpt1);
        setCompetitor2(data.response.cmpt2);
        setCompetitor3(data.response.cmpt3);

        setKeywordList({ data: data.response.rows, loading: false });
      },
    );
  };

  const debouncedFetchKeywordRankingList = useMemo(
    () =>
      _.debounce((searchVal: string, sortVal: string) => {
        fetchKeywordRankingList(searchVal, sortVal);
      }, 500),
    [],
  );

  const getKeywordRankingList = () => {
    fetchKeywordRankingList(search, sort);
  };

  const deletKeyword = () => {
    Api("deleteKeyword", { keyword_id: currentSelectedKeyword.current }).then(
      () => {
        toast.success("Keyword deleted successfully.");
        getKeywordRankingList();
      },
    );
  };

  useEffect(() => {
    debouncedFetchKeywordRankingList.cancel();
    fetchKeywordRankingList(search, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search is debounced in input handler; only refetch immediately when sort changes
  }, [sort, debouncedFetchKeywordRankingList]);

  return (
    <>
      <Confirmation
        message={"Are you sure you want to delete this keyword?"}
        show={confKeywordDelete}
        handleNo={() => setConfKeywordDelete(false)}
        handleYes={() => {
          setConfKeywordDelete(false);
          deletKeyword();
        }}
      />

      {Object.keys(chartData).length > 0 && (
        <Chart
          show={showChart}
          onHide={() => setShowChart(false)}
          item={chartData}
        />
      )}
      <div className="content-frame-main">
        <div className="content-frame-head flex justify-content-between align-item-center">
          <div className="content-frameHead-left flex align-item-center gap-2">
            <h1 className="Text--headingLg flex align-item-center gap-2">
              Keywords Ranking
              <Howitwork page="ranktracker" />
            </h1>
            <ChannelList />
          </div>

          <div className="content-frameHead-right">
            <div className="badge badge-success">
              Keywords Used: {`${used}/${limit}`}
            </div>
            <Link href={"/add-keyword"} className="headBtn-link">
              <button type="button" className="custom-btn add-keywordBtn">
                Add Keyword
              </button>
            </Link>
            <Hamburger />
          </div>
        </div>
        <div className="add-keywordMain">
          <div className="card">
            <div className="d-flex justify-content-between gap-2 table-searchDropi">
              <div className="autoSearch-dropi keyword-rankingDropi">
                <Select
                  value={sortList.find((item) => item.value == sort)}
                  onChange={(selectedValue: any) =>
                    setSort(selectedValue.value)
                  }
                  options={sortList}
                />
              </div>

              <div className="custom-input icon-input">
                <i className="input-icon">
                  <Image
                    src={`${basePath}/images/search-icon.svg`}
                    width={20}
                    height={21}
                    alt=""
                  />
                </i>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  value={search}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearch(value);
                    debouncedFetchKeywordRankingList(value, sort);
                  }}
                />
              </div>
            </div>
            {keywordList.loading ? (
              <Centerspinner />
            ) : (
              <div className="custom-table mt-22">
                {keywordList.data.length == 0 ? (
                  <h2 className="text-center">{`No Keyword Found`}</h2>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Keywords</th>
                        <th>My Rankings</th>
                        {competitor1 && <th>{competitor1}</th>}
                        {competitor2 && <th>{competitor2}</th>}
                        {competitor3 && <th>{competitor3}</th>}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordList.data.map((item: any, key: any) => (
                        <tr key={key}>
                          <td>
                            <div className="d-flex justify-content-between items-center">
                              <div className="keyword-tableKeyword-list">
                                <ul>
                                  <li>
                                    <div className="language-icon">
                                      {item.search_en_lan.substring(0, 2)}
                                    </div>
                                  </li>

                                  <li>
                                    <div className="tabe-country-icon">
                                      {" "}
                                      <Image
                                        alt={item.country_iso_code}
                                        width={24}
                                        height={24}
                                        src={`https://flagsapi.com/${item.country_iso_code}/flat/24.png`}
                                      />
                                    </div>
                                  </li>

                                  <li className="flex-grow-1">
                                    <div className="keyword-table-heading">
                                      {item.keyword}
                                    </div>
                                  </li>
                                  {item.position[0] != "no" && (
                                    <>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Sitelinks</Tooltip>}
                                      >
                                        <li
                                          className={
                                            item.all_array[0].links
                                              ? "active"
                                              : ""
                                          }
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          data-bs-title="Sitelinks"
                                        >
                                          <svg
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg"
                                            focusable="false"
                                            aria-hidden="true"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M15.842 4.175a3.746 3.746 0 0 0-5.298 0l-2.116 2.117a3.75 3.75 0 0 0 .01 5.313l.338.336a.75.75 0 1 0 1.057-1.064l-.339-.337a2.25 2.25 0 0 1-.005-3.187l2.116-2.117a2.246 2.246 0 1 1 3.173 3.18l-1.052 1.047a.75.75 0 0 0 1.058 1.064l1.052-1.047a3.746 3.746 0 0 0 .006-5.305Zm-11.664 11.67a3.75 3.75 0 0 0 5.304 0l2.121-2.121a3.75 3.75 0 0 0 0-5.303l-.362-.362a.75.75 0 0 0-1.06 1.06l.362.362a2.25 2.25 0 0 1 0 3.182l-2.122 2.122a2.25 2.25 0 1 1-3.182-3.182l1.07-1.07a.75.75 0 1 0-1.062-1.06l-1.069 1.069a3.75 3.75 0 0 0 0 5.303Z"
                                            ></path>
                                          </svg>
                                        </li>
                                      </OverlayTrigger>

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Image</Tooltip>}
                                      >
                                        <li
                                          className={
                                            item.all_array[0].is_image
                                              ? "active"
                                              : ""
                                          }
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          data-bs-title="Image"
                                        >
                                          <svg
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg"
                                            focusable="false"
                                            aria-hidden="true"
                                          >
                                            <path d="M12.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                                            <path
                                              fillRule="evenodd"
                                              d="M9.018 3.5h1.964c.813 0 1.469 0 2 .043.546.045 1.026.14 1.47.366a3.75 3.75 0 0 1 1.64 1.639c.226.444.32.924.365 1.47.043.531.043 1.187.043 2v1.964c0 .813 0 1.469-.043 2-.045.546-.14 1.026-.366 1.47a3.75 3.75 0 0 1-1.639 1.64c-.444.226-.924.32-1.47.365-.531.043-1.187.043-2 .043h-1.964c-.813 0-1.469 0-2-.043-.546-.045-1.026-.14-1.47-.366a3.75 3.75 0 0 1-1.64-1.639c-.226-.444-.32-.924-.365-1.47-.043-.531-.043-1.187-.043-2v-1.964c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.639-1.64c.444-.226.924-.32 1.47-.365.531-.043 1.187-.043 2-.043Zm-1.877 1.538c-.454.037-.715.107-.912.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912-.037.462-.038 1.057-.038 1.909v1.428l.723-.867a1.75 1.75 0 0 1 2.582-.117l2.695 2.695 1.18-1.18a1.75 1.75 0 0 1 2.604.145l.216.27v-2.374c0-.852 0-1.447-.038-1.91-.037-.453-.107-.714-.207-.911a2.25 2.25 0 0 0-.984-.984c-.197-.1-.458-.17-.912-.207-.462-.037-1.056-.038-1.909-.038h-1.9c-.852 0-1.447 0-1.91.038Zm-2.103 7.821a7.12 7.12 0 0 1-.006-.08.746.746 0 0 0 .044-.049l1.8-2.159a.25.25 0 0 1 .368-.016l3.226 3.225a.75.75 0 0 0 1.06 0l1.71-1.71a.25.25 0 0 1 .372.021l1.213 1.516c-.021.06-.045.114-.07.165-.216.423-.56.767-.984.983-.197.1-.458.17-.912.207-.462.037-1.056.038-1.909.038h-1.9c-.852 0-1.447 0-1.91-.038-.453-.037-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.984c-.1-.197-.17-.458-.207-.912Z"
                                            ></path>
                                          </svg>
                                        </li>
                                      </OverlayTrigger>

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Video</Tooltip>}
                                      >
                                        <li
                                          className={
                                            item.all_array[0].is_video
                                              ? "active"
                                              : ""
                                          }
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          data-bs-title="Video"
                                        >
                                          <svg
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg"
                                            focusable="false"
                                            aria-hidden="true"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M13.875 10.65a.75.75 0 0 0 0-1.3l-5.25-3.03a.75.75 0 0 0-1.125.649v6.062a.75.75 0 0 0 1.125.65l5.25-3.032Zm-4.875 1.082v-3.464l3 1.732-3 1.732Z"
                                            ></path>
                                            <path
                                              fillRule="evenodd"
                                              d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-5.5 7a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"
                                            ></path>
                                          </svg>
                                        </li>
                                      </OverlayTrigger>

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Featured Snippet</Tooltip>
                                        }
                                      >
                                        <li
                                          className={
                                            item.all_array[0]
                                              .is_featured_snippet
                                              ? "active"
                                              : ""
                                          }
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          data-bs-title="Featured Snippet"
                                        >
                                          <svg
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg"
                                            focusable="false"
                                            aria-hidden="true"
                                          >
                                            <path d="M7.25 6.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"></path>
                                            <path d="M6.5 10a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Z"></path>
                                            <path d="M7.25 12a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"></path>
                                            <path
                                              fillRule="evenodd"
                                              d="M7.25 3.5a3.75 3.75 0 0 0-3.75 3.75v5.5a3.75 3.75 0 0 0 3.75 3.75h5.5a3.75 3.75 0 0 0 3.75-3.75v-5.5a3.75 3.75 0 0 0-3.75-3.75h-5.5Zm-2.25 3.75a2.25 2.25 0 0 1 2.25-2.25h5.5a2.25 2.25 0 0 1 2.25 2.25v5.5a2.25 2.25 0 0 1-2.25 2.25h-5.5a2.25 2.25 0 0 1-2.25-2.25v-5.5Z"
                                            ></path>
                                          </svg>
                                        </li>
                                      </OverlayTrigger>
                                    </>
                                  )}
                                </ul>
                              </div>

                              {item.position[0] != "no" && (
                                <div
                                  className="keyword-infoModal cursor-pointer d-flex align-item-center"
                                  onClick={() => {
                                    setShowChart(true);
                                    setChartData(item);
                                  }}
                                >
                                  <span>
                                    <Image
                                      src={`${basePath}/images/eye-icon.svg`}
                                      alt=""
                                      width={20}
                                      height={20}
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            {item.position[0] != "no" ? (
                              <>
                                <div className="keywordCompetitor d-flex align-item-center gap-2">
                                  <span className="keywordCompetitor-rank">
                                    {item.all_array[0]?.rank_group
                                      .toString()
                                      .replace("50", ">50")}
                                  </span>
                                  {item.all_array[1] ? (
                                    <>
                                      {item.all_array[1].rank_group -
                                        item.all_array[0].rank_group ==
                                      0 ? (
                                        <span className="badge keywordBadge">
                                          <Image
                                            src={`${basePath}/images/equal-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                        </span>
                                      ) : item.all_array[1].rank_group -
                                          item.all_array[0].rank_group <
                                        0 ? (
                                        <span className="badge keywordBadge badge-danger">
                                          <Image
                                            src={`${basePath}/images/down-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                          {Math.abs(
                                            item.all_array[1].rank_group -
                                              item.all_array[0].rank_group,
                                          )}
                                        </span>
                                      ) : (
                                        <span className="badge keywordBadge badge-success">
                                          <Image
                                            src={`${basePath}/images/up-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                          {Math.abs(
                                            item.all_array[1].rank_group -
                                              item.all_array[0].rank_group,
                                          )}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <span className="badge keywordBadge">
                                        <Image
                                          src={`${basePath}/images/equal-arrow.svg`}
                                          width={20}
                                          height={20}
                                          alt=""
                                        />
                                      </span>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <Spinner size="sm" />
                              </>
                            )}
                          </td>

                          {competitor1 && (
                            <td>
                              {item.position[0] != "no" ? (
                                <>
                                  <div className="keywordCompetitor d-flex align-item-center gap-2">
                                    <span className="keywordCompetitor-rank">
                                      {item.cmp1_all[0]?.rank_group
                                        .toString()
                                        .replace("50", ">50")}
                                    </span>
                                    {item.cmp1_all[1] ? (
                                      <>
                                        {item.cmp1_all[1].rank_group -
                                          item.cmp1_all[0].rank_group ==
                                        0 ? (
                                          <span className="badge keywordBadge">
                                            <Image
                                              src={`${basePath}/images/equal-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                          </span>
                                        ) : item.cmp1_all[1].rank_group -
                                            item.cmp1_all[0].rank_group <
                                          0 ? (
                                          <span className="badge keywordBadge badge-danger">
                                            <Image
                                              src={`${basePath}/images/down-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp1_all[1].rank_group -
                                                item.cmp1_all[0].rank_group,
                                            )}
                                          </span>
                                        ) : (
                                          <span className="badge keywordBadge badge-success">
                                            <Image
                                              src={`${basePath}/images/up-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp1_all[1].rank_group -
                                                item.cmp1_all[0].rank_group,
                                            )}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge keywordBadge">
                                          <Image
                                            src={`${basePath}/images/equal-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Spinner size="sm" />
                                </>
                              )}
                            </td>
                          )}

                          {competitor2 && (
                            <td>
                              {item.position[0] != "no" ? (
                                <>
                                  <div className="keywordCompetitor d-flex align-item-center gap-2">
                                    <span className="keywordCompetitor-rank">
                                      {item.cmp2_all[0]?.rank_group
                                        .toString()
                                        .replace("50", ">50")}
                                    </span>
                                    {item.cmp2_all[1] ? (
                                      <>
                                        {item.cmp2_all[1].rank_group -
                                          item.cmp2_all[0].rank_group ==
                                        0 ? (
                                          <span className="badge keywordBadge">
                                            <Image
                                              src={`${basePath}/images/equal-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                          </span>
                                        ) : item.cmp2_all[1].rank_group -
                                            item.cmp2_all[0].rank_group <
                                          0 ? (
                                          <span className="badge keywordBadge badge-danger">
                                            <Image
                                              src={`${basePath}/images/down-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp2_all[1].rank_group -
                                                item.cmp2_all[0].rank_group,
                                            )}
                                          </span>
                                        ) : (
                                          <span className="badge keywordBadge badge-success">
                                            <Image
                                              src={`${basePath}/images/up-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp2_all[1].rank_group -
                                                item.cmp2_all[0].rank_group,
                                            )}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge keywordBadge">
                                          <Image
                                            src={`${basePath}/images/equal-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Spinner size="sm" />
                                </>
                              )}
                            </td>
                          )}

                          {competitor3 && (
                            <td>
                              {item.position[0] != "no" ? (
                                <>
                                  <div className="keywordCompetitor d-flex align-item-center gap-2">
                                    <span className="keywordCompetitor-rank">
                                      {item.cmp3_all[0]?.rank_group
                                        .toString()
                                        .replace("50", ">50")}
                                    </span>
                                    {item.cmp3_all[1] ? (
                                      <>
                                        {item.cmp3_all[1].rank_group -
                                          item.cmp3_all[0].rank_group ==
                                        0 ? (
                                          <span className="badge keywordBadge">
                                            <Image
                                              src={`${basePath}/images/equal-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                          </span>
                                        ) : item.cmp3_all[1].rank_group -
                                            item.cmp3_all[0].rank_group <
                                          0 ? (
                                          <span className="badge keywordBadge badge-danger">
                                            <Image
                                              src={`${basePath}/images/down-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp3_all[1].rank_group -
                                                item.cmp3_all[0].rank_group,
                                            )}
                                          </span>
                                        ) : (
                                          <span className="badge keywordBadge badge-success">
                                            <Image
                                              src={`${basePath}/images/up-arrow.svg`}
                                              width={20}
                                              height={20}
                                              alt=""
                                            />
                                            {Math.abs(
                                              item.cmp3_all[1].rank_group -
                                                item.cmp3_all[0].rank_group,
                                            )}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge keywordBadge">
                                          <Image
                                            src={`${basePath}/images/equal-arrow.svg`}
                                            width={20}
                                            height={20}
                                            alt=""
                                          />
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Spinner size="sm" />
                                </>
                              )}
                            </td>
                          )}

                          <td>
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => {
                                currentSelectedKeyword.current =
                                  item.keyword_id;
                                setConfKeywordDelete(true);
                              }}
                            >
                              <Image
                                src={`${basePath}/images/delete-icon.svg`}
                                width={20}
                                height={20}
                                alt=""
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
