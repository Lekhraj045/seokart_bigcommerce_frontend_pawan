"use client";

import Image from "next/image";
import { basePath } from "@/next.config";
import { Api } from "@/app/_api/apiCall";
import { useEffect, useState, useCallback, useRef } from "react";
import { Spinner, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import MetaTagIssue from "./_components/metaTagIssue";
import ContentIssue from "./_components/contentIssue";
import Singleimagerow from "./_components/singleImageRow";
import GptModalBox from "./_components/gptModal";
import { differenceInDays } from "date-fns";

import JoditEditor from "jodit-react";
import Jodit from "./jodit";

import _ from "lodash";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ImageModal, {
  ImageModalRef,
} from "@/app/(bigcommerce)/image-optimizer/_components/imageModal";
import ScoreMeter from "../../dashboard/_components/ScoreMeter";

const KeywordRankModal = dynamic(
  () => import("./_components/keywordRankModal"),
  { ssr: false },
);
const CustomEditor = dynamic(
  () => {
    return import("../../../_ckeditor/custom-editor");
  },
  { ssr: false, loading: () => <Skeleton count={15} /> },
);

export default function Home({ params }: { params: { id: number } }) {
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState(<Spinner size="sm" />);
  const [name, setName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemId, setItemId] = useState();
  const [targetKeyword, setTargetKeyword] = useState("");
  const [titleTag, setTitleTag] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [description, setDescription] = useState("");
  const [googleSuggestedKeyword, setGoogleSuggestedKeyword] = useState([]);
  const [googleSuggestedKeywordShow, setGoogleSuggestedKeywordShow] =
    useState(false);
  const [keywordRankModal, setKeywordRankModal] = useState(false);
  const [titleLengthIssue, setTitleLengthIssue] = useState({
    loading: true,
    data: "",
  });
  const [metaDescriptionLengthIssue, setMetaDescriptionLengthIssue] = useState({
    loading: true,
    data: "",
  });
  const [tKTitleIssue, setTKTitleIssue] = useState({ loading: true, data: "" });
  const [tKMetaDescriptionIssue, setTKMetaDescriptionIssue] = useState({
    loading: true,
    data: "",
  });
  const [duplicateTitleCount, setDuplicateTitleCount] = useState({
    loading: true,
    data: "",
  });
  const [duplicateMetaDescriptionCount, setDuplicateMetaDescriptionCount] =
    useState({ loading: true, data: "" });
  const [tKDescriptionIssue, setTKDescriptionIssue] = useState({
    loading: true,
    data: "",
  });
  const [loremIpsumDescriptionIssue, setLoremIpsumDescriptionIssue] = useState({
    loading: true,
    data: "",
  });
  const [internalBrokenCount, setInternalBrokenCount] = useState({
    loading: true,
    data: "",
  });
  const [externalBrokenCount, setExternalBrokenCount] = useState({
    loading: true,
    data: "",
  });
  const [httpCount, setHttpCount] = useState({ loading: true, data: "" });
  const [spellErrorDescriptionCount, setSpellErrorDescriptionCount] = useState({
    loading: true,
    data: "",
  });
  const [altTextIssue, setAltTextIssue] = useState({ loading: true, data: "" });
  const [urlLengthIssue, setUrlLengthIssue] = useState({
    loading: true,
    data: "",
  });
  const [tKurl, setTKurl] = useState({ loading: true, data: "" });
  const [aiTargetKeyword, setAiTargetKeyword] = useState<any>({
    loading: false,
    data: {},
  });
  const [aiTitleTag, setAiTitleTag] = useState<any>({ loading: 3, data: {} });
  const [aiMetaDescription, setAiMetaDescription] = useState<any>({
    loading: 3,
    data: "",
  });
  const [aiDescription, setAiDescription] = useState<any>({
    loading: 3,
    data: "",
  });
  const [imageData, setImageData] = useState([]);
  const [updateImageData, setUpdateImageData] = useState<any>([]);
  const [oldData, setOldData] = useState([]);
  const [primaryImageAltText, setPrimaryImageAltText] = useState("");
  const [spellStatus, setSpellStatus] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [url, setUrl] = useState("");
  const [newUrl, setNewUrl] = useState<any>("");
  const [redirectUrl, setRedirectUrl] = useState<any>("");
  const [homeUrl, setHomeUrl] = useState("");
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [gptModal, setGptModal] = useState({
    status: false,
    needToShow: false,
  });
  const [gptLanguage, setGptLanguage] = useState("english");
  const [imageDataLoading, setImageDataLoading] = useState(true);
  const [storeHash, setStoreHash] = useState("");
  const imageModalRef = useRef<ImageModalRef>(null);

  useEffect(() => {
    const channelObj = JSON.parse(localStorage.getItem("channel") ?? "");
    setHomeUrl(channelObj.domain);
    setStoreHash(localStorage.getItem("shop") ?? "");
  }, []);

  const getProductImages = () => {
    Api("getProductImages", { id: id }).then((json) => {
      setImageDataLoading(false);
      if (json.data) {
        setImageData(json.data);
        setUpdateImageData(json.data);
      }
    });
  };
  const getSingleItemOptimize = () => {
    Api("getSingleItemOptimize", { id: id }).then((data) => {
      getItemIssueCount();
      getItemIssue().then(() => {
        getItemIssue();
      });

      setLoading(false);
      if (data.gpt_popup_show == 0)
        setGptModal({ status: false, needToShow: true });
      setGptLanguage(data.gpt_language);
      //setSeoScore(data.total_seo_score)
      const itemData = data.data.item_data;
      setName(itemData.item_name);
      setTargetKeyword(itemData.target_keyword);
      setTitleTag(itemData.title_tag);
      setMetaDescription(itemData.meta_description);
      setDescription(itemData.description);
      setItemType(itemData.item_type);
      setItemId(itemData.item_id);
      // setImageData(itemData.image_data)
      // setUpdateImageData(itemData.image_data)
      setOldData(data.data.old_data);

      let item_disable_spell_error = itemData.item_disable_spell_error;
      let store_disable_spell_error = itemData.store_disable_spell_error;
      if (item_disable_spell_error == 1) {
        setSpellStatus("off_page");
      }
      if (store_disable_spell_error == 1) {
        setSpellStatus("off_store");
      }
      if (item_disable_spell_error == 0 && store_disable_spell_error == 0) {
        setSpellStatus("on");
      }

      setUrlData(itemData.urleditor);
      setUrl(itemData.url);
    });
  };

  const getGoogleSuggestedKeyword = () => {
    Api("getGoogleSuggestedKeyword", { keyword: targetKeyword }).then(
      ({ data }) => {
        setGoogleSuggestedKeyword(data);
      },
    );
  };

  const getAiTargetKeyword = () => {
    if (!name) {
      toast.error("Name is Required");
      return false;
    }
    gptModal.needToShow == true
      ? setGptModal({ status: true, needToShow: false })
      : setGptModal({ status: false, needToShow: false });
    setAiTargetKeyword({ loading: true, data: {} });
    Api("getAiTragetKeyword", {
      item_name: name,
      item_id: itemId,
      type: itemType,
    }).then(({ data }) => {
      if (data) setAiTargetKeyword({ loading: false, data: data });
    });
  };

  const getItemIssue = () => {
    return Api("getItemIssue", { id: id }).then(({ data }) => {
      setTitleLengthIssue({
        loading: false,
        data: data?.metaTagIssues?.title_length,
      });
      setMetaDescriptionLengthIssue({
        loading: false,
        data: data?.metaTagIssues?.meta_description_length,
      });
      setTKTitleIssue({
        loading: false,
        data: data?.metaTagIssues?.target_keyword_in_the_title_tag,
      });
      setTKMetaDescriptionIssue({
        loading: false,
        data: data?.metaTagIssues?.target_keyword_in_the_meta_description,
      });

      setTKDescriptionIssue({
        loading: false,
        data: data?.contentIssues?.target_keyword_present_in_the_description,
      });
      setLoremIpsumDescriptionIssue({
        loading: false,
        data: data?.contentIssues?.lorem_ipsum_content_in_the_description,
      });

      setAltTextIssue({
        loading: false,
        data: data?.imageIssues?.alt_text_in_the_primary_image,
      });

      setUrlLengthIssue({
        loading: false,
        data: data?.urlIssues?.url_length_is_less_48_char,
      });
      setTKurl({
        loading: false,
        data: data?.urlIssues?.target_keyword_in_URL,
      });
      setSeoScore(data?.total_seo_score);
    });
  };

  const getItemIssueCount = () => {
    Api("getItemIssueCount", { id: id }).then(({ data }) => {
      setDuplicateTitleCount({
        loading: false,
        data: data?.metaTagIssues?.duplicate_title_tags,
      });
      setDuplicateMetaDescriptionCount({
        loading: false,
        data: data?.metaTagIssues?.duplicate_meta_descriptions,
      });

      setInternalBrokenCount({
        loading: false,
        data: data?.contentIssues?.internal_broken_links,
      });
      setExternalBrokenCount({
        loading: false,
        data: data?.contentIssues?.external_broken_links,
      });
      setHttpCount({ loading: false, data: data?.contentIssues?.http_inks });
      setSpellErrorDescriptionCount({
        loading: false,
        data: data?.contentIssues?.spelling_errors_in_the_description,
      });
    });
  };

  const updateAiKeywordUseItStatus = (mainId: any, resId: any) => {
    Api("updateAiKeywordUseItStatus", { mainId: mainId, resId: resId });
  };

  const getAiItemTitle = () => {
    if (!targetKeyword) {
      toast.error("Target Keyword is Required");
      return false;
    }
    if (!name) {
      toast.error("Name is Required");
      return false;
    }
    gptModal.needToShow == true
      ? setGptModal({ status: true, needToShow: false })
      : setGptModal({ status: false, needToShow: false });
    setAiTitleTag({ loading: 1, data: "" });
    Api("getAiItemTitle", {
      item_name: name,
      target_keyword: targetKeyword,
      item_id: itemId,
      type: itemType,
    }).then(({ data }) => {
      setAiTitleTag({ loading: 2, data: data });
    });
  };

  const getAiItemMetaDesc = () => {
    if (!targetKeyword) {
      toast.error("Target Keyword is Required");
      return false;
    }
    if (!name) {
      toast.error("Name is Required");
      return false;
    }
    gptModal.needToShow == true
      ? setGptModal({ status: true, needToShow: false })
      : setGptModal({ status: false, needToShow: false });
    setAiMetaDescription({ loading: 1, data: "" });
    Api("getAiItemMetaDesc", {
      item_name: name,
      target_keyword: targetKeyword,
      item_id: itemId,
      type: itemType,
    }).then(({ data }) => {
      setAiMetaDescription({ loading: 2, data: data });
    });
  };

  const getAiItemDesc = () => {
    if (!targetKeyword) {
      toast.error("Target Keyword is Required");
      return false;
    }
    if (!name) {
      toast.error("Name is Required");
      return false;
    }
    gptModal.needToShow == true
      ? setGptModal({ status: true, needToShow: false })
      : setGptModal({ status: false, needToShow: false });
    setAiDescription({ loading: 1, data: "" });
    if (itemType == "product") {
      Api("getAiProductDesc", {
        item_name: name,
        target_keyword: targetKeyword,
        item_id: itemId,
        type: itemType,
      }).then(({ data }) => {
        setAiDescription({ loading: 2, data: data });
      });
    } else {
      Api("getAiItemDesc", {
        item_name: name,
        target_keyword: targetKeyword,
        item_id: itemId,
        type: itemType,
      }).then(({ data }) => {
        setAiDescription({ loading: 2, data: data });
      });
    }
  };

  const updateAiUseItStatus = (insertId: any) => {
    Api("updateAiUseItStatus", { insertId: insertId });
  };

  const getAuditScoreOnChange = useCallback(
    _.debounce(
      (
        name,
        targetKeyword,
        titleTag,
        metaDescription,
        description,
        imageAlt,
        url,
      ) => {
        setTitleLengthIssue({ loading: true, data: "" });
        setMetaDescriptionLengthIssue({ loading: true, data: "" });
        setTKTitleIssue({ loading: true, data: "" });
        setTKMetaDescriptionIssue({ loading: true, data: "" });

        setTKDescriptionIssue({ loading: true, data: "" });
        setLoremIpsumDescriptionIssue({ loading: true, data: "" });

        setAltTextIssue({ loading: true, data: "" });

        setUrlLengthIssue({ loading: true, data: "" });
        setTKurl({ loading: true, data: "" });

        setDuplicateTitleCount({ loading: true, data: "" });
        setDuplicateMetaDescriptionCount({ loading: true, data: "" });

        setInternalBrokenCount({ loading: true, data: "" });
        setExternalBrokenCount({ loading: true, data: "" });
        setHttpCount({ loading: true, data: "" });
        setSpellErrorDescriptionCount({ loading: true, data: "" });

        Api("getAuditScoreOnChange", {
          id: id,
          item_name: name,
          target_keyword: targetKeyword,
          title_tag: titleTag,
          meta_description: metaDescription,
          description: description,
          image_alt: imageAlt,
          url: url,
        }).then(({ data }) => {
          setTitleLengthIssue({
            loading: false,
            data: data?.metaTagIssues?.title_length,
          });
          setMetaDescriptionLengthIssue({
            loading: false,
            data: data?.metaTagIssues?.meta_description_length,
          });
          setTKTitleIssue({
            loading: false,
            data: data?.metaTagIssues?.target_keyword_in_the_title_tag,
          });
          setTKMetaDescriptionIssue({
            loading: false,
            data: data?.metaTagIssues?.target_keyword_in_the_meta_description,
          });

          setTKDescriptionIssue({
            loading: false,
            data: data?.contentIssues
              ?.target_keyword_present_in_the_description,
          });
          setLoremIpsumDescriptionIssue({
            loading: false,
            data: data?.contentIssues?.lorem_ipsum_content_in_the_description,
          });

          setAltTextIssue({
            loading: false,
            data: data?.imageIssues?.alt_text_in_the_primary_image,
          });

          setUrlLengthIssue({
            loading: false,
            data: data?.urlIssues?.url_length_is_less_48_char,
          });
          setTKurl({
            loading: false,
            data: data?.urlIssues?.target_keyword_in_URL,
          });

          setDuplicateTitleCount({
            loading: false,
            data: data?.metaTagIssues?.duplicate_title_tags,
          });
          setDuplicateMetaDescriptionCount({
            loading: false,
            data: data?.metaTagIssues?.duplicate_meta_descriptions,
          });

          setInternalBrokenCount({
            loading: false,
            data: data?.contentIssues?.internal_broken_links,
          });
          setExternalBrokenCount({
            loading: false,
            data: data?.contentIssues?.external_broken_links,
          });
          setHttpCount({ loading: false, data: data.contentIssues.http_inks });
          setSpellErrorDescriptionCount({
            loading: false,
            data: data?.contentIssues?.spelling_errors_in_the_description,
          });

          setSeoScore(data.score);
        });
      },
      2000,
    ),
    [],
  );

  const updateSeoAuditItem = (type: any) => {
    if (!targetKeyword) {
      toast.error("Target Keyword is Required");
      return false;
    }
    if (!name) {
      toast.error("name is Required");
      return false;
    }

    setSaveBtnLoading(true);
    Api("updateSeoAuditItem", {
      id: id,
      item_name: name,
      target_keyword: targetKeyword,
      title_tag: titleTag,
      meta_description: metaDescription,
      description: description,
      alt_data: JSON.stringify(updateImageData),
      old_url: url,
      new_url: newUrl,
      redirect_url: redirectUrl,
    }).then((data) => {
      setSaveBtnLoading(false);
      toast.success("Page Saved");
      if (type == "exit") {
        router.push("/seo-audit");
      }
    });
  };

  const deleteRedirectUrl = () => {
    Api("urlEditor/deleteRedirectUrl", {
      item_id: itemId,
      item_type: itemType,
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    getGoogleSuggestedKeyword();
  }, [targetKeyword]);

  useEffect(() => {
    getSingleItemOptimize();
    getProductImages();
  }, []);

  useEffect(() => {
    setRedirectUrl(newUrl);
  }, [newUrl]);

  const handleOnChangeLanguage = (selectedValue: any) => {
    setGptLanguage(selectedValue.value);
    Api("updateGptLanguage", { language: selectedValue.value }).then(
      (response) => {
        response.status_code == 200
          ? toast.success("Language Changed Successfully.")
          : toast.error("Something went wrong.");
      },
    );
  };

  const languageList = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese (Simplified)", value: "chinese (simplified)" },
    { label: "Chinese (Traditional)", value: "chinese (traditional)" },
    { label: "Japanese", value: "japanese" },
    { label: "Hindi", value: "hindi" },
    { label: "Korean", value: "korean" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Italian", value: "italian" },
    { label: "Dutch", value: "dutch" },
    { label: "Russian", value: "russian" },
    { label: "Arabic", value: "arabic" },
    { label: "Turkish", value: "turkish" },
    { label: "Polish", value: "polish" },
    { label: "Swedish", value: "swedish" },
    { label: "Danish", value: "danish" },
    { label: "Finnish", value: "finnish" },
    { label: "Norwegian", value: "norwegian" },
    { label: "Greek", value: "greek" },
    { label: "Hebrew", value: "hebrew" },
    { label: "Thai", value: "thai" },
    { label: "Vietnamese", value: "vietnamese" },
    { label: "Indonesian", value: "indonesian" },
  ];

  // Calculate issue counts and good results
  const calculateIssuesAndGoodResults = () => {
    // Meta Tag Issues
    const metaTagIssues = [
      !titleLengthIssue.loading && !titleLengthIssue.data, // Title length issue
      !metaDescriptionLengthIssue.loading && !metaDescriptionLengthIssue.data, // Meta description length issue
      !tKTitleIssue.loading && !tKTitleIssue.data, // Target keyword in title
      !tKMetaDescriptionIssue.loading && !tKMetaDescriptionIssue.data, // Target keyword in meta description
      !duplicateTitleCount.loading && Number(duplicateTitleCount.data) > 0, // Duplicate titles
      !duplicateMetaDescriptionCount.loading &&
        Number(duplicateMetaDescriptionCount.data) > 0, // Duplicate meta descriptions
    ].filter(Boolean).length;

    // Content Issues
    const contentIssues = [
      !tKDescriptionIssue.loading && !tKDescriptionIssue.data, // Target keyword in description
      !loremIpsumDescriptionIssue.loading && !loremIpsumDescriptionIssue.data, // Lorem ipsum content
      !internalBrokenCount.loading && Number(internalBrokenCount.data) > 0, // Internal broken links
      !externalBrokenCount.loading && Number(externalBrokenCount.data) > 0, // External broken links
      !httpCount.loading && Number(httpCount.data) > 0, // HTTP links
      !spellErrorDescriptionCount.loading &&
        spellStatus === "on" &&
        Number(spellErrorDescriptionCount.data) > 0, // Spelling errors (only count if spellStatus is "on")
    ].filter(Boolean).length;

    // Images' Issues - always count as 1 check (max 1 issue)
    // If both "Alt Text available" and "Image available" fail, count as 1 issue
    // If both pass, count as 0 issues
    let imageIssues = 0;
    if (itemType === "product") {
      const hasAltText = !altTextIssue.loading && altTextIssue.data; // true means alt text is available (pass)
      const hasImageAvailable = imageData.length > 0; // true means image is available (pass)

      // Only if BOTH checks fail (both false), it's 1 issue
      // If either passes, no issue (because they're related - if image not available, alt text doesn't matter)
      if (!hasAltText && !hasImageAvailable) {
        imageIssues = 1;
      }
      // If image is available but no alt text, it's still an issue
      else if (hasImageAvailable && !hasAltText) {
        imageIssues = 1;
      }
      // If both pass (hasAltText && hasImageAvailable), no issue
      // If no image available but has alt text (edge case), no issue counted
    }

    const totalIssues = metaTagIssues + contentIssues + imageIssues;

    // Calculate good results (passed checks)
    // Meta Tag: 6 checks, Content: 6 checks, Images: 1 check (always 1, even though it has 2 sub-checks)
    const totalChecks = 6 + 6 + (itemType === "product" ? 1 : 0);
    // If spellStatus is not "on", spelling check is automatically passed (good result)
    const spellingCheckPassed = spellStatus !== "on" ? 1 : 0;
    const goodResults = totalChecks - totalIssues + spellingCheckPassed;

    return {
      totalIssues,
      goodResults,
    };
  };

  const { totalIssues, goodResults } = calculateIssuesAndGoodResults();

  // Check if any issue data is still loading
  const isIssuesDataLoading =
    titleLengthIssue.loading ||
    metaDescriptionLengthIssue.loading ||
    tKTitleIssue.loading ||
    tKMetaDescriptionIssue.loading ||
    duplicateTitleCount.loading ||
    duplicateMetaDescriptionCount.loading ||
    tKDescriptionIssue.loading ||
    loremIpsumDescriptionIssue.loading ||
    internalBrokenCount.loading ||
    externalBrokenCount.loading ||
    httpCount.loading ||
    spellErrorDescriptionCount.loading ||
    altTextIssue.loading;

  return (
    <>
      <GptModalBox
        show={gptModal.status}
        handleClose={() => setGptModal({ status: false, needToShow: false })}
      />
      <KeywordRankModal
        show={keywordRankModal}
        onHide={() => setKeywordRankModal(false)}
        targetKeyword={targetKeyword}
      />
      <div
        className="content-frame-main"
        onClick={() => {
          setGoogleSuggestedKeywordShow(false);
        }}
      >
        <div className="py-3 lg:py-6 flex justify-between items-start lg:items-center gap-3 flex-col lg:flex-row">
          <div className="content-frameHead-left flex gap-2">
            <div className="flex items-start gap-1.5">
              <Link href={"/seo-audit"}>
                <button type="button" className="headBack-btn">
                  <Image
                    src={`${basePath}/images/back-icon.svg`}
                    alt=""
                    width="20"
                    height="20"
                  />
                </button>
              </Link>
              <div className="flex flex-col">
                <h1 className="Text--headingLg flex align-item-center gap-2">
                  SEO Optimizer
                </h1>
                <p className="text-xs text-[#616161] mt-0.5">
                  Analyze and optimize on‑page SEO issues
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {loading == false ? (
              <div className="custom-dropi flex-1 lg:flex-none w-full sm:w-auto">
                <select
                  className="form-select"
                  value={gptLanguage}
                  onChange={(e) =>
                    handleOnChangeLanguage({ value: e.target.value })
                  }
                >
                  {languageList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Spinner size="sm" />
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={saveBtnLoading}
                className="custom-btn"
                onClick={() => {
                  updateSeoAuditItem("");
                }}
              >
                {saveBtnLoading ? <Spinner size="sm" /> : "Save All"}
              </button>
              <button
                type="button"
                disabled={saveBtnLoading}
                className="btn-primary"
                onClick={() => {
                  updateSeoAuditItem("exit");
                }}
              >
                {saveBtnLoading ? <Spinner size="sm" /> : "Save All & Exit"}
              </button>
            </div>
          </div>
        </div>

        <div className="seo-optimizerMain flex flex-col gap-3">
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="card w-full max-w-full lg:w-[326px] lg:max-w-[326px] !mb-0">
              <div className="flex flex-col items-center gap-3">
                <div className="flex justify-center">
                  <ScoreMeter
                    score={typeof seoScore === "number" ? seoScore : 0}
                    size={250}
                    basePath={basePath}
                  />
                </div>
                {/* Badges */}
                <div className="flex gap-2 mt-1">
                  {isIssuesDataLoading ? (
                    <div className="d-flex gap-2">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <>
                      <div className="badge badge-danger !rounded-full">
                        {totalIssues} Issues
                      </div>
                      <div className="badge badge-success !rounded-full">
                        {goodResults} Good Result
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="card flex-1 !mb-0">
              {loading ? (
                <Skeleton count={2} />
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="custom-input custom-input-label flex flex-col gap-1">
                    <span className="flex items-center gap-1.5">
                      Name
                      <Link
                        href={`${homeUrl}${itemType != "home" ? url : ""}`}
                        target="_blank"
                      >
                        <Image
                          src={`${basePath}/images/link-icon.svg`}
                          width={16}
                          height={16}
                          alt=""
                        />
                      </Link>
                    </span>
                    <input
                      type="text"
                      disabled={itemType == "home"}
                      className="form-control"
                      value={name}
                      onChange={(e) => {
                        getAuditScoreOnChange(
                          e.target.value,
                          targetKeyword,
                          titleTag,
                          metaDescription,
                          description,
                          primaryImageAltText,
                          url,
                        );
                        setName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="custom-input custom-input-label flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span>Target Keyword</span>
                      <div className="optimizer-aiAssist dropdown">
                        <Dropdown
                          onToggle={(nextShow) => {
                            if (nextShow) {
                              getAiTargetKeyword();
                            }
                          }}
                        >
                          <Dropdown.Toggle
                            variant="secondary"
                            className="bg-transparent text-[#7367F0] border-none text-[13px] p-0 hover:text-[#7367F0] focus:text-[#7367F0] flex items-center"
                          >
                            <Image
                              src={`${basePath}/images/Magic-icon-purple.svg`}
                              alt=""
                              width="20"
                              height="20"
                              className="mr-1 -mt-1"
                            />
                            Run AI Assist
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {aiTargetKeyword.loading ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <Dropdown.Item
                                  as="button"
                                  onClick={() => {
                                    setTargetKeyword(
                                      aiTargetKeyword.data.result1,
                                    );
                                    updateAiKeywordUseItStatus(
                                      aiTargetKeyword.data.mainId,
                                      aiTargetKeyword.data.resId1,
                                    );
                                    getAuditScoreOnChange(
                                      name,
                                      aiTargetKeyword.data.result1,
                                      titleTag,
                                      metaDescription,
                                      description,
                                      primaryImageAltText,
                                      url,
                                    );
                                  }}
                                >
                                  <span>{aiTargetKeyword.data.result1}</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as="button"
                                  onClick={() => {
                                    setTargetKeyword(
                                      aiTargetKeyword.data.result2,
                                    );
                                    updateAiKeywordUseItStatus(
                                      aiTargetKeyword.data.mainId,
                                      aiTargetKeyword.data.resId2,
                                    );
                                    getAuditScoreOnChange(
                                      name,
                                      aiTargetKeyword.data.result1,
                                      titleTag,
                                      metaDescription,
                                      description,
                                      primaryImageAltText,
                                      url,
                                    );
                                  }}
                                >
                                  <span>{aiTargetKeyword.data.result2}</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as="button"
                                  onClick={() => {
                                    setTargetKeyword(
                                      aiTargetKeyword.data.result3,
                                    );
                                    updateAiKeywordUseItStatus(
                                      aiTargetKeyword.data.mainId,
                                      aiTargetKeyword.data.resId3,
                                    );
                                    getAuditScoreOnChange(
                                      name,
                                      aiTargetKeyword.data.result1,
                                      titleTag,
                                      metaDescription,
                                      description,
                                      primaryImageAltText,
                                      url,
                                    );
                                  }}
                                >
                                  <span>{aiTargetKeyword.data.result3}</span>
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="form-control"
                          value={targetKeyword}
                          onChange={(e) => {
                            getAuditScoreOnChange(
                              name,
                              e.target.value,
                              titleTag,
                              metaDescription,
                              description,
                              primaryImageAltText,
                              url,
                            );
                            setTargetKeyword(e.target.value);
                            setGoogleSuggestedKeywordShow(true);
                          }}
                        />
                        {googleSuggestedKeyword?.length > 0 &&
                          googleSuggestedKeywordShow && (
                            <div className="optimizer-keywordDropi TargetKeywordDropi !top-[57px]">
                              <ul>
                                {googleSuggestedKeyword.map(
                                  (item: any, key: any) => (
                                    <li
                                      key={key}
                                      onClick={() => {
                                        setTargetKeyword(item);
                                      }}
                                    >
                                      <span>{item}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>

                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>Add Keyword to Rank Tracker</Tooltip>
                          }
                        >
                          <button
                            className="btn btn-default !h-[32px] !w-[32px] !p-0"
                            type="button"
                            onClick={() => setKeywordRankModal(true)}
                          >
                            <Image
                              src={`${basePath}/images/plus-icon.svg`}
                              alt=""
                              width="20"
                              height="20"
                            />
                          </button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Tag Issues */}
          <div className="card !p-0 !mb-0">
            <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">
                  Meta Tag Issues
                </h3>
              </div>

              <div className="optimizer-aiAssist dropdown">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="Secondary"
                    className="btn btn-default"
                  >
                    Restore
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="RestoreDropdownMenu">
                    {oldData.map((item: any, key: any) => (
                      <div key={key}>
                        {item.type == 2 && (
                          <Dropdown.Item
                            as="button"
                            onClick={() => {
                              setTitleTag(item.value);
                            }}
                          >
                            Title Tag ({item.created_at})
                          </Dropdown.Item>
                        )}
                      </div>
                    ))}

                    {oldData.map((item: any, key: any) => (
                      <div key={key}>
                        {item.type == 3 && (
                          <Dropdown.Item
                            as="button"
                            onClick={() => {
                              setMetaDescription(item.value);
                            }}
                          >
                            Meta Description ({item.created_at})
                          </Dropdown.Item>
                        )}
                      </div>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="flex gap-3 p-3 flex-col lg:flex-row">
              <div className="infoCard !bg-[#F8FAFC] w-full max-w-full min-w-full lg:w-[310px] lg:min-w-[310px] lg:max-w-[310px] !order-2 lg:!order-1">
                <MetaTagIssue
                  titleLengthIssue={titleLengthIssue}
                  metaDescriptionLengthIssue={metaDescriptionLengthIssue}
                  tKTitleIssue={tKTitleIssue}
                  tKMetaDescriptionIssue={tKMetaDescriptionIssue}
                  duplicateTitleCount={duplicateTitleCount}
                  duplicateMetaDescriptionCount={duplicateMetaDescriptionCount}
                  titleTag={titleTag}
                  metaDescription={metaDescription}
                  targetKeyword={targetKeyword}
                  description={description}
                  itemName={name}
                />
              </div>

              {loading ? (
                <div className="flex flex-1 flex-col gap-4 !order-1 lg:!order-2 w-full">
                  <Skeleton count={12} height={20} />
                </div>
              ) : (
                <>
                  <div className="flex flex-1 flex-col gap-4 !order-1 lg:!order-2">
                    <div>
                      <div className="custom-input custom-input-label flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span>Title Tag</span>
                          {itemType != "home" && (
                            <>
                              <button
                                className="bg-transparent text-[#7367F0] border-none text-[13px] p-0 hover:text-[#7367F0] focus:text-[#7367F0] flex items-center"
                                onClick={getAiItemTitle}
                              >
                                <Image
                                  src={`${basePath}/images/Magic-icon-purple.svg`}
                                  alt=""
                                  width="20"
                                  height="20"
                                  className="mr-1 -mt-1"
                                />
                                Run AI Assist
                              </button>
                            </>
                          )}
                        </div>
                        <input
                          type="text"
                          disabled={itemType == "home" || itemType == "blog"}
                          className="form-control"
                          value={titleTag}
                          onChange={(e) => {
                            getAuditScoreOnChange(
                              name,
                              targetKeyword,
                              e.target.value,
                              metaDescription,
                              description,
                              primaryImageAltText,
                              url,
                            );
                            setTitleTag(e.target.value);
                          }}
                        />
                        <div className="keyword-count false">
                          {titleTag.length}
                        </div>
                      </div>

                      {aiTitleTag.loading == 1 ? (
                        <div className="mt-3">
                          <Spinner size="sm" />
                        </div>
                      ) : aiTitleTag.loading == 2 ? (
                        <div className="ai-useArea mt-3">
                          <div className="d-flex gap-3">
                            <div className="flex-grow-1">
                              <p className="mb-0">{aiTitleTag.data.result}</p>
                            </div>

                            <button
                              type="button"
                              className="custom-btn"
                              onClick={() => {
                                updateAiUseItStatus(aiTitleTag.data.insertId);
                                setTitleTag(aiTitleTag.data.result);
                                getAuditScoreOnChange(
                                  name,
                                  targetKeyword,
                                  aiTitleTag.data.result,
                                  metaDescription,
                                  description,
                                  primaryImageAltText,
                                  url,
                                );
                                setAiTitleTag({ loading: 3, data: {} });
                              }}
                            >
                              Use It
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div>
                      <div>
                        <div className="custom-textarea custom-input-label flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="textarea-heading ">
                              Meta Description
                            </span>

                            {itemType != "home" && (
                              <button
                                className="bg-transparent text-[#7367F0] border-none text-[13px] p-0 hover:text-[#7367F0] focus:text-[#7367F0] flex items-center"
                                onClick={getAiItemMetaDesc}
                              >
                                <Image
                                  src={`${basePath}/images/Magic-icon-purple.svg`}
                                  alt=""
                                  width="20"
                                  height="20"
                                  className="mr-1 -mt-1"
                                />
                                Run AI Assist
                              </button>
                            )}
                          </div>
                          <textarea
                            className={`form-control !h-[174px] ${
                              itemType == "home" ? "cursor-disable" : ""
                            }`}
                            disabled={itemType == "home"}
                            value={metaDescription}
                            onChange={(e) => {
                              getAuditScoreOnChange(
                                name,
                                targetKeyword,
                                titleTag,
                                e.target.value,
                                description,
                                primaryImageAltText,
                                url,
                              );
                              setMetaDescription(e.target.value);
                            }}
                          ></textarea>
                          <div className="keyword-count false">
                            {metaDescription.length}
                          </div>
                        </div>
                      </div>
                      {aiMetaDescription.loading == 1 ? (
                        <div className="mt-3">
                          <Spinner size="sm" />
                        </div>
                      ) : aiMetaDescription.loading == 2 ? (
                        <div className="ai-useArea mt-3">
                          <div className="d-flex gap-3">
                            <div className="flex-grow-1">
                              <p className="mb-0">
                                {aiMetaDescription.data.result}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="custom-btn"
                              onClick={() => {
                                updateAiUseItStatus(
                                  aiMetaDescription.data.insertId,
                                );
                                setMetaDescription(
                                  aiMetaDescription.data.result,
                                );
                                getAuditScoreOnChange(
                                  name,
                                  targetKeyword,
                                  titleTag,
                                  aiMetaDescription.data.result,
                                  description,
                                  primaryImageAltText,
                                  url,
                                );
                                setAiMetaDescription({
                                  loading: 3,
                                  data: "",
                                });
                              }}
                            >
                              Use It
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Issues */}
          <div className="card !p-0 !mb-0">
            <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#303030]">
                  Content Issues
                </h3>
              </div>

              <div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="Secondary"
                    className="btn btn-default"
                  >
                    Restore
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="RestoreDropdownMenu">
                    {oldData.map((item: any, key: any) => (
                      <div key={key}>
                        {item.type == 4 && (
                          <Dropdown.Item
                            as="button"
                            onClick={() => {
                              setDescription(item.value);
                            }}
                          >
                            {item.created_at}
                          </Dropdown.Item>
                        )}
                      </div>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="flex gap-3 p-3 flex-col lg:flex-row">
              <div className="infoCard !bg-[#F8FAFC] w-full max-w-full min-w-full lg:w-[310px] lg:min-w-[310px] lg:max-w-[310px] !order-2 lg:!order-1">
                <ContentIssue
                  tKDescriptionIssue={tKDescriptionIssue}
                  loremIpsumDescriptionIssue={loremIpsumDescriptionIssue}
                  internalBrokenCount={internalBrokenCount}
                  externalBrokenCount={externalBrokenCount}
                  httpCount={httpCount}
                  spellErrorDescriptionCount={spellErrorDescriptionCount}
                  titleTag={titleTag}
                  metaDescription={metaDescription}
                  targetKeyword={targetKeyword}
                  description={description}
                  itemName={name}
                  spellStatus={spellStatus}
                  updateSpellStatus={(status: string) => {
                    setSpellStatus(status);
                  }}
                  updateSpellErrorCount={(count: any) => {
                    setSpellErrorDescriptionCount({
                      loading: false,
                      data: count,
                    });
                  }}
                  getAuditScoreOnChange={() =>
                    getAuditScoreOnChange(
                      name,
                      targetKeyword,
                      titleTag,
                      metaDescription,
                      description,
                      primaryImageAltText,
                      url,
                    )
                  }
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 !order-1 lg:!order-2">
                <div>
                  <div
                    className={`custom-textarea custom-input-label flex flex-col gap-1 ${
                      itemType == "home" && "disable-editor"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="textarea-heading ">Description</span>
                      {itemType != "home" && (
                        <button
                          className="bg-transparent text-[#7367F0] border-none text-[13px] p-0 hover:text-[#7367F0] focus:text-[#7367F0] flex items-center"
                          onClick={getAiItemDesc}
                        >
                          <Image
                            src={`${basePath}/images/Magic-icon-purple.svg`}
                            alt=""
                            width="20"
                            height="20"
                            className="mr-1 -mt-1"
                          />
                          Run AI Assist
                        </button>
                      )}
                    </div>

                    {/* {loading ? '' :
                          <CustomEditor
                            disabled={(itemType == 'home') ? true : false}
                            initialData={description}
                            onChange={(event: any, editor: any) => {
                              const data = editor.getData()
                              setDescription(data)
                              getAuditScoreOnChange(name, targetKeyword, titleTag, metaDescription, data, primaryImageAltText, url)
                            }}
                          />} */}
                    {loading ? (
                      <div className="w-full">
                        <Skeleton count={16} height={20} />
                      </div>
                    ) : (
                      <Jodit
                        description={description}
                        itemType={itemType}
                        getAuditScoreOnChange={getAuditScoreOnChange}
                        setDescription={setDescription}
                        name={name}
                        targetKeyword={targetKeyword}
                        titleTag={titleTag}
                        metaDescription={metaDescription}
                        primaryImageAltText={primaryImageAltText}
                        url={url}
                      />
                    )}
                  </div>
                </div>

                {aiDescription.loading == 1 ? (
                  <Spinner size="sm" />
                ) : aiDescription.loading == 2 ? (
                  <div className="ai-useArea">
                    <div className="d-flex gap-3">
                      <div className="flex-grow-1">
                        <p className="mb-0">{aiDescription.data?.result}</p>
                      </div>

                      <button
                        type="button"
                        className="custom-btn"
                        onClick={() => {
                          updateAiUseItStatus(aiDescription?.data.insertId);
                          setDescription(aiDescription.data.result);
                          getAuditScoreOnChange(
                            name,
                            targetKeyword,
                            titleTag,
                            metaDescription,
                            aiDescription.data.result,
                            primaryImageAltText,
                            url,
                          );
                          setAiDescription({ loading: 3, data: "" });
                        }}
                      >
                        Use It
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Images' Issues */}
          {(itemType == "product" || loading) && (
            <div className="card !p-0 !mb-0">
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-[#303030]">
                    Images&apos; Issues
                  </h3>
                </div>
              </div>

              <div className="flex gap-3 p-3 flex-col xl:flex-row">
                <div className="infoCard !bg-[#F8FAFC] w-full max-w-full min-w-full xl:w-[310px] xl:min-w-[310px] xl:max-w-[310px] !order-2 xl:!order-1">
                  <div className="flex flex-col gap-3">
                    <div className="d-flex align-item-center gap-2">
                      {altTextIssue.loading ? (
                        <div className="w-4 h-4 max-w-4 max-h-4">
                          <Spinner
                            size="sm"
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </div>
                      ) : (
                        <span>
                          <Image
                            src={`${basePath}/images/${
                              altTextIssue.data
                                ? "check-circle-icon.svg"
                                : "alert-diamond-icon.svg"
                            }`}
                            alt=""
                            width={16}
                            height={16}
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </span>
                      )}
                      <p>Alt Text available in the Primary Image</p>
                    </div>

                    <div className="d-flex align-item-center gap-2">
                      <span>
                        <Image
                          src={`${basePath}/images/${
                            imageData.length > 0
                              ? "check-circle-icon.svg"
                              : "alert-diamond-icon.svg"
                          }`}
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4 max-w-4 max-h-4"
                        />
                      </span>
                      <p>Image available</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 !order-1 xl:!order-2">
                  {imageDataLoading || loading ? (
                    <div className="custom-table keywordSuggestion-table w-full">
                      <div className="w-full">
                        <Skeleton count={8} height={20} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="custom-table keywordSuggestion-table">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Image Info</th>
                              <th>Alt text</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {imageData.length === 0 ? (
                              <tr>
                                <td colSpan={3}>
                                  <div className="d-flex flex-column align-items-center justify-content-center py-3">
                                    <Image
                                      src={`${basePath}/images/no-data-found.svg`}
                                      width={60}
                                      height={60}
                                      alt=""
                                    />
                                    <p className="mt-2 font-bold">
                                      Data Not Found
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              imageData.map((item, key) => (
                                <Singleimagerow
                                  image={item}
                                  key={key}
                                  componentKey={key}
                                  refresh={(newalt: any) =>
                                    getAuditScoreOnChange(
                                      name,
                                      targetKeyword,
                                      titleTag,
                                      metaDescription,
                                      description,
                                      newalt,
                                      url,
                                    )
                                  }
                                  setPrimaryImageAltText={(val: any) =>
                                    setPrimaryImageAltText(val)
                                  }
                                  setUpdateImageData={(
                                    key: any,
                                    altText: any,
                                  ) => {
                                    setUpdateImageData(
                                      (updateImageData: any) => ({
                                        ...updateImageData,
                                        [key]: {
                                          ...updateImageData[key],
                                          alt: altText,
                                        },
                                      }),
                                    );
                                  }}
                                  openSettingsModal={() =>
                                    imageModalRef.current?.openModal()
                                  }
                                />
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* URL Issues (Optional) */}
          {itemType != "home" && (
            <div className="card !p-0 !mb-0">
              <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-[#303030]">
                    URL Issues (Optional)
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-3">
                <div className="custom-table keywordSuggestion-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="min-w-[250px] w-[250px] max-w-[250px]">
                          Current URL
                        </th>
                        <th>New URL</th>
                        <th>Redirect URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urlData.map((item: any, key: number) => (
                        <tr key={key}>
                          <td>
                            <div className="d-flex align-item-center gap-2">
                              <a
                                href={`${homeUrl}${item.old_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={`${basePath}/images/link-icon.svg`}
                                  width={16}
                                  height={16}
                                  alt=""
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    minWidth: "16px",
                                    minHeight: "16px",
                                  }}
                                />
                              </a>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip>{`${homeUrl}${item.old_url}`}</Tooltip>
                                }
                              >
                                <span className="text-[#303030] text-[13px] truncate max-w-[250px]">
                                  {`${homeUrl}${item.old_url}`}
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-item-center gap-2">
                              <a
                                href={`${homeUrl}${item.new_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={`${basePath}/images/link-icon.svg`}
                                  width={16}
                                  height={16}
                                  alt=""
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    minWidth: "16px",
                                    minHeight: "16px",
                                  }}
                                />
                              </a>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip>{`${homeUrl}${item.new_url}`}</Tooltip>
                                }
                              >
                                <span className="text-[#303030] text-[13px] truncate max-w-[350px]">
                                  {`${homeUrl}${item.new_url}`}
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-item-center gap-2">
                              <a
                                href={`${homeUrl}${item.redirect_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={`${basePath}/images/link-icon.svg`}
                                  width={16}
                                  height={16}
                                  alt=""
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    minWidth: "16px",
                                    minHeight: "16px",
                                  }}
                                />
                              </a>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip>{`${homeUrl}${item.redirect_url}`}</Tooltip>
                                }
                              >
                                <span className="text-[#303030] text-[13px] truncate max-w-[350px]">
                                  {`${homeUrl}${item.redirect_url}`}
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td>
                          <div className="d-flex align-item-center gap-2">
                            <a
                              href={`${homeUrl}${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={`${basePath}/images/link-icon.svg`}
                                width={16}
                                height={16}
                                alt=""
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  minWidth: "16px",
                                  minHeight: "16px",
                                }}
                              />
                            </a>
                            <OverlayTrigger
                              overlay={<Tooltip>{`${homeUrl}${url}`}</Tooltip>}
                            >
                              <span className="text-[#303030] text-[13px] truncate max-w-[250px]">
                                {`${homeUrl}${url}`}
                              </span>
                            </OverlayTrigger>
                          </div>
                        </td>

                        <td>
                          <div className="custom-input">
                            <div className="flex">
                              <div className="w-[110px] absolute left-[1px] top-[1px] h-[30px] bg-[#F2F2F2] rounded-l-[6px] px-2">
                                <div className="flex items-center h-full">
                                  <OverlayTrigger
                                    overlay={<Tooltip>{homeUrl}</Tooltip>}
                                  >
                                    <div className="truncate">{homeUrl}</div>
                                  </OverlayTrigger>
                                </div>
                              </div>

                              <input
                                type="text"
                                className="form-control !pl-[116px] min-w-[300px]"
                                value={newUrl}
                                onChange={(e) => {
                                  getAuditScoreOnChange(
                                    name,
                                    targetKeyword,
                                    titleTag,
                                    metaDescription,
                                    description,
                                    primaryImageAltText,
                                    e.target.value,
                                  );
                                  setNewUrl(e.target.value);
                                }}
                              />
                              <div className="keyword-count">
                                {homeUrl.length + newUrl.length}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="custom-input flex-1">
                              <div className="flex">
                                <div className="w-[110px] absolute left-[1px] top-[1px] h-[30px] bg-[#F2F2F2] rounded-l-[6px] px-2">
                                  <div className="flex items-center h-full">
                                    <OverlayTrigger
                                      overlay={<Tooltip>{homeUrl}</Tooltip>}
                                    >
                                      <div className="truncate">{homeUrl}</div>
                                    </OverlayTrigger>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  className="form-control !pl-[116px] min-w-[300px]"
                                  value={redirectUrl}
                                  onChange={(e) =>
                                    setRedirectUrl(e.target.value)
                                  }
                                />
                                <div className="keyword-count">
                                  {homeUrl.length + redirectUrl.length}
                                </div>
                              </div>
                            </div>

                            {urlData.length > 0 && (
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-default mini-btn"
                                  onClick={deleteRedirectUrl}
                                >
                                  <Image
                                    src={`${basePath}/images/delete-icon.svg`}
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="infoCard !bg-[#F8FAFC] !p-0">
                  <div className="flex flex-wrap gap-4 p-3">
                    <div className="flex items-center gap-2">
                      {urlLengthIssue.loading ? (
                        <div className="w-4 h-4 max-w-4 max-h-4">
                          <Spinner
                            size="sm"
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </div>
                      ) : (
                        <span>
                          <Image
                            src={`${basePath}/images/${
                              urlLengthIssue.data
                                ? "check-circle-icon.svg"
                                : "alert-diamond-icon.svg"
                            }`}
                            alt=""
                            width={16}
                            height={16}
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </span>
                      )}
                      <p>URL length is less than 48 characters</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {tKurl.loading ? (
                        <div className="w-4 h-4 max-w-4 max-h-4">
                          <Spinner
                            size="sm"
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </div>
                      ) : (
                        <span>
                          <Image
                            src={`${basePath}/images/${
                              tKurl.data
                                ? "check-circle-icon.svg"
                                : "alert-diamond-icon.svg"
                            }`}
                            alt=""
                            width={16}
                            height={16}
                            className="w-4 h-4 max-w-4 max-h-4"
                          />
                        </span>
                      )}
                      <p>Target Keyword present in the URL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex mb-3 justify-start sm:justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                disabled={saveBtnLoading}
                className="btn-default"
                onClick={() => {
                  updateSeoAuditItem("");
                }}
              >
                {saveBtnLoading ? <Spinner size="sm" /> : "Save All"}
              </button>
              <button
                type="button"
                disabled={saveBtnLoading}
                className="custom-btn"
                onClick={() => {
                  updateSeoAuditItem("exit");
                }}
              >
                {saveBtnLoading ? <Spinner size="sm" /> : "Save All & Exit"}
              </button>
            </div>
          </div>
        </div>

        <div className="opacity-0 invisible hidden">
          <ImageModal ref={imageModalRef} />
        </div>
      </div>
    </>
  );
}
