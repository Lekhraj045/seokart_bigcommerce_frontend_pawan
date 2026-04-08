import { Api } from "@/app/_api/apiCall";
import { useEffect, useState, useRef } from "react";
import SingleItem from "./singleItem";
import { Pagination } from "rsuite";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { basePath } from "@/next.config";

export default function Home() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "metaTagIssue";
  const hasTypeParam = searchParams?.get("type") !== null;

  const [errorHeading, setErrorHeading] = useState(type);

  const [errorType, setErrorType] = useState<any>();

  const [errorCount, setErrorCount] = useState<any>({});
  const [errorItem, setErrorItem] = useState({
    data: [],
    loading: true,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<any>(
    localStorage?.getItem("currentPage") ?? 1,
  );

  // If type parameter is present (coming from dashboard), reset point to 'all'
  // For imagesIssue, it will be set to first point in useEffect after errorType loads
  const [point, setPoint] = useState(
    hasTypeParam ? "all" : (localStorage?.getItem("point") ?? "all"),
  );
  const [limit, setLimit] = useState<any>(localStorage?.getItem("limit") ?? 10);
  const [productFilter, setProductFilter] = useState(
    localStorage?.getItem("productFilter") ?? "published_products",
  );
  const retryCountRef = useRef(false);
  const retryItemRef = useRef(false);
  const retryTimeoutRef = useRef<{
    count: ReturnType<typeof setTimeout> | null;
    item: ReturnType<typeof setTimeout> | null;
  }>({ count: null, item: null });
  // If type parameter is present (coming from dashboard), reset contentTypeFilter to 'all'
  const [contentTypeFilter, setContentTypeFilter] = useState(
    hasTypeParam
      ? "all"
      : (localStorage?.getItem("contentTypeFilter") ?? "all"),
  );

  const getSeoAuditErrorCount = () => {
    const apiParams: any = {};

    // Handle content type filter with item_type
    // Only send is_published for published_products and unpublished_products
    if (contentTypeFilter === "all") {
      apiParams.item_type = "all";
    } else if (contentTypeFilter === "home") {
      apiParams.item_type = "home";
    } else if (contentTypeFilter === "products") {
      apiParams.item_type = "product";
    } else if (contentTypeFilter === "published_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 1;
    } else if (contentTypeFilter === "unpublished_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 0;
    } else if (contentTypeFilter === "categories") {
      apiParams.item_type = "category";
    } else if (contentTypeFilter === "brands") {
      apiParams.item_type = "brand";
    } else if (contentTypeFilter === "pages") {
      apiParams.item_type = "page";
    } else if (contentTypeFilter === "blogs") {
      apiParams.item_type = "blog";
    }

    Api("getSeoAuditErrorCount", apiParams)
      .then(({ data }: any) => {
        if (!data && !retryCountRef.current) {
          retryCountRef.current = true;
          retryTimeoutRef.current.count = setTimeout(
            () => getSeoAuditErrorCount(),
            800,
          );
          return;
        }
        if (!data) return;
        setErrorCount(data);
        const toNumber = (val: any) => {
          if (typeof val === "number") return val;
          if (typeof val === "string") return parseInt(val) || 0;
          return 0;
        };
        setErrorType({
          metaTagIssue: [
            {
              key: "point1",
              value: "Title Tag length is 40 to 60 characters",
              count: toNumber(data.title_tag_length),
            },
            {
              key: "point2",
              value: "Meta Description length is 120 - 160 characters",
              count: toNumber(data.meta_description_length),
            },
            {
              key: "point3",
              value: "Target Keyword present in the Title Tag",
              count: toNumber(data.target_keyword_present_title),
            },
            {
              key: "point4",
              value: "Target Keyword present in the Meta Description",
              count: toNumber(data.target_keyword_present_meta_description),
            },
            {
              key: "point6",
              value: "Duplicate Title Tags",
              count: toNumber(data.duplicate_title),
            },
            {
              key: "point7",
              value: "Duplicate Meta Descriptions",
              count: toNumber(data.duplicate_meta_descriptions),
            },
          ],
          contentIssue: [
            {
              key: "point5",
              value: "Target Keyword present in the description",
              count: toNumber(data.target_keyword_present_description),
            },
            {
              key: "point10",
              value: "Lorem Ipsum content in the description",
              count: toNumber(data.lorem_Ipsum),
            },
            {
              key: "point11",
              value: "Spelling Errors in the description",
              count: toNumber(data.spelling_errors),
            },
          ],
          imagesIssue: [
            {
              key: "point8",
              value: "Alt Text available in the Primary Image",
              count: toNumber(data.alt_text),
            },
          ],
          brokenLinksIssue: [
            {
              key: "internal_count",
              value: "Internal Broken Links",
              count: toNumber(data.internal_count),
            },
            {
              key: "external_count",
              value: "External Broken Links",
              count: toNumber(data.external_count),
            },
            {
              key: "point12",
              value: "HTTP Links",
              count: toNumber(data.http_links),
            },
          ],
          urlIssue: [
            {
              key: "point13",
              value: "URL length is less than 48 characters",
              count: toNumber(data.url_length),
            },
            {
              key: "point14",
              value: "Target Keyword present in the URL",
              count: toNumber(data.target_keyword_present_url),
            },
          ],
        });
      })
      .catch(() => {
        if (!retryCountRef.current) {
          retryCountRef.current = true;
          retryTimeoutRef.current.count = setTimeout(
            () => getSeoAuditErrorCount(),
            800,
          );
        }
      });
  };

  const getSeoAuditErrorItem = () => {
    setErrorItem({ data: [], loading: true, total: 0 });

    const apiParams: any = {
      page: currentPage,
      limit: limit,
      point: point, // Always send point, including 'all'
      issue_type: errorHeading, // Add issue_type (errorHeading)
    };

    // Handle content type filter with item_type
    // Only send is_published for published_products and unpublished_products
    if (contentTypeFilter === "all") {
      apiParams.item_type = "all";
    } else if (contentTypeFilter === "home") {
      apiParams.item_type = "home";
    } else if (contentTypeFilter === "products") {
      apiParams.item_type = "product";
    } else if (contentTypeFilter === "published_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 1;
    } else if (contentTypeFilter === "unpublished_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 0;
    } else if (contentTypeFilter === "categories") {
      apiParams.item_type = "category";
    } else if (contentTypeFilter === "brands") {
      apiParams.item_type = "brand";
    } else if (contentTypeFilter === "pages") {
      apiParams.item_type = "page";
    } else if (contentTypeFilter === "blogs") {
      apiParams.item_type = "blog";
    }

    Api("getSeoAuditErrorItem", apiParams)
      .then((data: any) => {
        const list = data?.data ?? [];
        const total = data?.total_page_count ?? 0;
        setErrorItem({ data: list, loading: false, total });
        if (list.length === 0 && total === 0 && !retryItemRef.current) {
          retryItemRef.current = true;
          retryTimeoutRef.current.item = setTimeout(
            () => getSeoAuditErrorItem(),
            800,
          );
        }
      })
      .catch(() => {
        setErrorItem({ data: [], loading: false, total: 0 });
        if (!retryItemRef.current) {
          retryItemRef.current = true;
          retryTimeoutRef.current.item = setTimeout(
            () => getSeoAuditErrorItem(),
            800,
          );
        }
      });
  };

  // Reset contentTypeFilter and point when navigating from dashboard (type parameter in URL)
  useEffect(() => {
    if (hasTypeParam) {
      // Reset contentTypeFilter to 'all' when coming from dashboard
      setContentTypeFilter("all");
      localStorage.removeItem("contentTypeFilter");

      // Reset point based on errorHeading
      // For imagesIssue, set to first point, otherwise set to 'all'
      if (type === "imagesIssue") {
        // Will be set in the imagesIssue useEffect after errorType loads
        localStorage.removeItem("point");
      } else {
        setPoint("all");
        localStorage.removeItem("point");
      }
    }
  }, [hasTypeParam, type]);

  useEffect(() => {
    retryCountRef.current = false;
    if (retryTimeoutRef.current.count) {
      clearTimeout(retryTimeoutRef.current.count);
      retryTimeoutRef.current.count = null;
    }
    getSeoAuditErrorCount();
    return () => {
      if (retryTimeoutRef.current.count)
        clearTimeout(retryTimeoutRef.current.count);
    };
  }, [productFilter, contentTypeFilter]);

  useEffect(() => {
    retryItemRef.current = false;
    if (retryTimeoutRef.current.item) {
      clearTimeout(retryTimeoutRef.current.item);
      retryTimeoutRef.current.item = null;
    }
    getSeoAuditErrorItem();
    return () => {
      if (retryTimeoutRef.current.item)
        clearTimeout(retryTimeoutRef.current.item);
    };
  }, [
    limit,
    currentPage,
    point,
    productFilter,
    contentTypeFilter,
    errorHeading,
  ]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("limit", limit);
  }, [limit]);

  useEffect(() => {
    localStorage.setItem("errorHeading", errorHeading);
  }, [errorHeading]);

  // If imagesIssue is selected and point is 'all', set to first point
  useEffect(() => {
    if (
      errorHeading === "imagesIssue" &&
      point === "all" &&
      errorType &&
      errorType[errorHeading] &&
      errorType[errorHeading].length > 0
    ) {
      setPoint(errorType[errorHeading][0].key);
      localStorage.setItem("point", errorType[errorHeading][0].key);
    }
  }, [errorHeading, errorType, point]);

  useEffect(() => {
    localStorage.setItem("point", point);
  }, [point]);

  useEffect(() => {
    localStorage.setItem("productFilter", productFilter);
  }, [productFilter]);

  useEffect(() => {
    localStorage.setItem("contentTypeFilter", contentTypeFilter);
  }, [contentTypeFilter]);

  return (
    <>
      <div className="PageSpeed-URL-Area">
        {/* <div className="absolute top-[18px] left-[158px]">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="unpublishedProducts" />
          <label className="form-check-label" htmlFor="unpublishedProducts">
            Including unpublished products
          </label>
        </div>
      </div> */}
        <div className="d-flex justify-content-between">
          {errorType && (
            <div className="d-flex align-item-center gap-3 seo-optimierPage-left">
              <div className="custom-dropi without-labelDropi">
                <select
                  className="form-select"
                  aria-label="Content type filter"
                  value={contentTypeFilter}
                  onChange={(e) => {
                    setContentTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="home">Home</option>
                  <option value="products">Products</option>
                  <option value="published_products">
                    🟢 Published Products
                  </option>
                  <option value="unpublished_products">
                    🔴 Unpublished Products
                  </option>
                  <option value="categories">Categories</option>
                  <option value="brands">Brands</option>
                  <option value="pages">Pages</option>
                  <option value="blogs">Blogs</option>
                </select>
              </div>

              <div className="custom-dropi without-labelDropi">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={errorHeading}
                  onChange={(e) => {
                    const newErrorHeading = e.target.value;
                    setErrorHeading(newErrorHeading);
                    // For imagesIssue, set first point instead of 'all'
                    if (
                      newErrorHeading === "imagesIssue" &&
                      errorType[newErrorHeading] &&
                      errorType[newErrorHeading].length > 0
                    ) {
                      setPoint(errorType[newErrorHeading][0].key);
                    } else {
                      setPoint("all");
                    }
                    setCurrentPage(1);
                  }}
                >
                  <option value="metaTagIssue">Meta Tag Issues</option>
                  <option value="contentIssue">Content Issues</option>
                  <option value="imagesIssue">{`Images Issues`}</option>
                  <option value="brokenLinksIssue">Broken Links Issues</option>
                  <option value="urlIssue">URL Issues</option>
                </select>
              </div>

              <div className="custom-dropi without-labelDropi">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={point}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setPoint(e.target.value);
                  }}
                >
                  {errorType[errorHeading] && (
                    <>
                      {errorHeading !== "imagesIssue" && (
                        <option value="all">
                          All (
                          {errorType[errorHeading].reduce(
                            (total: number, item: any) =>
                              total + (item.count ?? 0),
                            0,
                          )}
                          )
                        </option>
                      )}
                      {errorType[errorHeading].map((item: any, key: any) => (
                        <option key={key} value={item.key}>
                          {item.value} ({item.count ?? 0})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="custom-table max-h-[540px] overflow-y-auto mt-20">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 max-w-2.5 max-h-2.5 min-w-2.5 min-h-2.5 rounded-full bg-[#f7f7f7]"></span>
                    Name
                  </div>
                </th>
                <th>Type</th>
                <th>Meta</th>
                <th>Content</th>
                <th>Image</th>
                <th>Broken</th>
                <th>URL</th>
                <th className="text-align-right">SEO Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {errorItem.loading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : errorItem.data.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="d-flex flex-column align-items-center justify-content-center py-3">
                      <Image
                        src={`${basePath}/images/no-data-found.svg`}
                        width={60}
                        height={60}
                        alt=""
                      />
                      <p className="mt-2 font-bold">Data Not Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                errorItem.data.map((item, key) => (
                  <SingleItem key={key} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3">
        <Pagination
          total={errorItem.total}
          limit={Number(limit)}
          limitOptions={[5, 10, 20]}
          prev={true}
          next={true}
          first={true}
          last={true}
          layout={["limit", "pager", "skip", "-"]}
          maxButtons={4}
          ellipsis={true}
          boundaryLinks={true}
          activePage={Number(currentPage)}
          onChangePage={(page) => {
            setCurrentPage(page);
          }}
          onChangeLimit={(limit) => {
            setLimit(limit);
          }}
        />
      </div>
    </>
  );
}
