"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Image from "next/image";
import { basePath } from "../../next.config";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";

export default function Sidebar({ handleOnChange }: { handleOnChange: any }) {
  const segment = useSelectedLayoutSegment() || "dashboard";

  return (
    <>
      <div className="sidebar">
        <nav className="custom-navbar">
          <ul>
            <li className="nav-logo">
              <a href="#">
                <div className="logo-icon">
                  <Image
                    src={`${basePath}/images/logo-icon.svg`}
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <div className="menu-hover-logo align-item-center gap-3">
                  <Image
                    src={`${basePath}/images/logo.svg`}
                    alt=""
                    width={155}
                    height={34}
                  />
                  <button type="button" onClick={handleOnChange}>
                    <Image
                      src={`${basePath}/images/menu-icon.svg`}
                      alt=""
                      width={20}
                      height={18}
                    />
                  </button>
                </div>
              </a>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/dashboard"
                className={segment == "dashboard" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/dashboard-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/analytics"
                className={segment == "analytics" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/analytics-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Analytics</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/seo-copilot"
                className={segment == "seo-copilot" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/analytics-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">SEO copilot</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/rank-tracker"
                className={segment == "rank-tracker" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/rank-tracker-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Rank Tracker</span>
              </Link>
            </li>

            <li className="nav-separator"></li>

            <li>
              <Link
                prefetch={false}
                href="/seo-audit"
                className={segment == "seo-audit" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/seo-audit-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">SEO Optimizer</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/bulk-optimizer"
                className={segment == "bulk-optimizer" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/bulk-optimizer-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Bulk Optimizer</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/image-optimizer"
                className={segment == "image-optimizer" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/image-optimizer-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Image Optimizer</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/rich-snippets"
                className={segment == "rich-snippets" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/rich-snippets-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Rich Snippets</span>
              </Link>
            </li>

            <li>
              <Dropdown>
                <Dropdown.Toggle>
                  <div className="nav-icon">
                    <Image
                      src={`${basePath}/images/url-editor-main-icon.svg`}
                      width={20}
                      height={20}
                      alt=""
                    />
                  </div>
                  <span className="nav-text">404 & URL</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Link
                    href="/404-fixer"
                    className={segment == "404-fixer" ? "active" : ""}
                  >
                    <div className="nav-icon">
                      <Image
                        src={`${basePath}/images/404-fixer-icon.svg`}
                        width={20}
                        height={20}
                        alt=""
                      />
                    </div>
                    <span className="nav-text">404 Fixer</span>
                  </Link>

                  <Link
                    href="/url-editor"
                    className={segment == "url-editor" ? "active" : ""}
                  >
                    <div className="nav-icon">
                      <Image
                        src={`${basePath}/images/url-editor-icon.svg`}
                        width={20}
                        height={20}
                        alt=""
                      />
                    </div>
                    <span className="nav-text">URL Editor</span>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/page-speed"
                className={segment == "page-speed" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/page-speed-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Free Page Speed</span>
              </Link>
            </li>

            <li className="nav-separator"></li>

            <li>
              <Link
                prefetch={false}
                href="/upgrade?tab=app"
                className={segment == "upgrade?tab=app" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/upgrade-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Upgrade</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/upgrade?tab=seoServices"
                className={segment == "upgrade?tab=seoServices" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/seo-services-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">SEO Services</span>
              </Link>
            </li>

            <li>
              <Link
                prefetch={false}
                href="/help"
                className={segment == "help" ? "active" : ""}
              >
                <div className="nav-icon">
                  <Image
                    src={`${basePath}/images/help-icon.svg`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <span className="nav-text">Help</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
