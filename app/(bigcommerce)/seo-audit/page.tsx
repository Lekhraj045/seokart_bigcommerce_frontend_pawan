"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Api } from "@/app/_api/apiCall";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";

const ChannelList = dynamic(() => import("@/app/_components/channelList"), {
  ssr: false,
});
const Howitwork = dynamic(() => import("@/app/_howitwork/modal"), {
  ssr: false,
});
const CountSection = dynamic(() => import("./_components/countSection"), {
  ssr: false,
});
const ListSection = dynamic(() => import("./_components/listSection"), {
  ssr: false,
});
import Confirmation from "@/app/_components/confirmation";
import UpgradeButton from "../../_components/upgradeButton";
import Hamburger from "../../_components/hamburger";

export default function Home() {
  const [syncStatus, setSyncStatus] = useState(0);
  const [syncModal, setSyncModal] = useState(false);
  const [ConfirmationModal, setConfirmationModal] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  useEffect(() => {
    setIsPaidUser((localStorage.getItem("manage_service") ?? "0") === "1");
  }, []);

  const synchronization = () => {
    setConfirmationModal(false);
    Api("synchronization").then((data) => {
      setSyncStatus(0);
      toast.success("Synchronization job successfully");
    });
  };
  return (
    <>
      <Confirmation
        show={ConfirmationModal}
        handleClose={() => setConfirmationModal(false)}
        message={
          <>
            <p>
              Run the sync function only if you have made changes to the meta
              tags or content of products/categories outside the SEOKart App.
              SEOKart will synchronize all the products/categories that have
              been modified outside the App.
            </p>
            <p>
              If you have added or deleted new products/categories, the Audit
              will start automatically on the dashboard. The sync function is
              not necessary.
            </p>
          </>
        }
        handleYes={synchronization}
        handleNo={() => setConfirmationModal(false)}
      />
      <Modal
        centered
        show={syncModal}
        onHide={() => setSyncModal(false)}
        backdrop="static"
      >
        <Modal.Header>
          <h4>
            Please reschedule the Sync for another time as the Audit is
            currently in progress.
          </h4>
        </Modal.Header>
        <Modal.Body>
          <p>
            Audit: The Audit starts automatically whenever you add or delete new
            products/categories and log in to the SEOKart App. You can track the
            progress on the Dashboard.
          </p>
          <p>
            Sync: If you have made any changes to the meta tags or content of
            products/categories outside the SEOKart App, you can run the Sync
            function. Our App will synchronize all the products/categories that
            have been modified outside our App.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="custom-btn" onClick={() => setSyncModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <div className="content-frame-main">
        <div className="py-3 lg:py-6 flex justify-between items-start lg:items-center gap-3 flex-col lg:flex-row">
          <div className="content-frameHead-left flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#616161] font-normal uppercase">
                SEO Optimizer
              </p>
              <Howitwork page="seoaudit" />
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-[17px] md:text-xl font-semibold mb-[2px]">
                Pages overview
              </h4>
            </div>
            <p className="text-xs text-[#616161] font-normal">
              See all pages with SEO issues and jump into the optimizer.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <ChannelList />
            {isPaidUser && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (syncStatus == 2) setSyncModal(true);
                  else setConfirmationModal(true);
                }}
                disabled={syncStatus == 0 ? true : false}
              >
                {syncStatus == 0 ? "Sync in progress..." : "Sync"}
              </button>
            )}
            <UpgradeButton />
            <Hamburger />
          </div>
        </div>

        <div className="seo-optimizerMain flex flex-col gap-3">
          <CountSection
            setSyncStatus={(status: number) => setSyncStatus(status)}
          />
          <ListSection />
        </div>
      </div>
    </>
  );
}
