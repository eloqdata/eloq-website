import React from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./ContactPage.css"; // Create and import your CSS file
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

  return (
    <Layout title="Contact Us">
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>我们很乐意听取您的意见</h1>
            <p>如果您有任何问题或建议，请随时与我们联系！</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>与我们交谈</h2>
                <p>
                  欢迎在{" "}
                  <a
                    href="https://discord.gg/nmYjBkfak6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="red-link"
                  >
                    Discord
                  </a>{" "}
                  上与我们交流
                </p>
              </div>
              <div className="info-section">
                <h2>填写表单</h2>
                <p>
                  如有任何咨询，请填写此联系表，或直接发送电子邮件至{" "}
                  <a href="mailto:contact@eloqdata.com">contact@eloqdata.com</a>
                  。 我们会尽快回复您。
                  <br />
                  <br />
                  如果您想了解 EloqKV
                  的最新发展，也可以提供您的电子邮件和联系信息，并将消息框留空。
                </p>
              </div>
            </div>
            <div className="form-panel">
              <form
                action="https://getform.io/f/bmdpkgja"
                method="POST"
                className="contact-form"
              >
                <label className="required">姓名:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  name="name"
                />
                <label className="required">电子邮件:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  name="email"
                />
                <label>公司:</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  name="company"
                />
                <label>留言:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  name="message"
                ></textarea>
                <button type="submit">提交</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
