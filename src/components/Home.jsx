import React from "react";
import Typewriter from "typewriter-effect";
import videobg from "../videos/home.mp4";

const Home = ({ classicHeader, darkTheme, handleNavClick }) => {
  return (
    <section id="home">
      <div className="hero-wrap">

        <div className="hero-content section d-flex py-5"style={{ minHeight: "70vh" }}>
          <div className="container my-auto">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="text-18 fw-600 text-white mb-2 mb-md-3">Whitney Kluttz</h1>
                <h2 className="text-12 fw-600 text-white mb-2 mb-md-3">
                  I'm a{" "}
                  <Typewriter
                    options={{
                      strings: ["Game Developer.", "Web Developer.", "Game Designer.", "Architect", "Programmer"],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h2>
                <p className="text-5 text-light mb-4">
                  based in Santa Monica, California.
                </p>
                {/* <a
                  href="#contact"
                  className="btn btn-outline-primary rounded-pill shadow-none smooth-scroll mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("contact");
                  }}
                >
                  Hire Me
                </a> */}
              </div>
            </div>
          </div>
          <a
            href="#about"
            className="scroll-down-arrow text-white smooth-scroll"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("portfolio");
            }}
          >
            <span className="animated">
              <i className="fa fa-chevron-down" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
