import { OverlayTrigger, Tooltip, Dropdown, Spinner } from "react-bootstrap";
import Image from "next/image";
import { basePath } from "@/next.config";
import { useEffect, useState, useContext } from "react";
import { Api } from "@/app/_api/apiCall";
import { toast } from "react-toastify";
import CustomItemModal from "./customItemList";
import ConfirmModal from "./confirmModal";
import UpgradePopup from "@/app/_lib/upgradePopup";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/app/_context/global";

import { PlusCircleIcon, MinusCircleIcon } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";

export default function Home({
  bulkHomeData,
  currentTab,
  selectedItem,
  refresh,
}: {
  bulkHomeData: any;
  currentTab: any;
  selectedItem: any;
  refresh: any;
}) {
  const [template, setTemplate] = useState("");
  const [previewData, setPreviewData] = useState<any>({});
  const [homeUrl, setHomeUrl] = useState("");
  const [cruiseControl, setCruiseControl] = useState<boolean>(false);
  const [customModalShow, setCustomModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [updateType, setUpdateType] = useState("");
  const router = useRouter();

  const [range, setRange] = useState<any>({ start: 1, end: 2 });
  const [rangeBlank, setRangeBlank] = useState<any>({ start: 1, end: 2 });
  const [showPopup, setShowPopup] = useState(false);
  const [showViewMore, setShowViewMore] = useState(false);
  const { userStatus } = useContext(GlobalContext);

  const getLivePreviewData = () => {
    Api("bulkOptimizer/getLivePreviewData", { type: selectedItem }).then(
      (data) => {
        setPreviewData(data.data);
      },
    );
  };

  const updateBulkTemplate = () => {
    let fieldKey = "";
    if (currentTab == "titleTag" && selectedItem == "product") {
      fieldKey = "prd_title";
    }
    if (currentTab == "metaDescription" && selectedItem == "product") {
      fieldKey = "prd_desc";
    }
    if (currentTab == "altText" && selectedItem == "product") {
      fieldKey = "prd_alt_tag";
    }
    if (currentTab == "titleTag" && selectedItem == "category") {
      fieldKey = "cat_title";
    }
    if (currentTab == "metaDescription" && selectedItem == "category") {
      fieldKey = "cat_desc";
    }
    if (currentTab == "titleTag" && selectedItem == "brand") {
      fieldKey = "brand_title";
    }
    if (currentTab == "metaDescription" && selectedItem == "brand") {
      fieldKey = "brand_desc";
    }
    Api("bulkOptimizer/updateBulkTemplate", {
      template: template,
      field_key: fieldKey,
    }).then((data) => {
      toast.success("Template Saved.");
    });
  };

  const updateCruiseStatus = () => {
    if (cruiseControl == false) {
      const isPaid = localStorage?.getItem("manage_service") ?? 0;
      if (isPaid == 0) {
        toast.error("Please Upgrade Your Account.");
        return false;
      }
    }

    setCruiseControl(!cruiseControl);
    let obj = {};
    if (currentTab == "titleTag") {
      obj = {
        title: String(!cruiseControl),
        meta_desc: String(bulkHomeData.data.template.product_cruise.desc),
      };
    }
    if (currentTab == "metaDescription") {
      obj = {
        title: String(bulkHomeData.data.template.product_cruise.title),
        meta_desc: String(!cruiseControl),
      };
    }
    Api("bulkOptimizer/updateCruiseStatus", {
      item_type: selectedItem,
      ...obj,
    }).then(() => {
      toast.success("Cruise Control ON.");
      refresh();
    });
  };

  const setBulkQueue = (checkedItem = []) => {
    toast.info("Please wait...");
    setConfirmModalShow(false);
    setCustomModalShow(false);
    updateBulkTemplate();

    let templateType =
      currentTab == "titleTag"
        ? "title"
        : currentTab == "metaDescription"
          ? "description"
          : "alttag";
    let extraData;
    if (updateType == "update_range") {
      extraData = [String(range.start), String(range.end)];
    }

    if (updateType == "update_range_blank") {
      extraData = [String(rangeBlank.start), String(rangeBlank.end)];
    }

    if (updateType == "update_custom") {
      extraData = checkedItem;
    }

    Api("bulkOptimizer/setBulkQueue", {
      template_type: templateType,
      template_value: template,
      item_type: selectedItem,
      update_type: updateType,
      extra_data: extraData,
    }).then((data) => {
      refresh();
      if (data.status_code == 200) toast.success(data.message);
      else toast.error(data.message);
    });
  };

  useEffect(() => {
    getLivePreviewData();
  }, [selectedItem]);

  useEffect(() => {
    if (bulkHomeData.loading == false) {
      if (currentTab == "titleTag" && selectedItem == "product") {
        setTemplate(
          bulkHomeData.data.template.prd_title?.replaceAll("^ ", " ") ?? "",
        );
        setCruiseControl(
          bulkHomeData.data.template.product_cruise.title == "true"
            ? true
            : false,
        );
      }

      if (currentTab == "metaDescription" && selectedItem == "product") {
        setTemplate(
          bulkHomeData.data.template.prd_desc?.replaceAll("^ ", " ") ?? "",
        );
        setCruiseControl(
          bulkHomeData.data.template.product_cruise.desc == "true"
            ? true
            : false,
        );
      }

      if (currentTab == "altText" && selectedItem == "product") {
        setTemplate(
          bulkHomeData.data.template.prd_alt_tag?.replaceAll("^ ", " ") ?? "",
        );
      }

      if (currentTab == "titleTag" && selectedItem == "category") {
        setTemplate(
          bulkHomeData.data.template.cat_title?.replaceAll("^ ", " ") ?? "",
        );
        setCruiseControl(
          bulkHomeData.data.template.category_cruise.title == "true"
            ? true
            : false,
        );
      }

      if (currentTab == "metaDescription" && selectedItem == "category") {
        setTemplate(
          bulkHomeData.data.template.cat_desc?.replaceAll("^ ", " ") ?? "",
        );
        setCruiseControl(
          bulkHomeData.data.template.category_cruise.desc == "true"
            ? true
            : false,
        );
      }

      if (currentTab == "titleTag" && selectedItem == "brand") {
        setTemplate(
          bulkHomeData.data.template.brand_title?.replaceAll("^ ", " ") ?? "",
        );
      }

      if (currentTab == "metaDescription" && selectedItem == "brand") {
        setTemplate(
          bulkHomeData.data.template.brand_desc?.replaceAll("^ ", " ") ?? "",
        );
      }
    }
  }, [bulkHomeData, currentTab, selectedItem]);

  useEffect(() => {
    const channelObj = JSON.parse(localStorage?.getItem("channel") ?? "");
    setHomeUrl(channelObj.domain);
  }, []);

  return (
    <>
      {customModalShow && (
        <CustomItemModal
          show={customModalShow}
          handleClose={() => setCustomModalShow(false)}
          itemType={selectedItem}
          setBulkQueue={(checkedItem: any) => setBulkQueue(checkedItem)}
        />
      )}

      {confirmModalShow && (
        <ConfirmModal
          show={confirmModalShow}
          handleClose={() => setConfirmModalShow(false)}
          previewData={previewData}
          currentTab={currentTab}
          selectedItem={selectedItem}
          template={template}
          homeUrl={homeUrl}
          handleYes={() => setBulkQueue()}
        />
      )}

      <div className="bulk-optimizerTab-area">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-[#EEEEEE] gap-4 lg:gap-3 p-3">
          <div className="">
            <div className="flex flex-col mb-3">
              <h3 className="text-base font-bold text-[#303030]">
                Build Your Template
              </h3>
              <p className="text-xs text-[#616161] font-normal">
                Use variables to keep titles consistent across all items.
              </p>
            </div>

            <div className="custom-textarea ">
              <textarea
                className="form-control !bg-[#FDFDFD] !border-[#8A8A8A] !h-[80px]"
                placeholder="Please select the dynamic labels from below."
                value={template?.replaceAll("^ ", " ").trimStart()}
                onChange={(e) => setTemplate(e.target.value)}
              ></textarea>
            </div>

            <div className="optisa-btns !mb-0">
              <ul>
                {selectedItem == "product" && (
                  <>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[product name]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Product Name
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[sku]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        SKU
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[price]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Price
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate(
                            (prev: any) =>
                              `${prev} ${bulkHomeData.data.currency_code}`,
                          )
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Currency
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[type]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Type
                      </button>
                    </li>
                  </>
                )}
                {(selectedItem == "category" || selectedItem == "product") && (
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() =>
                        setTemplate((prev: any) => `${prev} [[category name]]`)
                      }
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Category Name
                    </button>
                  </li>
                )}
                {selectedItem == "brand" && (
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() =>
                        setTemplate((prev: any) => `${prev} [[name]]`)
                      }
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Name
                    </button>
                  </li>
                )}
                {selectedItem == "product" && (
                  <>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[brand]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Brand
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[mpn]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />
                        MPN
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() =>
                          setTemplate((prev: any) => `${prev} [[condition]]`)
                        }
                      >
                        <Image
                          src={`${basePath}/images/plus-icon.svg`}
                          alt=""
                          width={20}
                          height={20}
                        />{" "}
                        Condition
                      </button>
                    </li>
                  </>
                )}

                <li>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() =>
                      setTemplate(
                        (prev: any) =>
                          `${prev} ${bulkHomeData.data.store_name}`,
                      )
                    }
                  >
                    <Image
                      src={`${basePath}/images/plus-icon.svg`}
                      alt=""
                      width={20}
                      height={20}
                    />
                    Store Name
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#303030]">
                Live Preview
              </h3>

              <p className="text-xs text-[#616161] font-normal">
                {`Our app will apply this template to each ${
                  selectedItem == "product"
                    ? "products"
                    : selectedItem == "category"
                      ? "categories"
                      : "brands"
                } Here is a sample ${
                  selectedItem == "product"
                    ? "product"
                    : selectedItem == "category"
                      ? "category"
                      : "brand"
                }'s ${
                  currentTab == "titleTag"
                    ? "Title Tag"
                    : currentTab == "metaDescription"
                      ? "Meta Description"
                      : "Alt Text"
                }.`}
              </p>
            </div>

            <div className="infoCard !bg-[#F8FAFC] pt-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center gap-1 text-xs text-[#616161] font-normal inputLabelNew">
                    <span>
                      {selectedItem == "product"
                        ? `Product`
                        : selectedItem == "category"
                          ? "Category"
                          : "Brand"}{" "}
                      URL:
                    </span>
                    <a
                      href={`${homeUrl}${previewData.url}`}
                      target="_blank"
                      className="bulk-productURL"
                    >
                      <Image
                        src={`${basePath}/images/link-icon.svg`}
                        alt=""
                        width={16}
                        height={16}
                        style={{
                          minWidth: "16px",
                          minHeight: "16px",
                          marginTop: "-2px",
                        }}
                      />
                    </a>
                  </div>
                  <div className="bg-white rounded-md border border-gray-200">
                    <div className="flex items-center gap-2 px-[12px] py-[6px]">
                      <p className="text-xs text-[#616161] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                        {homeUrl}
                        {previewData.url}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2 relative">
                    <p className="text-xs text-[#616161] font-normal inputLabelNew">
                      Current{" "}
                      {currentTab == "titleTag"
                        ? "Title Tag"
                        : currentTab == "metaDescription"
                          ? "Meta Description"
                          : "Alt Text"}
                      :
                    </p>

                    <div className="bg-white rounded-md border border-gray-200 min-h-[70px] max-h-[70px] overflow-auto relative">
                      <div className="flex items-center gap-2 px-[12px] py-[6px]">
                        <p className="text-xs text-[#616161] font-normal word-break">
                          {currentTab == "titleTag"
                            ? previewData.title_tag
                            : currentTab == "metaDescription"
                              ? previewData.meta_desc
                              : previewData.product_img_alt}
                        </p>
                      </div>
                      <p className="text-xs text-[#616161] font-normal absolute bottom-0 right-0 bg-white p-1.5">
                        {(currentTab == "titleTag"
                          ? previewData.title_tag
                          : currentTab == "metaDescription"
                            ? previewData.meta_desc
                            : previewData.product_img_alt
                        )?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <p className="text-xs text-[#616161] font-normal inputLabelNew">
                      New{" "}
                      {currentTab == "titleTag"
                        ? "Title Tag"
                        : currentTab == "metaDescription"
                          ? "Meta Description"
                          : "Alt Text"}
                      :
                    </p>

                    <div className="bg-white rounded-md border border-gray-200 min-h-[70px] max-h-[70px] overflow-auto relative">
                      <div className="flex items-center gap-2 px-[12px] py-[6px]">
                        <p className="text-xs text-[#616161] font-normal word-break">
                          {template
                            ?.replaceAll(
                              "[[product name]]",
                              previewData.product_name,
                            )
                            .replaceAll("[[sku]]", previewData.sku)
                            .replaceAll("[[price]]", previewData.price)
                            .replaceAll("[[type]]", previewData.type)
                            .replaceAll(
                              "[[category name]]",
                              previewData.category_name,
                            )
                            .replaceAll("[[brand]]", previewData.brand_name)
                            .replaceAll("[[mpn]]", previewData.mpn)
                            .replaceAll("[[condition]]", previewData.condition)
                            .replaceAll("[[condition]]", previewData.condition)
                            .replaceAll("[[name]]", previewData.brand_name)}
                        </p>
                      </div>

                      <p className="text-xs text-[#616161] font-normal absolute bottom-0 right-0 bg-white p-1.5">
                        {template
                          ?.replaceAll(
                            "[[product name]]",
                            previewData.product_name,
                          )
                          .replaceAll("[[sku]]", previewData.sku)
                          .replaceAll("[[price]]", previewData.price)
                          .replaceAll("[[type]]", previewData.type)
                          .replaceAll(
                            "[[category name]]",
                            previewData.category_name,
                          )
                          .replaceAll("[[brand]]", previewData.brand_name)
                          .replaceAll("[[mpn]]", previewData.mpn)
                          .replaceAll("[[condition]]", previewData.condition)
                          .replaceAll("[[condition]]", previewData.condition)
                          .replaceAll("[[name]]", previewData.brand_name)
                          ?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start md:items-center flex-col md:flex-row gap-3 justify-between p-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#616161] font-normal">
              Choose whether to update all items or only those with issues.
            </p>

            <div className="dropdown">
              <Dropdown>
                <Dropdown.Toggle
                  className="custom-btn dropdown-toggle w-[220px]"
                  variant="secondary"
                >
                  Update
                </Dropdown.Toggle>

                <Dropdown.Menu variant="secondary">
                  <div className="BulkOptimizer-BtnOpen">
                    <ul>
                      <li>
                        <Dropdown.Item className="btn btn-custom">
                          <button
                            type="button"
                            className="bulk-update-btn"
                            onClick={updateBulkTemplate}
                          >
                            Save Template
                          </button>
                        </Dropdown.Item>
                      </li>

                      <li>
                        <Dropdown.Item className="btn btn-custom recommended-btn">
                          <button
                            type="button"
                            className="bulk-update-btn"
                            onClick={() => {
                              setUpdateType("update_blank");
                              setConfirmModalShow(true);
                            }}
                          >
                            Save & Update All Blanks (Recommended)
                          </button>
                        </Dropdown.Item>
                      </li>

                      <li>
                        <Dropdown.Item className="btn btn-custom">
                          <button
                            type="button"
                            className="bulk-update-btn"
                            onClick={() => {
                              setUpdateType("update_all");
                              setConfirmModalShow(true);
                            }}
                          >
                            Save & Update All
                          </button>
                        </Dropdown.Item>
                      </li>

                      {showViewMore && (
                        <>
                          <li>
                            <Dropdown.Item className="btn btn-custom">
                              <button
                                type="button"
                                className="bulk-update-btn"
                                onClick={() => {
                                  setCustomModalShow(true);
                                  setUpdateType("update_custom");
                                }}
                              >
                                Save & Update Custom
                              </button>
                            </Dropdown.Item>
                          </li>

                          <li>
                            <div className="BulkUpdate-Btn">
                              <span className="BulkUpdate-BtnTitle">
                                Save & update
                              </span>
                              <div className="BulkUpdate-Filter">
                                <div className="custom-input">
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={range.start}
                                    onChange={(e) =>
                                      setRange((prev: any) => ({
                                        ...prev,
                                        start: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <span>to</span>
                                <div className="custom-input">
                                  <input
                                    type="number"
                                    min={2}
                                    className="form-control"
                                    value={range.end}
                                    onChange={(e) =>
                                      setRange((prev: any) => ({
                                        ...prev,
                                        end: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <Dropdown.Item className="btn btn-custom">
                                  <button
                                    type="button"
                                    className="custom-btn"
                                    disabled={
                                      Number(range.start) >= Number(range.end)
                                    }
                                    onClick={() => {
                                      setUpdateType("update_range");
                                      setConfirmModalShow(true);
                                    }}
                                  >
                                    GO
                                  </button>
                                </Dropdown.Item>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="BulkUpdate-Btn">
                              <span className="BulkUpdate-BtnTitle">
                                Save & Update All Blanks Between
                              </span>
                              <div className="BulkUpdate-Filter">
                                <div className="custom-input">
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={rangeBlank.start}
                                    onChange={(e) =>
                                      setRangeBlank((prev: any) => ({
                                        ...prev,
                                        start: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <span>to</span>
                                <div className="custom-input">
                                  <input
                                    type="number"
                                    min={2}
                                    className="form-control"
                                    value={rangeBlank.end}
                                    onChange={(e) =>
                                      setRangeBlank((prev: any) => ({
                                        ...prev,
                                        end: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <Dropdown.Item className="btn btn-custom">
                                  <button
                                    type="button"
                                    className="custom-btn"
                                    disabled={
                                      Number(rangeBlank.start) >=
                                      Number(rangeBlank.end)
                                    }
                                    onClick={() => {
                                      setUpdateType("update_range_blank");
                                      setConfirmModalShow(true);
                                    }}
                                  >
                                    GO
                                  </button>
                                </Dropdown.Item>
                              </div>
                            </div>
                          </li>
                        </>
                      )}

                      <li>
                        <Dropdown.Item as="div" className="btn btn-custom">
                          <button
                            type="button"
                            className="bulk-update-btn flex items-center justify-center gap-1 !py-2"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              setShowViewMore(!showViewMore);
                            }}
                          >
                            {showViewMore
                              ? "Hide More Options"
                              : "View More Options"}
                            <div className="w-5 h-5">
                              <Icon
                                source={
                                  showViewMore
                                    ? MinusCircleIcon
                                    : PlusCircleIcon
                                }
                                tone="base"
                              />
                            </div>
                          </button>
                        </Dropdown.Item>
                      </li>
                    </ul>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {currentTab != "altText" &&
            (selectedItem == "product" || selectedItem == "category") && (
              <div className="infoCard !bg-[#F8FAFC] flex items-center gap-4 w-full md:w-auto justify-between">
                <div className="cruise-controller-text">
                  Cruise Control
                  <p className="text-xs text-[#616161] font-normal">
                    {currentTab == "titleTag" &&
                      selectedItem == "product" &&
                      `Auto-apply this template to new products.`}

                    {currentTab == "metaDescription" &&
                      selectedItem == "product" &&
                      `Auto-apply this template to new products.`}

                    {currentTab == "titleTag" &&
                      selectedItem == "category" &&
                      `Auto-apply this template to new categories.`}

                    {currentTab == "metaDescription" &&
                      selectedItem == "category" &&
                      `Auto-apply this template to new categories.`}
                  </p>
                </div>
                <div className="cruise-controller-toggle">
                  <div className="vc-toggle-container">
                    <label className="vc-small-switch">
                      <input
                        type="checkbox"
                        className="vc-switch-input"
                        checked={cruiseControl}
                        onChange={() => {
                          updateCruiseStatus();
                        }}
                      />
                      <span
                        className="vc-switch-label"
                        data-on="ON"
                        data-off="OFF"
                      ></span>
                      <span className="vc-switch-handle"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
