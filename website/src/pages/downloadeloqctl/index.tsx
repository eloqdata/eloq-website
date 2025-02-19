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
            <h1>下载 Eloqctl</h1>
            <p>使用 Eloqctl 简化 EloqKV 集群的创建和管理</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>了解 Eloqctl</h2>
                <p>
                  Eloqctl 是 EloqKV 的集群管理工具。您可以使用它来创建和管理
                  EloqKV 集群，无需单独下载
                  <a href="/download">压缩包</a>。请按照
                  <a href="/eloqkv/quick-start">这里</a>的说明操作。
                  <br />
                  <br />
                  如果您想了解 EloqKV
                  的最新发展，可以提供您的电子邮件和联系信息。
                  如果您不想接收更新，也可以继续操作，无需任何义务。
                </p>
              </div>
            </div>
            <div className="form-panel">
              <h2>下载表单</h2>
              <form
                id="downloadForm"
                className="contact-form"
                onSubmit={triggerDownload}
              >
                <label htmlFor="download-reason">
                  EloqKV 的哪些特性最吸引您？
                </label>
                <div id="download-reason">
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="pure-cache"
                    />
                    高性能分布式缓存
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="persistent-cache"
                    />
                    持久化存储缓存
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="transactional-db"
                    />
                    事务性键值数据库
                  </div>
                </div>

                <label htmlFor="company">公司：</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">电子邮件：</label>
                <input type="email" id="email" name="email" />

                {/* Hidden input field to store IP address */}
                <input type="hidden" id="ip_address" name="ip_address" />

                <button type="submit">下载</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
