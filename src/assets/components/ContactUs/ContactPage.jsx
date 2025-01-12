import wdsteam from "./wdsteam1.jpg";

export const SimpleBackgroundGradient = ({ children }) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x flex items-center justify-center">
      {children}
    </div>
  );
};

export default function ContactPage() {
  return (
    <SimpleBackgroundGradient>
      <div className="flex flex-col md:flex-row items-center justify-center h-screen px-6">
        {/* Image Section */}
        <div className="flex items-center justify-center">
          <img
            className="w-[90%] max-w-[750px] h-auto rounded-xl object-cover"
            src={wdsteam}
            alt="WDS Team"
          />
        </div>

        {/* Spacer */}
        <div className="hidden md:block w-[1px] h-[250px] bg-white mx-6" />

        {/* Text Section */}
        <div className="flex flex-col items-center text-center text-white space-y-6">
          <h1 className="text-4xl font-bold">Questions? Suggestions?</h1>
          <p className="text-xl">We want to hear from you!</p>
          <a
            href="mailto:aaryanj@outlook.com"
            className="inline-flex items-center justify-center h-[50px] w-[200px] text-xl font-bold font-['DM Sans'] text-white bg-black border-2 border-gray-600 rounded-[11px] transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]"
          >
            Email Us!
          </a>
        </div>
      </div>
    </SimpleBackgroundGradient>
  );
}
