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
    const software_version = "0.8.8";
    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;
    const arch_type = (
      document.getElementById("arch_type") as HTMLSelectElement
    ).value;

    const ip = (document.getElementById("ip_address") as HTMLSelectElement)
      .value;

    const downloadUrl = `https://download.eloqdata.com/eloqkv/${kvtype}/eloqkv-${software_version}-${os_type}-${arch_type}.tar.gz`;

    //console.log('Download URL:', downloadUrl); // Debug log to check the URL

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `eloqkv-${software_version}-${os_type}-${arch_type}.tar.gz`
    );
    //link.download = `eloqkv-${software_version}-${os_type}-${arch_type}.tar.gz`;

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
            <h1>下载 EloqKV</h1>
            <p>下载适用于您操作系统的二进制压缩包，开始试用 EloqKV</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>探索 EloqKV</h2>
                <p>
                  下载一个二进制压缩包，轻松探索我们突破性的 KV
                  数据库。要开始，请遵循
                  <a href="/eloqkv/install-from-binary">快速开始</a>指南。
                  <br />
                  <br />
                  如果您对更深入的体验感兴趣，我们建议尝试我们的
                  <a href="/downloadeloqctl">Eloqctl</a> 工具来部署集群，并对
                  EloqKV 进行更深入的测试。
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
                <label htmlFor="os_type" className="required">
                  操作系统：
                </label>
                <select id="os_type" name="os_type" required>
                  <option value="" disabled selected>
                    请选择操作系统类型
                  </option>
                  <option value="rhel7">RHEL 7</option>
                  <option value="rhel8">RHEL 8</option>
                  <option value="rhel9">RHEL 9</option>
                  <option value="ubuntu20">Ubuntu 20.04</option>
                  <option value="ubuntu22">Ubuntu 22.04</option>
                  <option value="ubuntu24">Ubuntu 24.04</option>
                </select>

                <label htmlFor="arch_type" className="required">
                  CPU 架构：
                </label>
                <select id="arch_type" name="arch_type" required>
                  <option value="" disabled selected>
                    请选择 CPU 架构
                  </option>
                  <option value="amd64">x86_64</option>
                  <option value="arm64">arm64</option>
                </select>

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
