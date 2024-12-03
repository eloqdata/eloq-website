import React from "react";

import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./aboutus.css"; // Create and import your CSS file
import React, { useState } from "react";
import logo from "./eloqdata_logo.png"; // Adjust the path to your actual image location
import missionImage from "./ourmission.webp"; // Adjust the path to your actual image location
import visionImage from "./ourvision2.webp"; // Adjust the path to your actual image location

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

          {/* Our Mission Section */}
          {/* Mission and Vision Section */}
          <section className="mission-section">
            <div className="rowa">
              <div className="columna">
                <h2 className="mission-heading">Our Vision</h2>
                <p className="large-text">
                  We envision a future where managing data for AI applications
                  is seamless, efficient, and innovative. EloqData aims to
                  eliminate the complexity of fragmented data systems by
                  unifying multi-data-model access into a one-stop solution. By
                  delivering unmatched performance, scalability, and full ACID
                  transaction, we aspire to be the foundational data layer that
                  drives the next wave of AI innovation.{" "}
                </p>
              </div>
              <div className="columna">
                <img
                  src={visionImage}
                  alt="Our Vision"
                  className="vision-imagel"
                />
              </div>
            </div>
            <br />
            <div className="rowa">
              <div className="columna">
                <img
                  src={missionImage}
                  alt="Our Mission"
                  className="vision-imager"
                />
              </div>
              <div className="columna">
                <h2 className="mission-heading">Our Mission</h2>
                <p className="large-text">
                  Our mission is to revolutionize data management for modern AI
                  applications by addressing inefficiencies and inconsistencies
                  in traditional multi-database setups. With our groundbreaking
                  "data substrate" architecture, we are committed to providing a
                  one-stop solution that delivers over 10x performance gains and
                  cost savings. By combining cutting-edge technology, EloqData
                  strives to build the ideal data infrastructure for the
                  AI-driven world.
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
