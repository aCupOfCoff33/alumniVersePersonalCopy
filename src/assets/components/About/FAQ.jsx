import React, { useState } from "react";
import { motion } from "framer-motion";

const AccordionItem = ({ title, content, isExpanded, onToggle }) => {
  return (
    <div className="divide-y divide-slate-300 dark:divide-slate-700 mb-4">
      {" "}
      {/* Added bottom margin for distinction */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 bg-slate-100 p-4 text-left underline-offset-2 hover:bg-slate-100/75 focus-visible:bg-slate-100/75 focus-visible:underline focus-visible:outline-none dark:bg-slate-800 dark:hover:bg-slate-800/75 dark:focus-visible:bg-slate-800/75"
        aria-expanded={isExpanded ? "true" : "false"}
        onClick={onToggle}
      >
        <span
          className={`text-onSurface dark:text-onSurfaceDark font-medium ${
            isExpanded ? "font-bold" : ""
          } break-words lg:text-xl`}
        >
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className={`size-5 shrink-0 transition ${
            isExpanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 text-sm sm:text-base lg:text-lg text-pretty break-words bg-slate-100 dark:bg-slate-800">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

const Accordion = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-8 min-h-screen w-full flex items-center justify-center sm:py-12 py-8">
      <div className="w-full max-w-4xl divide-y divide-slate-300 overflow-hidden rounded-xl border border-slate-300 bg-slate-100/40 text-slate-700 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Accordion;
