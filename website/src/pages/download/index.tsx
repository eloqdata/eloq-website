import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import FormField from "@site/src/components/FormField";
import "./DownloadPage.css";

interface ProductFeatures {
  [key: string]: {
    title: string;
    version: string;
    kvtype: string;
    storageTypes: Array<{
      value: string;
      label: string;
    }>;
    features: Array<{
      value: string;
      label: string;
    }>;
  };
}

const productFeatures: ProductFeatures = {
  eloqkv: {
    title: "EloqKV",
    version: "0.8.18",
    kvtype: "rocksdb",
    storageTypes: [
      {
        value: "rocksdb",
        label: "RocksDB",
      },
      {
        value: "rocks_s3",
        label: "RocksCloud",
      },
    ],
    features: [
      {
        value: "pure-cache",
        label: "High Performance Distributed Cache",
      },
      {
        value: "persistent-cache",
        label: "Cache with Persistent Storage",
      },
      {
        value: "transactional-db",
        label: "Transactional Key Value Database",
      },
    ],
  },
  eloqsql: {
    title: "EloqSQL",
    version: "0.4.14",
    kvtype: "cassandra",
    storageTypes: [
      {
        value: "cassandra",
        label: "Cassandra",
      },
    ],
    features: [
      {
        value: "mysql-compatible",
        label: "MySQL Compatible API",
      },
      {
        value: "distributed-sql",
        label: "Multiple Writers",
      },
      {
        value: "acid-transactions",
        label: "Elasticity and Scalability",
      },
    ],
  },
  eloqdoc: {
    title: "EloqDoc",
    version: "v0.2.1",
    kvtype: "cassandra",
    storageTypes: [
      {
        value: "rocks_s3",
        label: "RocksCloud",
      },
    ],
    features: [
      {
        value: "MongoDB API compatible",
        label: "MongoDB Compatible API",
      },
      {
        value: "document-store",
        label: "Elastic and Scalability",
      },
      {
        value: "acid-transactions",
        label: "ACID Transactions",
      },
    ],
  },
};

const EloqDBDownloadPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("eloqkv");
  const [selectedStorageType, setSelectedStorageType] =
    useState<string>("rocksdb");
  const [storageTooltipVisible, setStorageTooltipVisible] = useState(false);

  const triggerDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const os_type = (document.getElementById("os_type") as HTMLSelectElement)
      .value;
    const arch_type = (
      document.getElementById("arch_type") as HTMLSelectElement
    ).value;
    const product = productFeatures[selectedProduct];

    const downloadUrl = `https://download.eloqdata.com/${selectedProduct}/${selectedStorageType}/${selectedProduct}-${product.version}-${os_type}-${arch_type}.tar.gz`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute(
      "download",
      `${selectedProduct}-${product.version}-${os_type}-${arch_type}.tar.gz`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Collect form data
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "aabaace1-59e8-471d-9dbe-352665e8efcd");

    // Create a custom subject
    const subject = `User Downloaded EloqData Software`;

    // Append the custom subject to the form data
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
      console.log("Form submission successful");
    }
  };

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

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProduct = event.target.value;
    setSelectedProduct(newProduct);
    // Set default storage type for the selected product
    setSelectedStorageType(productFeatures[newProduct].storageTypes[0].value);
  };

  const handleStorageTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedStorageType(event.target.value);
  };

  const showStorageTooltip = () => {
    setStorageTooltipVisible(true);
  };

  const hideStorageTooltip = () => {
    setStorageTooltipVisible(false);
  };

  const getProductDescription = () => {
    switch (selectedProduct) {
      case "eloqkv":
        return "Download a binary tarball to easily explore our groundbreaking KV database.";
      case "eloqsql":
        return "Download a binary tarball to explore our MySQL-compatible distributed SQL database.";
      case "eloqdoc":
        return "Download a binary tarball to explore our MongoDB-compatible document database.";
      default:
        return "";
    }
  };

  return (
    <Layout title={`Download ${productFeatures[selectedProduct].title}`}>
      <div className="contact-page-container">
        <div className="contact-page">
          <div className="top-description">
            <h1>
              DOWNLOAD {productFeatures[selectedProduct].title}
              {selectedProduct !== "eloqkv" && (
                <sup style={{ fontSize: "0.3em", verticalAlign: "1.7em" }}>
                  preview
                </sup>
              )}
            </h1>
            <p>{getProductDescription()}</p>
          </div>
          <div className="content">
            <div className="info-panel">
              <div className="info-section">
                <h2>Discover {productFeatures[selectedProduct].title}</h2>
                <p>
                  {getProductDescription()} To get started, follow the{" "}
                  <a href={`/${selectedProduct}/install-from-binary`}>
                    {" "}
                    Quick Start{" "}
                  </a>
                  guide.
                  {(selectedProduct === "eloqkv" ||
                    selectedProduct === "eloqsql") && (
                    <>
                      <br />
                      <br />
                      If you're interested in a more in-depth experience, we
                      recommend trying our
                      <a href="/downloadeloqctl"> Eloqctl </a> tool to deploy a
                      cluster.
                    </>
                  )}
                  <br />
                  <br />
                  If you'd like to stay informed about the exciting developments
                  of {productFeatures[selectedProduct].title}, you can provide
                  your email and contact information. However, if you prefer not
                  to receive updates, feel free to continue without any
                  obligations.
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
                <label htmlFor="product_type" className="required">
                  Product:
                </label>
                <select
                  id="product_type"
                  name="product_type"
                  value={selectedProduct}
                  onChange={handleProductChange}
                  required
                >
                  <option value="eloqkv">EloqKV</option>
                  <option value="eloqsql">EloqSQL</option>
                  <option value="eloqdoc">EloqDoc</option>
                </select>

                <label htmlFor="storage_type" className="required">
                  Storage Type:
                  <div className="tooltipContainer">
                    <span
                      className="infoIcon"
                      onMouseEnter={showStorageTooltip}
                      onMouseLeave={hideStorageTooltip}
                    >
                      i
                    </span>
                    {storageTooltipVisible && (
                      <div className="tooltip">
                        Select the storage engine that fits your environment.
                        {"\n\n"}• RocksDB: for on-prem deployments{"\n"}•
                        RocksCloud: for cloud-native setups backed by object
                        storage
                      </div>
                    )}
                  </div>
                </label>
                <select
                  id="storage_type"
                  name="storage_type"
                  value={selectedStorageType}
                  onChange={handleStorageTypeChange}
                  required
                >
                  {productFeatures[selectedProduct].storageTypes.map(
                    (storageType) => (
                      <option key={storageType.value} value={storageType.value}>
                        {storageType.label}
                      </option>
                    )
                  )}
                </select>

                <label htmlFor="os_type" className="required">
                  Operating System:
                </label>
                <select id="os_type" name="os_type" required>
                  <option value="" disabled selected>
                    Please Choose OS Type
                  </option>
                  {selectedProduct === "eloqkv" && (
                    <>
                      <option value="rhel7">RHEL 7</option>
                      <option value="rhel8">RHEL 8</option>
                    </>
                  )}
                  {(selectedProduct === "eloqkv" ||
                    selectedProduct === "eloqsql") && (
                    <option value="rhel9">RHEL 9</option>
                  )}
                  <option value="ubuntu20">Ubuntu 20.04</option>
                  <option value="ubuntu22">Ubuntu 22.04</option>
                  <option value="ubuntu24">Ubuntu 24.04</option>
                </select>

                <label htmlFor="arch_type" className="required">
                  CPU Architecture:
                </label>
                <select id="arch_type" name="arch_type" required>
                  <option value="" disabled selected>
                    Please Choose CPU Arch
                  </option>
                  <option value="amd64" selected>
                    x86_64
                  </option>
                  <option value="arm64" disabled>
                    arm64
                  </option>
                </select>

                <label htmlFor="download-reason">
                  Which feature of {productFeatures[selectedProduct].title}{" "}
                  interests you the most?
                </label>
                <div id="download-reason">
                  {productFeatures[selectedProduct].features.map((feature) => (
                    <div className="checkbox-option" key={feature.value}>
                      <input
                        type="checkbox"
                        name="download-reason"
                        value={feature.value}
                      />
                      {feature.label}
                    </div>
                  ))}
                </div>

                <label htmlFor="company">Company:</label>
                <input type="text" id="company" name="company" />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" />

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

export default EloqDBDownloadPage;
