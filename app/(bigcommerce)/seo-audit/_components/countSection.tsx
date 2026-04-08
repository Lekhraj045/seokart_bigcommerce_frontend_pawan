import { Api } from "@/app/_api/apiCall";
import { basePath } from "@/next.config";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Progress } from "rsuite";
import Image from "next/image";

export default function Home(Props: any) {
  const [count, setCount] = useState<any>({ data: {}, loading: true });
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [scoreData, setScoreData] = useState<any>({
    loading: true,
    score: 0,
    errorCount: {
      broken_link_issue: 0,
      image_issue: 0,
      content_issue: 0,
      meta_tag_issue: 0,
    },
  });

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    setIsPaidUser((localStorage?.getItem("manage_service") ?? "0") === "1");

    // Set loading states
    setScoreData((prev: any) => ({ ...prev, loading: true }));

    // Call both APIs in parallel - update UI independently as each responds
    // Call getSeoAuditCount
    Api("getSeoAuditCount", { refresh: 1 }).then(({ data }: any) => {
      setCount({ data: data, loading: false });
      if (data?.totalAuditCount == data?.totalLiveCount) {
        Props.setSyncStatus(Number(data?.re_audit_status));
      } else {
        Props.setSyncStatus(2);
      }
    });

    // First time: getScoreAndErrorData
    Api("getScoreAndErrorData", {}).then((scoreResponse: any) => {
      console.log(scoreResponse || "scoreResponse");
      const totalScore = scoreResponse?.data?.totalStoreAvgScore || 0;
      const errorCount = {
        broken_link_issue:
          scoreResponse?.data?.errorCount?.broken_link_issue || 0,
        image_issue: scoreResponse?.data?.errorCount?.image_issue || 0,
        content_issue: scoreResponse?.data?.errorCount?.content_issue || 0,
        meta_tag_issue: scoreResponse?.data?.errorCount?.meta_tag_issue || 0,
      };
      setScoreData({
        loading: false,
        score: totalScore,
        errorCount: errorCount,
      });
    });

    // refreshDashboardData - on 200, call getScoreAndErrorData again
    const channel = localStorage?.getItem("channel");
    const channelId = channel ? (JSON.parse(channel)?.channel_id ?? 1) : 1;
    const refreshPayload = {
      shop: localStorage?.getItem("shop") ?? "",
      channel_id:
        typeof channelId === "string" ? parseInt(channelId, 10) : channelId,
      store_id: localStorage?.getItem("user_id") ?? "",
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/refreshDashboardData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-token": localStorage?.getItem("api-token") ?? "",
        "app-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify(refreshPayload),
    }).then((res) => {
      if (res.status === 200) {
        Api("getScoreAndErrorData", {}).then((scoreResponse: any) => {
          const totalScore = scoreResponse?.data?.totalStoreAvgScore || 0;
          const errorCount = {
            broken_link_issue:
              scoreResponse?.data?.errorCount?.broken_link_issue || 0,
            image_issue: scoreResponse?.data?.errorCount?.image_issue || 0,
            content_issue: scoreResponse?.data?.errorCount?.content_issue || 0,
            meta_tag_issue:
              scoreResponse?.data?.errorCount?.meta_tag_issue || 0,
          };
          setScoreData({
            loading: false,
            score: totalScore,
            errorCount: errorCount,
          });
        });
      }
    });
  }, [Props]);

  console.log(count.data.totalAuditCount, count.data.totalLiveCount);

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      In the free plan, we audit only a limited number of pages.
    </Tooltip>
  );

  return (
    <>
      <div className="flex gap-3 flex-col xl:flex-row">
        <div className="card !mb-0">
          <div className="flex flex-col gap-3 min-w-full w-full sm:min-w-[320px] sm:max-w-[320px]">
            <div className="flex gap-1 items-start sm:items-center justify-between flex-col sm:flex-row">
              <h3 className="text-base font-bold text-[#303030]">
                Average SEO score
              </h3>
              {scoreData.loading ? (
                <div className="badge badge-danger !rounded-full">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="badge badge-danger !rounded-full">
                  {scoreData.errorCount.broken_link_issue +
                    scoreData.errorCount.image_issue +
                    scoreData.errorCount.content_issue +
                    scoreData.errorCount.meta_tag_issue}{" "}
                  SEO errors found
                </div>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <div className="optimization-score">
                {scoreData.loading ? (
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: "56px", height: "56px" }}
                  >
                    <Spinner size="sm" />
                  </div>
                ) : (
                  (() => {
                    const score = Math.round(scoreData.score || 0);
                    const radius = 24;
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference * (1 - score / 100);

                    const getProgressColor = (s: number) => {
                      if (s >= 90) return "#22C55E";
                      if (s >= 80) return "#FF862B";
                      return "#FF5E60";
                    };

                    const getTextColor = (s: number) => {
                      if (s >= 90) return "#007A5C";
                      if (s >= 80) return "#FF862B";
                      return "#FF5E60";
                    };

                    return (
                      <div
                        className="relative"
                        style={{ width: "56px", height: "56px" }}
                      >
                        <svg
                          width="56"
                          height="56"
                          className="transform -rotate-90"
                          style={{ width: "56px", height: "56px" }}
                        >
                          {/* Background circle */}
                          <circle
                            cx="28"
                            cy="28"
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="4"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="28"
                            cy="28"
                            r={radius}
                            fill="none"
                            stroke={getProgressColor(score)}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{
                              transition:
                                "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
                            }}
                          />
                        </svg>
                        {/* Percentage text */}
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: getTextColor(score),
                          }}
                        >
                          {score}%
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">
                  SEO Performance
                </h3>
                <p className="text-xs text-[#616161] font-normal">
                  Overall SEO health of your store.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card flex-1 !mb-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center items-start">
              <h3 className="text-base font-bold text-[#303030]">
                Audit Coverage
              </h3>

              <div className="bg-white rounded-full border border-[#DEDEDE] py-2 px-3">
                {count.loading ? (
                  <Spinner size="sm" />
                ) : (
                  <div className="flex items-center gap-2">
                    {isPaidUser ? (
                      <p className="text-xs text-[#616161] font-normal">
                        {count.data.totalAuditCount} of{" "}
                        {count.data.totalLiveCount} Pages Audited
                      </p>
                    ) : (
                      <OverlayTrigger placement="top" overlay={renderTooltip}>
                        <div className="tooltipDashed relative">
                          <p className="text-xs text-[#616161] font-normal">
                            {count.data.totalAuditCount} of{" "}
                            {count.data.totalLiveCount} Pages Audited
                          </p>
                        </div>
                      </OverlayTrigger>
                    )}

                    <div className="relative h-4 w-4">
                      {(() => {
                        const completed = count.data.totalAuditCount || 0;
                        const total = count.data.totalLiveCount || 1;
                        const progress = Math.round((completed / total) * 100);
                        const isComplete = completed === total && total > 0;

                        return (
                          <span className="inline-flex">
                            {isComplete ? (
                              <span
                                className="h-4 w-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#14CC52" }}
                              >
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.33333 2.5L3.75 7.08333L1.66667 5"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            ) : (
                              <span
                                className="h-4 w-4 rounded-full border"
                                style={{
                                  borderColor: "#14CC52",
                                  backgroundColor: "#ffffff",
                                  backgroundImage:
                                    progress === 0
                                      ? "none"
                                      : `conic-gradient(#14CC52 0 ${progress}%, transparent ${progress}% 100%)`,
                                }}
                              />
                            )}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 sm:gap-2 lg:grid-cols-5 gap-3 ">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                {(() => {
                  const completed =
                    count.data?.individual_db_count?.product || 0;
                  const total = count.data?.individual_live_count?.product || 0;
                  const isComplete = !count.loading && completed === total;

                  return (
                    <div
                      className={`rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center ${
                        isComplete ? "bg-[#AFFEBF]" : "bg-[#FEF3C6]"
                      }`}
                    >
                      <Image
                        src={`${basePath}/images/${
                          isComplete ? "check-green-round.svg" : "wait-icon.svg"
                        }`}
                        alt=""
                        width="14"
                        height="14"
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-[#303030]">Products</h3>
                  {count.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <p className="text-xs text-[#616161] font-normal">
                      {count.data?.individual_db_count?.product || 0} of{" "}
                      {count.data?.individual_live_count?.product || 0} audited
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                {(() => {
                  const completed =
                    count.data?.individual_db_count?.category || 0;
                  const total =
                    count.data?.individual_live_count?.category || 0;
                  const isComplete = !count.loading && completed === total;

                  return (
                    <div
                      className={`rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center ${
                        isComplete ? "bg-[#AFFEBF]" : "bg-[#FEF3C6]"
                      }`}
                    >
                      <Image
                        src={`${basePath}/images/${
                          isComplete ? "check-green-round.svg" : "wait-icon.svg"
                        }`}
                        alt=""
                        width="14"
                        height="14"
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-[#303030]">Category</h3>
                  {count.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <p className="text-xs text-[#616161] font-normal">
                      {count.data?.individual_db_count?.category || 0} of{" "}
                      {count.data?.individual_live_count?.category || 0} audited
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                {(() => {
                  const completed = count.data?.individual_db_count?.brand || 0;
                  const total = count.data?.individual_live_count?.brand || 0;
                  const isComplete = !count.loading && completed === total;

                  return (
                    <div
                      className={`rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center ${
                        isComplete ? "bg-[#AFFEBF]" : "bg-[#FEF3C6]"
                      }`}
                    >
                      <Image
                        src={`${basePath}/images/${
                          isComplete ? "check-green-round.svg" : "wait-icon.svg"
                        }`}
                        alt=""
                        width="14"
                        height="14"
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-[#303030]">Brand</h3>
                  {count.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <p className="text-xs text-[#616161] font-normal">
                      {count.data?.individual_db_count?.brand || 0} of{" "}
                      {count.data?.individual_live_count?.brand || 0} audited
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                {(() => {
                  const completed = count.data?.individual_db_count?.page || 0;
                  const total = count.data?.individual_live_count?.page || 0;
                  const isComplete = !count.loading && completed === total;

                  return (
                    <div
                      className={`rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center ${
                        isComplete ? "bg-[#AFFEBF]" : "bg-[#FEF3C6]"
                      }`}
                    >
                      <Image
                        src={`${basePath}/images/${
                          isComplete ? "check-green-round.svg" : "wait-icon.svg"
                        }`}
                        alt=""
                        width="14"
                        height="14"
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-[#303030]">Pages</h3>
                  {count.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <p className="text-xs text-[#616161] font-normal">
                      {count.data?.individual_db_count?.page || 0} of{" "}
                      {count.data?.individual_live_count?.page || 0} audited
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                {(() => {
                  const completed = count.data?.individual_db_count?.blog || 0;
                  const total = count.data?.individual_live_count?.blog || 0;
                  const isComplete = !count.loading && completed === total;

                  return (
                    <div
                      className={`rounded-full w-[30px] h-[30px] min-w-[30px] min-h-[30px] flex items-center justify-center ${
                        isComplete ? "bg-[#AFFEBF]" : "bg-[#FEF3C6]"
                      }`}
                    >
                      <Image
                        src={`${basePath}/images/${
                          isComplete ? "check-green-round.svg" : "wait-icon.svg"
                        }`}
                        alt=""
                        width="14"
                        height="14"
                      />
                    </div>
                  );
                })()}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-bold text-[#303030]">Blogs</h3>
                  {count.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <p className="text-xs text-[#616161] font-normal">
                      {count.data?.individual_db_count?.blog || 0} of{" "}
                      {count.data?.individual_live_count?.blog || 0} audited
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
