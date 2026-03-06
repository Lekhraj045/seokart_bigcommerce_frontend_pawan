"use client";

import { Api } from "@/app/_api/apiCall";
import { useEffect, useState } from "react";
import { Spinner, Accordion, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import TagInput from "rsuite/TagInput";
import Image from "next/image";
import { basePath } from "@/next.config";
import Link from "next/link";
import { Icon } from "@shopify/polaris";
import { CaretDownIcon, InfoIcon } from "@shopify/polaris-icons";

export default function Home(Props: any) {
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
  const [cruiseControlHistoryLoading, setCruiseControlHistoryLoading] = useState(true);

  // Helper function to check if at least one toggle is enabled
  const isAnyToggleEnabled = () => {
    return fileNameStatus || altTextStatus || fileSizeStatus;
  };

  const getImageSetting = () => {
    Api("imageOptimizer/getImageSetting").then(({ data }) => {
      const setting = data.setting;
      setFileNameStatus(setting.file_name_status == "1" ? true : false);
      setAltTextStatus(setting.alt_status == "1" ? true : false);
      setFileSizeStatus(setting.file_size_status == "1" ? true : false);

      setCnvrtPTJ(setting?.file_size_data?.cnvrt_png_jpg == "1" ? true : false);
      if (setting?.file_name_data?.file_data)
        setFileName(setting?.file_name_data?.file_data.split(", "));
      else setFileName("[[name]]".split(", "));
      if (setting?.alt_data?.alt_data)
        setAltText(setting?.alt_data?.alt_data.split(", "));
      else setAltText("[[name]]".split(", "));

      setStoreName(data.store_name);
      setCurrency(data.currency_code);

      // Check if user is on free plan - if yes, force cruise control to false
      const isPaidUser = localStorage.getItem("manage_service") == "1";
      const cruiseControlValue = data.cruise_control;
      
      // Auto-disable cruise control for free users (even if API returns true)
      if (!isPaidUser) {
        // Force cruise control to false for free users
        setCruiseControl(false);
        // If backend returned true but user is free, update backend using updateImageSetting format
        if (cruiseControlValue) {
          // Prepare setting data in the exact same format as updateImageSetting
          const fileNameArray = setting?.file_name_data?.file_data 
            ? setting.file_name_data.file_data.split(", ") 
            : ["[[name]]"];
          const altTextArray = setting?.alt_data?.alt_data 
            ? setting.alt_data.alt_data.split(", ") 
            : ["[[name]]"];
          
          // Prepare setting data in the exact same format as updateImageSetting function
          // Match the exact format: alt_status should be boolean like in updateImageSetting
          const settingData = {
            file_name_status: Number(setting.file_name_status == "1"),
            alt_status: setting.alt_status == "1", // Boolean to match updateImageSetting format
            file_size_status: setting.file_size_status == "1", // Boolean to match updateImageSetting format
            file_name_data: {
              file_data: fileNameArray.join(", "),
            },
            alt_data: {
              alt_data: altTextArray.join(", "),
            },
            file_size_data: {
              img_quality: setting?.file_size_data?.img_quality || "medium",
              cnvrt_png_jpg: setting?.file_size_data?.cnvrt_png_jpg == "1", // Use boolean to match format
            },
          };
          
          // Update backend to disable cruise control - use exact same API call format as updateImageSetting
          Api("imageOptimizer/updateImageSetting", {
            setting_data: JSON.stringify(settingData),
            cruise_status: false,
          }).then((response) => {
            // After successful update, verify by calling getImageSetting again after a short delay
            setTimeout(() => {
              Api("imageOptimizer/getImageSetting").then(({ data: refreshData }) => {
                // Verify cruise control is now false in API response
                const updatedCruiseControl = refreshData.cruise_control;
                if (updatedCruiseControl === false || updatedCruiseControl === 0 || updatedCruiseControl === "0") {
                  setCruiseControl(false);
                  console.log("Cruise control successfully disabled in backend");
                } else {
                  // If still enabled, log warning (might need backend fix)
                  console.warn("Cruise control still enabled in API response:", updatedCruiseControl);
                  setCruiseControl(false); // Force frontend to false anyway
                }
              }).catch((err) => {
                console.error("Error verifying cruise control update:", err);
              });
            }, 1000); // Wait 1 second for backend to process
          }).catch((error) => {
            console.error("Error updating cruise control:", error);
            toast.error("Failed to update cruise control setting.");
          });
        }
      } else {
        // Paid users can use cruise control as returned by API
        setCruiseControl(cruiseControlValue);
      }

      // Set quality - if File Size Optimization is OFF, always set to "medium"
      if (setting.file_size_status == "1") {
        setQuality(setting?.file_size_data?.img_quality || "medium");
      } else {
        // If File Size Optimization is OFF, always show "medium" as default
        setQuality("medium");
      }
    });
  };

  const updateImageSetting = () => {
    setButtonLoading(true);
    const isPaidUser = localStorage.getItem("manage_service") == "1";
    
    // Ensure free users can't save with cruise control ON
    const finalCruiseControl = isPaidUser ? cruiseControl : false;
    
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
      cruise_status: finalCruiseControl,
    }).then(() => {
      setButtonLoading(false);
      toast.success("Settings updated successfully.");
      // Close the offcanvas after a successful save
      Props.onClose?.();
    });
  };

  const getCruiseControlHistory = () => {
    setCruiseControlHistoryLoading(true);
    Api("imageOptimizer/getCruiseControlHistory").then(({ data }) => {
      setCruiseControlData(data || []);
      setCruiseControlHistoryLoading(false);
    }).catch((error) => {
      console.error("Error fetching cruise control history:", error);
      setCruiseControlData([]);
      setCruiseControlHistoryLoading(false);
    });
  };

  useEffect(() => {
    getImageSetting();
    getCruiseControlHistory();
  }, []);

  // Auto-disable cruise control if all toggles are OFF
  useEffect(() => {
    if (!fileNameStatus && !altTextStatus && !fileSizeStatus && cruiseControl) {
      setCruiseControl(false);
    }
  }, [fileNameStatus, altTextStatus, fileSizeStatus, cruiseControl]);

  // Auto-disable cruise control when user switches to free plan
  useEffect(() => {
    const isPaidUser = localStorage.getItem("manage_service") == "1";
    // If user is on free plan and cruise control is ON, disable it
    if (!isPaidUser && cruiseControl) {
      setCruiseControl(false);
      // Update backend to disable cruise control
      Api("imageOptimizer/updateImageSetting", {
        setting_data: JSON.stringify({
          file_name_status: fileNameStatus ? 1 : 0,
          alt_status: altTextStatus ? 1 : 0,
          file_size_status: fileSizeStatus ? 1 : 0,
          file_name_data: { file_data: fileName.join(", ") },
          alt_data: { alt_data: altText.join(", ") },
          file_size_data: {
            img_quality: quality,
            cnvrt_png_jpg: cnvrtPTJ ? 1 : 0,
          },
        }),
        cruise_status: false,
      }).then(() => {
        toast.info("Cruise Control has been disabled as you're on a free plan.");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cruiseControl]);

  return (
    <>
      <div className="content-frame-main !p-0">
        {/* <div className="content-frame-head flex justify-content-between align-item-center">
        <div className="content-frameHead-left">
          <h1 className="Text--headingLg flex align-item-center gap-2">
            <Link href='/image-optimizer'>
              <button type="button" className="headBack-btn">
                <Image src={`${basePath}/images/back-icon.svg`} width={20} height={20} alt='' />
              </button>
            </Link>

            Image Optimizer Settings
          </h1>
        </div>

        <div className="content-frameHead-right headBtn-link">
          <button type="button" className="btn-primary" onClick={updateImageSetting} disabled={buttonLoading}>{buttonLoading ? <Spinner size='sm' /> : 'Save'}</button>
        </div>
      </div> */}

        <div className="image-optimizer-settingMain">
          {/* info card section */}
          <div className="infoCard mb-3">
            <p className="text-xs text-[#7B3306] font-normal">
              The app will optimize your images according to the settings below
              and keep a backup of the original images for 3 days, allowing you
              to restore them if needed.
            </p>
            <p className="text-xs text-[#7B3306] font-normal">
              When Cruise control is enabled, new product images will be
              optimized automatically without any extra steps from you.
            </p>
          </div>

          {/* cruise control section */}
          <div className="card !p-0 !mb-4">
            <div className="imageOptimize-settingCruise">
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE] gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#303030] flex items-center gap-2">
                    Cruise Control
                    <span className="badge badge-success !rounded-full">
                      Auto-optimize all new images
                    </span>
                  </h3>
                  <p className="text-xs text-[#616161] font-normal">
                    When turned on, SEOKart will rename, update alt text and
                    compress images for new products based on the template and
                    settings below.
                  </p>
                </div>

                <div className="vc-toggle-container !static">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={cruiseControl}
                      className="vc-switch-input"
                      // disabled={!isAnyToggleEnabled() && !cruiseControl}
                      onChange={() => {
                        // Check if user has manage_service or is trying to turn OFF cruise control
                        if (
                          localStorage.getItem("manage_service") == "1" ||
                          cruiseControl == true
                        ) {
                          // If trying to enable, check if at least one toggle is ON
                          if (!cruiseControl) {
                            if (isAnyToggleEnabled()) {
                              setCruiseControl(true);
                            } else {
                              toast.error("Enable atleast one setting to use the Cruise Control feature.");
                            }
                          } else {
                            // Turning OFF is always allowed
                            setCruiseControl(false);
                          }
                        } else {
                          toast.error("Please upgrade your plan.");
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

                {/* tooltip */}
                {/* <div className="w-5 h-5">
                  <OverlayTrigger
                    placement="top"
                    trigger={["hover", "focus"]}
                    overlay={
                      <Tooltip id="cruise-info-tooltip">
                        Enable this to optimize images for any new
                        products added after today, within 24 hours.
                      </Tooltip>
                    }
                  >
                    <span
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        cursor: "pointer",
                        display: "inline-flex",
                        width: "20px",
                        height: "20px",
                      }}
                    >
                      <Image
                        src={`${basePath}/images/info-icon.svg`}
                        alt="info-icon"
                        width={20}
                        height={20}
                      />
                    </span>
                  </OverlayTrigger>
                </div> */}
              </div>

              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex align-content-center justify-content-between w-100">
                      <span className="flex items-center">
                        <div className="w-6 h-6 cruise-dropdown-icon">
                          <Icon source={CaretDownIcon} tone="info" />
                        </div>
                        <span className="text-[13px] text-[#005BD3]">
                          View cruise control history
                        </span>
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="imageOptimize-settingCruise--body">
                      <div className="custom-table keywordSuggestion-table !max-h-[200px]">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Item Type</th>
                              <th className="text-align-left">Update Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cruiseControlHistoryLoading ? (
                              <tr>
                                <td colSpan={3} className="text-center py-4">
                                  <Spinner size="sm" />
                                </td>
                              </tr>
                            ) : cruiseControlData && cruiseControlData.length > 0 ? (
                              cruiseControlData.map((item: any, key) => (
                                <tr key={key}>
                                  <td>{item.created_at}</td>
                                  <td>Product</td>
                                  <td className="text-align-left">
                                    <span className="badge">{item.total}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center py-4 text-[#616161]">
                                  No Items found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          {/* file size optimization section */}
          <div className="card !p-0 !mb-4">
            <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE] gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-[#303030] flex items-center gap-2">
                  File Size Optimization
                  <span className="badge badge-success !rounded-full">Faster page loads</span>
                </h3>
                <p className="text-xs text-[#616161] font-normal">
                  Compress images to reduce file size while keeping visual quality suitable for ecommerce.
                </p>
              </div>

              <div className="vc-toggle-container">
                <label className="vc-small-switch">
                  <input
                    type="checkbox"
                    checked={fileSizeStatus}
                    className="vc-switch-input"
                    onChange={() => {
                      const newStatus = !fileSizeStatus;
                      setFileSizeStatus(newStatus);
                      // Reset quality to medium when File Size Optimization is turned OFF
                      if (!newStatus) {
                        setQuality("medium");
                      }
                      // Check if all toggles are OFF and disable cruise control if needed
                      if (!newStatus && !fileNameStatus && !altTextStatus && cruiseControl) {
                        setCruiseControl(false);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
              <div className="infoCard !bg-[#F8FAFC]">
                <div className="">
                  <h2 className="text-sm font-semibold text-[#303030]">
                    Quality
                  </h2>
                  <p className="text-xs text-[#616161] font-normal mt-[2px]">
                    Choose the image quality to balance clarity and page speed.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="quality"
                        id="quality-high"
                        checked={quality == "high"}
                        onChange={() => setQuality("high")}
                        disabled={!fileSizeStatus}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="quality-high"
                      >
                        High
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="quality"
                        id="quality-medium"
                        checked={quality == "medium"}
                        onChange={() => setQuality("medium")}
                        disabled={!fileSizeStatus}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="quality-medium"
                      >
                        Medium (recommended)
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="quality"
                        id="quality-low"
                        checked={quality == "low"}
                        onChange={() => setQuality("low")}
                        disabled={!fileSizeStatus}
                      />
                      <label className="form-check-label" htmlFor="quality-low">
                        Low
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="infoCard !bg-[#F8FAFC]">
                <div className="">
                  <h2 className="text-sm font-semibold text-[#303030]">
                    Convert PNG to JPEG
                  </h2>
                  <p className="text-xs text-[#616161] font-normal mt-[2px]">
                    Recommended for product photos without transparency. 
                  </p>
                  
                  <div className="flex gap-4 mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="cnvrtPTJ"
                        id="cnvrtPTJ-on"
                        checked={cnvrtPTJ === true}
                        onChange={() => setCnvrtPTJ(true)}
                        disabled={!fileSizeStatus}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="cnvrtPTJ-on"
                      >
                        On
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="cnvrtPTJ"
                        id="cnvrtPTJ-off"
                        checked={cnvrtPTJ === false}
                        onChange={() => setCnvrtPTJ(false)}
                        disabled={!fileSizeStatus}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="cnvrtPTJ-off"
                      >
                        Off
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* file name & alt text template section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="card !p-0">
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE] gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#303030] flex items-center gap-2">
                    File Name Template
                  </h3>
                  <p className="text-xs text-[#616161] font-normal">
                    Define how product image file names will look after
                    optimization.
                  </p>
                </div>

                <div className="vc-toggle-container">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={fileNameStatus}
                      className="vc-switch-input"
                      onChange={() => {
                        const newStatus = !fileNameStatus;
                        setFileNameStatus(newStatus);
                        // Check if all toggles are OFF and disable cruise control if needed
                        if (!newStatus && !altTextStatus && !fileSizeStatus && cruiseControl) {
                          setCruiseControl(false);
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

              <div className="p-3 flex flex-col gap-3">
                <div className="custom-textarea">
                  <TagInput
                    placeholder="Select dynamic labels from below."
                    style={{ width: "100%", minHeight: "95px" }}
                    value={fileName}
                    onChange={(value: any, event: any) => setFileName(value)}
                    disabled={!fileNameStatus}
                  />
                </div>

                <div className="optisa-btns mb-0">
                  <ul className="!mt-0">
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => {
                          setFileName((prev: any) => [...prev, "[[name]]"]);
                        }}
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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
                          setFileName((prev: any) => [
                            ...prev,
                            "[[condition]]",
                          ]);
                        }}
                        disabled={!fileNameStatus}
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
                        disabled={!fileNameStatus}
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

            <div className="card !p-0">
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE] gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#303030] flex items-center gap-2">
                    Alt Text Template
                  </h3>
                  <p className="text-xs text-[#616161] font-normal">
                    Use a readable sentence that describes the product and
                    includes key attributes.
                  </p>
                </div>

                <div className="vc-toggle-container">
                  <label className="vc-small-switch">
                    <input
                      type="checkbox"
                      checked={altTextStatus}
                      className="vc-switch-input"
                      onChange={() => {
                        const newStatus = !altTextStatus;
                        setAltTextStatus(newStatus);
                        // Check if all toggles are OFF and disable cruise control if needed
                        if (!newStatus && !fileNameStatus && !fileSizeStatus && cruiseControl) {
                          setCruiseControl(false);
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

              <div className="p-3 flex flex-col gap-3">
                <div className="custom-textarea">
                  <TagInput
                    placeholder="Select dynamic labels from below."
                    style={{ width: "100%", minHeight: "95px" }}
                    value={altText}
                    onChange={(value: any, event: any) => setAltText(value)}
                    disabled={!altTextStatus}
                  />
                </div>

                <div className="optisa-btns mb-0">
                  <ul className="!mt-0">
                    <li>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => {
                          setAltText((prev: any) => [...prev, "[[name]]"]);
                        }}
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
                        disabled={!altTextStatus}
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
          </div>          

          <div className="flex justify-start items-center gap-2 border-t border-[#ddd] -ml-4 -mr-4 pl-4 pr-4 pt-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#616161] font-normal">
                These settings will apply to all future image optimizations. Existing optimized images will not be changed.
              </p>

              <div className="flex gap-2">
                <button
                type="button"
                className="btn btn-default"
                onClick={Props.onClose}
              >
                Cancel
              </button>

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
        </div>
      </div>
    </>
  );
}
