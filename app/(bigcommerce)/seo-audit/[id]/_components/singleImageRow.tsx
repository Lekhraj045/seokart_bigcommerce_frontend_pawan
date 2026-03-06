import { basePath } from "@/next.config";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { Api } from "@/app/_api/apiCall";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Previewmodal from "@/app/(bigcommerce)/image-optimizer/_components/previewModal";

export default function Home({
  image,
  setPrimaryImageAltText,
  setUpdateImageData,
  componentKey,
  refresh,
  openSettingsModal,
}: {
  image: any;
  setPrimaryImageAltText: any;
  setUpdateImageData: any;
  componentKey: any;
  refresh: any;
  openSettingsModal?: () => void;
}) {
  const router = useRouter();
  const [altText, setAltText] = useState(image.description);
  const [optimizeStatus, setOptimizeStatus] = useState(image.is_optimize);
  const [previewModal, setPreviewModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (image.is_thumbnail) {
      refresh(altText);
      setPrimaryImageAltText(altText);
    }

    setUpdateImageData(componentKey, altText);
  }, [altText]);

  const imageOptimize = () => {
    setOptimizeStatus(5);
    Api("imageOptimizer/imageOptimize", {
      img_alt: altText,
      old_alt_text: image.description,
      img_name: image.image_file.split("/").pop(),
      real_image: image.image_file,
      product_id: image.product_id,
      image_id: image.id,
      is_thumbnail: image.is_thumbnail,
      sort_order: image.sort_order,
    }).then((data) => {
      if (data.status_code == 202) {
        setOptimizeStatus(0);
        if (openSettingsModal) {
          openSettingsModal();
        }
      }
      if (data.status_code == 200) {
        setOptimizeStatus(2);
        toast.success(
          "Your image is queued for optimization. It may take up to a few hours depending on the queue our server has."
        );
      }
      if (data.status_code == 204 || data.status_code == 203) {
        setOptimizeStatus(0);
        toast.error(data.message);
      }
    });
  };

  const RestoreOptimizeImage = () => {
    setOptimizeStatus(5);
    Api("imageOptimizer/RestoreOptimizeImage", {
      product_id: image.product_id,
      image_id: image.id,
    }).then((data) => {
      if (data.status_code == 204 || data.status_code == 203) {
        setOptimizeStatus(1);
        toast.error(data.message);
      }
      if (data.status_code == 200) {
        setOptimizeStatus(3);
        toast.success(
          "Your image is queued for restore. It may take up to a few hours depending on the queue our server has."
        );
      }
    });
  };

  return (
    <>
      <Previewmodal
        show={previewModal}
        onHide={() => setPreviewModal(false)}
        image={image}
        RestoreOptimizeImage={RestoreOptimizeImage}
        size={image.image_size}
      />

      <tr>
        <td>
          <div className="d-flex align-item-center gap-3">
            <div
              className={`optimizerProduct-img ${
                checked ? "check_active" : ""
              }`}
            >
              {image.is_thumbnail && (
                <span className="optimizer-favourite">
                  <Image
                    src={`${basePath}/images/star-icon.svg`}
                    width={16}
                    height={16}
                    alt=""
                  />
                </span>
              )}
              <Image
                src={image.url_thumbnail}
                width={40}
                height={40}
                alt=""
                style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px", }}
              />
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex align-item-center gap-2">
                <span className="text-[#303030] text-[13px] font-medium min-w-[200px]" style={{wordBreak: 'break-all'}}>
                  {image.image_file.split("/").pop()}
                </span>
                <a
                  href={image.url_standard}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`${basePath}/images/link-icon.svg`}
                    width={16}
                    height={16}
                    alt=""
                    style={{
                      width: "16px",
                      height: "16px",
                      maxWidth: "16px",
                      maxHeight: "16px",
                    }}
                  />
                </a>
              </div>
              <span className="text-[#616161] text-xs">{image.image_size}</span>
            </div>
          </div>
        </td>
        <td>
          <div className="custom-input">
            <input
              type="text"
              placeholder="Alt Text"
              className="form-control min-w-48"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </td>
        <td>
          <div className="d-flex align-item-center justify-end gap-2">
            {optimizeStatus == 5 ? (
              <>
                <button
                  type="button"
                  className="imageOptimize-btn btn btn-default btn-disable"
                  disabled
                >
                  <Spinner size="sm" />
                </button>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Restore</Tooltip>}
                >
                  <button
                    type="button"
                    className="custom-btn black-iconBtn btn-disable"
                    disabled
                  >
                    <Spinner size="sm" />
                  </button>
                </OverlayTrigger>
              </>
            ) : optimizeStatus == 1 ? (
              <>
                <button
                  type="button"
                  className="imageOptimize-btn custom-btn"
                  onClick={() => setPreviewModal(true)}
                >
                  Preview
                </button>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Restore</Tooltip>}
                >
                  <button
                    type="button"
                    className="custom-btn black-iconBtn"
                    onClick={RestoreOptimizeImage}
                  >
                    <Image
                      src={`${basePath}/images/restore-icon.svg`}
                      width={20}
                      height={20}
                      style={{
                        width: "20px",
                        height: "20px",
                        maxWidth: "20px",
                        maxHeight: "20px",
                      }}
                      alt="restoreIcon"
                    />
                  </button>
                </OverlayTrigger>
              </>
            ) : optimizeStatus == 2 ? (
              <>
                <button
                  type="button"
                  className="imageOptimize-btn btn btn-default btn-disable"
                  disabled
                >
                  Optimizing
                </button>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Restore</Tooltip>}
                >
                  <button
                    type="button"
                    className="custom-btn black-iconBtn btn-disable"
                    disabled
                  >
                    <Image
                      src={`${basePath}/images/restore-icon.svg`}
                      width={20}
                      height={20}
                      style={{
                        width: "20px",
                        height: "20px",
                        maxWidth: "20px",
                        maxHeight: "20px",
                      }}
                      alt="restoreIcon"
                    />
                  </button>
                </OverlayTrigger>
              </>
            ) : optimizeStatus == 3 ? (
              <>
                <button
                  type="button"
                  className="imageOptimize-btn btn btn-default btn-disable"
                  disabled
                >
                  Restoring
                </button>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Restore</Tooltip>}
                >
                  <button
                    type="button"
                    className="custom-btn black-iconBtn btn-disable"
                    disabled
                  >
                    <Image
                      src={`${basePath}/images/restore-icon.svg`}
                      width={20}
                      height={20}
                      style={{
                        width: "20px",
                        height: "20px",
                        maxWidth: "20px",
                        maxHeight: "20px",
                      }}
                      alt="restoreIcon"
                    />
                  </button>
                </OverlayTrigger>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={imageOptimize}
                >
                  Optimize
                </button>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Restore</Tooltip>}
                >
                  <button
                    type="button"
                    className="custom-btn black-iconBtn btn-disable"
                    disabled
                  >
                    <Image
                      src={`${basePath}/images/restore-icon.svg`}
                      width={20}
                      height={20}
                      style={{
                        width: "20px",
                        height: "20px",
                        maxWidth: "20px",
                        maxHeight: "20px",
                      }}
                      alt="restoreIcon"
                    />
                  </button> 
                </OverlayTrigger>
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}