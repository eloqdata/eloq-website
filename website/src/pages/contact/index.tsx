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
            <h1>GETTING IN TOUCH</h1>
            <p>
              Please reach out to us if you have any questions regarding sales,
              support, or general inquiries!
            </p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Chat with Us</h2>
                <p>
                  Feel free to chat with us on{" "}
                  <a
                    href="https://www.eloqdata.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="red-link"
                  >
                    Discord
                  </a>{" "}
                  for any inquiries, sales, product demos, information, or
                  support.
                </p>
              </div>
              <div className="info-section">
                <h2>Contact Form</h2>
                <p>
                  For all other inquiries, please fill out this contact form,
                  and we will get back to you within one business day.
                </p>
              </div>
            </div>
            <div className="form-panel">
              <form
                action="https://getform.io/f/bmdpkgja"
                method="POST"
                className="contact-form"
              >
                <label className="required">
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    name="name"
                  />
                </label>
                <label className="required">
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name="email"
                  />
                </label>
                <label>
                  Company:
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    name="company"
                  />
                </label>
                <label className="required">
                  Message:
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                    name="message"
                  ></textarea>
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
