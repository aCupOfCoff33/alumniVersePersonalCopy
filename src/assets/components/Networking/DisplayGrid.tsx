// From Aceturnity UI. 


import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DisplayGridProps {
  filteredCards: Array<{
    id: string;
    title: string;
    description: string;
    src: string;
    content: () => React.ReactNode;
  }>;
  active: any;
  setActive: (card: any) => void;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const DisplayGrid: React.FC<DisplayGridProps> = ({
  filteredCards,
  active,
  setActive,
  cardRef,
}) => {
  const id = React.useId();

  // Close the card when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(null);
      }
    }

    // Add event listener when the card is active
    if (active) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active, cardRef, setActive]);

  return (
    <>
      {/* Background overlay for the expanded card */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded card modal */}
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={cardRef}
              className="w-full max-w-[450px] h-full md:h-fit md:max-h-[80%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden justify-center items-center pt-4"
            >
              <motion.div
                layoutId={`image-${active.id}-${id}`}
                className="flex justify-center"
              >
                <img
                  src={active.src}
                  alt={active.title}
                  className="w-[400px] h-[400px] lg:w-[400px] lg:h-[400px] object-cover object-center rounded-lg"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-blue-500 text-white"
                  >
                    LinkedIn
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Grid of clickable cards */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2 max-w-7xl mx-auto w-full">
        {filteredCards.map((card) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={card.id}
            onClick={() => setActive(card)}
            className="p-6"
            style={{ width: "100%", position: "relative" }}
          >
            <div
              className="flex gap-1 flex-col w-full items-center rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#262626] hover:ring-8 hover:ring-[#262626]"
              style={{ position: "relative", aspectRatio: "1/1" }}
            >
              <motion.div
                layoutId={`image-${card.id}-${id}`}
                className="w-full h-auto"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="object-cover w-full h-auto rounded-lg"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>

              <div className="flex flex-col items-center justify-center w-full p-4 text-gray-900 dark:text-neutral-400 bg-transparent hover:bg-[#262626] rounded-b-lg">
                <motion.h3
                  layoutId={`title-${card.id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.id}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center text-sm"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
};

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
