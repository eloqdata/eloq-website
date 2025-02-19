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

            <p className="company-tagline">构建下一代 AI 原生数据库</p>
          </header>

          {/* Our Mission Section */}
          {/* Mission and Vision Section */}
          <section className="mission-section">
            <div className="rowa">
              <div className="columna">
                <h2 className="mission-heading">我们的愿景</h2>
                <p className="large-text">
                  我们展望一个管理 AI
                  应用程序数据变得无缝、高效和创新的未来。EloqData
                  旨在通过将多数据模型访问统一为一站式解决方案，消除分散数据系统的复杂性。通过提供无与伦比的性能、可扩展性和完整的
                  ACID 事务，我们致力于成为推动下一波 AI 创新的基础数据层。
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
                <h2 className="mission-heading">我们的使命</h2>
                <p className="large-text">
                  我们的使命是通过解决传统多数据库设置中的低效和不一致问题，彻底改变现代
                  AI
                  应用程序的数据管理。凭借我们突破性的"数据基底"架构，我们致力于提供一个可实现超过
                  10
                  倍性能提升和成本节省的一站式解决方案。通过结合尖端技术，EloqData
                  努力为 AI 驱动的世界构建理想的数据基础设施。
                </p>
              </div>
            </div>
          </section>
          <section className="mission-section-join">
            <br />
            <br />
            <h2 className="mission-heading">加入我们</h2>
            <p className="large-text">
              我们正在招聘。如果您想与世界级团队一起工作，并帮助定义数据库系统的未来，
              <a href="/contact">请联系我们</a>。
            </p>
          </section>
          <br />
          <br />
          {/* Office Locations Section */}
          <section className="offices-section">
            <h2 className="mission-heading">办公地点</h2>
            <br />
            <div className="office-locations">
              <div className="office">
                <h3>北美</h3>
                <p>
                  EloqData Inc. <br></br>
                  10268 Parkwood Drive 5 <br></br>
                  Cupertino, CA 94301<br></br>
                  USA
                </p>
              </div>
              <div className="office">
                <h3>亚太地区</h3>
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
