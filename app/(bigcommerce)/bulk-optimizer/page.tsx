"use client";

import ChannelList from "@/app/_components/channelList";
import UpgradeButton from "@/app/_components/upgradeButton";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Spinner } from "react-bootstrap";
import Bulkoptimizerhistory from "./_components/bulkOptimizerHistory";
import Cruisecontrolhistory from "./_components/cruiseControlHistory";
import { Api } from "@/app/_api/apiCall";
import Howitwork from "@/app/_howitwork/modal";
import Image from "next/image";
import { basePath } from "@/next.config";
import Tabcontent from "./_components/tabContent";
import Hamburger from "../../_components/hamburger";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("titleTag");
  const [selectedItem, setSelectedItem] = useState("product");
  const [bulkHomeData, setBulkHomeData] = useState<any>({
    data: {},
    loading: true,
  });

  const itemList = [
    { label: "Products", value: "product" },
    { label: "Category", value: "category" },
    { label: "Brand", value: "brand" },
  ];

  const [bulkOptimizerHistory, setBulkOptimizerHistory] = useState(false);

  const getBulkHomePageData = () => {
    setBulkOptimizerHistory(false);
    Api("bulkOptimizer/getBulkHomePageData").then(({ data }) => {
      setBulkHomeData({ data: data, loading: false });
      setBulkOptimizerHistory(true);
    });
  };

  useEffect(() => {
    getBulkHomePageData();
  }, []);

  return (
    <>
      <div className="content-frame-main">
        <div className="py-3 lg:py-6 flex justify-between items-start lg:items-center gap-3 flex-col lg:flex-row">
          <div className="content-frameHead-left flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#616161] font-normal uppercase">
                Bulk Optimizer
              </p>
              <Howitwork page="bulkoptimizer" />
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-[17px] md:text-xl font-semibold mb-[2px]">
                Template-based SEO Updates
              </h4>
              <span className="hidden lg:block">
                {bulkHomeData.loading ? (
                  <Spinner size="sm" />
                ) : (
                  <div className="badge badge-success !rounded-full">
                    Quota Used:{" "}
                    {`${bulkHomeData.data.totalUsedBulk}/${bulkHomeData.data.bulkLimitData}`}
                  </div>
                )}
              </span>
            </div>
            <p className="text-xs text-[#616161] font-normal">
              Create one smart template and apply it safely to hundreds of
              products at once.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <ChannelList />
            <UpgradeButton />
            <Hamburger />
          </div>

          <div className="mobileQuota block lg:hidden">
            <span>
              {bulkHomeData.loading ? (
                <Spinner size="sm" />
              ) : (
                <div className="badge badge-success !rounded-full">
                  Quota Used:{" "}
                  {`${bulkHomeData.data.totalUsedBulk}/${bulkHomeData.data.bulkLimitData}`}
                </div>
              )}
            </span>
          </div>
        </div>

        <div className="bulk-optimizerMain">
          <div className="card !p-0">
            <div className="flex justify-start sm:justify-between items-center p-3 border-b border-[#EEEEEE] flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="flex flex-col w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-[#303030]">
                    Choose What To Optimize
                  </h3>

                  <div className="flex flex-col gap-2 w-full sm:w-auto relative">
                    <p className="text-xs text-[#616161] font-normal inputLabelNew !bg-white">
                      Apply to
                    </p>
                    <div className="headChannel-dropi custom-dropi !w-full sm:!w-[150px] !max-w-full sm:!max-w-[150px]">
                      <select
                        className="form-select"
                        aria-label="Select item type"
                        onChange={(e) => {
                          setCurrentTab("titleTag");
                          setSelectedItem(e.target.value);
                        }}
                        value={selectedItem}
                      >
                        {itemList.map((item: any, key: any) => (
                          <option key={key} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="nav nav-tabs">
                  <div className="flex mt-2.5">
                    <button
                      className={`tab-heading-btn nav-link ${
                        currentTab === "titleTag" ? "active" : ""
                      }`}
                      onClick={() => setCurrentTab("titleTag")}
                    >
                      Title Tag
                    </button>
                    <button
                      className={`tab-heading-btn nav-link ${
                        currentTab === "metaDescription" ? "active" : ""
                      }`}
                      onClick={() => setCurrentTab("metaDescription")}
                    >
                      Meta Description
                    </button>
                    {selectedItem == "product" && (
                      <button
                        className={`tab-heading-btn nav-link ${
                          currentTab === "altText" ? "active" : ""
                        }`}
                        onClick={() => setCurrentTab("altText")}
                      >
                        Alt Text
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="bulk-optimizerTab--headLeft">
                <div className="tab-content-wrapper">
                  {currentTab === "titleTag" && (
                    <Tabcontent
                      bulkHomeData={bulkHomeData}
                      currentTab={currentTab}
                      selectedItem={selectedItem}
                      refresh={() => getBulkHomePageData()}
                    />
                  )}
                  {currentTab === "metaDescription" && (
                    <Tabcontent
                      bulkHomeData={bulkHomeData}
                      currentTab={currentTab}
                      selectedItem={selectedItem}
                      refresh={() => getBulkHomePageData()}
                    />
                  )}
                  {currentTab === "altText" && selectedItem == "product" && (
                    <Tabcontent
                      bulkHomeData={bulkHomeData}
                      currentTab={currentTab}
                      selectedItem={selectedItem}
                      refresh={() => getBulkHomePageData()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            {bulkOptimizerHistory && <Bulkoptimizerhistory />}
          </div>

          <div className="card">
            <Cruisecontrolhistory />
          </div>
        </div>
      </div>
    </>
  );
}
