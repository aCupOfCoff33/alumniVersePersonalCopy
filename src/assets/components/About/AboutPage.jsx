import FAQ from "./FAQ.jsx";
import accordionItems from "./AccordionItems.jsx";

export const SimpleBackgroundGradient = ({ children }) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x">
      {/* Remove absolute positioning */}
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <>
      <SimpleBackgroundGradient>
        <div className="mx-auto p-6 py-12">
          {" "}
          {/* Increased padding for top and bottom */}
          <FAQ items={accordionItems} />
        </div>
      </SimpleBackgroundGradient>
    </>
  );
}
