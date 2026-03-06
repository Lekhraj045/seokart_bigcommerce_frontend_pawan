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
  onAltChange,
  componentKey,
  refresh,
}: {
  image: any;
  setPrimaryImageAltText: any;
  setUpdateImageData: any;
  onAltChange?: (key: number, altText: string) => void;
  componentKey: any;
  refresh: any;
}) {
  const router = useRouter();
  const [altText, setAltText] = useState(image.description);
  const [optimizeStatus, setOptimizeStatus] = useState(image.is_optimize);
  const [previewModal, setPreviewModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (image?.is_thumbnail) {
      refresh(altText);
      setPrimaryImageAltText(altText);
    }

    setUpdateImageData(componentKey, altText);
  }, [altText]);

  const imageOptimize = () => {
    setOptimizeStatus(5);
    Api("imageOptimizer/imageOptimize", {
      img_alt: altText,
      old_alt_text: image?.description,
      img_name: image?.image_file.split("/").pop(),
      real_image: image?.image_file,
      product_id: image?.product_id,
      image_id: image?.id,
      is_thumbnail: image?.is_thumbnail,
      sort_order: image?.sort_order,
    }).then((data) => {
      if (data?.status_code == 202) {
        router.push("/image-optimizer-setting");
      }
      if (data?.status_code == 200) {
        setOptimizeStatus(2);
        toast.success(
          "Your image is queued for optimization. It may take up to a few hours depending on the queue our server has.",
        );
      }
      if (data?.status_code == 204 || data?.status_code == 203) {
        setOptimizeStatus(0);
        toast.error(data?.message);
      }
    });
  };

  const RestoreOptimizeImage = () => {
    setOptimizeStatus(5);
    Api("imageOptimizer/RestoreOptimizeImage", {
      product_id: image?.product_id,
      image_id: image?.id,
    }).then((data) => {
      if (data?.status_code == 204 || data?.status_code == 203) {
        setOptimizeStatus(1);
        toast.error(data?.message);
      }
      if (data?.status_code == 200) {
        setOptimizeStatus(3);
        toast.success(
          "Your image is queued for restore. It may take up to a few hours depending on the queue our server has.",
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
      <div className="d-flex align-item-center gap-3 optimizerList-box">
        <div
          className={`optimizerProduct-img ${checked ? "check_active" : ""}`}
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
          <Image src={image.url_thumbnail} width={38} height={38} alt="" />
        </div>

        <div className="optimizerProduct-imgfeild flex-grow-1 d-flex align-item-center gap-3">
          <div className="custom-input link-iconDropi flex-grow-1">
            <span>
              File Name
              <a href="" target="_blank">
                <Image
                  src={`${basePath}/images/link-icon.svg`}
                  width={16}
                  height={16}
                  alt=""
                />
              </a>
            </span>
            <input
              type="text"
              placeholder="File name"
              className="form-control"
              value={image.image_file.split("/").pop()}
              disabled
            />
          </div>

          <div className="custom-input flex-grow-1">
            <span>Alt Text</span>
            <input
              type="text"
              placeholder="Alt Text"
              className="form-control"
              value={altText}
              onChange={(e) => {
                const value = e.target.value;
                setAltText(value);
                onAltChange?.(componentKey, value);
              }}
            />
          </div>
        </div>

        <div className="optimizerProduct-actionInfo d-flex align-item-center gap-3">
          <span>{image.image_size}</span>
        </div>
      </div>
    </>
  );
}
