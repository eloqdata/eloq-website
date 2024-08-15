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

          <p className="highlight-text">
            <span className="emphasized-text">
              Building the NextGen Databases, the Right Way
            </span>
          </p>

          {/* Our Mission Section */}
          <section className="mission-section">
            <h2 className="mission-heading">Our Mission</h2>
            <p class="large-text">
              We are redefining how databases are designed. At EloqKV, we are
              committed to creating a next-generation distributed database that
              challenges the status quo. Our innovative data substrate
              methodology is crafted to support a variety of compute engines,
              addressing the diverse needs of real-world applications.
            </p>
            <br />
            <br />
            <h2 className="mission-heading">Our Vision</h2>
            <p class="large-text">
              Our goal is to deliver a database without compromises. This means
              achieving unparalleled performance, high availability, and ease of
              use—all at once. We're not just building a database; we're
              revolutionizing the very concept of data management to empower
              businesses to operate at their fullest potential.
            </p>
            <br />
            <br />
            <h2 className="mission-heading">Join Us</h2>
            <p class="large-text">
              That’s our vision. If you want to help us fulfill it,{" "}
              <a href="/preview/contact"> Join Us </a> (we’re hiring!).
            </p>
          </section>
          <br />
          <br />
          {/* Office Locations Section */}
          <section className="offices-section">
            <h2>Office Locations</h2>
            <br />
            <div className="office-locations">
              <div className="office">
                <h3>Asia Pacific</h3>
                <p>
                  EloqData PTE.Ltd. <br></br>160 RobinSon Road,<br></br>#14-04
                  SBF Center,<br></br>Singapore 068914
                </p>
              </div>
              <div className="office">
                <h3>North America</h3>
                <p>
                  EloqData Inc. <br></br>10268 Parkwood Drive 5,
                  <br></br>Cupertino, CA 94301,<br></br>USA
                </p>
                {/* Example address */}
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="footer-section">
            <p>
              &copy; {new Date().getFullYear()} EloqData Inc. All rights
              reserved.
            </p>
          </footer>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyPage;
