import { DeantaLogo } from "./DeantaLogo";

export function DeantaRational() {
  const content = [
    {
      title: "Publishing Production Management",
      description: "Complete and customisable publishing solutions",
    },
    {
      title: "Tailored AI Solutions",
      description:
        "Leveraging machine learning to streamline workflows and enhance productivity",
    },
    {
      title: "Real-Time XML Proofing",
      description:
        "A user-friendly environment for making changes directly to the XML",
    },
    {
      title: "Digital Asset Management",
      description:
        "A cloud-based workspace with advanced search and reporting functions",
    },
    {
      title: "Professional Content Editing with PRO Editor",
      description: "Sophisticated tools for on-line editing",
    },
    {
      title: "XML Transformation",
      description: "Single source of XML-first workflow",
    },
  ];

  const randomNumber = Math.floor(Math.random() * content.length);

  // need to change the number 7 if we have more images/videos
  const imageRandomNumber = Math.floor(Math.random() * 7);

  return (
    <div className="m-0 p-0 h-100" id="deantaRationalContainer">
      {imageRandomNumber <= 3 ? (
        <img
          className="background"
          src={`/assets/asset${
            imageRandomNumber === 0 ? 1 : imageRandomNumber
          }.jpg`}
          alt="Lanstad background"
        />
      ) : (
        <video
          src={`/assets/asset${imageRandomNumber}.mp4`}
          autoPlay
          muted
          loop
        />
      )}

      <div className="overlay" />

      <div className="contentContainer">
        <DeantaLogo />

        <div className="messageContainer">
          <strong>{content[randomNumber]?.title}</strong>

          <span>{content[randomNumber]?.description}</span>
        </div>
      </div>
    </div>
  );
}
