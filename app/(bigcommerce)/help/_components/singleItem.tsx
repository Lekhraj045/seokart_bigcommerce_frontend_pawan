import Image from "next/image";
import { basePath } from "@/next.config";
import { useEffect, useState } from "react";

export default function Home({
  item,
  componentKey,
  masterCheckbox,
  setItemIdArray,
}: {
  item: any;
  componentKey: any;
  masterCheckbox: any;
  setItemIdArray: any;
}) {
  const [checked, setChecked] = useState(false);
  const [homeUrl, setHomeUrl] = useState("");

  useEffect(() => {
    setChecked(masterCheckbox);
  }, [masterCheckbox]);

  useEffect(() => {
    if (checked) setItemIdArray(item.id, "add", componentKey);
    else setItemIdArray(item.id, "remove", componentKey);
  }, [checked]);

  useEffect(() => {
    const channelObj = JSON.parse(localStorage?.getItem("channel") ?? "");
    setHomeUrl(channelObj.domain);
  }, []);

  return (
    <>
      <tr>
        <td className="table-check">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
          </div>
        </td>
        <td>{item.item_name}</td>
        <td>
          <div className="d-flex align-item-center gap-2">
            <a href={`${homeUrl}${item.item_url}`} target="_blank">
              <Image
                src={`${basePath}/images/link-icon.svg`}
                alt=""
                width={20}
                height={20}
              />
            </a>
            <a href={`${homeUrl}${item.item_url}`} target="_blank">
              {homeUrl}
              {item.item_url}
            </a>
          </div>
        </td>
      </tr>
    </>
  );
}
