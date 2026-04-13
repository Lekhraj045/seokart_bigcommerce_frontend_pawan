"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import _ from "lodash";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { basePath } from "@/next.config";
import CopilotRight from "./copilotRight/page";
import {
  Spinner,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import Select from "react-select";
import { Api } from "@/app/_api/apiCall";
import { copilotApi } from "@/app/_api/apiCall";
import Modal from "react-bootstrap/Modal";
import ImageOptimizerSetting from "@/app/(bigcommerce)/image-optimizer-setting/seoCopilot";

const ChannelList = dynamic(() => import("@/app/_components/channelList"), {
  ssr: false,
});
const Howitwork = dynamic(() => import("@/app/_howitwork/modal"), {
  ssr: false,
});
import UpgradeButton from "../../_components/upgradeButton";
import Hamburger from "../../_components/hamburger";
import { toast } from "react-toastify";
import { totalmem } from "os";

export default function Home() {
  const dropdownToggleRef = useRef<any>(null);
  const [rightKey, setRightKey] = useState(1);
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeItemId, setActiveItemId] = useState();
  const [rightSideLoading, setRightSideLoading] = useState(1);
  const childRef = useRef<any>();
  const [itemType, setItemType] = useState("all");
  const [sort, setSort] = useState<string>(
    localStorage?.getItem("sort") || "atoz",
  );
  const [emptyType, setEmptyType] = useState(
    localStorage?.getItem("emptyType") ?? "all",
  );
  const [searchKeyword, setSearchKeyword] = useState(
    localStorage?.getItem("searchKeyword") ?? "",
  );

  const pathname = usePathname();

  const [itemList, setItemList] = useState<any>({
    data: [],
    loading: true,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [limit, setLimit] = useState<any>(localStorage?.getItem("limit") ?? 10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [updateSeoScore, setUpdateSeoScore] = useState();
  const [updateItemName, setUpdateItemName] = useState();
  const [gptLanguage, setGptLanguage] = useState("english");
  const [credits, setCredits] = useState({ used: 0, limit: 0 });
  const [currentPageHidden, setCurrentPageHidden] = useState("");
  const [aiButtonLoading, setAiButtonLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    faqs: false,
    targetKeyword: false,
    titleTag: false,
    metaDescription: false,
    description: false,
    image: false,
  });
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingSwitchItemId, setPendingSwitchItemId] = useState<any>(null);
  const [pendingSwitchIndex, setPendingSwitchIndex] = useState<any>(null);
  const [currentItemType, setCurrentItemType] = useState("");

  // fetch channel active domain from local storage
  const [channelDomain, setChannelDomain] = useState("");
  useEffect(() => {
    const channel = JSON.parse(localStorage?.getItem("channel") ?? "");
    setChannelDomain(channel.domain);
  }, []);

  useEffect(() => {
    if (!activeItemId) setCurrentItemType("");
  }, [activeItemId]);

  const onItemTypeChange = useCallback((type: string) => {
    setCurrentItemType((prev) => (prev === type ? prev : type));
  }, []);

  const handleOnClick = async () => {
    const allUnchecked = Object.values(checkedItems).every(
      (value) => value === false,
    );

    if (allUnchecked) {
      toast.error("Select fields to run SEO Co-pilot");
      dropdownToggleRef.current?.click();
      return "";
      // Add your condition logic here
    }
    setAiButtonLoading(true);
    try {
      await childRef.current?.handleRunSeoCopilot(checkedItems);
    } catch (err) {
      // optional: toast.error("Something went wrong");
    } finally {
      setAiButtonLoading(false); // yeh hamesha chalega - success ya error dono mein
    }
  };

  useEffect(() => {
    if (updateSeoScore) {
      itemList.data[activeIndex] = {
        ...itemList.data[activeIndex],
        seo_score: updateSeoScore,
      };
      setItemList((prev: any) => {
        return { ...prev, data: itemList.data };
      });
      // console.log(activeIndex);
      // console.log(itemList.data[activeIndex]);
    }
  }, [updateSeoScore]);

  useEffect(() => {
    if (updateItemName) {
      itemList.data[activeIndex] = {
        ...itemList.data[activeIndex],
        item_name: updateItemName,
      };
      setItemList((prev: any) => {
        return { ...prev, data: itemList.data };
      });
      // console.log(activeIndex);
      // console.log(itemList.data[activeIndex]);
    }
  }, [updateItemName]);

  useEffect(() => {
    setSearchKeyword("");
    localStorage.setItem("searchKeyword", "");
  }, [pathname]);

  const getSetGptSettings = async () => {
    const settings = await copilotApi("getGptSettings", {});
    
    setCheckedItems({
      targetKeyword: settings?.data?.target_keyword ? true : false,
      titleTag: settings?.data?.title_tag ? true : false,
      metaDescription: settings?.data?.meta_description ? true : false,
      description: settings?.data?.description ? true : false,
      faq: settings?.data?.faq ? true : false,
      image: settings?.data?.image ? true : false,
    });
  };

  interface CheckedItems {
    targetKeyword: boolean;
    titleTag: boolean;
    metaDescription: boolean;
    description: boolean;
    image: boolean;
    faqs: boolean;
  }
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedSetGptSettings = useMemo(
    () =>
      _.debounce((settings: CheckedItems) => {
        copilotApi("setGptSettings", {
          target_keyword: settings.targetKeyword,
          title_tag: settings.titleTag,
          meta_description: settings.metaDescription,
          description: settings.description,
          image: settings.image,
          faqs: settings.faqs,
        });
      }, 500),
    [],
  );

  const handleCheckboxChange = (key: keyof CheckedItems): void => {
    setCheckedItems((prev: CheckedItems) => {
      const updated = { ...prev, [key]: !prev[key] };

      debouncedSetGptSettings(updated);

      if (key === "image" && !prev.image) {
        setShowModal(true);
      }

      return updated;
    });
  };

  const getSeoAuditPageData = () => {
    setItemList((prev: any) => ({ data: [], loading: true, total: 0 }));
    Api("getSeoAuditPageData", {
      item_type: itemType,
      sort: sort,
      empty_type: emptyType,
      search_key: searchKeyword,
      page: currentPage,
      limit: limit,
    }).then((data: any) => {
      setTotalPage(Math.ceil(data?.total_page_count / limit));
      setItemList((prev: any) => ({
        data: data.data,
        loading: false,
        total: data.total_page_count,
      }));

      setActiveIndex(0);
      setRightSideLoading((prev) => prev + 1);
      setRightKey((prev) => prev + 1);
      setActiveItemId(data?.data[0]?.id);
    });
  };



  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (itemList.data.length > 0 && currentPage == 1) {
      setActiveItemId(itemList?.data[0]?.id);
      setActiveIndex(0);
    }
    // getSelectedAiLang();
    getSetGptSettings();
  }, []);

  const prevFilterRef = useRef({ searchKeyword, sort, itemType });
  const skipPageEffectRef = useRef(false);

  useEffect(() => {
    skipPageEffectRef.current = true;
    setCurrentPage(1);

    const prev = prevFilterRef.current;
    const isSearchOnlyChange =
      prev.searchKeyword !== searchKeyword &&
      prev.sort === sort &&
      prev.itemType === itemType;
    prevFilterRef.current = { searchKeyword, sort, itemType };

    const delay = isSearchOnlyChange ? 500 : 0;
    const timer = setTimeout(() => {
      getSeoAuditPageData();
      skipPageEffectRef.current = false;
    }, delay);
    return () => clearTimeout(timer);
  }, [searchKeyword, sort, itemType]);

  useEffect(() => {
    if (skipPageEffectRef.current) {
      skipPageEffectRef.current = false;
      return;
    }
    getSeoAuditPageData();
  }, [currentPage]);

  const handleOnChangeLanguage = (selectedValue: any) => {
    setGptLanguage(selectedValue.value);
    Api("updateGptLanguage", { language: selectedValue.value }).then(
      (response) => {
        response.status_code == 200
          ? toast.success("Language Changed Successfully.")
          : toast.error("Something went wrong.");
      },
    );
  };

  const languageList = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese (Simplified)", value: "chinese (simplified)" },
    { label: "Chinese (Traditional)", value: "chinese (traditional)" },
    { label: "Japanese", value: "japanese" },
    { label: "Hindi", value: "hindi" },
    { label: "Korean", value: "korean" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Italian", value: "italian" },
    { label: "Dutch", value: "dutch" },
    { label: "Russian", value: "russian" },
    { label: "Arabic", value: "arabic" },
    { label: "Turkish", value: "turkish" },
    { label: "Polish", value: "polish" },
    { label: "Swedish", value: "swedish" },
    { label: "Danish", value: "danish" },
    { label: "Finnish", value: "finnish" },
    { label: "Norwegian", value: "norwegian" },
    { label: "Greek", value: "greek" },
    { label: "Hebrew", value: "hebrew" },
    { label: "Thai", value: "thai" },
    { label: "Vietnamese", value: "vietnamese" },
    { label: "Indonesian", value: "indonesian" },
  ];

  useEffect(() => {
    setCurrentPageHidden(String(currentPage));
  }, [currentPage]);

  return (
    <>
      <div className="content-frame-main">
        <div className="content-frame-head flex justify-content-between align-item-center">
          <div className="content-frameHead-left flex align-item-center gap-2">
            <h1 className="Text--headingLg flex align-item-center gap-2">
              SEO Copilot
              <Howitwork page="seoaudit" />
            </h1>
            <ChannelList />
          </div>

          <div className="content-frameHead-right">
            {/* <div className="badge badge-success">
              Quota Used: {credits.used} /{credits.limit}
            </div> */}
            <Select
              value={languageList.find((item) => item.value == gptLanguage)}
              onChange={handleOnChangeLanguage}
              options={languageList}
            />
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Select fields to run SEO Co-pilot</Tooltip>}
            >
              <button
                type="button"
                className="custom-btn flex items-center gap-2"
                onClick={handleOnClick}
                title="Select fields to run SEO Co-pilot"
              >
                <Image
                  src={`${basePath}/images/magic-icon.svg`}
                  alt=""
                  width={20}
                  height={20}
                />
                {aiButtonLoading ? <Spinner size="sm" /> : "Run SEO Copilot"}
              </button>
            </OverlayTrigger>

            <div className="copilot-settingDropi">
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  ref={dropdownToggleRef}
                >
                  <Image
                    src={`${basePath}/images/setting-icon.svg`}
                    alt="Settings"
                    width={20}
                    height={20}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-3 w-[270px]">
                  <ul className="space-y-3">
                    {/* Target Keyword */}
                    <li>Select to run SEO Co-pilot.</li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="targetKeyword"
                          type="checkbox"
                          checked={checkedItems.targetKeyword}
                          onChange={() => handleCheckboxChange("targetKeyword")}
                          className="form-check-input cursor-pointer mt-0"
                        />
                        <label
                          htmlFor="targetKeyword"
                          className="ms-2 text-sm font-medium text-gray-900"
                        >
                          Target Keyword
                        </label>
                      </div>
                    </li>

                    {/* Title Tag - hidden for blog */}
                    {currentItemType !== "blog" &&
                      currentItemType !== "home" && (
                        <li>
                          <div className="flex items-center">
                            <input
                              id="titleTag"
                              type="checkbox"
                              checked={checkedItems.titleTag}
                              onChange={() => handleCheckboxChange("titleTag")}
                              className="form-check-input cursor-pointer mt-0"
                            />
                            <label
                              htmlFor="titleTag"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Title Tag
                            </label>
                          </div>
                        </li>
                      )}

                    {/* Meta Description */}
                    {currentItemType !== "home" && (
                      <li>
                        <div className="flex items-center">
                          <input
                            id="metaDescription"
                            type="checkbox"
                            checked={checkedItems.metaDescription}
                            onChange={() =>
                              handleCheckboxChange("metaDescription")
                            }
                            className="form-check-input cursor-pointer mt-0"
                          />
                          <label
                            htmlFor="metaDescription"
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            Meta Description
                          </label>
                        </div>
                      </li>
                    )}

                    {/* Description */}
                    {currentItemType !== "brand" &&
                      currentItemType !== "home" && (
                        <li>
                          <div className="flex items-center">
                            <input
                              id="description"
                              type="checkbox"
                              checked={checkedItems.description}
                              onChange={() =>
                                handleCheckboxChange("description")
                              }
                              className="form-check-input cursor-pointer mt-0"
                            />
                            <label
                              htmlFor="description"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Description
                            </label>
                          </div>
                        </li>
                      )}

                      {/* FAQs */}
                    {currentItemType  === "product" && (
                        <li>
                          <div className="flex items-center">
                            <input
                              id="faqs"
                              type="checkbox"
                              checked={checkedItems.faqs}
                              onChange={() =>
                                handleCheckboxChange("faqs")
                              }
                              className="form-check-input cursor-pointer mt-0"
                            />
                            <label
                              htmlFor="faqs"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              FAQs
                            </label>
                          </div>
                        </li>
                      )}


                    {/* ✅ Image Section */}
                    <li>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                          <input
                            id="image"
                            type="checkbox"
                            checked={checkedItems.image}
                            onChange={() => handleCheckboxChange("image")}
                            className="form-check-input cursor-pointer mt-0"
                          />
                          <label
                            htmlFor="image"
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            Image
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <UpgradeButton />
            <Hamburger />
          </div>
        </div>

        <div className="seo-optimizerMain">
          <div className="flex items-start gap-6">
            <div className="copilot-leftArea w-[380px] sticky top-0">
              <div className="card p-0">
                <div className="copilot-leftInner">
                  {/* Filters and Search */}
                  <div className="relative flex flex-col sm:flex-row justify-between gap-2 2xl:gap-3 p-3">
                    <div className="custom-dropi without-labelDropi">
                      <select
                        className="form-select"
                        value={itemType}
                        onChange={(e) => {
                          setItemType(e.target.value);
                          setSearchKeyword("");
                          localStorage.setItem("searchKeyword", "");
                          setCurrentPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="home">Home</option>
                        <option value="product">Products</option>
                        <option value="category">Categories</option>
                        <option value="brand">Brands</option>
                        <option value="page">Pages</option>
                        <option value="blog">Blogs</option>
                      </select>
                    </div>

                    <div className="sm:absolute right-3">
                      <div className="flex items-center justify-center">
                        {/* For screens >= 640px → expandable search */}
                        <div
                          className={`hidden sm:flex items-center bg-white border border-gray-300 transition-all duration-300 overflow-hidden rounded-md h-[33px]
                            ${
                              isOpen
                                ? "w-[250px] xl1366:w-[234px] sm:w-[336px] pr-3"
                                : "w-[36px]"
                            }
                          `}
                        >
                          {/* Search Icon Button */}
                          <button
                            onClick={() => setIsOpen(true)}
                            className="flex items-center justify-center text-gray-500 hover:text-gray-700 py-[6px] px-[8px]"
                          >
                            <Image
                              src={`${basePath}/images/search-icon.svg`}
                              alt="Search"
                              width={18}
                              height={18}
                              style={{ minWidth: 18, minHeight: 18 }}
                            />
                          </button>

                          {/* Input Field */}
                          <input
                            value={searchKeyword}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSearchKeyword(value);
                              localStorage.setItem("searchKeyword", value);
                              setCurrentPage(1);
                            }}
                            type="text"
                            placeholder="Search Product"
                            className={`w-full font-normal bg-transparent outline-none text-gray-700 text-[13px] transition-all duration-300
              ${isOpen ? "opacity-100 visible" : "opacity-0 invisible w-0"}
            `}
                          />

                          {/* Close Button */}
                          {isOpen && (
                            <button
                              onClick={() => {
                                setSearchKeyword("");
                                localStorage.setItem("searchKeyword", "");
                                setCurrentPage(1);
                                setIsOpen(false);
                              }}
                              className="text-gray-500 hover:text-gray-700 ml-2 flex items-center justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/*  For screens < 640px → always visible input */}
                        <div className="flex sm:hidden items-center bg-white border border-gray-300 rounded-md h-[33px] px-2 w-full">
                          <Image
                            src={`${basePath}/images/search-icon.svg`}
                            alt="Search"
                            width={18}
                            height={18}
                            style={{ minWidth: 18, minHeight: 18 }}
                          />
                          <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSearchKeyword(value);
                              localStorage.setItem("searchKeyword", value);
                              setCurrentPage(1);
                            }}
                            placeholder="Search Product"
                            className="ml-2 w-full font-normal bg-transparent outline-none text-gray-700 text-[13px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products table */}
                  <div className="border">
                    {/* Table header */}
                    <div className="flex justify-between items-center px-3 py-2 border-b bg-gray-50">
                      <span className="font-extrabold">Name</span>
                      <div className="copilot-sortDropdown">
                        <div className="custom-dropi without-labelDropi">
                          <select
                            className="form-select"
                            value={sort}
                            onChange={(e) => {
                              setSort(e.target.value);
                              localStorage.setItem("sort", e.target.value);
                            }}
                          >
                            <option value="atoz">Name - A to Z</option>
                            <option value="ztoa">Name - Z to A</option>
                            <option value="lth">SEO Score - Low to High</option>
                            <option value="htl">SEO Score - High to Low</option>
                            <option value="latest">Latest</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {itemList.loading ? (
                      <h1 className="text-center text-2xl font-bold">
                        Loading...
                      </h1>
                    ) : (
                      <div
                        ref={listRef}
                        className={`copilot-listArea overflow-auto scroll`}
                      >
                        {itemList?.data?.map((item: any, key: any) => (
                          <div
                            onClick={() => {
                              const hasUnsaved =
                                childRef.current?.hasUnsavedChanges?.();
                              if (hasUnsaved) {
                                setPendingSwitchItemId(item?.id);
                                setPendingSwitchIndex(key);
                                setShowUnsavedModal(true);
                                return;
                              }
                              if (activeItemId === item?.id) return;
                              setActiveIndex(key);
                              setRightSideLoading((prev) => prev + 1);
                              setRightKey((prev) => prev + 1);
                              setActiveItemId(item?.id);
                            }}
                            key={key}
                            className={`flex justify-between items-center px-3 py-3 border-b last:border-0 cursor-pointer copilotProduct-row 
                            ${
                              activeIndex === key
                                ? "bg-[#3E3E3E] text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {item.showStatus && (
                                <span
                                  className={`w-2.5 h-2.5 min-w-2.5 min-h-2.5 rounded-full ${
                                    item.published
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></span>
                              )}

                              <div className="copilot-name flex gap-3 items-center">
                                <h6 className="text-[13px] font-normal whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                  {item.item_name}
                                </h6>

                                <a
                                  href={`${channelDomain}${item.item_url}`}
                                  target="_blank"
                                  title={item.item_name}
                                  className={`${
                                    activeIndex === key
                                      ? "text-yellow-400 hover:text-yellow-300"
                                      : "text-gray-500 hover:text-yellow-400"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M10.5 3a.5.5 0 0 0 0 1h1.793L6.146 10.146a.5.5 0 1 0 .708.708L13 4.707V6.5a.5.5 0 0 0 1 0v-3a.499.499 0 0 0-.5-.5h-3z" />
                                    <path
                                      d="M13.5 10a.5.5 0 0 1 .5.5V13a2 2 0 0 1-2 
                                  2H3a2 2 0 0 1-2-2V4a2 
                                  2 0 0 1 2-2h2.5a.5.5 
                                  0 0 1 0 1H3a1 1 0 0 
                                  0-1 1v9a1 1 0 0 0 1 
                                  1h9a1 1 0 0 0 1-1v-2.5a.5.5 
                                  0 0 1 .5-.5z"
                                    />
                                  </svg>
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-[20px] ${
                                  activeIndex === key
                                    ? "text-white"
                                    : item.seo_score >= 90
                                      ? "text-[#014B40]"
                                      : item.seo_score >= 80
                                        ? "text-[#4f4700]"
                                        : "text-[#8E0B21]"
                                }`}
                              >
                                {item.seo_score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {totalPage == 0 ? (
                      <div className="copilot-loadMore border-t flex items-center gap-1.5 justify-center py-2.5 flex-col gap-2"></div>
                    ) : (
                      <div className="copilot-loadMore border-t flex items-center gap-1.5 justify-center py-2.5">
                        <button
                          disabled={currentPage == 1}
                          className="customPagination-arrow w-9 h-9 border rounded-md flex items-center justify-center"
                          onClick={() =>
                            setCurrentPage((prev: any) => prev - 1)
                          }
                        >
                          <img src="/images/arrow-icon.svg" alt="" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage == 1}
                          className="customPagination-arrow min-w-9 h-9 border rounded-md flex items-center justify-center bg-white"
                        >
                          1
                        </button>
                        <input
                          type="number"
                          value={
                            currentPageHidden === ""
                              ? ""
                              : String(currentPageHidden)
                          }
                          placeholder="Go to page"
                          max={totalPage}
                          disabled={totalPage == 0}
                          onChange={(e) => {
                            setCurrentPageHidden(e.target.value);
                          }}
                          onBlur={(e: any) => {
                            const value = Number(e.target?.value);
                            if (!value || value <= 0) {
                              setCurrentPage(1);
                              setCurrentPageHidden("1");
                            } else if (value > totalPage) {
                              setCurrentPage(totalPage);
                              setCurrentPageHidden(String(totalPage));
                            } else {
                              setCurrentPage(value);
                              setCurrentPageHidden(String(value));
                            }
                          }}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              e.target?.blur();
                            }
                          }}
                          className="border border-gray-300 rounded-md h-9 px-2 py-1 w-28 appearance-none"
                        />
                        <button
                          disabled={currentPage == totalPage}
                          className="customPagination-arrow min-w-9 h-9 border rounded-md flex items-center justify-center bg-white"
                          onClick={() => setCurrentPage(totalPage)}
                        >
                          {totalPage}
                        </button>
                        <button
                          disabled={currentPage == totalPage}
                          className="customPagination-arrow w-9 h-9 border rounded-md flex items-center justify-center"
                          onClick={() =>
                            setCurrentPage((prev: any) => prev + 1)
                          }
                        >
                          <img
                            className="rotate-180"
                            src="/images/arrow-icon.svg"
                            alt=""
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1" key={rightKey}>
              {activeItemId && (
                <CopilotRight
                  gptLanguage={gptLanguage}
                  setGptLanguage={setGptLanguage}
                  mainItemId={activeItemId}
                  ref={childRef}
                  setUpdateSeoScore={setUpdateSeoScore}
                  checkedItems={checkedItems}
                  setUpdateItemName={setUpdateItemName}
                  onItemTypeChange={onItemTypeChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved changes confirm when switching product */}
      <Modal
        show={showUnsavedModal}
        onHide={() => {
          setShowUnsavedModal(false);
          setPendingSwitchItemId(null);
          setPendingSwitchIndex(null);
        }}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Unsaved changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Are you sure you want to switch without
          saving?
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowUnsavedModal(false);
              setPendingSwitchItemId(null);
              setPendingSwitchIndex(null);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const saved = childRef.current?.getSavedItemState?.();
              if (saved) {
                setItemList((prev: any) => {
                  const data = [...(prev.data || [])];
                  if (activeIndex != null && data[activeIndex]) {
                    data[activeIndex] = {
                      ...data[activeIndex],
                      item_name: saved.name ?? data[activeIndex].item_name,
                      ...(saved.seoScore !== undefined && {
                        seo_score: saved.seoScore,
                      }),
                    };
                  }
                  return { ...prev, data };
                });
              }
              if (pendingSwitchItemId != null) {
                setActiveIndex(pendingSwitchIndex);
                setRightSideLoading((prev) => prev + 1);
                setRightKey((prev) => prev + 1);
                setActiveItemId(pendingSwitchItemId);
              }
              setShowUnsavedModal(false);
              setPendingSwitchItemId(null);
              setPendingSwitchIndex(null);
            }}
          >
            Switch without saving
          </button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Modal Component */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        dialogClassName="copilot-settings-modal"
      >
        <Modal.Header closeButton>
          <h1>Image Optimizer Settings</h1>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ImageOptimizerSetting />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );  
}
