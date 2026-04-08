"use client";

import { Api } from "@/app/_api/apiCall";
import { useEffect, useState } from "react";
import { Spinner, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";
import TagInput from "rsuite/TagInput";
import Image from "next/image";
import { basePath } from "@/next.config";
import Link from "next/link";

export default function Home() {
  const [fileName, setFileName] = useState<any>();
  const [fileNameStatus, setFileNameStatus] = useState(false);
  const [fileSizeStatus, setFileSizeStatus] = useState(false);

  const [altText, setAltText] = useState<any>();
  const [altTextStatus, setAltTextStatus] = useState(false);

  const [cnvrtPTJ, setCnvrtPTJ] = useState(false);
  const [quality, setQuality] = useState("medium");
  const [cruiseControl, setCruiseControl] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [currency, setCurrency] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);

  const [cruiseControlData, setCruiseControlData] = useState([]);

  const getImageSetting = () => {
    Api("imageOptimizer/getImageSetting").then(({ data }) => {
      const setting = data.setting;
      console.log("setting", setting);
      setFileNameStatus(setting.file_name_status == "1" ? true : false);
      setAltTextStatus(setting.alt_status == "1" ? true : false);
      setFileSizeStatus(setting.file_size_status == "1" ? true : false);

      setCnvrtPTJ(setting?.file_size_data?.cnvrt_png_jpg == "1" ? true : false);

      // File Name  Data
      if (
        setting?.file_name_status == "1" &&
        setting?.file_name_data?.file_data
      ) {
        setFileName(setting?.file_name_data?.file_data.split(", "));
      } else {
        setFileName("[[name]]".split(", "));
      }

      // Alt Text Optimization Data
      if (setting?.alt_data?.alt_data)
        setAltText(setting?.alt_data?.alt_data.split(", "));
      else setAltText("[[name]]".split(", "));

      setStoreName(data.store_name);
      setCurrency(data.currency_code);

      setCruiseControl(data.cruise_control);

      setQuality(setting?.file_size_data?.img_quality);
    });
  };

  const updateImageSetting = () => {
    setButtonLoading(true);
    const settingData = {
      file_name_status: Number(fileNameStatus),
      alt_status: altTextStatus,
      file_size_status: fileSizeStatus,
      file_name_data: {
        file_data: fileName.join(", "),
      },
      alt_data: {
        alt_data: altText.join(", "),
      },
      file_size_data: {
        img_quality: quality,
        cnvrt_png_jpg: cnvrtPTJ,
      },
    };
    Api("imageOptimizer/updateImageSetting", {
      setting_data: JSON.stringify(settingData),
      cruise_status: cruiseControl,
    }).then(() => {
      setButtonLoading(false);
      toast.success("Settings updated successfully.");
    });
  };

  const getCruiseControlHistory = () => {
    Api("imageOptimizer/getCruiseControlHistory").then(({ data }) => {
      setCruiseControlData(data);
    });
  };

  useEffect(() => {
    getImageSetting();
    getCruiseControlHistory();
  }, []);

  return (
    <>
      <div className="content-frame-main">
        <div className="content-frame-head flex justify-content-between align-item-center">
          <div className="content-frameHead-right headBtn-link">
            <button
              type="button"
              className="btn-primary"
              onClick={updateImageSetting}
              disabled={buttonLoading}
            >
              {buttonLoading ? <Spinner size="sm" /> : "Save"}
            </button>
          </div>
        </div>

        <div className="image-optimizer-settingMain">
          <div className="card">
            <p className="mb-1">
              The app will optimize your images according to the settings below.
              <span className="red-text">
                {" "}
                It will also keep a backup of the original images for 3 days,
                allowing you to restore them if needed.
              </span>
            </p>
            <p className="mb-0">{`If you enable Cruise Control, the app will automatically optimize images for all new products without any further action required from you.`}</p>
          </div>

          <div className="card">
            <div className="imageOptimize-settingCruise">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="imageOptimize-setting-CruiseHead d-flex align-content-center gap-3">
                      <h2 className="Text--headingLg mb-0">Cruise Control</h2>
                      <div className="vc-toggle-container">
                        <label className="vc-small-switch">
                          <input
                            type="checkbox"
                            checked={cruiseControl}
                            className="vc-switch-input"
                            onChange={() => {
                              if (
                                localStorage?.getItem("manage_service") ==
                                  "1" ||
                                cruiseControl == true
                              ) {
                                setCruiseControl(!cruiseControl);
                              } else {
                                toast.error("Please upgrade your plan!");
                              }
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
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="imageOptimize-settingCruise--body">
                      <div className="custom-table keywordSuggestion-table">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Item Type</th>
                              <th className="text-align-left">Update Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cruiseControlData.map((item: any, key) => (
                              <tr key={key}>
                                <td>{item.created_at}</td>
                                <td>Product</td>
                                <td className="text-align-left">
                                  <span className="badge">{item.total}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <div className="card">
            <div className="imageOptimize-settingHead">
              <div className="d-flex align-content-center gap-3">
                <h2 className="Text--headingLg mb-0">File Name</h2>
                <div className="vc-toggle-container">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={fileNameStatus}
                      className="vc-switch-input"
                      onChange={() => {
                        setFileNameStatus(!fileNameStatus);
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

            <div className="imageOptimize-settingBody">
              <div className="custom-textarea">
                <TagInput
                  placeholder="[[name]]"
                  style={{ width: "100%", minHeight: "100px" }}
                  value={fileName}
                  onChange={(value: any, event: any) => setFileName(value)}
                  disabled={!fileNameStatus}
                />
              </div>

              <div className="optisa-btns mb-0">
                <ul>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[name]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[sku]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Sku
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[price]]"]);
                      }}
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
                      onClick={() => {
                        setFileName((prev: any) => [...prev, currency]);
                      }}
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
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[type]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[category]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Category
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[brand]]"]);
                      }}
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
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[mpn]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Mpn
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, "[[condition]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setFileName((prev: any) => [...prev, storeName]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Store Name
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="imageOptimize-settingHead">
              <div className="d-flex align-content-center gap-3">
                <h2 className="Text--headingLg mb-0">Alt Text Optimization</h2>
                <div className="vc-toggle-container">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={altTextStatus}
                      className="vc-switch-input"
                      onChange={() => {
                        setAltTextStatus(!altTextStatus);
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

            <div className="imageOptimize-settingBody">
              <div className="custom-textarea">
                <TagInput
                  placeholder="[[name]]"
                  style={{ width: "100%", minHeight: "100px" }}
                  value={altText}
                  onChange={(value: any, event: any) => setAltText(value)}
                  disabled={!altTextStatus}
                />
              </div>

              <div className="optisa-btns mb-0">
                <ul>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[name]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[sku]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Sku
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[price]]"]);
                      }}
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
                      onClick={() => {
                        setAltText((prev: any) => [...prev, currency]);
                      }}
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
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[type]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[category]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Category
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[brand]]"]);
                      }}
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
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[mpn]]"]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Mpn
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, "[[condition]]"]);
                      }}
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
                  <li>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setAltText((prev: any) => [...prev, storeName]);
                      }}
                    >
                      <Image
                        src={`${basePath}/images/plus-icon.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />{" "}
                      Store Name
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="imageOptimize-settingHead">
              <div className="d-flex align-content-center gap-3">
                <h2 className="Text--headingLg mb-0">File Size Optimization</h2>
                <div className="vc-toggle-container">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={fileSizeStatus}
                      className="vc-switch-input"
                      onChange={() => {
                        setFileSizeStatus(!fileSizeStatus);
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

            <div className="imageOptimize-settingBody">
              <div className="Optimize-settingSize d-flex gap-5">
                <div className="Optimize-settingSize--left">
                  <h2 className="Text--headingLg mb-3">Quality</h2>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="quality"
                      checked={quality == "high"}
                      onChange={() => setQuality("high")}
                    />
                    <label className="form-check-label">High</label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="quality"
                      checked={quality == "medium"}
                      onChange={() => setQuality("medium")}
                    />
                    <label className="form-check-label">Medium</label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="quality"
                      checked={quality == "low"}
                      onChange={() => setQuality("low")}
                    />
                    <label className="form-check-label">Low</label>
                  </div>
                </div>

                <div className="Optimize-settingSize--right">
                  <h2 className="Text--headingLg mb-3">Convert PNG to JPEG</h2>
                  <div className="vc-toggle-container">
                    <label className="vc-small-switch">
                      <input
                        type="checkbox"
                        className="vc-switch-input"
                        checked={cnvrtPTJ}
                        onChange={() => {
                          setCnvrtPTJ(!cnvrtPTJ);
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
            </div>
          </div>

          <div className="text-align-left mb-22">
            <button
              type="button"
              className="custom-btn tab-fullWidth"
              onClick={updateImageSetting}
              disabled={buttonLoading}
            >
              {buttonLoading ? <Spinner size="sm" /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
