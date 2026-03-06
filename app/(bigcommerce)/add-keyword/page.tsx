"use client";

import { Spinner } from "react-bootstrap";
import ChannelList from "@/app/_components/channelList";
import UpgradeButton from "@/app/_components/upgradeButton";
import { Api } from "@/app/_api/apiCall";
import { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import Image from "next/image";

import TagInput from "rsuite/TagInput";
import { toast } from "react-toastify";
import Select from "react-select";
import Confirmation from "@/app/_components/confirmation";
import SuggestModal from "./_components/suggestKeywordModal";
import { basePath } from "@/next.config";
import Link from "next/link";

export default function Home() {
  const [device, setDevice] = useState<any>("monitor");
  const [countryList, setCountryList] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>("US");
  const [languageList, setLanguageList] = useState<any>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any>("English");
  const [searchEngineList, setSearchEngineList] = useState<any>([]);
  const [selectedSearchEngine, setSelectedSearchEngine] =
    useState<any>("google.com");
  const [keywords, setKeywords] = useState({ data: [], loading: true });
  const [inputKeyword, setInputKeyword] = useState<any>([]);
  const [suggestKeywords, setSuggestKeywords] = useState({
    data: [],
    loading: true,
  });
  const [addKeywordBtnLoading, setAddKeywordBtnLoading] = useState(false);
  const [confKeywordDelete, setConfKeywordDelete] = useState(false);
  const currentSelectedKeyword = useRef("");
  const isFirstSuggestionsRun = useRef(true);
  const [limit, setLimit] = useState(0);
  const [used, setUsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [suggestModal, setSuggestModal] = useState(false);

  const [suggestCompetitor, setSuggestCompetitor] = useState<any>({
    data: [],
    loading: true,
  });
  const [competitor1, setCompetitor1] = useState<any>("");
  const [competitor2, setCompetitor2] = useState<any>("");
  const [competitor3, setCompetitor3] = useState<any>("");
  const [competitorBtnLoading, setCompetitorBtnLoading] = useState(false);

  const deviceList = [
    { label: "Desktop", value: "monitor" },
    { label: "Mobile", value: "smartphone" },
  ];

  const getKeyword = () => {
    Api("getKeyword").then((data: any) => {
      setKeywords({ data: data.data, loading: false });
      setLimit(data.total_limit);
      setUsed(data.total_used);
      setRemaining(data.total_remaining);
    });
  };

  const getSuggestedKeyword = () => {
    Api("getSuggestedKeyword").then((data: any) => {
      setSuggestKeywords({ data: data.data, loading: false });
    });
  };

  const debouncedRefreshSuggestions = useMemo(
    () =>
      _.debounce(() => {
        getSuggestedKeyword();
        getSuggestedCompetitor();
      }, 500),
    [],
  );

  const getSuggestedCompetitor = () => {
    Api("getSuggestedCompetitor").then((data: any) => {
      const competitorData = JSON.parse(data.data.suggested_competitor);
      if (competitorData.from_data == "keyword_api") {
        setSuggestCompetitor({ data: competitorData.data, loading: false });
      } else {
        setSuggestCompetitor({
          data: [
            "Please add atleast one keyword for competitors' suggestions.",
          ],
          loading: false,
        });
      }
      if (data.data.competitor1) setCompetitor1(data.data.competitor1);
      if (data.data.competitor2) setCompetitor2(data.data.competitor2);
      if (data.data.competitor3) setCompetitor3(data.data.competitor3);
    });
  };

  const addCompetitor = () => {
    setCompetitorBtnLoading(true);
    Api("addCompetitors", {
      competitor1: competitor1,
      competitor2: competitor2,
      competitor3: competitor3,
    }).then(() => {
      toast.success("Competitors updated successfully.");
      setCompetitorBtnLoading(false);
    });
  };

  const addKeyword = () => {
    if (inputKeyword.length == 0) {
      toast.error("Input Keyword and press enter");
      return false;
    }
    setAddKeywordBtnLoading(true);
    Api("addKeywords", {
      keywords: inputKeyword.toString(),
      search_en: selectedSearchEngine,
      search_en_language: selectedLanguage,
      country_name: countryList.find(
        (item: any) => item.value == selectedCountry,
      ).label,
      device: device,
      country_iso_code: selectedCountry,
    }).then((data) => {
      setAddKeywordBtnLoading(false);
      setInputKeyword([]);
      getKeyword();
      toast.success("Keyword added");
    });
  };

  const deletKeyword = () => {
    Api("deleteKeyword", { keyword_id: currentSelectedKeyword.current }).then(
      () => {
        toast.success("Keyword deleted successfully.");
        getKeyword();
      },
    );
  };

  const getCountry = () => {
    Api("getCountry").then(({ data }) => {
      setCountryList(
        data.map((item: any) => ({
          label: item.location_name,
          value: item.country_iso_code,
        })),
      );
    });
  };

  const addSuggestedCompetitor = (item: any) => {
    if (!competitor1) {
      setCompetitor1(item);
    } else {
      if (!competitor2) {
        setCompetitor2(item);
      } else {
        if (!competitor3) {
          setCompetitor3(item);
        }
      }
    }
  };

  const getLanguage = () => {
    Api("getLanguage").then(({ data }) => {
      setLanguageList(
        data.map((item: any) => ({
          label: item.language_name,
          value: item.language_name,
        })),
      );
    });
  };

  const getSearchEngine = () => {
    Api("getSearchEngine", {
      country: countryList.find((item: any) => item.value == selectedCountry)
        ?.label,
    }).then(({ data }) => {
      setSearchEngineList(
        data.map((item: any) => ({ label: item.se_name, value: item.se_name })),
      );
    });
  };

  const handleAddKeywordByClick = (item: any) => {
    setInputKeyword((inputKeyword: any) => {
      if (
        inputKeyword.length < remaining &&
        !inputKeyword.find((element: any) => element == item)
      )
        return [...inputKeyword, item];
      else return inputKeyword;
    });
  };

  useEffect(() => {
    getKeyword();
    getSuggestedKeyword();
    getSuggestedCompetitor();
    getCountry();
    getLanguage();
  }, []);

  useEffect(() => {
    if (isFirstSuggestionsRun.current) {
      isFirstSuggestionsRun.current = false;
      return;
    }
    debouncedRefreshSuggestions();
    return () => debouncedRefreshSuggestions.cancel();
  }, [inputKeyword]);

  useEffect(() => {
    getSearchEngine();
  }, [selectedCountry]);

  return (
    <>
      <Confirmation
        message={"Are you sure you want to delete this keyword?"}
        show={confKeywordDelete}
        handleNo={() => setConfKeywordDelete(false)}
        handleYes={() => {
          setConfKeywordDelete(false);
          deletKeyword();
        }}
      />

      <SuggestModal
        show={suggestModal}
        handleClose={() => setSuggestModal(false)}
        handleAddKeyword={(item: any) => handleAddKeywordByClick(item)}
      />

      <div className="content-frame-main">
        <div className="content-frame-head flex justify-content-between align-item-center">
          <div className="content-frameHead-left flex align-item-center gap-2">
            <h1 className="Text--headingLg flex align-item-center gap-2">
              <Link href={"/rank-tracker"}>
                <button type="button" className="headBack-btn">
                  <Image
                    src={`${basePath}/images/back-icon.svg`}
                    height={20}
                    width={20}
                    alt=""
                  />
                </button>
              </Link>
              Keywords/Competitors
            </h1>
            <ChannelList />
          </div>
          <div className="content-frameHead-right">
            <div className="badge badge-success">
              Keywords Used: {`${used + inputKeyword.length}/${limit}`}
            </div>
            <UpgradeButton />
          </div>
        </div>

        <div className="add-keywordMain">
          <div className="add-keywordArea flex gap24">
            <div className="add-keywordLeft card">
              <h2 className="Text--headingLg mb-0">Add Keywords</h2>

              <div className="addKeyword-field mt-30">
                <div className="row">
                  <div className="col-md-12 mb-22">
                    <div className="custom-textarea">
                      <span className="textarea-heading">Keyword</span>
                      <TagInput
                        placeholder="Enter Keyword (press enter to add multiple keywords)"
                        style={{ width: "100%", minHeight: "100px" }}
                        value={inputKeyword}
                        onChange={(value: any, event: any) => {
                          if (value.length <= remaining) setInputKeyword(value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12 mb-22">
                    <div className="autoSearch-dropi">
                      <span className="autoSearch-dropiHeadig">Location</span>
                      <Select
                        value={countryList.find(
                          (item: any) => item.value == selectedCountry,
                        )}
                        onChange={(selectedValue: any) =>
                          setSelectedCountry(selectedValue.value)
                        }
                        options={countryList}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12 mb-22">
                    <div className="autoSearch-dropi">
                      <span className="autoSearch-dropiHeadig">Device</span>
                      <Select
                        value={deviceList.find(
                          (item: any) => item.value == device,
                        )}
                        onChange={(selectedValue: any) =>
                          setDevice(selectedValue.value)
                        }
                        options={deviceList}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12 mb-22">
                    <div className="autoSearch-dropi">
                      <span className="autoSearch-dropiHeadig">
                        Search Engine
                      </span>
                      <Select
                        value={searchEngineList.find(
                          (item: any) => item.value == selectedSearchEngine,
                        )}
                        onChange={(selectedValue: any) =>
                          setSelectedSearchEngine(selectedValue.value)
                        }
                        options={searchEngineList}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12 mb-22">
                    <div className="autoSearch-dropi">
                      <span className="autoSearch-dropiHeadig">Language</span>
                      <Select
                        value={languageList.find(
                          (item: any) => item.value == selectedLanguage,
                        )}
                        onChange={(selectedValue: any) =>
                          setSelectedLanguage(selectedValue.value)
                        }
                        options={languageList}
                      />
                    </div>
                  </div>

                  <div className="text-align-left">
                    <button
                      type="button"
                      className="custom-btn mobile-fullBtn"
                      onClick={addKeyword}
                      disabled={addKeywordBtnLoading}
                    >
                      {addKeywordBtnLoading ? <Spinner size="sm" /> : "Submit"}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`custom-table addedKeyword-table ${keywords.data.length == 0 ? "noDataTable" : ""}`}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Location</th>
                      <th>Device</th>
                      <th>Search Engine</th>
                      <th>Language</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.loading ? (
                      <tr>
                        <td colSpan={6} className="text-align-center">
                          <Spinner animation="grow" variant="secondary" />
                        </td>
                      </tr>
                    ) : (
                      keywords.data.map((item: any, key: any) => (
                        <tr key={key}>
                          <td>{item.keyword}</td>
                          <td>
                            <Image
                              alt={item.country_iso_code}
                              width={24}
                              height={24}
                              src={`https://flagsapi.com/${item.country_iso_code}/flat/24.png`}
                            />
                          </td>
                          <td>{item.device}</td>
                          <td>{item.search_en}</td>
                          <td>{item.search_en_lan}</td>
                          <td>
                            <button
                              className="icon-btn"
                              onClick={() => {
                                currentSelectedKeyword.current = item.id;
                                setConfKeywordDelete(true);
                              }}
                            >
                              <Image
                                src={`${basePath}/images/delete-icon.svg`}
                                height={20}
                                width={20}
                                alt=""
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}

                    {keywords.data.length == 0 && keywords.loading == false && (
                      <tr>
                        <td colSpan={6} className="text-align-center">
                          <div className="empty-tableArea">
                            <Image
                              src={`${basePath}/images/emptystate.png`}
                              height={166}
                              width={163}
                              alt=""
                            />
                            <p>No Data Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="add-keywordRight card">
              <h2 className="Text--headingLg mb-0">{`Keywords' Suggestions`}</h2>
              <div className="keywordSuggestion-field mt-30">
                <div className="custom-table keywordSuggestion-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Keyword</th>
                        <th>Searches</th>
                        <th>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestKeywords.loading ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <Spinner animation="grow" variant="secondary" />
                          </td>
                        </tr>
                      ) : (
                        suggestKeywords.data.map((item: any, key: any) => (
                          <tr key={key}>
                            <td>{item.keyword}</td>
                            <td>
                              <span className="badge">
                                {item.search_volume}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddKeywordByClick(item.keyword)
                                }
                                className="icon-btn"
                              >
                                <Image
                                  src={`${basePath}/images/add-icon.svg`}
                                  width={20}
                                  height={21}
                                  alt=""
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="full-btn mt-22">
                  <button
                    type="button"
                    className="custom-btn"
                    data-bs-toggle="modal"
                    onClick={() => {
                      setSuggestModal(true);
                    }}
                  >
                    View More Keywords
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="add-keywordArea flex gap24">
            <div className="add-keywordLeft card">
              <h2 className="Text--headingLg mb-0">
                Add Competitors (optional)
              </h2>

              <div className="addKeyword-field mt-30">
                <div className="row">
                  <div className="col-md-12 mb-26">
                    <div className="custom-input">
                      <span>COMPETITOR 1</span>
                      <input
                        type="text"
                        placeholder="Enter Competitor"
                        className="form-control pr-50"
                        value={competitor1}
                        onChange={(event: any) => {
                          setCompetitor1(event.target.value);
                        }}
                      />
                      {competitor1 && (
                        <button
                          type="button"
                          onClick={() => setCompetitor1("")}
                          className="competitor-clearBtn"
                        >
                          <Image
                            src={`${basePath}/images/close-icon.svg`}
                            width={20}
                            height={20}
                            alt=""
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-12 mb-26">
                    <div className="custom-input">
                      <span>COMPETITOR 2</span>
                      <input
                        type="text"
                        placeholder="Enter Competitor"
                        className="form-control pr-50"
                        value={competitor2}
                        onChange={(event: any) => {
                          setCompetitor2(event.target.value);
                        }}
                      />
                      {competitor2 && (
                        <button
                          type="button"
                          onClick={() => setCompetitor2("")}
                          className="competitor-clearBtn"
                        >
                          <Image
                            src={`${basePath}/images/close-icon.svg`}
                            width={20}
                            height={20}
                            alt=""
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-12 mb-22">
                    <div className="custom-input">
                      <span>COMPETITOR 3</span>
                      <input
                        type="text"
                        placeholder="Enter Competitor"
                        className="form-control pr-50"
                        value={competitor3}
                        onChange={(event: any) => {
                          setCompetitor3(event.target.value);
                        }}
                      />
                      {competitor3 && (
                        <button
                          type="button"
                          onClick={() => setCompetitor3("")}
                          className="competitor-clearBtn"
                        >
                          <Image
                            src={`${basePath}/images/close-icon.svg`}
                            width={20}
                            height={20}
                            alt=""
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-align-left">
                    <button
                      type="button"
                      className="custom-btn mobile-fullBtn"
                      onClick={addCompetitor}
                      disabled={competitorBtnLoading}
                    >
                      {competitorBtnLoading ? <Spinner size="sm" /> : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-keywordRight card">
              <h2 className="Text--headingLg mb-0">{`Competitors' Suggestions`}</h2>
              <div className="keywordSuggestion-field mt-30">
                <div className="custom-table competitor-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Website</th>
                        <th>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestCompetitor.loading ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <Spinner animation="grow" variant="secondary" />
                          </td>
                        </tr>
                      ) : (
                        suggestCompetitor.data.map((item: any, key: any) => (
                          <tr key={key}>
                            <td>{item}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => addSuggestedCompetitor(item)}
                                className="icon-btn"
                              >
                                <Image
                                  src={`${basePath}/images/add-icon.svg`}
                                  width={20}
                                  height={20}
                                  alt=""
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
