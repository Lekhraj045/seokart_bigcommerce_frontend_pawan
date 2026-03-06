import { useState } from "react";
import { Modal } from "react-bootstrap";
import Image from "next/image";
import { basePath } from "@/next.config";

export default function Home(Props: any) {
  return (
    <>
      <Modal show={Props.show} onHide={Props.handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Are you sure you want to proceed with the Bulk Optimizer?</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h3 className="text-base font-bold text-[#303030]">Live Preview</h3>

            <div className="BulkOptimizer-Preview-Pera">
              <p className="text-xs text-[#616161] font-normal">
                {`Our app will apply this template to each ${
                  Props.selectedItem == "product"
                    ? "products"
                    : Props.selectedItem == "category"
                    ? "categories"
                    : "brands"
                } Here is a sample ${
                  Props.selectedItem == "product"
                    ? "product"
                    : Props.selectedItem == "category"
                    ? "category"
                    : "brand"
                }'s ${
                  Props.currentTab == "titleTag"
                    ? "Title Tag"
                    : Props.currentTab == "metaDescription"
                    ? "Meta Description"
                    : "Alt Text"
                }.`}
              </p>

              <div className="infoCard !bg-[#F8FAFC] mt-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-[#616161] font-normal">
                      {Props.selectedItem == "product"
                        ? `Product`
                        : Props.selectedItem == "category"
                        ? "Category"
                        : "Brand"}{" "}
                      URL:
                    </p>

                    <div className="bg-white rounded-md border border-gray-200 min-h-[28px]">
                      <div className="flex items-center gap-2 px-[12px] py-[6px]">
                        <a
                          href={`${Props.homeUrl}${Props.previewData.url}`}
                          target="_blank"
                          className="bulk-productURL"
                        >
                          <Image
                            src={`${basePath}/images/link-icon.svg`}
                            alt=""
                            width={16}
                            height={16}
                          />
                        </a>
                        <p className="text-xs text-[#616161] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                          {Props.homeUrl}
                          {Props.previewData.url}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-[#616161] font-normal">
                        Current{" "}
                        {Props.currentTab == "titleTag"
                          ? "Title Tag"
                          : Props.currentTab == "metaDescription"
                          ? "Meta Description"
                          : "Alt Text"}
                        :
                      </p>

                      <div className="bg-white rounded-md border border-gray-200 min-h-[70px] max-h-[70px] overflow-auto">
                        <div className="flex items-center gap-2 px-[12px] py-[6px]">
                          <p className="text-xs text-[#616161] font-normal word-break">
                            {Props.currentTab == "titleTag"
                              ? Props.previewData.title_tag
                              : Props.currentTab == "metaDescription"
                              ? Props.previewData.meta_desc
                              : Props.previewData.product_img_alt}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-[#616161] font-normal">
                        New{" "}
                        {Props.currentTab == "titleTag"
                          ? "Title Tag"
                          : Props.currentTab == "metaDescription"
                          ? "Meta Description"
                          : "Alt Text"}
                        :
                      </p>
                      <div className="bg-white rounded-md border border-gray-200 min-h-[70px] max-h-[70px] overflow-auto">
                        <div className="flex items-center gap-2 px-[12px] py-[6px]">
                          <p className="text-xs text-[#616161] font-normal word-break">
                            {Props.template
                              ?.replaceAll(
                                "[[product name]]",
                                Props.previewData.product_name
                              )
                              .replaceAll("[[sku]]", Props.previewData.sku)
                              .replaceAll("[[price]]", Props.previewData.price)
                              .replaceAll("[[type]]", Props.previewData.type)
                              .replaceAll(
                                "[[category name]]",
                                Props.previewData.category_name
                              )
                              .replaceAll(
                                "[[brand]]",
                                Props.previewData.brand_name
                              )
                              .replaceAll("[[mpn]]", Props.previewData.mpn)
                              .replaceAll(
                                "[[condition]]",
                                Props.previewData.condition
                              )
                              .replaceAll(
                                "[[condition]]",
                                Props.previewData.condition
                              )
                              .replaceAll(
                                "[[name]]",
                                Props.previewData.brand_name
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-default" onClick={Props.handleClose}>
            No
          </button>
          <button className="custom-btn" onClick={Props.handleYes}>
            Yes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
