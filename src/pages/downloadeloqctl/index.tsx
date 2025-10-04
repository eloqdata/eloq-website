import React from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css"; // Create and import your CSS file
import { useState, useEffect } from "react";

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

    const downloadUrl = `https://download.eloqdata.com/eloqctl/eloqctl_installer.sh`;

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

    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    const subject = "User Downloaded EloqData Software";
    formData.append("subject", subject);

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
            <h1>
              DOWNLOAD Eloqctl
              <sup style={{ fontSize: "0.3em", verticalAlign: "1.7em" }}>
                preview
              </sup>
            </h1>
            <p>
              Simplifying the Creation and Management of EloqKV Cluster with
              Eloqctl
            </p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Discover Eloqctl</h2>
                <p>
                  Eloqctl is a cluster management tool for EloqKV. You can use
                  it to create and manage EloqKV clusters without the need to
                  download the
                  <a href="/download"> tarball </a> separately. Just follow the
                  instructions
                  <a href="/eloqkv/quick-start"> here</a>.
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
