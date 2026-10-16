import React, { useEffect, useRef } from "react";

import Slider from "react-slick";

import "./css/card-modal-animation.css"
import "./css/card-modal-style.css"

/* ---- AUTO-CYCLE: images advance on a timer while the popup is open ---- */
const AUTOPLAY_MS = 2500; // how long each image shows before moving on (ms)

/* ---- SLIDER IMAGES: size and alignment ---- */
const MAX_IMAGE_HEIGHT = 450; // px: tallest an image can be. Every slide gets a box this
                              // tall, and each image is centered inside it, so all slides align

const SLIDER_SETTINGS = {
  dots: true,
  arrows: false,
  infinite: true, // loops back to the first image after the last
  speed: 750, // slide transition time (ms)
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true, // always on; the modal starts and stops it (see the effect below)
  autoplaySpeed: AUTOPLAY_MS,
  pauseOnDotsHover: true,
};

// The box every image sits in: fixed height, image centered both ways
const slideBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: MAX_IMAGE_HEIGHT,
};

// Images shrink to fit the box (never stretch) and keep their proportions
const slideImageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
};

const ProjectDetailsModal = ({ darkTheme, projectDetails }) => {
  const sliderRef = useRef();
  const modalRef = useRef();

  const whiteIfDark = darkTheme ? " text-white" : "";
  const labelClass = "text-dark font-weight-600 me-2" + whiteIfDark;

  // The thumbnail is always the first slide, followed by the project's slider images
  const slideImages = [
    projectDetails?.thumbImage,
    ...(projectDetails?.sliderImages ?? []),
  ];

  const details = [
    ["Client", projectDetails?.client],
    ["Technologies", projectDetails?.technologies],
    ["Industry", projectDetails?.industry],
    ["Date", projectDetails?.date],
  ];

  // Go back to the first image whenever a different project is chosen
  useEffect(() => {
    sliderRef.current?.slickGoTo(0);
  }, [projectDetails]);

  // Run the timer only while the popup is open. Bootstrap fires these events
  // on the modal when it finishes opening and closing.
  useEffect(() => {
    const modal = modalRef.current;
    const slider = () => sliderRef.current;

    const onShown = () => {
      slider()?.slickGoTo(0, true); // always start on the first image
      slider()?.slickPlay();
    };
    const onHidden = () => slider()?.slickPause();

    slider()?.slickPause(); // the slider mounts hidden, so hold it until the popup opens
    modal.addEventListener("shown.bs.modal", onShown);
    modal.addEventListener("hidden.bs.modal", onHidden);
    return () => {
      modal.removeEventListener("shown.bs.modal", onShown);
      modal.removeEventListener("hidden.bs.modal", onHidden);
    };
  }, []);

  return (
    <>
      <div
        ref={modalRef}
        className="modal fade card-modal-style card-modal-animation"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div
            className={
              "modal-content " + (darkTheme ? "text-light" : "")
            }
          >
            <div className="modal-body">
              <button
                type="button"
                className={"btn-close " + (darkTheme ? "btn-close-white" : "")}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <div
                className={
                  "container ajax-container " +
                  (darkTheme ? "text-light" : "")
                }
              >
                <h2
                  id="exampleModalLabel"
                  className={"text-6 font-weight-600 text-center mb-4" + whiteIfDark}
                >
                  {projectDetails?.title}
                </h2>
                <div className="row g-4">
                  <div className="col-md-7">
                    <Slider {...SLIDER_SETTINGS} ref={sliderRef}>
                      {slideImages.map((image, index) => (
                        <div className="item" key={index}>
                          <div style={slideBoxStyle}>
                            <img
                              className="img-fluid"
                              style={slideImageStyle}
                              alt=""
                              src={image}
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div className="col-md-5">
                    <h4 className={"text-4 font-weight-600" + whiteIfDark}>
                      Project Info:
                    </h4>
                    <p>{projectDetails?.projectInfo}</p>
                    <h4 className={"text-4 font-weight-600 mt-4" + whiteIfDark}>
                      Project Details:
                    </h4>
                    <ul
                      className={
                        "list-style-2 " + (darkTheme ? "list-style-light" : "")
                      }
                    >
                      {details.map(([label, value]) => (
                        <li key={label}>
                          <span className={labelClass}>{label}:</span>
                          {value}
                        </li>
                      ))}
                      <li>
                        <span className={labelClass}>URL:</span>
                        <a
                          href={projectDetails?.url?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {projectDetails?.url?.name}
                        </a>
                      </li>
                    </ul>
                    {/* <div className="row no-gutters align-items-center">
                      <div
                        className={
                          "col-auto text-dark font-weight-600" +
                          (darkTheme ? " text-white" : "")
                        }
                      >
                        Share:
                      </div>
                      <div className="col-auto">
                        <ul
                          className={
                            "social-icons" +
                            (darkTheme ? " social-icons-muted" : "")
                          }
                        >
                          <li className="social-icons-facebook">
                            <a
                              data-toggle="tooltip"
                              href={projectDetails?.socialLinks?.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Facebook"
                            >
                              <i className="fab fa-facebook-f" />
                            </a>
                          </li>
                          <li className="social-icons-twitter">
                            <a
                              data-toggle="tooltip"
                              href={projectDetails?.socialLinks?.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Twitter"
                            >
                              <i className="fab fa-twitter" />
                            </a>
                          </li>
                          <li className="social-icons-google">
                            <a
                              data-toggle="tooltip"
                              href={projectDetails?.socialLinks?.google}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Google"
                            >
                              <i className="fab fa-google" />
                            </a>
                          </li>
                          <li className="social-icons-instagram">
                            <a
                              data-toggle="tooltip"
                              href={projectDetails?.socialLinks?.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Instagram"
                            >
                              <i className="fab fa-instagram" />
                            </a>
                          </li>
                          <li className="social-icons-email">
                            <a
                              data-toggle="tooltip"
                              href={projectDetails?.socialLinks?.mail}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-original-title="Email"
                            >
                              <i className="fas fa-envelope" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsModal;