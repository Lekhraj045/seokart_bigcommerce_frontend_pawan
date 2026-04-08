"use client";

import Image from "next/image";
import { basePath } from "@/next.config";
import { Api } from "@/app/_api/apiCall";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import LinkModal from "./linkModal";
import SpellModal from "./spellModal";


export default function Home(Props: any) {  
  const [linkModalShow, setLinkModalShow] = useState(false);
  const [spellModalShow, setSpellModalShow] = useState(false);
  const [linkType, setLinkType] = useState("internal");
  const [spellStatus, setSpellStatus] = useState(Props?.spellStatus);

  const [spellCount, setSpellCount] = useState(
    Props?.spellErrorDescriptionCount?.data,
  );

  useEffect(() => {
    setSpellCount(Props?.spellErrorDescriptionCount?.data);
  }, [Props?.spellErrorDescriptionCount?.data]);

  const updateSpellErrorStatus = (spellStatus: any) => {
    Api("updateSpellErrorStatus", { type: spellStatus, id: Props.id });
  };

  useEffect(() => {
    setSpellStatus(Props?.spellStatus);
  }, [Props?.spellStatus]);

  return (
    <>
      <LinkModal
        show={linkModalShow}
        onHide={() => setLinkModalShow(false)}
        itemName={Props?.itemName}
        targetKeyword={Props?.targetKeyword}
        titleTag={Props?.titleTag}
        metaDescription={Props?.metaDescription}
        description={Props?.description}
        linkType={linkType}
      />

      <SpellModal
        id={Props?.id}
        show={spellModalShow}
        onHide={() => setSpellModalShow(false)}
        itemName={Props?.itemName}
        targetKeyword={Props?.targetKeyword}
        titleTag={Props?.titleTag}
        metaDescription={Props?.metaDescription}
        description={Props?.description}
        count={spellCount}
        updateSpellCount={(count: any) => {
          setSpellCount(count);
        }}
        getAuditScoreOnChange={() => Props?.getAuditScoreOnChange()}
      />
      <div className="card seoOptimizer-left">
        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>No Target Keyword present in the description</p>
          {Props?.tKDescriptionIssue?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.tKDescriptionIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>No Lorem Ipsum content in the description</p>
          {Props.loremIpsumDescriptionIssue.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.loremIpsumDescriptionIssue?.data ? "check-green.svg" : "close-red-icon.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>
            No Internal Broken Links{" "}
            <a
              href="#"
              onClick={() => {
                setLinkType("internal");
                setLinkModalShow(true);
              }}
            >
              {" "}
              ({Props?.internalBrokenCount?.data})
            </a>
          </p>
          {Props.internalBrokenCount.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props?.internalBrokenCount?.data ? "close-red-icon.svg" : "check-green.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>
            No External Broken Links{" "}
            <a
              href="#"
              onClick={() => {
                setLinkType("external");
                setLinkModalShow(true);
              }}
            >
              {" "}
              ({Props?.externalBrokenCount?.data})
            </a>
          </p>
          {Props?.externalBrokenCount?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props.externalBrokenCount.data ? "close-red-icon.svg" : "check-green.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
          <p>
            No HTTP Links{" "}
            <a
              href="#"
              onClick={() => {
                setLinkType("http");
                setLinkModalShow(true);
              }}
            >
              {" "}
              ({Props?.httpCount?.data})
            </a>
          </p>
          {Props?.httpCount?.loading ? (
            <div className="w-[25px] h-[25px]">
              <Spinner size="sm" />
            </div>
          ) : (
            <span>
              <Image
                src={`${basePath}/images/${Props.httpCount.data ? "close-red-icon.svg" : "check-green.svg"}`}
                alt=""
                width={20}
                height={20}
              />
            </span>
          )}
        </div>

        <div className="spelling-listIssues">
          <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
            <p>
              No Spelling Errors in the description{" "}
              <a
                href="#"
                onClick={() => {
                  setSpellModalShow(true);
                }}
              >
                {" "}
                ({spellCount})
              </a>
            </p>
            {Props.spellErrorDescriptionCount.loading ? (
              <div className="w-[25px] h-[25px]">
                <Spinner size="sm" />
              </div>
            ) : (
              <span>
                <Image
                  src={`${basePath}/images/${spellCount && spellStatus == "on" ? "close-red-icon.svg" : "check-green.svg"}`}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            )}
          </div>

          <div className="custom-dropi without-labelDropi">
            <select
              className="form-select"
              aria-label="Default select example"
              value={spellStatus}
              onChange={(e) => {
                setSpellStatus(e.target.value);
                updateSpellErrorStatus(e.target.value);
                Props.getAuditScoreOnChange();
              }}
            >
              <option value="off_store">OFF for this Store</option>
              <option value="on">On</option>
              <option value="off_page">OFF for this Page</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
