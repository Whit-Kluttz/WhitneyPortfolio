import React, { useEffect, useRef, useState } from "react";
import Isotope from "isotope-layout";
import ProjectDetailsModal from "./ProjectDetailsModal";
const Portfolio = ({ classicHeader, darkTheme }) => {
  // init one ref to store the future isotope object
  const isotope = useRef();
  // store the filter keyword in a state
  const [filterKey, setFilterKey] = useState("*");
  const [imagesLoaded, setimagesLoaded] = useState(0);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState();

  const filters = {
    DESIGN: "Design",
    GAMES: "Games",
    WEBSITES: "Web",
    TECH: "Networking"
  };

  const projectsData = [
    { title: "Floor is... What?!",
      engine: "Unity",
      projectInfo:
        "Floor is... What?! Is a four player Mario Party style like game I had the joy of working on with Joshua Garity for the majority of 2023 - 2024. I assisted the project by porting it for online networking using the Photon PUN2 SDK, developing preexisting gameplay and Unity physics to work seamlessly for online gameplay. I also assisted in the game design giving prototyping notes and attending conferences and playtesting sessions to gather and analzye player feedback. ",
      client: "Midwestern Games",
      technologies: "Unity, Photon PUN, C#, C++, Blender, Jira",
      industry: "Game Development and Design",
      date: "October 16, 2023",
      url: {
        name: "Floor is... What?!",
        link: "https://www.flooriswhat.com/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/FloorIsWhat.jpg",
      sliderImages: [
        "images/projects/fiw-blizzardbombers.webp",
        "images/projects/flooriswhat03.png",
        "images/projects/floorlogo.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH],
    },
    { title: "Nunaka",
      engine: "Unity",
      projectInfo:
        "Nunaka is a 3D Unity game I worked on as a Developer at FableVision. Nunaka is a fun and engaging mobile game exploring Sugpiaq heritage, the Sugt'stun language, and key school readiness goals for 3-5-year-olds. On this project, I worked in developing the narrative and minigames featured in the game as well as helping cut down on graphic performance issues for mobile devices.",
      client: "FableVision",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "March 3rd, 2025",
      url: {
        name: "Nunaka",
        link: "https://www.fablevisionstudios.com/portfolio/nunaka",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/NunakaAward.jpg",
      sliderImages: [
        "images/projects/NunakaCharacterCreate.webp",
        "images/projects/MiniGameSelection.webp",
        "images/projects/NunakaAllTogether.png",
        "images/projects/NunakaWorldMap.webp",
        "images/projects/Fablevision_SpiralLogo.png",
      ],
      categories: [filters.DESIGN, filters.GAMES],
    },
    { title: "Idol Hell",
      projectInfo:
        "Idol Hell is a 6 chapter arcade shooter game developed in Unity as a capstone project I led. The game raised $17.5k in a successful Kickstart campaign and is available on both Steam and Nintendo Switch. My main responsibilities included scripting generative bullet logic, designing artistic bullet patterns for four difficulties, moderating a community server, and assisting with optimization for the Switch SDK.",
      client: "Whitney Kluttz",
      engine: "Unity",
      technologies: "Unity, Switch Dev, C#, Adobe, Steam, Jira, Miro",
      industry: "Game Development and Design",
      date: "March 3rd, 2023",
      url: {
        name: "Idol Hell Store Page",
        link: "https://store.steampowered.com/app/2067470/Idol_Hell/",
      },
      thumbImage: "images/projects/IdolHell.png",
      sliderImages: [
        "images/projects/HowToPlayStage.png",
        "images/projects/DiscordNewBanner.jpg",
        "images/projects/FightToTheEnd.png",
        "images/projects/BoothBest.jpg",
        "images/projects/IdolHellSwitch.jpg",
      ],
      categories: [filters.DESIGN, filters.GAMES],
    },
    { title: "Marine Biology VR",
      projectInfo:
        "Marine Biology is a project I developed with Alter-Learning Education Inc. The project is a fully immersive VR underwater experience meant to help teach children about marine life. My role included VR Unity development, WebGL optimization, and design documentation and prototyping for underwater sea creatures.",
      client: "Alter Learning",
      engine: "Unity",
      technologies: "Unity, Vr, Occulus, Lens, WebGL",
      industry: "VR Development and Design",
      date: "April 3, 2023",
      url: {
        name: "Marine Biology",
        link: "https://alter-learning.com/games/marine-biology/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/MarineBiologyUI.png",
      sliderImages: [
        "images/projects/Animals.png",
        "images/projects/Marine-Biology-Mobile.webp",
        "images/projects/Marine-Biology-Underwater.webp",
        "images/projects/Submarine.png",
        "images/projects/WireMesh.png",
        "images/projects/Marine_biology.png",
      ],
      categories: [filters.GAMES, filters.TECH, filters.DESIGN],
    },
    {title: "Bun.EXE",
      projectInfo:
        "Bun.EXE is an action adventure game that tells a story across four major dungeons. On this project, I worked in developing the narrative, puzzle, and combat systems in the game. I also was the primary designer behind the puzzles in each dungeon and prototyped combat for all enemies and bosses.",
      client: "Sean Foley",
      engine: "Godot",
      technologies: "Godot, GDScript, Aseprite, Trello, Miro",
      industry: "Combat and Puzzle Design",
      date: "March 4th, 2023",
      url: {
        name: "TBA",
        // link: "https://www.example.com",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/Bun_Logo.png",
      sliderImages: [
        "images/projects/AfterGrappleDungeon.png",
        "images/projects/LighthouseInterior.png",
        "images/projects/garden_2a.png",
      ],
      categories: [filters.DESIGN, filters.GAMES],
    },
    {title: "Online First Person Shooter Demo",
      engine: "Unity",
      projectInfo: "This is a Demo project I made for a client. While not avalialbe to play, it features online gameplay through Photon Quantum, a voxel based enviornment generator, 4 wacky guns, and more!",
      client: "LS",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "Jan 10th, 2026",
      url: {
        name: "LICHTENSTEIN",
        link: "https://www.youtube.com/@Lich",
      },
      socialLinks: {
      Youtube: "https://www.youtube.com/@Lich",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/fps/Header.png",
      sliderImages: [
        "images/projects/fps/ZombieMulti.png",
        "images/projects/fps/HouseExploding.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH],
    },
    {title: "Real Time Strategy Tool",
      engine: "Unity",
      projectInfo: "This was a tool I made to assist with a greater real time strategy project called Mist Of War. I provided a small RTS demo in Unity complete with an enviornment generator, seeking and attack AIs, and more!",
      client: "Our English",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "March 8th, 2026",
      url: {
        name: "Mist of War",
        link: "https://somethingrandomstudio.itch.io/mist-of-war",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/rts/Header.png",
      sliderImages: [
        "images/projects/rts/Image1.png",
        "images/projects/rts/Image2.png",
        "images/projects/rts/Image3.png",
      ],
      categories: [filters.GAMES, filters.TECH],
    },
    { title: "Miraglia Client Portal",
      projectInfo:
        "Miraglia & Company is an eviction law firm I worked for during employment with Sandbox Union. On this project I was client facing and dealt with Front-End development of their client portal.",
      client: "Miraglia & Company",
      engine: "Angular",
      technologies: "Anuglar, HTML5, CSS3, PHP, Java",
      industry: "Web Development",
      date: "September 6, 2021",
      url: {
        name: "Miraglia Home Page",
        link: "https://www.miragliaco.com/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/Law.png",
      sliderImages: [
        "images/projects/MiragliaHome.png",
        "images/projects/MiragliaPortal.png",
      ],
      categories: [filters.WEBSITES],
    },
    { title: "Notes - A React App",
      projectInfo:
        "Notes - A React App is a tech demo I put together to improve on my React Skills. It's a simply reflection of the iOS Notes app on a PC using local back-end Json hosting to save data for created and deleted notes.",
      client: "Whitney Kluttz",
      engine: "React",
      technologies: "React, SCSS, Javascript, HTML5",
      industry: "Tech Demo",
      date: "March 10, 2025",
      url: {
        name: "Coming Soon",
        // link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/Notes.png",
      sliderImages: [
        "images/projects/Notes.png",
        "images/projects/NotesPage.png",
      ],
      categories: [filters.WEBSITES],
    },
    { title: "Sentence Builder",
      engine: "Unity",
      projectInfo: "Sentence Builder is an educational Unity game developed to teach English language learning skills. \The primary challenges involved in this project included back-end integration for thousands of active users, and loading educational content into the game from a custom back-end service. \
This game comes with both a Review mode for lesson learning, as well as an arcade marketplace mode with endless gameplay!",
      client: "Our English",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "August 24th, 2026",
      url: {
        name: "SentenceBuilder",
        link: "https://webapp.ourenglish.ai/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/SentenceBuilder/Header.webp",
      sliderImages: [
        "images/projects/SentenceBuilder/Image1.png",
        "images/projects/SentenceBuilder/Image2.png",
        "images/projects/SentenceBuilder/Image3.png",
        "images/projects/SentenceBuilder/Image4.png",
        "images/projects/SentenceBuilder/Image5.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH],
    },
    { title: "Sharp Shooter",
      engine: "Unity",
      projectInfo: "Sharp Shooter is an educational Unity game developed to teach English language learning skills. \The primary challenges involved in this project included back-end integration for thousands of active users, and loading educational content into the game from a custom back-end service. \
This game comes with both a Review mode for lesson learning, as well as an arcade marketplace mode with endless gameplay!",
      client: "Our English",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "August 24th, 2026",
      url: {
        name: "SharpShooter",
        link: "https://webapp.ourenglish.ai/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/SharpShooter/Header.webp",
      sliderImages: [
        "images/projects/SharpShooter/Image1.png",
        "images/projects/SharpShooter/Image2.png",
        "images/projects/SharpShooter/Image3.png",
        "images/projects/SharpShooter/Image4.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH],
    },
    { title: "Word Scramble",
      engine: "Unity",
      projectInfo: "Word Scramble is an educational Unity game developed to teach English language learning skills. \The primary challenges involved in this project included back-end integration for thousands of active users, and loading educational content into the game from a custom back-end service. \
This game comes with both a Review mode for lesson learning, as well as an arcade marketplace mode with endless gameplay!",
      client: "Our English",
      technologies: "Unity, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Unity Development",
      date: "August 24th, 2026",
      url: {
        name: "WordScramble",
        link: "https://webapp.ourenglish.ai/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/WordScramble/Header.webp",
      sliderImages: [
        "images/projects/WordScramble/Image1.png",
        "images/projects/WordScramble/Image2.png",
        "images/projects/WordScramble/Image3.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH],
    }, 
    { title: "Word Rush",
      engine: "HTML5",
      projectInfo: "Word Rush is an educational Unity game developed to teach English language learning skills. \The primary challenges involved in this project included back-end integration for thousands of active users, and loading educational content into the game from a custom back-end service. \
This game comes with both a Review mode for lesson learning, as well as an arcade marketplace mode with endless gameplay!",
      client: "Our English",
      technologies: "HTML5, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Web Development",
      date: "August 24th, 2026",
      url: {
        name: "WordRush",
        link: "https://webapp.ourenglish.ai/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/WordRush/Header.webp",
      sliderImages: [
        "images/projects/WordRush/Image1.png",
        "images/projects/WordRush/Image2.png",
        "images/projects/WordRush/Image3.png",
        "images/projects/WordRush/Image4.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH, filters.WEBSITES],
    },
    { title: "Bubble Pop",
      engine: "HTML5",
      projectInfo: "Bubble Pop is an educational Unity game developed to teach English language learning skills. \The primary challenges involved in this project included back-end integration for thousands of active users, and loading educational content into the game from a custom back-end service. \
This game comes with both a Review mode for lesson learning, as well as an arcade marketplace mode with endless gameplay!",
      client: "Our English",
      technologies: "HTML5, iOS, Andriod, C#, BaseCamp, Slack, Jira, Miro",
      industry: "Web Development",
      date: "August 24th, 2026",
      url: {
        name: "BubblePop",
        link: "https://webapp.ourenglish.ai/",
      },
      // socialLinks: {
      //   facebook: "http://www.facebook.com/",
      //   twitter: "http://www.twitter.com/",
      //   google: "http://www.google.com/",
      //   instagram: "http://www.instagram.com/",
      //   mail: "mailto:example@gmail.com",
      // },
      thumbImage: "images/projects/BubblePop/Header.webp",
      sliderImages: [
        "images/projects/BubblePop/Image1.png",
        "images/projects/BubblePop/Image2.png",
        "images/projects/BubblePop/Image3.png",
      ],
      categories: [filters.DESIGN, filters.GAMES, filters.TECH, filters.WEBSITES],
    },
    {title: "Cattle USA",
      projectInfo:
        "Cattle USA is a website I developed along with the Effortless API team inside the Angular framework. On this project I helped develop front end design for the login authentication page and developed a new front-end application for the company. I also ran backend QA testing for a switch to Token based OAuth using a DBeaver server for tracking user data.",
      client: "EJ Alexandria",
      engine: "Angular, DBeaver",
      technologies: "Angular, HTML5, Tailwind, DBeaver, Figma, Airtable, SQL",
      industry: "Full Stack Development",
      date: "Janurary 20, 2025",
      url: {
        name: "Cattle USA Home Page",
        link: "https://www.cattleusa.com/",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/CattleLogo.png",
      sliderImages: [
        "images/projects/CattleUSA.png",
      ],
      categories: [filters.WEBSITES],
    },
    { title: "Equlibiria Systems",
      projectInfo:
        "Equilibria Systems is a company focused on bridging informational sciences with entertainment systems. I worked to develop a bold project of theirs that used Open AI to serve as a linguistic game master in an upcoming project. Because of NDA I cannot include images or specific details, but my responsibilities included Unity API integration, MML management, and back-end data retrieval.",
      client: "Ross Magnant",
      engine: "Unity",
      technologies: "Unity, C#, APIs, Open AI, LootLocker",
      industry: "Game Development",
      date: "March 10, 2025",
      url: {
        name: "NDA",
        // link: "https://www.example.com",
      },
      socialLinks: {
        facebook: "http://www.facebook.com/",
        twitter: "http://www.twitter.com/",
        google: "http://www.google.com/",
        instagram: "http://www.instagram.com/",
        mail: "mailto:example@gmail.com",
      },
      thumbImage: "images/projects/Equilibria.png",
      sliderImages: [
      ],
      categories: [filters.GAMES],
    },
  ];

  // initialize an Isotope object with configs
  useEffect(() => {
    isotope.current = new Isotope(".portfolio-filter", {
      itemSelector: ".filter-item",
      layoutMode: "masonry",
    });

    // cleanup
    return () => {
      isotope.current.destroy();
    };
  }, []);

  // handling filter key change
  useEffect(() => {
    if (imagesLoaded) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey, imagesLoaded]);

  const handleFilterKeyChange = (key) => () => setFilterKey(key);

  return (
    <>
      <section
        id="portfolio"
        className={"section " + (darkTheme ? "bg-dark-2" : "bg-light")}
      >
        <div className={"container " + (classicHeader ? "" : "px-lg-5")}>
          {/* Heading */}
          <div className="position-relative d-flex text-center mb-5">
            <h2
              className={
                "text-24  text-uppercase fw-600 w-100 mb-0 " +
                (darkTheme ? "text-muted opacity-1" : "text-light opacity-4")
              }
            >
              Portfolio
            </h2>
            <p
              className={
                "text-9 text-dark fw-600 position-absolute w-100 align-self-center lh-base mb-0 " +
                (darkTheme ? "text-white" : "text-dark")
              }
            >
              {" "}
              My Work
              <span className="heading-separator-line border-bottom border-3 border-primary d-block mx-auto" />
            </p>
          </div>
          {/* Heading end*/}
          {/* Filter Menu */}
          <ul
            className={
              "portfolio-menu nav nav-tabs justify-content-center border-bottom-0 mb-5 " +
              (darkTheme ? "nav-light" : "")
            }
          >
            <li className="nav-item">
              <button
                className={"nav-link " + (filterKey === "*" ? "active" : "")}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </button>
            </li>
            {Object.keys(filters).map((oneKey, i) => (
              <li className="nav-item" key={i}>
                <button
                  className={
                    "nav-link " +
                    (filterKey === filters[oneKey] ? "active" : "")
                  }
                  onClick={handleFilterKeyChange(filters[oneKey])}
                >
                  {filters[oneKey]}
                </button>
              </li>
            ))}
          </ul>
          {/* Filter Menu end */}
          <div className="portfolio popup-ajax-gallery">
            <div className="row portfolio-filter filter-container g-4">
              {projectsData.length > 0 &&
                projectsData.map((project, index) => (
                  <div
                    className={
                      "col-sm-6 col-lg-4 filter-item " +
                      project.categories.join(" ")
                    }
                    key={index}
                  >
                    <div className="portfolio-box rounded">
                      <div className="portfolio-img rounded">
                        <img
                          onLoad={() => {
                            setimagesLoaded(imagesLoaded + 1);
                          }}
                          className="img-fluid d-block portfolio-image"
                          src={project.thumbImage}
                          alt=""
                        />
                        <div className="portfolio-overlay">
                          <a
                            className="popup-ajax stretched-link"
                            href=""
                            onClick={() => {
                              setSelectedProjectDetails(projectsData[index]);
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />
                          <div className="portfolio-overlay-details">
                            <h5 className="text-white fw-400">
                              {project.title}
                            </h5>
                            <span className="text-light">{project.engine}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <div className="project-details-modal">
        {/* Modal */}
        <ProjectDetailsModal
          projectDetails={selectedProjectDetails}
          darkTheme={darkTheme}
        ></ProjectDetailsModal>
      </div>
    </>
  );
};

export default Portfolio;
