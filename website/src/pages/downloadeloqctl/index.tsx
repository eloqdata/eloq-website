import React from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css"; // Create and import your CSS file
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to an API
    console.log({ name, email, message, message });
  };

  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const software_version = (
      document.getElementById("software_version") as HTMLSelectElement
    ).value;
    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;

    const downloadUrl = `https://download.eloqdata.com/eloqctl/install.sh`;

    //console.log('Download URL:', downloadUrl); // Debug log to check the URL

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `install.sh`);
    //link.download = `eloqkv-${software_version}-${os_type}-amd64.tar.gz`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    console.log("Form submission initiated");

    //(document.getElementById('downloadForm') as HTMLFormElement).submit();
    // Collect form data
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "5bb5011a-1ff2-4a20-b49e-4938673427d2");

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
            <h1>DOWNLOAD</h1>
            <p>Deploy EloqKV Using Eloqctl</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Discover Eloqctl</h2>
                <p>
                  Eloqctl is a cluster operation and maintenance tool for
                  EloqKV, which supports deploying, starting, stopping and
                  destroying EloqKV cluster. <br />
                  We appreciate your email and contact information, but if you
                  prefer not to share it, feel free to proceed without
                  hesitation.
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

                <label htmlFor="software_version" className="required">
                  Software Version:
                </label>
                <select id="software_version" name="software_version" required>
                  <option value="0.6.0">0.6.0</option>
                </select>

                <label htmlFor="download-reason">
                  Which feature of EloqKV interests you the most?
                </label>
                <select id="download-reason" name="download-reason">
                  <option value="" disabled selected hidden>
                    Please select an option
                  </option>
                  <option value="pure-cache">
                    High Performance Distributed Cache
                  </option>
                  <option value="persistent-cache">
                    Cache with Persistent Storage
                  </option>
                  <option value="transactional-db">
                    Transactional Key Value Database
                  </option>
                </select>

                <label htmlFor="company">Company:</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" />

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
