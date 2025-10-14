import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css";

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message, message });
  };

  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const downloadUrl = `https://download.eloqdata.com/eloqctl/eloqctl_installer.sh`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `install.sh`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("表单提交已启动");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    const subject = "User Downloaded EloqData Software";
    formData.append("subject", subject);

    const selectedFeatures = Array.from(
      document.querySelectorAll('input[name="download-reason"]:checked')
    ).map((checkbox) => (checkbox as HTMLInputElement).value);

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
    } else {
      console.log("错误", data);
    }
  };

  return (
    <Layout title="联系我们">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>
              下载 Eloqctl
              <sup style={{ fontSize: "0.3em", verticalAlign: "1.7em" }}>
                预览版
              </sup>
            </h1>
            <p>使用 Eloqctl 简化 EloqKV 集群的创建和管理</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>探索 Eloqctl</h2>
                <p>
                  Eloqctl 是 EloqKV 的集群管理工具。您可以使用它创建和管理
                  EloqKV 集群，而无需单独下载
                  <a href="/download"> tarball </a>。 只需按照
                  <a href="/eloqkv/quick-start"> 此处 </a> 的说明操作。
                  <br />
                  <br />
                  如果您希望了解 EloqKV
                  的最新动态，可以提供您的电子邮件和联系方式。
                  如果您不希望接收更新，也可以直接继续下载。
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

export default ContactPage;
