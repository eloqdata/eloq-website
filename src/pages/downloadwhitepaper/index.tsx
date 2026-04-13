import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import "../download/DownloadPage.css";

const WhitepaperDownloadPage: React.FC = () => {
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipInput = document.getElementById(
          "ip_address"
        ) as HTMLInputElement | null;
        if (ipInput) {
          ipInput.value = data.ip;
        }
      })
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const companyInput = form.elements.namedItem("company") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;

    if (!companyInput?.value.trim() || !emailInput?.value.trim()) {
      alert("Please provide both company and email before downloading.");
      if (!companyInput?.value.trim()) {
        companyInput?.focus();
      } else {
        emailInput?.focus();
      }
      return;
    }

    const link = document.createElement("a");
    link.href = "/whitepaper.pdf";
    link.setAttribute("download", "whitepaper.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const formData = new FormData(form);
    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");
    formData.append("subject", "User Downloaded EloqData Whitepaper");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data.success) {
        console.log("Form submission failed", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Layout title="Download Whitepaper">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>DOWNLOAD WHITEPAPER</h1>
            <p>
              Download the EloqKV on EloqStore whitepaper to learn architecture,
              design, and benchmark details.
            </p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Get the Whitepaper</h2>
                <p>
                  Fill in your information to download the latest whitepaper in
                  PDF format. We use this information to better understand
                  product interest and follow up when requested.
                </p>
              </div>
            </div>
            <div className="form-panel">
              <h2>Download Form</h2>
              <form
                id="whitepaperDownloadForm"
                className="contact-form"
                onSubmit={triggerDownload}
              >
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" />

                <label htmlFor="company" className="required">
                  Company:
                </label>
                <input type="text" id="company" name="company" required />

                <label htmlFor="email" className="required">
                  Email:
                </label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="job_title">Job Title:</label>
                <input type="text" id="job_title" name="job_title" />

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

export default WhitepaperDownloadPage;
