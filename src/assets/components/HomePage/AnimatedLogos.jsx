{
  /* The URL's to the Logos should be changed eventually. they just need to be in the correct orientation and size, so it looks really bad now\
but will be changed eventually */
}

const logos = [
  {
    name: "Google",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
  },
  {
    name: "Nextjs",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881475/nextjs_logo_dark_gfkf8m.svg",
  },
  {
    name: "Amazon",
    url: "companyImgaes/Amazon.svg",
  },
  {
    name: "Y",
    url: "https://www.hutsy.co/wp-content/uploads/2019/12/y_combinator.png",
  },
  {
    name: "IBM",
    url: "companyImgaes/IBM.svg",
  },

  {
    name: "Microsoft",
    url: "companyImgaes/Microsoft.png",
  },
  {
    name: "Beats by Dre",
    url: "companyImgaes/beats.png",
  },
  {
    name: "CIBC",
    url: "companyImgaes/CIBC.png",
  },
  {
    name: "MLSE",
    url: "companyImgaes/MLSE.png",
  },
];

const AnimatedLogoCloud = () => {
  return (
    <div className="w-full py-12">
      <div className="mx-auto w-full px-4 md:px-8">
        <div
          className="group relative mt-6 flex gap-6 overflow-hidden p-2"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          }}
        >
          {Array(6) // Increase repetition to reduce jitter
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
              >
                {logos.map((logo, key) => (
                  <img
                    key={key}
                    src={logo.url}
                    className="h-10 w-28 px-2 brightness-0 dark:invert"
                    alt={`${logo.name}`}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogoCloud;
