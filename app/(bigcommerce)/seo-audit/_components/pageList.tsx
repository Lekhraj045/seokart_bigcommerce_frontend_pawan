import { Api } from "@/app/_api/apiCall";
import { basePath } from "@/next.config";
import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Pagination } from "rsuite";
import Image from "next/image";
import SingleItem from "./singleItem";
import _ from "lodash";

export default function Home() {
  const [itemType, setItemType] = useState(
    localStorage?.getItem("itemType") ?? "product",
  );
  const [sort, setSort] = useState(localStorage?.getItem("sort") || "atoz");
  const [emptyType, setEmptyType] = useState(
    localStorage?.getItem("emptyType") ?? "all",
  );
  const [searchKeyword, setSearchKeyword] = useState(
    localStorage?.getItem("searchKeyword") ?? "",
  );
  const [itemList, setItemList] = useState({
    data: [],
    loading: true,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<any>(
    localStorage?.getItem("currentPage") ?? 1,
  );
  const [limit, setLimit] = useState<any>(localStorage?.getItem("limit") ?? 10);
  const retryRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSeoAuditPageData = () => {
    setItemList({ data: [], loading: true, total: 0 });

    // Prepare API parameters
    const apiParams: any = {
      item_type: itemType,
      sort: sort,
      empty_type: emptyType,
      search_key: searchKeyword,
      page: currentPage,
      limit: limit,
    };

    // Handle published/unpublished products filter
    if (itemType === "published_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 1;
    } else if (itemType === "unpublished_products") {
      apiParams.item_type = "product";
      apiParams.is_published = 0;
    }

    Api("getSeoAuditPageData", apiParams)
      .then((data) => {
        const list = data?.data ?? [];
        const total = data?.total_page_count ?? 0;
        setItemList({
          data: list,
          loading: false,
          total,
        });
        // First visit often gets empty due to timing; retry once after delay (skip when search applied - empty can be valid)
        if (
          list.length === 0 &&
          total === 0 &&
          !retryRef.current &&
          !searchKeyword
        ) {
          retryRef.current = true;
          retryTimeoutRef.current = setTimeout(() => {
            getSeoAuditPageData();
          }, 800);
        }
      })
      .catch(() => {
        setItemList({ data: [], loading: false, total: 0 });
        if (!retryRef.current) {
          retryRef.current = true;
          retryTimeoutRef.current = setTimeout(
            () => getSeoAuditPageData(),
            800,
          );
        }
      });
  };

  const fetchRef = useRef(getSeoAuditPageData);
  fetchRef.current = getSeoAuditPageData;
  const debouncedGetSeoAuditPageData = useMemo(
    () =>
      _.debounce(() => {
        fetchRef.current();
      }, 500),
    [],
  );

  useEffect(() => {
    retryRef.current = false;
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    debouncedGetSeoAuditPageData();
    return () => {
      debouncedGetSeoAuditPageData.cancel?.();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [
    sort,
    emptyType,
    searchKeyword,
    currentPage,
    itemType,
    limit,
    debouncedGetSeoAuditPageData,
  ]);

  useEffect(() => {
    localStorage.setItem("itemType", itemType);
  }, [itemType]);

  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  useEffect(() => {
    localStorage.setItem("emptyType", emptyType);
  }, [emptyType]);

  useEffect(() => {
    localStorage.setItem("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("limit", limit);
  }, [limit]);
  return (
    <>
      <div className="PageSpeed-URL-Area">
        <div className="d-flex justify-content-between seo-optimierPage-head">
          <div className="d-flex align-item-center gap-3 seo-optimierPage-left">
            <div className="custom-dropi without-labelDropi">
              <select
                className="form-select"
                value={itemType}
                onChange={(e) => {
                  setItemType(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Default select example"
              >
                <option value="all">All</option>
                <option value="home">Home</option>
                <option value="product">Products</option>
                <option value="published_products">
                  {" "}
                  🟢 Published Products
                </option>
                <option value="unpublished_products">
                  {" "}
                  🔴 Unpublished Products
                </option>
                <option value="category">Categories</option>
                <option value="brand">Brands</option>
                <option value="page">Pages</option>
                <option value="blog">Blogs</option>
              </select>
            </div>

            <div className="custom-dropi without-labelDropi">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Default select example"
              >
                <option value="atoz">Name - A to Z</option>
                <option value="ztoa">Name - Z to A</option>
                <option value="lth">SEO Score - Low to High</option>
                <option value="htl">SEO Score - High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>

            <div className="custom-dropi without-labelDropi">
              <select
                className="form-select"
                value={emptyType}
                onChange={(e) => {
                  setEmptyType(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Default select example"
              >
                <option value="all">Select All</option>
                <option value="meta_title">Blank Title Tag</option>
                <option value="meta_desc">Blank Meta Description</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-item-center gap-3 seo-optimierPage-right">
            <div className="custom-input icon-input without-labelInput search-closeBar">
              <i className="input-icon">
                <Image
                  src={`${basePath}/images/search-icon.svg`}
                  width={20}
                  height={20}
                  alt=""
                />
              </i>
              <input
                type="text"
                placeholder="Search By Name"
                className="form-control"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
              />
              <span
                className="searchClose-icon"
                style={{ display: `${searchKeyword ? "" : "none"}` }}
                onClick={() => {
                  setSearchKeyword("");
                }}
              >
                <Image
                  src={`${basePath}/images/close-icon.svg`}
                  width={20}
                  height={20}
                  alt=""
                />
              </span>
            </div>
          </div>
        </div>

        <div className="custom-table mt-20">
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
              {itemList.loading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : itemList.data.length === 0 ? (
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
                itemList.data.map((item: any, key: any) => (
                  <SingleItem key={key} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3">
        <Pagination
          total={itemList.total}
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
