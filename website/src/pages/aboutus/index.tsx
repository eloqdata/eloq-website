import React from "react";

import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./aboutus.css"; // Create and import your CSS file
import React, { useState } from "react";

const CompanyPage: React.FC = () => {
  return (
    <Layout title="About Us">
      <div className="company-page-container">
        <div className="company-page">
          {/* Header Section */}
          <header className="header-section">
            <h1 className="company-name">EloqData</h1>
            <p className="company-tagline">
              Eloquently Ingest, Transform, and Process your Data
            </p>
          </header>

          {/* Our Mission Section */}
          <section className="mission-section">
            <h2 className="mission-heading">Our Mission</h2>
            <p className="highlight-text">
              <span className="emphasized-text">
                Building the Next Generation of Revolutionary Distributed
                Databases
              </span>
            </p>
            <p class="large-text">
              We are redefining how databases are designed. At EloqKV, we are
              committed to creating a next-generation distributed database that
              challenges the status quo. Our innovative data substrate
              methodology is crafted to support a variety of compute engines,
              addressing the diverse needs of real-world applications.
            </p>
            <p className="highlight-text">
              <span className="emphasized-text">
                No Compromises—Only Excellence
              </span>
            </p>
            <p class="large-text">
              Our goal is to deliver a database without compromises. This means
              achieving unparalleled performance, high availability, and ease of
              use—all at once. We're not just building a database; we're
              revolutionizing the very concept of data management to empower
              businesses to operate at their fullest potential.
            </p>
            <p class="large-text">
              That’s our vision. If you want to help us fulfill it,{" "}
              <a href="/preview/contact"> Join Us </a> (we’re hiring!).
            </p>
          </section>

          {/* Office Locations Section */}
          <section className="offices-section">
            <h2>Office Locations</h2>
            <div className="office-locations">
              <div className="office">
                <h3>Singapore</h3>
                <p>
                  EloqData PTE.Ltd. <br></br>160 RobinSon Road, #14-04 SBF
                  Center, Singapore 068914
                </p>
              </div>
              <div className="office">
                <h3>U.S.</h3>
                <p>
                  MonographDB Limited.Ltd. <br></br>10268 Parkwood Drive 5,
                  Cupertino, CA 94301
                </p>{" "}
                {/* Example address */}
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="footer-section">
            <p>
              &copy; {new Date().getFullYear()} EloqData. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyPage;
