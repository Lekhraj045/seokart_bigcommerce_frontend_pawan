import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "@/app/_context/global";

export default function Home() {
  const [paid, setPaid] = useState(1);
  const { trialDays } = useContext(GlobalContext);
  useEffect(() => {
    localStorage?.getItem("manage_service") == "1" ? setPaid(1) : setPaid(0);
  }, []);
  return (
    <>
      {paid == 0 ? (
        <>
          <Link href={"/upgrade"} className="headBtn-link">
            <button type="button" className="custom-btn">
              Upgrade
            </button>
          </Link>
        </>
      ) : (
        ""
      )}
    </>
  );
}
