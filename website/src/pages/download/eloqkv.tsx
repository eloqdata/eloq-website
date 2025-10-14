import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css";

const EloqKVDownloadPage: React.FC = () => {
  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;
    const arch_type = (
      document.getElementById("arch_type") as HTMLSelectElement
    ).value;
    const software_version = "0.8.13";
    const kvtype = "rocksdb";

    const downloadUrl = `https://download.eloqdata.com/eloqkv/${kvtype}/eloqkv-${software_version}-${os_type}-${arch_type}.tar.gz`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `eloqkv-${software_version}-${os_type}-${arch_type}.tar.gz`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 收集表单数据
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    const subject = "User Downloaded EloqData Software";
    formData.append("subject", subject);

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
      console.log("表单提交成功");
    }
  };

  useEffect(() => {
    // 获取 IP 地址并设置到隐藏输入字段
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
      .catch((error) => console.error("获取 IP 地址时出错:", error));
  }, []);

  return (
    <Layout title="下载 EloqKV">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>下载 EloqKV</h1>
            <p>通过下载适用于您的操作系统的二进制 Tarball 来体验 EloqKV</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>探索 EloqKV</h2>
                <p>
                  下载二进制 Tarball 轻松探索我们创新的 KV
                  数据库。开始使用，请参阅
                  <a href="/eloqkv/install-from-binary"> 快速入门 </a>
                  指南。
                  <br />
                  <br />
                  如果您想要更深入的体验，我们建议使用
                  <a href="/downloadeloqctl"> Eloqctl </a>{" "}
                  工具来部署集群，并深入测试 EloqKV。
                  <br />
                  <br />
                  如果您想了解 EloqKV
                  的最新动态，可以提供您的电子邮件和联系方式。
                  当然，如果您不希望接收更新，也可以直接继续下载。
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
                  操作系统:
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
                  CPU 架构:
                </label>
                <select id="arch_type" name="arch_type" required>
                  <option value="" disabled selected>
                    请选择 CPU 架构
                  </option>
                  <option value="amd64" selected>
                    x86_64
                  </option>
                  <option value="arm64" disabled>
                    arm64
                  </option>
                </select>

                <label htmlFor="download-reason">
                  您对 EloqKV 的哪些功能最感兴趣？
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
                    具备持久存储的缓存
                  </div>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      name="download-reason"
                      value="transactional-db"
                    />
                    事务型键值数据库
                  </div>
                </div>

                <label htmlFor="company">公司:</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">电子邮件:</label>
                <input type="email" id="email" name="email" />

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

export default EloqKVDownloadPage;
