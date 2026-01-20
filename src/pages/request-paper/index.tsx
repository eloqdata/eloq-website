import React from "react";
import Layout from "@theme/Layout";
import "../contact/ContactPage.css";
import { useState } from "react";

const RequestPaperPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [company, setCompany] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedCompany = company.trim();
        const trimmedMessage = message.trim();

        const formData = new FormData();
        formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");
        formData.append("subject", "Request: EloqData Distributed Database Paper");
        formData.append("name", trimmedName);
        formData.append("email", trimmedEmail);
        formData.append("message", trimmedMessage);

        if (trimmedCompany) {
            formData.append("company", trimmedCompany);
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Form submission failed. Please try again later.");
            }

            setName("");
            setEmail("");
            setCompany("");
            setMessage("");

            window.location.href = "/request-paper/submitted";
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout title="Request the Paper">
            <div className="contact-page-container">
                <div className="contact-page">
                    <div className="top-description">
                        <h1>Request the EloqData Paper</h1>
                        <p>
                            Learn how EloqData builds a truly distributed database without sacrificing
                            performance.
                        </p>
                    </div>
                    <div className="content">
                        <div className="info-panel">
                            <div className="info-section">
                                <h2>Get the Paper</h2>
                                <p>
                                    Fill out the form to receive the EloqData paper on how we build a
                                    truly distributed database without sacrificing performance.
                                </p>
                                <p>
                                    To learn our Data Substrate Architecture, refer to the{" "}
                                    <a href="/blog/2025/07/14/technology">blog</a>.
                                </p>
                            </div>
                            <div className="info-section">
                                <h2>Questions?</h2>
                                <p>
                                    If you have any questions about the paper, email us at{" "}
                                    <a href="mailto:contact@eloqdata.com">contact@eloqdata.com</a>.
                                </p>
                            </div>
                        </div>
                        <div className="form-panel">
                            <form className="contact-form" onSubmit={handleSubmit}>
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
                                <label>
                                    Message:
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={5}
                                        required
                                        name="message"
                                    ></textarea>
                                </label>
                                {error && <p className="form-status error">{error}</p>}
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RequestPaperPage;

