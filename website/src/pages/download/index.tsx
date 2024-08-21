import React from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css"; // Create and import your CSS file
import React, { useState, useEffect } from "react";

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Fetch the IP address and set it in the hidden input field
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipInput = document.getElementById(
          "ip_address"
        ) as HTMLInputElement;
        if (ipInput) {
          ipInput.value = data.ip;
        }
      })
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to an API
    console.log({ name, email, message, message });
  };

  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*const kvtype = (document.getElementById("kvtype") as HTMLSelectElement)
      .value;
    const software_version = (
      document.getElementById("software_version") as HTMLSelectElement
    ).value;*/
    const kvtype = "rocksdb";
    const software_version = "0.6.6";
    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;

    const ip = (document.getElementById("ip_address") as HTMLSelectElement)
      .value;

    const downloadUrl = `https://download.eloqdata.com/eloqkv/${kvtype}/eloqkv-${software_version}-${os_type}-amd64.tar.gz`;

    //console.log('Download URL:', downloadUrl); // Debug log to check the URL

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `eloqkv-${software_version}-${os_type}-amd64.tar.gz`
    );
    //link.download = `eloqkv-${software_version}-${os_type}-amd64.tar.gz`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    console.log("Form submission initiated");

    //(document.getElementById('downloadForm') as HTMLFormElement).submit();
    // Collect form data
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    // Collect checked checkbox values
    const selectedFeatures = Array.from(
      document.querySelectorAll('input[name="download-reason"]:checked')
    ).map((checkbox) => checkbox.value);

    // Append the selected features to the form data
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
    } else {
      console.log("Error", data);
    }

    /* getform API
    try {
      const response = await fetch('https://getform.io/f/bmdpkgja', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Form submission successful');
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }*/
  };

  return (
    <Layout title="Contact Us">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>DOWNLOAD EloqKV</h1>
            <p>Try EloqKV by Downloading a Binary Tarball for Your OS</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Discover EloqKV</h2>
                <p>
                  Download a binary tarball to easily explore our groundbreaking
                  KV database. To get started, follow the{" "}
                  <a href="/eloqkv/install-from-binary"> Quick Start </a>
                  guide.
                  <br />
                  <br />
                  If you're interested in a more in-depth experience, we
                  recommend trying our
                  <a href="/downloadeloqctl"> Eloqctl </a> tool to deploy a
                  cluster and take EloqKV for a more serious test drive.
                  <br />
                  <br />
                  If you'd like to stay informed about the exciting developments
                  of EloqKV, you can provide your email and contact information.
                  However, if you prefer not to receive updates, feel free to
                  continue without any obligations.
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
                  <option value="rhel8">RHEL 8</option>
                  <option value="rhel9">RHEL 9</option>
                  <option value="ubuntu20">Ubuntu 20.04</option>
                  <option value="ubuntu22">Ubuntu 22.04</option>
                  <option value="ubuntu24">Ubuntu 24.04</option>
                </select>

                {/*<label htmlFor="software_version" className="required">
                  Software Version:
                </label>
                <select id="software_version" name="software_version" required>
                  <option value="0.6.3">0.6.3</option>
                </select>

                <div className="form-group">
                  <label htmlFor="kvtype" className="required">
                    Persistent Storage:
                    <span className="help-icon" aria-label="Help">
                      ?
                    </span>
                  </label>
                  <select id="kvtype" name="kvtype" required>
                    <option value="rocksdb">RocksDB</option>
                  </select>
                  <div className="help-message">
                    EloqKV can store data in a persistent data storage.
                    Currently, local RocksDB and distributed Cassandra storage
                    engines are supported.
                    <br />
                    <br />
                    Additional persistent storage engines will be supported in
                    the future.
                  </div>
                </div>*/}

                <label htmlFor="download-reason">
                  Which feature of EloqKV interests you the most?
                </label>
                <div id="download-reason">
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="pure-cache"
                    />
                    High Performance Distributed Cache
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="persistent-cache"
                    />
                    Cache with Persistent Storage
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="transactional-db"
                    />
                    Transactional Key Value Database
                  </div>
                </div>

                <label htmlFor="company">Company:</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" />

                {/* Hidden input field to store IP address */}
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

export default ContactPage;
