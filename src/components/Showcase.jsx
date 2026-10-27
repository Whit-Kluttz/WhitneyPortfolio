import React, { useEffect, useRef, useState } from "react";

/* ---- TRAILER: point these at your own video ---- */
// Put the file in your public folder, next to your images (e.g. public/videos/trailer.mp4).
// The path has no leading slash, matching how your project images are referenced.
const TRAILER_SRC = "videos/Showcase2026.mp4";
const TRAILER_POSTER = ""; // optional: image shown while the video loads, e.g. "images/projects/trailer-poster.jpg"

/* ---- HEADING TEXT ---- */
const BACKGROUND_WORD = "Showcase"; // the large faded word behind the heading
const HEADING = "Game Trailer";     // the main heading

const Showcase = ({ classicHeader, darkTheme }) => {
  const videoRef = useRef();
  const [failed, setFailed] = useState(false);

  // Browsers only allow autoplay when the video is muted, and React doesn't
  // reliably apply the `muted` attribute, so set it directly and start playback.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // If the browser still blocks autoplay, the controls let the viewer press play
    });
  }, []);

  return (
    <section
      id="showcase"
      className={"section py-4" + (darkTheme ? "bg-dark-2" : "bg-light")}
    >
      <div className={"container " + (classicHeader ? "" : "px-lg-5")}>
        {/* Heading */}
        <div className="position-relative d-flex text-center mb-3">
          <h2
            className={
              "text-24  text-uppercase fw-600 w-100 mb-0 " +
              (darkTheme ? "text-muted opacity-1" : "text-light opacity-4")
            }
          >
            {BACKGROUND_WORD}
          </h2>
          <p
            className={
              "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
              (darkTheme ? "text-white" : "text-dark")
            }
          >
            {" "}
            {HEADING}
            <span 
                className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto"
                style={{ width: 200}}
            />
          </p>
        </div>
        {/* Heading end*/}

        {/* Trailer */}
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="ratio ratio-16x9 rounded overflow-hidden shadow">
              {failed ? (
                <div className="d-flex align-items-center justify-content-center bg-dark text-light">
                  <p className="mb-0">Trailer coming soon</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={TRAILER_SRC}
                  poster={TRAILER_POSTER || undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  preload="auto"
                  onError={() => setFailed(true)}
                  style={{ objectFit: "contain", backgroundColor: "#000" }}
                />
              )}
            </div>
          </div>
        </div>
        {/* Trailer end */}
      </div>
    </section>
  );
};

export default Showcase;