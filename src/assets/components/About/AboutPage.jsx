import FAQ from "./FAQ.tsx";

export const SimpleBackgroundGradient = ({ children }) => {
  return (
    <div className="relative h-screen w-screen bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};


export default function AboutPage() {
  
  return (
    <>
      <SimpleBackgroundGradient>

      <div className="w-3/4 mx-auto pt-[10px]">
        {" "}
        <FAQ />
      </div>
      </SimpleBackgroundGradient>
    </>
  );
}
