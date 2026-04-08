"use client";

import Image from "next/image";
import { basePath } from "@/next.config";
import { Api } from "@/app/_api/apiCall";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DuplicateModal from "./duplicateModal";

export default function Home(Props: any) {
  const [duplicateModalShow, setDuplicateModalShow] = useState(false);
  const [type, setType] = useState("title_tag");

  return (
    <>
      <DuplicateModal
        show={duplicateModalShow}
        onHide={() => setDuplicateModalShow(false)}
        type={type}
        itemName={Props?.itemName}
        targetKeyword={Props?.targetKeyword}
        titleTag={Props?.titleTag}
        metaDescription={Props?.metaDescription}
        description={Props?.description}
      />
      <div className="card seoOptimizer-left">
        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>Title length (40 to 60)</p>
          {Props?.titleLengthIssue?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.titleLengthIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>Meta Description length (120 to 160)</p>
          {Props?.metaDescriptionLengthIssue?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.metaDescriptionLengthIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>Target Keyword present in the Title Tag</p>
          {Props?.tKTitleIssue?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.tKTitleIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>Target Keyword present in the Meta Description</p>
          {Props?.tKMetaDescriptionIssue?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.tKMetaDescriptionIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>
            No Duplicate Title Tags{" "}
            <a
              href="#"
              onClick={() => {
                setType("title_tag");
                setDuplicateModalShow(true);
              }}
            >
              ({Props?.duplicateTitleCount?.data})
            </a>
          </p>
          {Props?.duplicateTitleCount?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.duplicateTitleCount?.data ? "close-red-icon.svg" : "check-green.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3">
          <p>
            No Duplicate Meta Descriptions{" "}
            <a
              href="#"
              onClick={() => {
                setType("meta_description");
                setDuplicateModalShow(true);
              }}
            >
              ({Props?.duplicateMetaDescriptionCount?.data})
            </a>
          </p>
          {Props?.duplicateMetaDescriptionCount?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.duplicateMetaDescriptionCount?.data ? "close-red-icon.svg" : "check-green.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
