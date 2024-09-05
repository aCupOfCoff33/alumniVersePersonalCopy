import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface AccordionItemProps {
  title: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
}

interface AccordionProps {
  items: Array<{
    title: string;
    content: string;
  }>;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isExpanded,
  onToggle,
}) => {
  const cardVariants: Variants = {
    collapsed: {
      height: "100px",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    expanded: {
      height: "auto",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const contentVariants: Variants = {
    collapsed: { opacity: 0 },
    expanded: {
      opacity: 1,
      transition: { delay: 0.1 },
    },
  };

  const chevronVariants: Variants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  };

  return (
    <motion.div
      className="w-90 dark:bg-gray-800 my-4 h-full cursor-pointer select-none overflow-hidden rounded-lg border border-[#1C255B] dark:border-gray-700"
      variants={cardVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
        <h2 className="px-4 m-0 text-2xl font-semibold text-white">{title}</h2>
        <motion.div variants={chevronVariants}>
          <ChevronDown size={24} />
        </motion.div>
      </div>
      <motion.div
        className="text-xl select-none px-4 py-4"
        variants={contentVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
      >
        <p className="px-4 m-0 text-xl text-gray-900 dark:text-gray-100">
          {content}
        </p>
      </motion.div>
    </motion.div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 space-y-4">
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
  );
};

const accordionItems = [
  {
    title:
      "The cheapest, fastest, and most reliable components are those that aren’t there. (Gordon Bell)",
    content:
      "The best thing about a boolean is even if you are wrong, you are only off by a bit. (Anonymous) It’s ridiculous to live 100 years and only be able to remember 30 million bytes. You know, less than a compact disc.",
  },
  {
    title: "First, solve the problem. Then, write the code. (John Johnson)",
    content:
      "Their best approach so far has been to take all the old brochures and stamp the words ‘user-friendly’ on the cover. (Bill Gates) Measuring programming progress",
  },
  {
    title:
      "There are two ways to write error-free programs; only the third one works. (Alan J. Perlis)",
    content:
      "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. (Bill Gates) Should array indices start at 0 or 1? My compromise of 0.5 was rejected without, I thought, proper consideration. (Stan Kelly-Bootle)",
  },
  {
    title:
      "Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris. (Larry Wall)",
    content:
      "First learn computer science and all the theory. Next develop a programming style. Then forget all that and just hack. (George Carrette)",
  },
  {
    title:
      "The cheapest, fastest, and most reliable components are those that aren’t there. (Gordon Bell)",
    content:
      "The best thing about a boolean is even if you are wrong, you are only off by a bit. (Anonymous) It’s ridiculous to live 100 years and only be able to remember 30 million bytes. You know, less than a compact disc.",
  },
  {
    title: "First, solve the problem. Then, write the code. (John Johnson)",
    content:
      "Their best approach so far has been to take all the old brochures and stamp the words ‘user-friendly’ on the cover. (Bill Gates) Measuring programming progress",
  },
  {
    title:
      "There are two ways to write error-free programs; only the third one works. (Alan J. Perlis)",
    content:
      "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. (Bill Gates) Should array indices start at 0 or 1? My compromise of 0.5 was rejected without, I thought, proper consideration. (Stan Kelly-Bootle)",
  },
  {
    title:
      "Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris. (Larry Wall)",
    content:
      "First learn computer science and all the theory. Next develop a programming style. Then forget all that and just hack. (George Carrette)",
  },
];

const AccordionExample: React.FC = () => {
  return (
    <div>
      <div className="p-8">
        <Accordion items={accordionItems} />
      </div>
    </div>
  );
};

export default AccordionExample;
