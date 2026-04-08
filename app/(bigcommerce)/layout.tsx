"use client";

import Sidebar from "../_components/sidebar";
import { ToastContainer } from "react-toastify";
import "rsuite/dist/rsuite.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "../global.css";
import { useEffect, useState, useContext } from "react";
import Script from "next/script";
import { basePath } from "@/next.config";
import { Crisp } from "crisp-sdk-web";
import { Api } from "../_api/apiCall";
import { GlobalContext } from "@/app/_context/global";
import { checkTrialDays } from "@/app/_lib/checkTrialDays";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeClass, setActiveClass] = useState(true);
  const [userStatus, setUserStatus] = useState<any>("free");
  const [trialDays, setTrialDays] = useState<any>(555);

  // useEffect(() => {
  //   const shop = localStorage?.getItem('shop')
  //   if (shop) {
  //     fetch(`${process.env.NEXT_PUBLIC_API_URL}/freeTrial`, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ shop: localStorage?.getItem('shop') }),
  //       method: 'POST'
  //     }).then((json) => json.json())
  //       .then((data) => {
  //         setUserStatus(data.isPaid == 1 ? 'paid' : data.is_expired == false ? 'trial' : 'free')
  //         setTrialDays(data.freeTrialDate)
  //       })
  //   }
  //
  // }, [localStorage?.getItem('shop')])

  // Responsive logic: 1100px se niche activeNav remove
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setActiveClass(false);
      } else {
        setActiveClass(true);
      }
    };

    handleResize(); // initial check on page load

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section className={`frame-area ${activeClass ? "activeNav" : ""}`}>
        <Sidebar handleOnChange={() => setActiveClass(!activeClass)} />

        <GlobalContext.Provider value={{ userStatus, trialDays }}>
          {children}
        </GlobalContext.Provider>

        <ToastContainer position="bottom-center" theme="dark" />
      </section>

      <Script src={`${basePath}/js/intercom.js`} />
    </>
  );
}
