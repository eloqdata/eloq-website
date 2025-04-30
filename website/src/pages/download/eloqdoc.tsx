import React from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css";

const EloqDocDownloadPage: React.FC = () => {
  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;
    const arch_type = (
      document.getElementById("arch_type") as HTMLSelectElement
    ).value;
    const software_version = "0.1.0";
    const kvtype = "cassandra";

    const downloadUrl = `https://download.eloqdata.com/eloqdoc/${kvtype}/eloqdoc-${software_version}-${os_type}-${arch_type}.tar.gz`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `eloqdoc-${software_version}-${os_type}-${arch_type}.tar.gz`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Collect form data
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    const selectedFeatures = Array.from(
      document.querySelectorAll('input[name="download-reason"]:checked')
    ).map((checkbox: Element) => (checkbox as HTMLInputElement).value);

    if (selectedFeatures.length > 0) {
      formData.append("selected_features", selectedFeatures.join(","));
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      console.log("Form submission successful");
    }
  };

  return (
    <Layout title="Download EloqDoc">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>
              DOWNLOAD EloqDoc
              <sup style={{ fontSize: "0.3em", verticalAlign: "1.7em" }}>
                preview
              </sup>
            </h1>
            <p>Try EloqDoc by Downloading a Binary Tarball for Your OS</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Discover EloqDoc</h2>
                <p>
                  Download a binary tarball to explore our MongoDB-compatible
                  document database. To get started, follow the{" "}
                  <a href="/eloqdoc/install-from-binary"> Quick Start </a>
                  guide.
                  <br />
                  <br />
                  If you're interested in a more in-depth experience, we
                  recommend trying our
                  <a href="/downloadeloqctl"> Eloqctl </a> tool to deploy a
                  cluster.
                  <br />
                  <br />
                  If you'd like to stay informed about EloqDoc developments, you
                  can provide your email and contact information. However, if
                  you prefer not to receive updates, feel free to continue
                  without any obligations.
                </p>
              </div>
            </div>
            <div className="form-panel">
              <h2>Download Form</h2>
              <form
                id="downloadForm"
                className="contact-form"
                onSubmit={triggerDownload}
              >
                <label htmlFor="os_type" className="required">
                  Operating System:
                </label>
                <select id="os_type" name="os_type" required>
                  <option value="" disabled selected>
                    Please Choose OS Type
                  </option>
                  <option value="ubuntu20">Ubuntu 20.04</option>
                  <option value="ubuntu22">Ubuntu 22.04</option>
                </select>

                <label htmlFor="arch_type" className="required">
                  CPU Architecture:
                </label>
                <select id="arch_type" name="arch_type" required>
                  <option value="" disabled selected>
                    Please Choose CPU Arch
                  </option>
                  <option value="amd64" selected>
                    x86_64
                  </option>
                  <option value="arm64" disabled>
                    arm64
                  </option>
                </select>

                <label htmlFor="download-reason">
                  Which feature of EloqDoc interests you the most?
                </label>
                <div id="download-reason">
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="mongo-compatible"
                    />
                    MongoDB Compatible API
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="document-store"
                    />
                    Elastic and Scalability
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="acid-transactions"
                    />
                    ACID Transactions
                  </div>
                </div>

                <label htmlFor="company">Company:</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" />

                <input type="hidden" id="ip_address" name="ip_address" />

                <button type="submit">Download</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EloqDocDownloadPage;
