"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Howitwork from "@/app/_howitwork/modal";
import { Spinner, Badge } from "react-bootstrap";
import Image from "next/image";
import { basePath } from "../../../next.config.js";
import { Api } from "@/app/_api/apiCall";
import UpgradeButton from "../../_components/upgradeButton";
import ChannelList from "../../_components/channelList";
import BulkOptimizerModal from "./_components/bulkOptimizerModal";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import PaymentModal from "@/app/_components/infoModal";
import ConfirmationModal from "@/app/_components/confirmation";
import Hamburger from "../../_components/hamburger";
import ScoreMeter from "./_components/ScoreMeter";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";

export default function Home(Props: any) {
  const spinner = <Spinner animation="border" size="sm" />;
  const [seoScore, setSeoScore] = useState<any>(0);
  const [seoAudit, setSeoAudit] = useState<any>({
    crawled: spinner,
    total: spinner,
  });
  const [errors, setErrors] = useState<any>({
    meta: spinner,
    content: spinner,
    image: spinner,
    broken: spinner,
    url: spinner,
  });
  const [error404, setError404] = useState<any>(spinner);
  const [bulkOptimizer, setBulkOptimizer] = useState<any>({
    titleTag: {
      total: spinner,
      home: 0,
      product: 0,
      category: 0,
      brand: 0,
      page: 0,
      blog: 0,
    },
    metaDescription: {
      total: spinner,
      home: 0,
      product: 0,
      category: 0,
      brand: 0,
      page: 0,
      blog: 0,
    },
    altText: { total: spinner },
  });
  const [fixedImage, setFixedImage] = useState<any>(spinner);
  const [totalProduct, setTotalProduct] = useState<any>(spinner);
  const [rankTracker, setRankTracker] = useState<any>({
    avgRanking: spinner,
    keywords: spinner,
  });
  const [homeDesktop, setHomeDesktop] = useState<any>(spinner);
  const [homeMobile, setHomeMobile] = useState<any>(spinner);
  const [productDesktop, setProductDesktop] = useState<any>(spinner);
  const [productMobile, setProductMobile] = useState<any>(spinner);
  const [categoryDesktop, setCategoryDesktop] = useState<any>(spinner);
  const [categoryMobile, setCategoryMobile] = useState<any>(spinner);
  const [richSnippets, setRichSnippets] = useState<any>({
    home: "false",
    product: "false",
    breadcrumb: "false",
    sitelink: "false",
    blog: "false",
    faq: "false",
  });
  const [richSnippetLoading, setRichSnippetLoading] = useState(true);
  const [modalShow, setModalShow] = useState<any>({
    type: "titleTag",
    status: false,
  });
  const totalPage = useRef(0);
  const [signedPayload, setSignedPayload] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showTitleTagPopover, setShowTitleTagPopover] = useState(false);
  const [showMetaDescPopover, setShowMetaDescPopover] = useState(false);
  const titleTagTimeoutRef = useRef<any>(null);
  const metaDescTimeoutRef = useRef<any>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const searchParams = useSearchParams();
  const showPaymentModal = searchParams.get("showPaymentModal");
  const [auditStatus, setAuditStatus] = useState(1);

  const timeOutId = useRef<any>();
  const refreshSeoAuditInProgressRef = useRef(false);

  const [topBarShow, dispatchTopBar] = useReducer(
    (state: any, action: any) => {
      if (action.type == "close") return { status: false };
      if (action.type == "open") return { status: true };
    },
    { status: false },
  );

  const getDashboardData = () => {
    Api("getDashboardData", {}).then(({ data }: any) => {
      const error = data.errorCount;
      const bulkOptimizer = data.bulkOptimizerErrors;
      const rank = data.rankingData;
      setSeoScore(data.totalStoreAvgScore);
      setErrors({
        meta: error.meta_tag_issue,
        content: error.content_issue,
        image: error.image_issue,
        broken: error.broken_link_issue,
        url: error.url_issue,
      });
      setError404(data.forzerofor_errors);
      setBulkOptimizer({
        titleTag: {
          total: bulkOptimizer.title_blank,
          home: bulkOptimizer.homeEmptyTitleCount,
          product: bulkOptimizer.productEmptyTitleCount,
          category: bulkOptimizer.categoryEmptyTitleCount,
          brand: bulkOptimizer.brandEmptyTitleCount,
          page: bulkOptimizer.pageEmptyTitleCount,
          blog: bulkOptimizer.blogEmptyTitleCount,
        },
        metaDescription: {
          total: bulkOptimizer.meta_description_blank,
          home: bulkOptimizer.homeEmptyDescCount,
          product: bulkOptimizer.productEmptyDescCount,
          category: bulkOptimizer.categoryEmptyDescCount,
          brand: bulkOptimizer.brandEmptyDescCount,
          page: bulkOptimizer.pageEmptyDescCount,
          blog: bulkOptimizer.blogEmptyDescCount,
        },
        altText: { total: bulkOptimizer.alttext_blank },
      });
      setFixedImage(data.imgOptimizeErrors);
      setRankTracker({
        avgRanking: rank.average_ranking,
        keywords: rank.keyword_count,
      });
    });
    Api("refreshDashboardData", {});
  };

  const getSeoAuditCount = (refresh = 0) => {
    const isPaid = localStorage.getItem("manage_service") ?? 0;
    Api("getSeoAuditCount", { refresh: refresh }).then((res: any) => {
      const data = res?.data;
      if (!data) return;
      setAuditStatus(data.audit_status ?? 1);
      if (refresh == 1) {
        totalPage.current = data.totalLiveCount;
        setTotalProduct(data?.individual_live_count?.product);
        setSeoAudit({
          crawled: data.totalAuditCount,
          total: data.totalLiveCount,
        });
      } else {
        setSeoAudit((seoAudit: any) => ({
          ...seoAudit,
          crawled: data.totalAuditCount,
        }));
      }
      if (
        data.totalAuditCount != totalPage.current &&
        isPaid == "1" &&
        data.audit_status == 0
      ) {
        timeOutId.current = setTimeout(getSeoAuditCount, 10000);
      }
    });
    callRefreshSeoAuditCount(refresh);
  };

  const getDashboardPageSpeedScore = (type: string) => {
    Api("getDashboardPageSpeedScore", { type: type }).then((data) => {
      if (type == "home_desktop") setHomeDesktop(data.data.score);
      if (type == "home_mobile") setHomeMobile(data.data.score);
      if (type == "product_desktop") setProductDesktop(data.data.score);
      if (type == "product_mobile") setProductMobile(data.data.score);
      if (type == "category_desktop") setCategoryDesktop(data.data.score);
      if (type == "category_mobile") setCategoryMobile(data.data.score);
    });
  };

  const getRichSnippets = () => {
    Api("getRichSnippetsStatus", {}).then(({ data }: any) => {
      setRichSnippetLoading(false);
      setRichSnippets({
        home: data.status.home_status,
        product: data.status.product_status,
        breadcrumb: data.status.breadcrumb_status,
        sitelink: data.status.sitelink_search_status,
        blog: data.status.blog_post_status,
        faq: data.status.faq_status,
      });
    });
  };

  const getTopBarStatus = () => {
    Api("getSettingData", { val_key: "meeting_call_top_bar" }).then((data) => {
      if (data.data.status == 0) {
        dispatchTopBar({ type: "close" });
      } else {
        dispatchTopBar({ type: "open" });
      }
    });
  };

  const setTopBarStatus = () => {
    Api("setSettingData", { val_key: "meeting_call_top_bar", val_status: 0 });
    dispatchTopBar({ type: "close" });
  };

  const ifStoreDownGrade = () => {
    Api("ifStoreDownGrade", {});
  };

  const callRefreshSeoAuditCount = (refresh: number) => {
    if (refreshSeoAuditInProgressRef.current) return;
    refreshSeoAuditInProgressRef.current = true;
    Api("refreshSeoAuditCount", { refresh }).finally(() => {
      refreshSeoAuditInProgressRef.current = false;
    });
  };

  const apiCall = () => {
    getDashboardData();
    getSeoAuditCount(1);
    callRefreshSeoAuditCount(1);
    getDashboardPageSpeedScore("home_desktop");
    getDashboardPageSpeedScore("home_mobile");
    getRichSnippets();
    getTopBarStatus();
    ifStoreDownGrade();
  };

  useEffect(() => {
    // Keep polling until we have a non-zero score
    if (seoScore > 0) return;
    // Run immediately on first render
    apiCall();
    const intervalId = setInterval(() => {
      if (seoScore > 0) {
        clearInterval(intervalId);
        return;
      }
      apiCall();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [seoScore]);

  const updateAuditStatus = () => {
    Api("updateAuditStatus").then(() => {
      getSeoAuditCount(1);
      callRefreshSeoAuditCount(1);
    });
  };

  useEffect(() => {
    setSignedPayload(localStorage.getItem("signedPayload") ?? "");
    setIsPaidUser((localStorage.getItem("manage_service") ?? "0") === "1");
    return () => {
      clearTimeout(timeOutId.current);
      clearTimeout(titleTagTimeoutRef.current);
      clearTimeout(metaDescTimeoutRef.current);
    };
  }, []);

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      In the free plan, we audit only a limited number of pages.
    </Tooltip>
  );

  const titleTagPopover = (
    <Popover id="title-tag-popover">
      <Popover.Body
        onMouseEnter={() => {
          if (titleTagTimeoutRef.current) {
            clearTimeout(titleTagTimeoutRef.current);
          }
          setShowTitleTagPopover(true);
        }}
        onMouseLeave={() => {
          titleTagTimeoutRef.current = setTimeout(() => {
            setShowTitleTagPopover(false);
          }, 200);
        }}
      >
        <div className="flex flex-col" style={{ minWidth: "150px" }}>
          <div className="flex justify-between items-center">
            <div>Home:</div>
            <div>{bulkOptimizer.titleTag.home ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Product:</div>
            <div>{bulkOptimizer.titleTag.product ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Category:</div>
            <div>{bulkOptimizer.titleTag.category ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Brands:</div>
            <div>{bulkOptimizer.titleTag.brand ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Pages:</div>
            <div>{bulkOptimizer.titleTag.page ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Blogs:</div>
            <div>{bulkOptimizer.titleTag.blog ?? 0}</div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const metaDescriptionPopover = (
    <Popover id="meta-description-popover">
      <Popover.Body
        onMouseEnter={() => {
          if (metaDescTimeoutRef.current) {
            clearTimeout(metaDescTimeoutRef.current);
          }
          setShowMetaDescPopover(true);
        }}
        onMouseLeave={() => {
          metaDescTimeoutRef.current = setTimeout(() => {
            setShowMetaDescPopover(false);
          }, 200);
        }}
      >
        <div className="flex flex-col" style={{ minWidth: "150px" }}>
          <div className="flex justify-between items-center">
            <div>Home:</div>
            <div>{bulkOptimizer.metaDescription.home ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Product:</div>
            <div>{bulkOptimizer.metaDescription.product ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Category:</div>
            <div>{bulkOptimizer.metaDescription.category ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Brands:</div>
            <div>{bulkOptimizer.metaDescription.brand ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Pages:</div>
            <div>{bulkOptimizer.metaDescription.page ?? 0}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Blogs:</div>
            <div>{bulkOptimizer.metaDescription.blog ?? 0}</div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <ConfirmationModal
        message={`Re-audit may take a few days depending on the number of products and BigCommerce API limits. Also, during Re-audit, you won't be able to use Bulk Optimization function. `}
        show={showConfirmationModal}
        handleClose={() => {
          setShowConfirmationModal(false);
        }}
        handleYes={() => {
          setShowConfirmationModal(false);
          setAuditStatus(0);
          updateAuditStatus();
        }}
        handleNo={() => setShowConfirmationModal(false)}
      />
      {showPaymentModal == "true" && (
        <PaymentModal
          heading="Did you make the payment?"
          message="If yes, please wait for a few minutes to reflect it into the app."
        />
      )}
      <BulkOptimizerModal
        show={modalShow.status}
        handleClose={() =>
          setModalShow((modalShow: any) => ({ ...modalShow, status: false }))
        }
        type={modalShow.type}
        home={bulkOptimizer[modalShow.type].home}
        product={bulkOptimizer[modalShow.type].product}
        category={bulkOptimizer[modalShow.type].category}
        brand={bulkOptimizer[modalShow.type].brand}
        page={bulkOptimizer[modalShow.type].page}
        blog={bulkOptimizer[modalShow.type].blog}
      />

      <div className="content-frame-main">
        <div className="py-3 lg:py-6 flex justify-between items-start lg:items-center gap-3 flex-col lg:flex-row">
          <div className="content-frameHead-left flex flex-col">
            <div className="flex flex-col">
              <h1 className="Text--headingLg mb-0 flex align-item-center gap-2">
                SEO Dashboard <Howitwork page="dashboard" />
              </h1>
              <p className="text-xs text-[#616161] mt-0.5">
                Monitor and optimize your store’s SEO performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <ChannelList />
            <UpgradeButton />
            {signedPayload && (
              <a
                target="_blank"
                href={`https://app.seokart.com/bigc_front/load?signed_payload=${signedPayload}`}
              >
                <button className="btn btn-light dashLinkBtn">
                  <Image
                    src={`${basePath}/images/link-icon.svg`}
                    width={16}
                    height={16}
                    className="min-w-4 min-h-4"
                    alt=""
                  />
                </button>
              </a>
            )}

            <Hamburger />
          </div>
        </div>

        {topBarShow?.status && (
          <div className="infoCard top-bar flex md:flex-row flex-col !justify-between gap-3 items-start md:items-center mb-3">
            <div>
              <h6 className="text-sm font-medium text-[#303030] mb-0">
                Stay ahead in SEO & AI Visibility — Talk to an expert!
              </h6>
              <p className="text-xs text-[#616161] font-normal">
                Let&apos;s discuss best practices, App demo & our managed
                services.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://calendly.com/seokart/30min"
                target="_blank"
                className="btn-default flex items-center gap-1"
              >
                <Image
                  src={`${basePath}/images/schedule-call-icon.svg`}
                  width={20}
                  height={20}
                  alt=""
                  style={{ filter: "brightness(0.3)" }}
                />
                Schedule a Call
              </a>

              <span onClick={setTopBarStatus} className="cursor-pointer">
                <Image
                  src={`${basePath}/images/close-icon.svg`}
                  width={20}
                  height={20}
                  alt=""
                  className="brightness-0"
                />
                <span className="inline-block md:hidden text-xs">Close</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* SEO Overview start */}
          <div className="card !mb-0">
            <div className="cardHeader flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">
                  SEO Overview
                </h3>
                <p className="text-xs text-[#616161] mt-0.5">
                  Today’s snapshot of your store’s search health.
                </p>
              </div>
            </div>

            <div className="cardBody pb-3 pt-8 pl-0 flex flex-col justify-between gap-7 md:flex-row md:pl-12 md:gap-1">
              <div className="dashboard-SeoBox text-center md:text-left">
                <ScoreMeter
                  score={typeof seoScore === "number" ? seoScore : 0}
                  size={250}
                  basePath={basePath}
                />

                <div className="mt-6 text-center">
                  <h4 className="text-sm font-normal">
                    {isPaidUser ? (
                      <div className="flex items-center justify-center gap-2">
                        {seoAudit.crawled} / {seoAudit.total} pages audited
                      </div>
                    ) : (
                      <OverlayTrigger placement="top" overlay={renderTooltip}>
                        <div className="tooltipDashed relative table mx-auto w-auto">
                          <div className="flex items-center justify-center gap-2">
                            {seoAudit.crawled} / {seoAudit.total} pages audited
                          </div>
                        </div>
                      </OverlayTrigger>
                    )}
                  </h4>
                </div>

                <div className="mt-2">
                  {auditStatus == 2 && seoAudit.crawled != seoAudit.total && (
                    <button
                      className="custom-btn"
                      onClick={() => setShowConfirmationModal(true)}
                    >
                      Re-audit
                    </button>
                  )}
                  {auditStatus == 0 && seoAudit.crawled != seoAudit.total && (
                    <Badge className="!bg-[#F0F0F0] !text-[#7E7E7E] !font-normal">
                      Audit in Progress...
                    </Badge>
                  )}
                </div>
              </div>

              <div className="errorCard">
                <div className="infoCard w-[100%] md:w-[350px] !p-0 !bg-[#FAFBFC]">
                  <div className="flex justify-between items-center gap-2 p-3 border-b border-[#EEEEEE]">
                    <div className="flex items-center gap-1">
                      <h6 className="text-sm font-normal whitespace-normal">
                        We found
                      </h6>

                      {!(
                        Number.isFinite(errors.meta) &&
                        Number.isFinite(errors.content) &&
                        Number.isFinite(errors.image) &&
                        Number.isFinite(errors.broken)
                      ) ? (
                        <Spinner size="sm" />
                      ) : (
                        <span className="text-[#FF5E60] text-sm">
                          {errors.meta +
                            errors.content +
                            errors.image +
                            errors.broken}
                        </span>
                      )}

                      <span className="text-[#FF5E60] text-sm">errors</span>
                    </div>
                    <Link href={"/seo-audit"} className="headBtn-link">
                      <button type="button" className="custom-btn">
                        Fix Errors
                      </button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-3 pt-3 pb-3">
                    {/* Meta */}
                    <div className="flex items-center gap-2 justify-between relative">
                      <Link
                        href="seo-audit?tab=errors&type=metaTagIssue"
                        className="flex items-center gap-2 justify-between cursor-pointer w-[100%] hover:no-underline"
                      >
                        <div className="flex items-center gap-2">
                          {errors.meta === 0 ? (
                            <Image
                              src={`${basePath}/images/check-circle-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          ) : (
                            <Image
                              src={`${basePath}/images/alert-diamond-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          )}
                          <h6 className="text-sm font-normal text-[#303030]">
                            Meta
                          </h6>
                        </div>

                        <div className="flex items-center justify-end">
                          {Number.isFinite(errors.meta) ? (
                            errors.meta === 0 ? (
                              <span className="text-[#16A34A] text-sm">
                                {errors.meta}
                              </span>
                            ) : (
                              <span className="text-[#FF5E60] text-sm">
                                {errors.meta}
                              </span>
                            )
                          ) : (
                            <Spinner size="sm" />
                          )}
                        </div>
                      </Link>

                      {/* Right separator */}
                      <div className="absolute right-[-16px] top-1/2 h-[18px] w-[1px] bg-[#e5e5e5] -translate-y-1/2"></div>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-2 justify-between relative">
                      <Link
                        href="seo-audit?tab=errors&type=contentIssue"
                        className="flex items-center gap-2 justify-between cursor-pointer w-[100%] hover:no-underline"
                      >
                        <div className="flex items-center gap-2">
                          {errors.content === 0 ? (
                            <Image
                              src={`${basePath}/images/check-circle-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          ) : (
                            <Image
                              src={`${basePath}/images/alert-diamond-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          )}
                          <h6 className="text-sm font-normal text-[#303030]">
                            Content
                          </h6>
                        </div>

                        <div className="flex items-center justify-end">
                          {Number.isFinite(errors.content) ? (
                            errors.content === 0 ? (
                              <span className="text-[#16A34A] text-sm">
                                {errors.content}
                              </span>
                            ) : (
                              <span className="text-[#FF5E60] text-sm">
                                {errors.content}
                              </span>
                            )
                          ) : (
                            <Spinner size="sm" />
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Image */}
                    <div className="flex items-center gap-2 justify-between relative">
                      <Link
                        href="seo-audit?tab=errors&type=imagesIssue"
                        className="flex items-center gap-2 justify-between cursor-pointer w-[100%] hover:no-underline"
                      >
                        <div className="flex items-center gap-2">
                          {errors.image === 0 ? (
                            <Image
                              src={`${basePath}/images/check-circle-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          ) : (
                            <Image
                              src={`${basePath}/images/alert-diamond-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          )}
                          <h6 className="text-sm font-normal text-[#303030]">
                            Image
                          </h6>
                        </div>

                        <div className="flex items-center justify-end">
                          {Number.isFinite(errors.image) ? (
                            errors.image === 0 ? (
                              <span className="text-[#16A34A] text-sm">
                                {errors.image}
                              </span>
                            ) : (
                              <span className="text-[#FF5E60] text-sm">
                                {errors.image}
                              </span>
                            )
                          ) : (
                            <Spinner size="sm" />
                          )}
                        </div>
                      </Link>
                      {/* Right separator */}
                      <div className="absolute right-[-16px] top-1/2 h-[18px] w-[1px] bg-[#e5e5e5] -translate-y-1/2"></div>
                    </div>

                    {/* Broken */}
                    <div className="flex items-center gap-2 justify-between relative">
                      <Link
                        href="seo-audit?tab=errors&type=brokenLinksIssue"
                        className="flex items-center gap-2 justify-between cursor-pointer w-[100%] hover:no-underline"
                      >
                        <div className="flex items-center gap-2">
                          {errors.broken === 0 ? (
                            <Image
                              src={`${basePath}/images/check-circle-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          ) : (
                            <Image
                              src={`${basePath}/images/alert-diamond-icon.svg`}
                              alt=""
                              width={16}
                              height={16}
                            />
                          )}
                          <h6 className="text-sm font-normal text-[#303030]">
                            Broken
                          </h6>
                        </div>

                        <div className="flex items-center justify-end">
                          {Number.isFinite(errors.broken) ? (
                            errors.broken === 0 ? (
                              <span className="text-[#16A34A] text-sm">
                                {errors.broken}
                              </span>
                            ) : (
                              <span className="text-[#FF5E60] text-sm">
                                {errors.broken}
                              </span>
                            )
                          ) : (
                            <Spinner size="sm" />
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="-ml-4 -mr-4 border-t border-[#EEEEEE] pt-3 px-3">
              <div className="flex items-center justify-between">
                <h6 className="text-[14px] font-light text-[#616161]">
                  Quick Actions
                </h6>

                <h6 className="text-xs text-[#616161] font-normal">
                  Jump straight to the most used tools
                </h6>
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/seo-audit" className="flex-[1_1_auto]">
                    <button className="btn-default w-full">
                      Optimize Meta Tags
                    </button>
                  </Link>
                  <Link href="/url-editor" className="flex-[1_1_auto]">
                    <button className="btn-default w-full">
                      Fix Broken Links
                    </button>
                  </Link>
                  <Link href="/image-optimizer" className="flex-[1_1_auto]">
                    <button className="btn-default w-full">
                      Compress Images
                    </button>
                  </Link>
                  <Link href="/rank-tracker" className="flex-[1_1_auto]">
                    <button className="btn-default w-full">
                      Track Keywords
                    </button>
                  </Link>
                  <Link href="/rich-snippets" className="flex-[1_1_auto]">
                    <button className="btn-default w-full">Add Schemas</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Rank Tracker and page speed start */}
          <div className="card !mb-0 p-0">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">
                  Store Performance — Quick Snapshot
                </h3>
                <p className="text-xs text-[#616161] font-normal">
                  All key metrics in one place
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
              <div className="infoCard !bg-white !p-0">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-[#303030]">
                      Rank Tracker
                    </h3>
                    <p className="text-xs text-[#616161] font-normal">
                      Check your store&apos;s position on Google
                    </p>
                  </div>

                  {/* <Badge tone="success">+4.2% this week</Badge> */}
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 relative">
                  {/* Vertical Divider */}
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-[29px] bg-[#E5E5E5]"></div>

                  <div className="flex flex-col items-center gap-1.5">
                    <h4 className="text-2xl text-[#007a5c] flex items-center gap-1 font-normal mb-0">
                      {rankTracker.avgRanking}
                    </h4>

                    <p className="text-xs text-[#616161] font-normal">
                      Avg. Rank
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <h4 className="text-2xl flex items-center gap-1 font-normal mb-0">
                      {rankTracker.keywords}
                    </h4>

                    <p className="text-xs text-[#616161] font-normal">
                      Keywords
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mb-3 mt-2">
                  <div className="flex gap-2">
                    <Link href="/rank-tracker">
                      <button className="btn-default">View Keywords</button>
                    </Link>
                    <Link href="/add-keyword">
                      <button className="btn-default">Add Keywords</button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="infoCard !bg-white !p-0">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-[#303030]">
                      Page Speed
                    </h3>
                    <p className="text-xs text-[#616161] font-normal">
                      Desktop / Mobile
                    </p>
                  </div>

                  <Link href="/page-speed" className="relative">
                    <div className="absolute -top-3 -left-1">
                      <Image
                        src={`${basePath}/images/free-icon.svg`}
                        alt=""
                        width={36}
                        height={20}
                      />
                    </div>
                    <button className="btn-default">
                      Request Optimization
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 relative">
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-[#E5E5E5]"></div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-[68px] h-[68px]">
                      <div className="absolute inset-0 rounded-full border-[6px] border-[#D9D9D9]"></div>

                      <svg className="absolute inset-0" viewBox="0 0 36 36">
                        <path
                          strokeDasharray={`${(homeDesktop / 100) * 100}, 100`}
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          stroke={
                            homeDesktop <= 49
                              ? "#FF5E60"
                              : homeDesktop <= 89
                                ? "#ffaa33"
                                : "#22C55E"
                          }
                          fill="none"
                          d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
                        />
                      </svg>

                      {/* Score */}
                      <div
                        className="absolute inset-0 flex items-center justify-center text-xl font-semibold"
                        style={{
                          color:
                            homeDesktop <= 49
                              ? "#FF5E60"
                              : homeDesktop <= 89
                                ? "#ffaa33"
                                : "#22C55E",
                        }}
                      >
                        {homeDesktop}
                      </div>
                    </div>

                    <p className="text-xs text-[#616161] font-normal">
                      Desktop
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-[68px] h-[68px]">
                      <div className="absolute inset-0 rounded-full border-[6px] border-[#D9D9D9]"></div>

                      <svg className="absolute inset-0" viewBox="0 0 36 36">
                        <path
                          strokeDasharray={`${(homeMobile / 100) * 100}, 100`}
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          stroke={
                            homeMobile <= 49
                              ? "#FF5E60"
                              : homeMobile <= 89
                                ? "#ffaa33"
                                : "#22C55E"
                          }
                          fill="none"
                          d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
                        />
                      </svg>

                      {/* Score */}
                      <div
                        className="absolute inset-0 flex items-center justify-center text-xl font-semibold"
                        style={{
                          color:
                            homeMobile <= 49
                              ? "#FF5E60"
                              : homeMobile <= 89
                                ? "#ffaa33"
                                : "#22C55E",
                        }}
                      >
                        {homeMobile}
                      </div>
                    </div>

                    <p className="text-xs text-[#616161] font-normal">Mobile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Optimizer and Image Optimizer start */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="infoCard !bg-white !p-0">
              {/* Header */}
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-[#303030]">
                    Bulk Optimizer
                  </h3>
                  <p className="text-xs text-[#616161] font-normal">
                    Optimize all store images in one go
                  </p>
                </div>

                <Link href="/bulk-optimizer">
                  <button className="btn-default">
                    Start Bulk Optimization
                  </button>
                </Link>
              </div>

              <div className="flex flex-col gap-[20px] p-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal text-[#616161]">
                    Empty Title Tags
                  </p>

                  <p className="text-sm text-[#303030] font-normal mt-0 tooltipDashed relative">
                    <OverlayTrigger
                      show={showTitleTagPopover}
                      trigger={[]}
                      placement="auto"
                      overlay={titleTagPopover}
                      popperConfig={{
                        modifiers: [
                          {
                            name: "flip",
                            options: {
                              fallbackPlacements: ["top", "bottom"],
                              allowedAutoPlacements: ["top", "bottom"],
                            },
                          },
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "viewport",
                            },
                          },
                        ],
                      }}
                    >
                      <p
                        className={`text-sm font-normal cursor-pointer ${
                          typeof bulkOptimizer.titleTag.total === "number" &&
                          bulkOptimizer.titleTag.total === 0
                            ? "text-[#007a5c]"
                            : "text-[#FF5E60]"
                        }`}
                        onMouseEnter={() => {
                          if (titleTagTimeoutRef.current) {
                            clearTimeout(titleTagTimeoutRef.current);
                          }
                          setShowTitleTagPopover(true);
                        }}
                        onMouseLeave={() => {
                          titleTagTimeoutRef.current = setTimeout(() => {
                            setShowTitleTagPopover(false);
                          }, 200);
                        }}
                      >
                        {bulkOptimizer.titleTag.total}
                      </p>
                    </OverlayTrigger>
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal text-[#616161]">
                    Empty Meta Description
                  </p>

                  <p className="text-sm text-[#303030] font-normal mt-0 tooltipDashed relative">
                    <OverlayTrigger
                      show={showMetaDescPopover}
                      trigger={[]}
                      placement="auto"
                      overlay={metaDescriptionPopover}
                      popperConfig={{
                        modifiers: [
                          {
                            name: "flip",
                            options: {
                              fallbackPlacements: ["top", "bottom"],
                              allowedAutoPlacements: ["top", "bottom"],
                            },
                          },
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "viewport",
                            },
                          },
                        ],
                      }}
                    >
                      <p
                        className={`text-sm font-normal cursor-pointer ${
                          typeof bulkOptimizer.metaDescription.total ===
                            "number" &&
                          bulkOptimizer.metaDescription.total === 0
                            ? "text-[#007a5c]"
                            : "text-[#FF5E60]"
                        }`}
                        onMouseEnter={() => {
                          if (metaDescTimeoutRef.current) {
                            clearTimeout(metaDescTimeoutRef.current);
                          }
                          setShowMetaDescPopover(true);
                        }}
                        onMouseLeave={() => {
                          metaDescTimeoutRef.current = setTimeout(() => {
                            setShowMetaDescPopover(false);
                          }, 200);
                        }}
                      >
                        {bulkOptimizer.metaDescription.total}
                      </p>
                    </OverlayTrigger>
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal text-[#616161]">
                    Empty Alt Texts
                  </p>
                  <p
                    className={`text-sm font-normal mt-0 ${
                      typeof bulkOptimizer.altText.total === "number" &&
                      bulkOptimizer.altText.total === 0
                        ? "text-[#007a5c]"
                        : "text-[#FF5E60]"
                    }`}
                  >
                    {bulkOptimizer.altText.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="infoCard !bg-white !p-0">
              {/* Header */}
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-[#303030]">
                    Image Optimizer
                  </h3>
                  <p className="text-xs text-[#616161] font-normal">
                    Compress Images for better page speed
                  </p>
                </div>

                <Link href="/image-optimizer">
                  <button className="btn-default">Fix Images</button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 relative">
                <div className="infoCard !bg-white">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-normal text-[#616161]">
                      Fixed Images
                    </p>
                    <h4 className="text-2xl text-[#007a5c] flex items-center gap-1 font-normal mb-0">
                      {/* Fixed Images */}
                      {Number.isFinite(Number(fixedImage)) ? (
                        Number(fixedImage)
                      ) : (
                        <span className="inline-flex items-center">
                          <Spinner size="sm" />
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                <div className="infoCard !bg-white">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-normal text-[#616161]">
                      Total Products
                    </p>
                    <h4 className="text-2xl text-[#303030] flex items-center gap-1 font-normal mb-0">
                      {/* Total Products */}
                      {Number.isFinite(Number(totalProduct)) ? (
                        Number(totalProduct)
                      ) : (
                        <span className="inline-flex items-center">
                          <Spinner size="sm" />
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support start */}
          <div className="card">
            <div className="cardHeader flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">Support</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 mt-2.5">
              {/* Card 1 */}
              <Link
                className="hover:no-underline focus:no-underline"
                href="https://www.seokart.com/how-to-guide/"
                target="_blank"
              >
                <div className="flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border !border-transparent h-full hover:bg-[#FCFBFF] hover:!border hover:!border-[#F2F1FF]  hover:shadow-sm">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-[#F2F1FF] flex items-center justify-center">
                    <Image
                      src={`${basePath}/images/play-icon.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-normal text-sm mb-0 text-[#303030]">
                      SEOKart Tutorial Videos
                    </h4>
                    <p className="text-xs text-[#616161] font-normal">
                      Learn how to optimize your website with short, focused
                      videos.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 2 */}
              <Link
                className="hover:no-underline focus:no-underline"
                href={"/help?tab=faqs"}
              >
                <div className="flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border !border-transparent h-full hover:bg-[#FCFBFF] hover:!border hover:!border-[#F2F1FF]  hover:shadow-sm">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-[#F2F1FF] flex items-center justify-center">
                    <Image
                      src={`${basePath}/images/question-icon.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-normal text-sm mb-0 text-[#303030]">
                      SEOKart Help Center
                    </h4>
                    <p className="text-xs text-[#616161] font-normal">
                      Make use of FAQs to get faster help.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card 3 */}
              <Link
                className="hover:no-underline focus:no-underline"
                href={`/help?tab=ask-an-expert&subject=${encodeURIComponent(
                  "Feature request/Report a bug",
                )}`}
              >
                <div className="flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border !border-transparent h-full hover:bg-[#FCFBFF] hover:!border hover:!border-[#F2F1FF]  hover:shadow-sm">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-xl bg-[#F2F1FF] flex items-center justify-center">
                    <Image
                      src={`${basePath}/images/feature-request-cion.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-normal text-sm mb-0 text-[#303030]">
                      Feature Request/Report a Bug
                    </h4>
                    <p className="text-xs text-[#616161] font-normal">
                      Recommend features and improvements for future updates.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
