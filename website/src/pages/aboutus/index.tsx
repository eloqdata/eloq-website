import React from "react";

import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./aboutus.css"; // Create and import your CSS file
import React, { useState } from "react";
import logo from "./eloqdata_logo.png"; // Adjust the path to your actual image location
import missionImage from "./aboutusmission.jpg"; // Adjust the path to your actual image location
import visionImage from "./aboutusvision.jpg"; // Adjust the path to your actual image location
import techImage from "./aboutustech.jpg"; // Adjust the path to your actual image location

const CompanyPage: React.FC = () => {
  return (
    <Layout title="About Us">
      <div className="company-page-container">
        <div className="company-page">
          {/* Header Section */}
          <header className="header-section">
            <div className="company-branding">
              <img src={logo} alt="EloqData Logo" className="company-logo" />
              <h1 className="company-name">EloqData</h1>
            </div>

            <p className="company-tagline">
              Build the Next Generation of AI Native Databases
            </p>
          </header>

          {/* Vision, Technolody and Mission Section */}
          <section className="mission-section">
            <div className="rowa">
              <div className="columna">
                <img
                  src={visionImage}
                  alt="Our Vision"
                  className="vision-imagel"
                />
              </div>
              <div className="columna">
                <h2 className="mission-heading">Our Vision</h2>
                <p className="large-text">
                  EloqData consists of a{" "}
                  <a href="https://www.linkedin.com/company/eloqdata">team </a>
                  with deep expertise in databases, distributed systems, and
                  artificial intelligence. Drawing on decades of experience
                  building and scaling mission-critical infrastructure, we came
                  together with a shared vision: to rethink what a database
                  should be in the AI age. We believe that the data stack must
                  be radically simplified and modernized to meet the needs of
                  emerging AI applications—and we're building EloqData to make
                  that future a reality.
                </p>
              </div>
            </div>
            <br />
            <div className="rowa">
              <div className="columna">
                <h2 className="mission-heading">Our Technology</h2>
                <p className="large-text">
                  At the heart of EloqData is{" "}
                  <a href="blog/2025/07/14/technology">Data Substrate</a>—a
                  modular database architecture that redefines how databases are
                  built. By abstracting the core components of database
                  functionality, Data Substrate enables us to create
                  high-performance, scalable and fully transactional systems
                  without reinventing the wheel. This composable foundation
                  allows us to support multiple APIs and data modalities (such
                  as MySQL, Redis, and MongoDB) while delivering consistent
                  performance and reliability across all workloads. You can read
                  more about of our technology foundation here.
                </p>
              </div>
              <div className="columna">
                <img
                  src={techImage}
                  alt="Our Technology"
                  className="vision-imager"
                />
              </div>
            </div>
            <br />
            <div className="rowa">
              <div className="columna">
                <img
                  src={missionImage}
                  alt="Our Mission"
                  className="vision-imagel"
                />
              </div>
              <div className="columna">
                <h2 className="mission-heading">Our Mission</h2>
                <p className="large-text">
                  At EloqData, we aim to be the foundational data layer that
                  drives the AI era forward. We believe the future of data lies
                  in simplicity, performance, and adaptability. Our goal is to
                  modernize database architecture by unifying fragmented systems
                  into a single, seamless platform. We drive to offer a range of
                  data management products that deliver unmatched scalability,
                  full ACID compliance, upto10x performance gains and up to 90%
                  the cost savings — empowering developers to build the next
                  generation of AI-native applications with ease and confidence.
                </p>
              </div>
            </div>
          </section>
          <section className="mission-section-join">
            <br />
            <br />
            <h2 className="mission-heading">Join Us</h2>
            <p class="large-text">
              We are hiring. If you want to work with a world-class team <br />
              and help define the future of database systems,{" "}
              <a href="/contact"> Contact Us</a>.
            </p>
          </section>
          <br />
          <br />
          {/* Office Locations Section */}
          <section className="offices-section">
            <h2 className="mission-heading">Office Locations</h2>
            <br />
            <div className="office-locations">
              <div className="office">
                <h3>North America</h3>
                <p>
                  EloqData Inc. <br></br>
                  10268 Parkwood Drive 5 <br></br>
                  Cupertino, CA 94301<br></br>
                  USA
                </p>
              </div>
              <div className="office">
                <h3>Asia Pacific</h3>
                <p>
                  EloqData PTE.Ltd. <br></br>
                  160 Robinson Road<br></br>
                  #14-04 SBF Center<br></br>
                  Singapore 068914
                </p>
                {/* Example address */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyPage;
