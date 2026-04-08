import { useEffect, useState, useContext } from "react";

import Link from "next/link";
import { Spinner } from "react-bootstrap";
import UpgradePopup from "@/app/_lib/upgradePopup";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/app/_context/global";

export default function Home(Props: any) {
  const router = useRouter();
  const [homeUrl, setHomeUrl] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { userStatus } = useContext(GlobalContext);

  useEffect(() => {
    const channel: any = localStorage?.getItem("channel");
    setHomeUrl(JSON.parse(channel).domain);
  }, []);
  return (
    <>
      <tr>
        <td className="tableHeading-name">
          <div className="flex align-item-center gap-2">
            <p className="mb-0 table-mainHeading flex items-center gap-1.5">
              {(() => {
                // For products, show green/red based on is_published
                if (Props.item.item_type === "product") {
                  // Check is_published field - handle different formats
                  const isPublished = Props.item.is_published;

                  // If field exists (not undefined and not null), show circle
                  if (isPublished !== undefined && isPublished !== null) {
                    // Handle different formats: 1/0, true/false, '1'/'0', etc.
                    const isPublishedValue =
                      isPublished === 1 ||
                      isPublished === true ||
                      isPublished === "1" ||
                      isPublished === "published";
                    return (
                      <div
                        className={`w-2.5 h-2.5 max-w-2.5 max-h-2.5 min-w-2.5 min-h-2.5 rounded-full ${isPublishedValue ? "bg-[#affebf]" : "bg-[#fed1d7]"}`}
                      ></div>
                    );
                  }
                  // If is_published field doesn't exist, don't show circle for products
                  return null;
                }
                // For non-products, show white circle
                else if (Props.item.item_type !== "product") {
                  return (
                    <div className="w-2.5 h-2.5 max-w-2.5 max-h-2.5 min-w-2.5 min-h-2.5 rounded-full bg-white"></div>
                  );
                }
                return null;
              })()}
              {Props.item.item_name}
            </p>
            <a
              href={`${homeUrl}${Props.item.item_type != "home" ? Props.item.item_url : ""}`}
              target="_blank"
            >
              <img src="images/link-icon.svg" alt="" />
            </a>
          </div>
        </td>
        <td>
          {Props.item.item_type.toString().charAt(0).toUpperCase() +
            Props.item.item_type.toString().slice(1)}
        </td>
        <td>
          <span
            className={`badge badge-${Props.item.meta_tag_issue > 1 ? "danger" : Props.item.meta_tag_issue == 1 ? "warning" : "success"}`}
          >
            {Props.item.meta_tag_issue}
          </span>
        </td>
        <td>
          <span
            className={`badge badge-${Props.item.content_issue > 1 ? "danger" : Props.item.content_issue == 1 ? "warning" : "success"}`}
          >
            {Props.item.content_issue}
          </span>
        </td>
        <td>
          <span
            className={`badge badge-${Props.item.image_issue > 1 ? "danger" : Props.item.image_issue == 1 ? "warning" : "success"}`}
          >
            {Props.item.image_issue}
          </span>
        </td>
        <td>
          <span
            className={`badge badge-${Props.item.broken_link_issue > 1 ? "danger" : Props.item.broken_link_issue == 1 ? "warning" : "success"}`}
          >
            {Props.item.broken_link_issue}
          </span>
        </td>
        <td>
          <span
            className={`badge badge-${Props.item.url_issue > 1 ? "danger" : Props.item.url_issue == 1 ? "warning" : "success"}`}
          >
            {Props.item.url_issue}
          </span>
        </td>
        <td className="text-align-right">
          <h2
            className={`Text--headingLg mb-0 ${Props.item.seo_score < 80 ? "red-text" : Props.item.seo_score > 79 && Props.item.seo_score < 90 ? "yellow-text" : "green-text"}`}
          >
            {Props.item.seo_score}%
          </h2>
        </td>
        <td>
          <Link href={`/seo-audit/${Props.item.id}`}>
            <button
              onClick={() => setLoading(true)}
              type="button"
              className="custom-btn"
            >
              {loading ? <Spinner size="sm" /> : "Optimize"}
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
}
