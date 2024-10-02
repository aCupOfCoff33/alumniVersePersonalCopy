export const SimpleBackgroundGradient = ({ children }) => {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x">
        <div className="flex items-center justify-center w-full h-full">
          {children}
        </div>
      </div>
    );
  };
  

export default function ContactPage() {
  return (
    <SimpleBackgroundGradient>
    <div className="flex flex-col md:flex-row justify-center items-center h-screen">
      {/* Image Section */}
      <div className="flex items-center justify-center mb-8 md:mb-0">
        <img
          className="w-100 h-auto rounded-2xl"
          src="https://i.pinimg.com/736x/fd/3b/78/fd3b78ab6e60a8a9b3d45073c4b8fb95.jpg"
          alt="Dog in costume"
        />
      </div>

      {/* Spacer */}
      <div className="w-full h-1 bg-white md:w-1 md:h-96 mx-8 mb-8 md:mb-0" />

      {/* Text Section */}
      <div className="text-center text-white space-y-8">
        <div className="text-5xl font-bold">Questions? Suggestions?</div>
        <div className="text-2xl">We want to hear from you</div>
        <button className="inline-flex items-center justify-center h-[50px] w-[200px] text-xl font-bold font-['DM Sans'] text-white bg-black border-2 border-gray-600 rounded-[11px] no-underline transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]">
          Email Us!
        </button>
      </div>
    </div>
    </SimpleBackgroundGradient>
  );
}
