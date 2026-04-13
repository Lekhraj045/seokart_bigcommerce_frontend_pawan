import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type FaqItem = { question: string; answer: string };

type Props = {
  faqs: FaqItem[];
  setFaqs: Dispatch<SetStateAction<FaqItem[]>>;
};

const FAQs = ({ faqs, setFaqs }: Props) => {
  const [schemaEnabled, setSchemaEnabled] = useState(true);
  const addFaq = () =>
    setFaqs((prev: any) => [...prev, { question: "", answer: "" }]);
  const removeFaq = (index: number) =>
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  const updateFaq = (
    index: number,
    patch: Partial<{ question: string; answer: string }>,
  ) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    );
  };

  return (
    <div className="card !p-0 !mb-0">
      <div className="flex justify-between items-center p-3 border-b border-[#EEEEEE]">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-[#303030]">FAQs</h3>
        </div>
        <div className="flex gap-3 items-center">
          <button type="button" className={`custom-btn `} onClick={addFaq}>
            Add New FAQ
          </button>
          <div className="flex items-center gap-2 rounded-[8px] border border-[#EEEEEE] bg-white px-[6px] py-[6px]">
            <span className="text-[13px] font-normal text-[#303030]">
              Schema
            </span>
            <div className="vc-toggle-container !static">
              <label className="vc-small-switch">
                <input
                  type="checkbox"
                  checked={schemaEnabled}
                  className="vc-switch-input"
                  onChange={() => setSchemaEnabled((v) => !v)}
                />
                <span
                  className="vc-switch-label"
                  data-on="ON"
                  data-off="OFF"
                ></span>
                <span className="vc-switch-handle"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`card !mb-0 group relative ${faqs.length === 1 ? "lg:col-span-2" : ""}`}
          >
            {faqs.length > 1 && (
              <button
                type="button"
                onClick={() => removeFaq(idx)}
                aria-label="Remove FAQ"
                title="Remove"
                className="absolute right-[-4px] top-[-4px] z-20 flex items-center justify-center bg-[#DF4646] rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
            <div className="flex flex-1 flex-col gap-3 !order-1 lg:!order-2">
              <div>
                <div className="custom-input custom-input-label flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span>Question</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a question..."
                    value={faq.question}
                    onChange={(e) =>
                      updateFaq(idx, { question: e.target.value })
                    }
                  />
                  <div className="keyword-count false">
                    {faq.question.length}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="custom-textarea custom-input-label flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="textarea-heading ">Answer</span>
                    </div>
                    <textarea
                      className="form-control !h-[106px]"
                      placeholder="Write a helpful answer..."
                      value={faq.answer}
                      onChange={(e) =>
                        updateFaq(idx, { answer: e.target.value })
                      }
                    />
                    <div className="keyword-count false">
                      {faq.answer.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
