"use client";

import Image from "next/image";
import { basePath } from "@/next.config";
import { Api, copilotApi } from "@/app/_api/apiCall";
import {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  memo,
  forwardRef,
  useMemo,
  useRef,
} from "react";
import { Spinner, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import MetaTagIssue from "./_components/metaTagIssue";
import ContentIssue from "./_components/contentIssue";
import Singleimagerow from "./_components/singleImageRow";
import Modal from "react-bootstrap/Modal";
import GptModalBox from "./_components/gptModal";
import { differenceInDays } from "date-fns";
import Select from "react-select";

import JoditEditor from "jodit-react";
import Jodit from "./jodit";

import _ from "lodash";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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

const Home = (Props: any, ref: any) => {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState<true | undefined>(true);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Sync latest editor content to state so Preview modal shows current content (without re-rendering editor on every keystroke)
    setDescription((prev) => ({
      ...prev,
      data: descriptionLatestRef.current ?? prev.data,
    }));
    setShow(true);
  };
  const router = useRouter();
  const id = Props.mainItemId;

  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState(<Spinner size="sm" />);
  const [name, setName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemId, setItemId] = useState();
  const [targetKeyword, setTargetKeyword] = useState({
    loading: true,
    data: "",
  });
  const [titleTag, setTitleTag] = useState({ loading: true, data: "" });
  const [metaDescription, setMetaDescription] = useState({
    loading: true,
    data: "",
  });
  const [description, setDescription] = useState({ loading: true, data: "" });

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
  const [checkedImage, setCheckedImage] = useState<any>([]);
  const [imageData, setImageData] = useState([]);
  const [updateImageData, setUpdateImageData] = useState<any>([]);
  const [oldData, setOldData] = useState([]);
  const [primaryImageAltText, setPrimaryImageAltText] = useState("");
  const [spellStatus, setSpellStatus] = useState("");
  const [url, setUrl] = useState("");
  const [newUrl, setNewUrl] = useState<any>("");
  const [redirectUrl, setRedirectUrl] = useState<any>("");
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [gptModal, setGptModal] = useState({
    status: false,
    needToShow: false,
  });
  const [isSeoUpdated, setIsSeoUpdated] = useState(false);

  const [imageDataLoading, setImageDataLoading] = useState(true);
  const [allData, setAllData] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState<any>([]);
  // console.log(previewImage);

  // Store previous keyword
  const prevKeyword = useRef("");
  // Latest editor content (updated on every change) so Preview shows current content without re-rendering editor on each keystroke
  const descriptionLatestRef = useRef<string>("");
  // Latest alt text per image index (updated on every change) so Preview shows current alt without waiting for state
  const imageAltsLatestRef = useRef<Record<number, string>>({});
  // Refs for unsaved-changes check (read in useImperativeHandle)
  const nameRef = useRef("");
  const targetKeywordRef = useRef("");
  const titleTagRef = useRef("");
  const metaDescriptionRef = useRef("");
  const descriptionRef = useRef("");
  const savedSnapshotRef = useRef<{
    name: string;
    targetKeyword: string;
    titleTag: string;
    metaDescription: string;
    description: string;
    imageAlts: Record<number, string>;
  }>({
    name: "",
    targetKeyword: "",
    titleTag: "",
    metaDescription: "",
    description: "",
    imageAlts: {},
  });
  const savedSeoScoreRef = useRef<number | undefined>(undefined);
  const lastReportedItemTypeRef = useRef<string>("");

  // Keep ref in sync when description is set from parent (initial load, blur, restore)
  useEffect(() => {
    descriptionLatestRef.current = description.data ?? "";
  }, [description.data]);

  // Keep current-state refs in sync for unsaved-changes check (name is string state, others use .data)
  useEffect(() => {
    nameRef.current = name ?? "";
    targetKeywordRef.current = targetKeyword.data ?? "";
    titleTagRef.current = titleTag.data ?? "";
    metaDescriptionRef.current = metaDescription.data ?? "";
    descriptionRef.current =
      descriptionLatestRef.current ?? description.data ?? "";
  }, [
    name,
    targetKeyword.data,
    titleTag.data,
    metaDescription.data,
    description.data,
  ]);

  // Init image alts ref when image data loads so Preview has fallback before any edit
  useEffect(() => {
    if (Array.isArray(imageData) && imageData.length) {
      imageData.forEach((item: any, key: number) => {
        imageAltsLatestRef.current[key] = item.description ?? "";
      });
      // Store initial image alts as saved snapshot for this product
      const alts: Record<number, string> = {};
      imageData.forEach((item: any, key: number) => {
        alts[key] = item.description ?? "";
      });
      savedSnapshotRef.current = {
        ...savedSnapshotRef.current,
        imageAlts: alts,
      };
    }
  }, [imageData]);

  const getProductImages = async () => {
    const json = await Api("getProductImages", { id: id });
    setImageDataLoading(false);

    if (json.data) {
      setImageData(json.data);
      setUpdateImageData(json.data);
      setCheckedImage(json.data);
    }
    const updated = await Promise.all(
      json.data
        .filter((item: any) => item.is_optimize == 1)
        .map(async (item: any) => {
          const data = await getPreviewImgData(item.product_id, item.id);
          // console.log(data);
          return {
            image_id: data?.data?.image_id,
            product_id: data.data.product_id,
            image: data?.data?.image_url,
            name: data?.data?.old_file_name,
            size: data?.data?.image_size,
            altText: data?.data?.old_alt_text,
          };
        }),
    );
    setPreviewImage(updated);
  };
  const getSingleItemOptimize = () => {
    setTargetKeyword({ loading: true, data: "" });
    setTitleTag({ loading: true, data: "" });
    setMetaDescription({ loading: true, data: "" });
    setDescription({ loading: true, data: "" });

    setLoading(true);
    Api("getSingleItemOptimize", { id: id }).then((data) => {
      setAllData(data);
      getItemIssueCount();
      getItemIssue();

      setLoading(false);
      if (data?.gpt_language != null && data?.gpt_language !== undefined)
        Props.setGptLanguage?.(data.gpt_language);
      if (data?.gpt_popup_show == 0)
        setGptModal({ status: false, needToShow: true });

      //setSeoScore(data.total_seo_score)
      const itemData = data?.data?.item_data;
      setName(itemData?.item_name);
      setTargetKeyword({ loading: false, data: itemData?.target_keyword });
      setTitleTag({ loading: false, data: itemData?.title_tag });
      setMetaDescription({ loading: false, data: itemData?.meta_description });
      setDescription({ loading: false, data: itemData?.description });
      setItemType(itemData?.item_type);
      const newType = itemData?.item_type ?? "";
      if (lastReportedItemTypeRef.current !== newType) {
        lastReportedItemTypeRef.current = newType;
        Props.onItemTypeChange?.(newType);
      }
      setItemId(itemData?.item_id);
      // setImageData(itemData.image_data)
      // setUpdateImageData(itemData.image_data)
      setOldData(data?.data?.old_data);
      savedSnapshotRef.current = {
        ...savedSnapshotRef.current,
        name: itemData?.item_name ?? "",
        targetKeyword: itemData?.target_keyword ?? "",
        titleTag: itemData?.title_tag ?? "",
        metaDescription: itemData?.meta_description ?? "",
        description: itemData?.description ?? "",
      };

      let item_disable_spell_error = itemData?.item_disable_spell_error;
      let store_disable_spell_error = itemData?.store_disable_spell_error;
      if (item_disable_spell_error == 1) {
        setSpellStatus("off_page");
      }
      if (store_disable_spell_error == 1) {
        setSpellStatus("off_store");
      }
      if (item_disable_spell_error == 0 && store_disable_spell_error == 0) {
        setSpellStatus("on");
      }

      setUrl(itemData?.url);
      setSeoScore(data?.total_seo_score);
      savedSeoScoreRef.current = data?.total_seo_score;
    });
  };

  const getPreviewImgData = async (product_id: any, image_id: any) => {
    const data = await Api("imageOptimizer/getPreviewImgData", {
      product_id: product_id,
      image_id: image_id,
    });
    return data;
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

  const RestoreOptimizeImage = (imageId: any) => {
    setImageData((prev: any[]) =>
      prev.map((img: any) =>
        img.id === imageId ? { ...img, is_optimize: 3 } : img,
      ),
    );
    Api("imageOptimizer/RestoreOptimizeImage", {
      product_id: itemId,
      image_id: imageId,
    }).then((data) => {
      if (data.status_code == 204 || data.status_code == 203) {
        toast.error(data.message);
        getProductImages();
      }
      if (data.status_code == 200) {
        toast.success(
          "Your image is queued for restore. It may take up to a few hours depending on the queue our server has.",
        );
      }
    });
  };

  const debouncedAuditScore = useMemo(
    () =>
      _.debounce((params) => {
        const {
          name,
          targetKeyword,
          titleTag,
          metaDescription,
          description,
          imageAlt,
          url,
        } = params;
        setTitleLengthIssue({ loading: true, data: "" });
        setMetaDescriptionLengthIssue({ loading: true, data: "" });
        setTKTitleIssue({ loading: true, data: "" });
        setTKMetaDescriptionIssue({ loading: true, data: "" });

        setTKDescriptionIssue({ loading: true, data: "" });
        setLoremIpsumDescriptionIssue({ loading: true, data: "" });

        setAltTextIssue({ loading: true, data: "" });

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
          setHttpCount({
            loading: false,
            data: data?.contentIssues?.http_inks,
          });
          setSpellErrorDescriptionCount({
            loading: false,
            data: data?.contentIssues?.spelling_errors_in_the_description,
          });

          setSeoScore(data?.score);
          Props.setUpdateSeoScore(data?.score);
        });
      }, 1000),
    [id],
  ); // include dependencies like id if needed

  const getAuditScoreOnChange = useCallback(
    (
      name: any,
      targetKeyword: any,
      titleTag: any,
      metaDescription: any,
      description: any,
      imageAlt: any,
      url: any,
    ) => {
      debouncedAuditScore({
        name,
        targetKeyword,
        titleTag,
        metaDescription,
        description,
        imageAlt,
        url,
      });
    },
    [],
  );

  // Stable callback so Jodit doesn't re-render when parent state updates after API (avoids losing edit focus)
  const setDescriptionFromEditor = useCallback((content: string) => {
    setDescription((prev) => ({ ...prev, data: content }));
  }, []);

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
    if (Props.checkedItems.image) {
      handleMasterOptimize();
    }

    Api("updateSeoAuditItem", {
      id: id,
      item_name: name,
      target_keyword: targetKeyword.data,
      title_tag: titleTag.data,
      meta_description: metaDescription.data,
      description: description.data,
      alt_data: JSON.stringify(updateImageData),
      old_url: url,
      new_url: newUrl,
      redirect_url: redirectUrl,
    }).then((data) => {
      setSaveBtnLoading(false);
      toast.success("Page Saved");
      const alts: Record<number, string> = {};
      Object.keys(imageAltsLatestRef.current).forEach((k) => {
        alts[Number(k)] = imageAltsLatestRef.current[Number(k)] ?? "";
      });
      savedSnapshotRef.current = {
        name: name ?? "",
        targetKeyword: targetKeyword.data ?? "",
        titleTag: titleTag.data ?? "",
        metaDescription: metaDescription.data ?? "",
        description: descriptionLatestRef.current ?? description.data ?? "",
        imageAlts: Object.keys(alts).length
          ? alts
          : savedSnapshotRef.current.imageAlts,
      };
      savedSeoScoreRef.current =
        typeof seoScore === "number" ? seoScore : undefined;
      if (type == "exit") {
        router.push("/seo-audit");
      }
    });
  };

  const handleMasterOptimize = () => {
    const checkedImageArray = checkedImage.map((single: any) => {
      return {
        img_alt: single.description,
        old_alt_text: single.description,
        img_name: single.image_file.split("/").pop(),
        real_image: single.image_file,
        product_id: single.product_id,
        image_id: single.id,
        is_thumbnail: single.is_thumbnail,
        sort_order: single.sort_order,
        is_optimize: single.is_optimize,
      };
    });

    const filterArray = checkedImageArray.filter(
      (item: any) => item.is_optimize == 0,
    );
    Api("imageOptimizer/checkboxImageOptimize", {
      bulk_img_data: JSON.stringify(filterArray),
    }).then((data: any) => {
      if (data.status_code == 200) {
        toast.success(
          "Your image is queued for optimization. It may take up to a few hours depending on the queue our server has.",
        );
      }
      if (data.status_code == 202) {
        router.push("/image-optimizer-setting");
      }
      if (data.status_code == 204 || data.status_code == 203) {
        toast.error(data.message);
      }
    });
  };

  // useEffect(() => {
  //   getGoogleSuggestedKeyword();
  // }, [targetKeyword]);

  useEffect(() => {
    const keyword = targetKeyword.data;
    if (keyword && keyword !== prevKeyword.current) {
      prevKeyword.current = keyword; // update previous keyword
    }
  }, [targetKeyword]);

  useEffect(() => {
    lastReportedItemTypeRef.current = "";
    getSingleItemOptimize();
    getProductImages();
  }, [id]);

  useEffect(() => {
    setRedirectUrl(newUrl);
  }, [newUrl]);

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

  const handleRunSeoCopilot = async (checkedItems: any) => {
    if (checkedItems.targetKeyword)
      setTargetKeyword((prev: any) => ({ ...prev, loading: true }));
    if (checkedItems.titleTag && itemType !== "blog" && itemType !== "home")
      setTitleTag((prev: any) => ({ ...prev, loading: true }));
    if (checkedItems.metaDescription && itemType !== "home")
      setMetaDescription((prev: any) => ({ ...prev, loading: true }));
    if (checkedItems.description && itemType !== "brand" && itemType !== "home")
      setDescription((prev: any) => ({ ...prev, loading: true }));

    let keyword = targetKeyword.data;

    const apiCalls: Promise<any>[] = [];

    try {
      if (checkedItems.targetKeyword) {
        apiCalls.push(
          copilotApi("generateTargetKeyword", {
            item_name: name,
            item_id: itemId,
            item_db_id: id,
            type: itemType,
            target_keyword: targetKeyword.data,
            lang: Props.gptLanguage,
          })
            .then((res) => {
              if (res.success || res.status_code == 200) {
                setTargetKeyword({
                  loading: false,
                  data: res?.data?.keyword,
                });
                setIsSeoUpdated(true);
                getAuditScoreOnChange(
                  nameRef.current,
                  res?.data?.keyword,
                  titleTagRef.current,
                  metaDescriptionRef.current,
                  descriptionRef.current,
                  primaryImageAltText,
                  url,
                );
                keyword = res?.data?.keyword;
              }
            })
            .finally(() => {
              setTargetKeyword((prev) => ({ ...prev, loading: false }));
            }),
        );
      }

      if (checkedItems.titleTag && itemType !== "blog" && itemType !== "home") {
        apiCalls.push(
          copilotApi("generateMetaTitle", {
            item_name: name,
            item_id: itemId,
            item_db_id: id,
            type: itemType,
            target_keyword: keyword,
            lang: Props.gptLanguage,
          })
            .then((res) => {
              if (res.success || res.status_code == 200) {
                const nextTitle = res?.data?.meta_title ?? "";
                setTitleTag({
                  loading: false,
                  data: nextTitle,
                });
                setIsSeoUpdated(true);
                getAuditScoreOnChange(
                  nameRef.current,
                  targetKeywordRef.current,
                  nextTitle,
                  metaDescriptionRef.current,
                  descriptionRef.current,
                  primaryImageAltText,
                  url,
                );
              }
            })
            .finally(() => {
              setTitleTag((prev) => ({ ...prev, loading: false }));
            }),
        );
      }

      if (checkedItems.metaDescription && itemType !== "home") {
        apiCalls.push(
          copilotApi("generateMetaDesc", {
            item_name: name,
            item_id: itemId,
            item_db_id: id,
            type: itemType,
            target_keyword: keyword,
            lang: Props.gptLanguage,
          })
            .then((res) => {
              if (res.success || res.status_code == 200) {
                const nextMetaDescription = res?.data?.meta_description ?? "";
                setMetaDescription({
                  loading: false,
                  data: nextMetaDescription ?? "",
                });
                setIsSeoUpdated(true);
                getAuditScoreOnChange(
                  nameRef.current,
                  targetKeywordRef.current,
                  titleTagRef.current,
                  nextMetaDescription,
                  descriptionRef.current,
                  primaryImageAltText,
                  url,
                );
              }
            })
            .finally(() => {
              setMetaDescription((prev) => ({ ...prev, loading: false }));
            }),
        );
      }

      if (
        checkedItems.description &&
        itemType !== "brand" &&
        itemType !== "home"
      ) {
        apiCalls.push(
          copilotApi(
            itemType == "product" ? "generateProductDesc" : "getAiItemDesc",
            {
              item_name: name,
              item_id: itemId,
              item_db_id: id,
              type: itemType,
              target_keyword: keyword,
              lang: Props.gptLanguage,
            },
          )
            .then((res) => {
              if (res.data?.success || res.status_code == 200) {
                const nextDescription = res?.data?.description ?? "";
                setDescription({
                  loading: false,
                  data: nextDescription,
                });
                console.log("nextDescription", nextDescription);
                getAuditScoreOnChange(
                  nameRef.current,
                  targetKeywordRef.current,
                  titleTagRef.current,
                  metaDescriptionRef.current,
                  nextDescription,
                  primaryImageAltText,
                  url,
                );
                setIsSeoUpdated(true);
              }
            })
            .finally(() => {
              setDescription((prev) => ({ ...prev, loading: false }));
            }),
        );
      }

      // ✅ fire only required APIs
      await Promise.all(apiCalls);
    } finally {
      if (checkedItems.titleTag && itemType !== "blog")
        setTitleTag((prev) => ({ ...prev, loading: false }));
      if (checkedItems.metaDescription)
        setMetaDescription((prev) => ({ ...prev, loading: false }));
      if (checkedItems.description && itemType !== "brand")
        setDescription((prev) => ({ ...prev, loading: false }));
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    const cur = {
      name: nameRef.current,
      targetKeyword: targetKeywordRef.current,
      titleTag: titleTagRef.current,
      metaDescription: metaDescriptionRef.current,
      description: descriptionLatestRef.current ?? descriptionRef.current,
      imageAlts: imageAltsLatestRef.current,
    };
    const saved = savedSnapshotRef.current;
    if (
      cur.name !== saved.name ||
      cur.targetKeyword !== saved.targetKeyword ||
      cur.titleTag !== saved.titleTag ||
      cur.metaDescription !== saved.metaDescription ||
      cur.description !== saved.description
    )
      return true;
    const altKeys = new Set([
      ...Object.keys(cur.imageAlts),
      ...Object.keys(saved.imageAlts),
    ]);
    for (const k of altKeys) {
      const key = Number(k);
      if ((cur.imageAlts[key] ?? "") !== (saved.imageAlts[key] ?? ""))
        return true;
    }
    return false;
  }, []);

  const getSavedItemState = useCallback(() => {
    return {
      name: savedSnapshotRef.current?.name ?? "",
      seoScore: savedSeoScoreRef.current,
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleRunSeoCopilot,
    hasUnsavedChanges,
    getSavedItemState,
  }));

  useEffect(() => {
    Props.setUpdateItemName(name);
  }, [name]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
      <div className="content-frame-main copilotRight-scroll p-0">
        <div className="seo-optimizerMain">
          <div className="d-flex gap-24 seo-optimizerLogo-head">
            <div className="card">
              <div className="d-flex align-item-center gap-3 optimizerScore justify-content-center">
                <div className="optimizer-logo">
                  <Image
                    src={`${basePath}/images/seokart-logo-icon.svg`}
                    alt=""
                    width="50"
                    height="50"
                  />
                </div>

                <div className="optimizer-auditInfo">
                  <div className="d-flex align-items-baseline mb-1">
                    <h2 className="Text--headingXl mb-0 green-text">
                      {seoScore}%
                    </h2>
                  </div>
                  <h2 className="Text--headingMd mb-0">SEO SCORE</h2>
                </div>
              </div>
            </div>

            <div className="card flex-grow-1">
              {loading ? (
                <Skeleton count={2} />
              ) : (
                <div className="d-flex gap-3 seo-optimizer-headRight tab-align-item-center">
                  <div className="optimizer-headRightBox d-flex flex-grow-1 gap-3 tab-flex-direction-column">
                    <div className="custom-input flex-grow-1">
                      <span>Name</span>
                      <input
                        type="text"
                        disabled={itemType == "home"}
                        className={
                          itemType == "home"
                            ? "field-disable form-control"
                            : "form-control"
                        }
                        value={name}
                        onChange={(e) => {
                          getAuditScoreOnChange(
                            e.target.value,
                            targetKeyword.data,
                            titleTag.data,
                            metaDescription.data,
                            description.data,
                            primaryImageAltText,
                            url,
                          );
                          setName(e.target.value);
                        }}
                      />
                    </div>

                    <div className="custom-input flex-grow-1 position-relative">
                      <>
                        <span>Target Keyword</span>
                        <input
                          type="text"
                          className="form-control"
                          value={targetKeyword.data}
                          onChange={(e) => {
                            getAuditScoreOnChange(
                              name,
                              e.target.value,
                              titleTag.data,
                              metaDescription.data,
                              description.data,
                              primaryImageAltText,
                              url,
                            );
                            setTargetKeyword({
                              loading: false,
                              data: e.target.value,
                            });
                          }}
                        />
                        {targetKeyword.loading ? <Spinner size="sm" /> : ""}
                      </>
                    </div>
                  </div>

                  <div className="optimizer-headRightBox d-flex gap-3">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Add Keyword to Rank Tracker</Tooltip>}
                    >
                      <button
                        className="btn btn-default"
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
              )}
            </div>
          </div>

          <div className="seo-optimizer--innerArea">
            <h1 className="Text--headingLg">Meta Tag Issues</h1>
            <div className="d-flex gap-24 seo-optimizerInner-mainBox">
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
              <div className="card seoOptimizer-right flex-grow-1">
                <>
                  <div className="row">
                    <div className="col-md-12 mb-22">
                      <div className="d-flex gap-3 align-items-end">
                        <div className="custom-input flex-grow-1">
                          <span>Title Tag</span>
                          <input
                            type="text"
                            disabled={itemType == "home" || itemType == "blog"}
                            className={
                              itemType == "home" || itemType == "blog"
                                ? "field-disable form-control"
                                : "form-control"
                            }
                            value={titleTag.data}
                            onChange={(e) => {
                              getAuditScoreOnChange(
                                name,
                                targetKeyword.data,
                                e.target.value,
                                metaDescription.data,
                                description.data,
                                primaryImageAltText,
                                url,
                              );
                              setTitleTag({
                                loading: false,
                                data: e.target.value,
                              });
                            }}
                          />
                          {titleTag.loading ? <Spinner size="sm" /> : ""}
                          <div className="keyword-count false">
                            {titleTag.data.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 mb-22">
                      <div className="d-flex gap-3 align-items-end">
                        <div className="custom-textarea flex-grow-1">
                          <span className="textarea-heading ">
                            Meta Description
                          </span>
                          <textarea
                            className={`form-control height110 ${itemType == "home" ? "field-disable" : ""}`}
                            disabled={itemType == "home"}
                            value={metaDescription.data}
                            onChange={(e) => {
                              getAuditScoreOnChange(
                                name,
                                targetKeyword.data,
                                titleTag.data,
                                e.target.value,
                                description.data,
                                primaryImageAltText,
                                url,
                              );
                              setMetaDescription({
                                loading: false,
                                data: e.target.value,
                              });
                            }}
                          ></textarea>
                          {metaDescription.loading ? <Spinner size="sm" /> : ""}
                          <div className="keyword-count false">
                            {metaDescription.data.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>

          <div className="seo-optimizer--innerArea seo-optimizerInner-mainBox">
            <h1 className="Text--headingLg">Content Issues</h1>

            <div className="d-flex gap-24 seo-optimizerInner-mainBox">
              <ContentIssue
                id={id}
                tKDescriptionIssue={tKDescriptionIssue}
                loremIpsumDescriptionIssue={loremIpsumDescriptionIssue}
                internalBrokenCount={internalBrokenCount}
                externalBrokenCount={externalBrokenCount}
                httpCount={httpCount}
                spellErrorDescriptionCount={spellErrorDescriptionCount}
                titleTag={titleTag.data}
                metaDescription={metaDescription.data}
                targetKeyword={targetKeyword.data}
                description={description.data}
                itemName={name}
                spellStatus={spellStatus}
                getAuditScoreOnChange={() => {
                  getAuditScoreOnChange(
                    name,
                    targetKeyword.data,
                    titleTag.data,
                    metaDescription.data,
                    description.data,
                    primaryImageAltText,
                    url,
                  );
                }}
              />

              <div className="card seoOptimizer-right flex-grow-1">
                <div className="row">
                  <div className="col-md-12 mb-22">
                    <div className="d-flex gap-3 align-items-end">
                      <div
                        className={`custom-textarea flex-grow-1 ${(itemType == "home" || itemType == "brand") && "field-disable"}`}
                      >
                        <span className="textarea-heading ">Description</span>

                        {loading ? (
                          ""
                        ) : (
                          <Jodit
                            description={description.data}
                            itemType={itemType}
                            descriptionLatestRef={descriptionLatestRef}
                            getAuditScoreOnChange={getAuditScoreOnChange}
                            setDescription={setDescriptionFromEditor}
                            name={name}
                            targetKeyword={targetKeyword}
                            titleTag={titleTag}
                            metaDescription={metaDescription}
                            primaryImageAltText={primaryImageAltText}
                            url={url}
                          />
                        )}
                      </div>

                      {description.loading ? <Spinner size="sm" /> : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {itemType == "product" && (
            <div className="seo-optimizer--innerArea seo-optimizerInner-mainBox">
              <h1 className="Text--headingLg">{`Images' Issues`}</h1>

              <div className="d-flex gap-24">
                <div className="card seoOptimizer-left">
                  <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
                    <p>Alt Text available in the Primary Image</p>
                    {altTextIssue.loading ? (
                      <div className="w-[25px] h-[25px]">
                        <Spinner size="sm" />
                      </div>
                    ) : (
                      <span>
                        <Image
                          src={`${basePath}/images/${altTextIssue.data ? "check-green.svg" : "close-red-icon.svg"}`}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-item-center gap-3 mb-16">
                    <p>Image available</p>
                    <span>
                      <Image
                        src={`${basePath}/images/${imageData.length > 0 ? "check-green.svg" : "close-red-icon.svg"}`}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </span>
                  </div>
                </div>

                <div className="card seoOptimizer-right flex-grow-1 pt-4">
                  {imageDataLoading ? (
                    <Skeleton count={14} />
                  ) : (
                    <>
                      {imageData.map((item, key) => (
                        <Singleimagerow
                          image={item}
                          key={key}
                          componentKey={key}
                          refresh={(newalt: any) =>
                            getAuditScoreOnChange(
                              name,
                              targetKeyword.data,
                              titleTag.data,
                              metaDescription.data,
                              description.data,
                              newalt,
                              url,
                            )
                          }
                          setPrimaryImageAltText={(val: any) =>
                            setPrimaryImageAltText(val)
                          }
                          onAltChange={(key: number, altText: string) => {
                            imageAltsLatestRef.current[key] = altText;
                          }}
                          setUpdateImageData={(key: any, altText: any) => {
                            setUpdateImageData((updateImageData: any) => ({
                              ...updateImageData,
                              [key]: { ...updateImageData[key], alt: altText },
                            }));
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 mb-22 justify-content-end tab-justify-content-start">
            <div className="content-frameHead-right">
              <button
                type="button"
                className="btn-primary"
                onClick={handleShow}
                disabled={!isSeoUpdated}
                style={
                  !isSeoUpdated
                    ? { backgroundColor: "#e5e5e5", color: "#9ca3af" }
                    : undefined
                }
              >
                Preview
              </button>

              <Modal show={show} onHide={handleClose} fullscreen={fullscreen}>
                <Modal.Header closeButton>
                  <Modal.Title className="text-base">
                    Preview AI-Generated Changes
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <div className="flex flex-col gap-5 px-4 md:flex-row">
                    <div className="flex flex-col gap-6 flex-1">
                      <h3 className="text-xl font-bold">Before</h3>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">
                            Target Keyword:-
                          </h3>
                          <p>{allData?.data?.item_data?.target_keyword}</p>
                        </div>
                      </div>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">Title Tag:-</h3>
                          <p>{allData?.data?.item_data?.title_tag}</p>
                        </div>
                      </div>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">
                            Meta Description:-
                          </h3>
                          <p>{allData?.data?.item_data?.meta_description}</p>
                        </div>
                      </div>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">Content:-</h3>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                allData?.data?.item_data?.description || "",
                            }}
                          />
                        </div>
                      </div>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <h6 className="font-bold mb-2">Image:-</h6>
                        <div className="custom-table keywordSuggestion-table">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Product Image</th>
                                <th>Image Name</th>
                                <th>Alt Text</th>
                                <th>Size</th>
                              </tr>
                            </thead>
                            <tbody>
                              {imageData.map((item: any, key) => (
                                <tr key={key}>
                                  <td>
                                    <Image
                                      src={item.url_thumbnail}
                                      width={20}
                                      height={20}
                                      alt=""
                                    />
                                  </td>
                                  <td>
                                    {previewImage.find(
                                      (previewItem: any) =>
                                        previewItem.image_id == item.id,
                                    )?.name ?? item.image_file.split("/").pop()}
                                  </td>
                                  <td>
                                    {previewImage.find(
                                      (previewItem: any) =>
                                        previewItem.image_id == item.id,
                                    )?.altText ?? item.description}
                                  </td>
                                  <td>
                                    {previewImage.find(
                                      (previewItem: any) =>
                                        previewItem.image_id == item.id,
                                    )?.size ?? item.image_size}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="separator bg-[#E3E3E3] w-[1px] -my-5"></div>

                    <div className="flex flex-col gap-6 flex-1">
                      <h3 className="text-xl font-bold">After</h3>

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">
                            Target Keyword:-
                          </h3>
                          <p>{targetKeyword.data}</p>
                        </div>
                      </div>

                      {itemType !== "blog" && (
                        <div className="card !bg-[#f7f7f7] mb-0">
                          <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-[13px]">
                              Title Tag:-
                            </h3>
                            <p>{titleTag.data}</p>
                          </div>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="Secondary"
                              className="btn btn-default"
                            >
                              Restore
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {oldData.map((item: any, key: any) => (
                                <div key={key}>
                                  {item.type == 2 && (
                                    <Dropdown.Item
                                      as="button"
                                      onClick={() => {
                                        setTitleTag({
                                          loading: false,
                                          data: item.value,
                                        });
                                      }}
                                    >
                                      Title Tag ({item.created_at})
                                    </Dropdown.Item>
                                  )}
                                </div>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )}

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">
                            Meta Description:-
                          </h3>
                          <p>{metaDescription.data}</p>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="Secondary"
                              className="btn btn-default"
                            >
                              Restore
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {oldData.map((item: any, key: any) => (
                                <div key={key}>
                                  {item.type == 3 && (
                                    <Dropdown.Item
                                      as="button"
                                      onClick={() => {
                                        setMetaDescription({
                                          loading: false,
                                          data: item.value,
                                        });
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

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[13px]">Content:-</h3>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: description.data || "",
                            }}
                          />
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="Secondary"
                              className="btn btn-default"
                            >
                              Restore
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {oldData.map((item: any, key: any) => (
                                <div key={key}>
                                  {item.type == 4 && (
                                    <Dropdown.Item
                                      as="button"
                                      onClick={() => {
                                        setDescription({
                                          loading: false,
                                          data: item.value,
                                        });
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

                      <div className="card !bg-[#f7f7f7] mb-0">
                        <h6 className="font-bold mb-2">Image:-</h6>
                        <div className="custom-table keywordSuggestion-table">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Product Image</th>
                                <th>Image Name</th>
                                <th>Alt Text</th>
                                <th>Size</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {imageData.map((item: any, key) => {
                                return (
                                  <tr key={key}>
                                    <td>
                                      <Image
                                        src={item.url_thumbnail}
                                        width={20}
                                        height={20}
                                        alt=""
                                      />
                                    </td>
                                    <td>{item.image_file.split("/").pop()}</td>
                                    <td>
                                      {imageAltsLatestRef.current[key] ??
                                        updateImageData[key]?.alt ??
                                        item.description}
                                    </td>
                                    <td>{item.image_size}</td>
                                    <td>
                                      <button
                                        type="button"
                                        disabled={
                                          !(
                                            item.is_optimize == 0 ||
                                            item.is_optimize === false
                                          )
                                        }
                                        className="custom-btn"
                                        style={{
                                          backgroundColor:
                                            item.is_optimize == 0 ||
                                            item.is_optimize === false
                                              ? "#ffffff"
                                              : "#e5e5e5",
                                          color:
                                            item.is_optimize == 0 ||
                                            item.is_optimize === false
                                              ? undefined
                                              : "#9ca3af",
                                        }}
                                        onClick={() =>
                                          RestoreOptimizeImage(item.id)
                                        }
                                      >
                                        Restore
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              <button
                type="button"
                disabled={saveBtnLoading || !hasUnsavedChanges()}
                className="custom-btn"
                style={
                  saveBtnLoading || !hasUnsavedChanges()
                    ? {
                        backgroundColor: "#e5e5e5",
                        color: "#9ca3af",
                      }
                    : undefined
                }
                onClick={() => {
                  updateSeoAuditItem("");
                }}
              >
                {saveBtnLoading ? <Spinner size="sm" /> : "Save All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(forwardRef(Home));
