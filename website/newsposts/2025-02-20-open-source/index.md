---
title: EloqData Goes Open Source
authors: eloq
date: 2025-02-20
tags: [Product, Open Source]
image: /img/blog/opensource.jpg
description: EloqData announces the open-source release of EloqKV, EloqSQL, and EloqDoc, making our high-performance distributed database solutions available to the community.
---

We are thrilled to announce that **EloqData** is open-sourcing our core products: **EloqKV**, **EloqSQL**, and **EloqDoc**, as well as the revolutionary technology underpinning of these product - our Data Substrate component. This marks a significant milestone in our journey to build a more open and collaborative database ecosystem.

<!--truncate-->

## Our Open Source Journey

Open source has become a cornerstone for database and cloud infrastructures, driving innovation and collaboration across the industry. By providing transparent and accessible code, open source projects like PostgreSQL and MySQL, the Hadoop Big Data Stack, the Spark ecosystem, as well as numerous other projects have revolutionized the way databases are developed, maintained, managed and deployed. These open source projects have not only reduced costs but also fostered a community-driven approach to problem-solving, leading to rapid advancements and widespread adoption. More importantly, these projects inspired a great number of aspiring students, researchers, developers and entrepreneurs to collectively pushing the frontier of data management technologies forward.

We at EloqData have benefited tremendously from open source. We learnt our chops by studying open source projects, developed our product with open source tool chains, and leverage open source projects to enhance and complement the features of our commercial products.

The Data Substrate Architecture is specifically designed to work with open source projects. Data Substrate is a modular, pluggable architecture that can leverage existing open source projects to provide better database solutions without reinventing the wheel. We stand on the shoulders of the giants. By leveraging existing code base, we can significantly reduce the development cost and eliminate API incompatibility.

Today, we're taking a major step by making our database solutions available to the open-source community. We are glad to announce that we are open sourcing some of the key components of Data Substrate, to embrace and benefit from the community. Moreover, we are releasing the code base for EloqKV, EloqSQL and EloqDoc – three major products built on top of the Data Substrate technology that implement the Redis API, MySQL API and Mongo API respectively. Included in the source are modifications to existing code bases from other open-source projects to make them work with our Data Substrate. We believe that innovation thrives through collaboration, and we're excited to work with developers worldwide to build better database solutions.

## What's Being Open Sourced?

### EloqKV

A high-performance distributed transactional database with Redis API compatibility. EloqKV offers:

- Redis API compatibility
- Full ACID transaction support
- Vertical & Horizontal scalability
- Cross Node Lua Scripting
- Auto-tiering between memory and storage

### EloqSQL

A MySQL-compatible distributed SQL database that provides:

- Distributed SQL processing
- MySQL/MariaDB wire protocol compatibility
- Strong consistency
- Horizontal scalability with multiple writer

### EloqDoc

A MongoDB-compatible document store featuring:

- Document-oriented storage
- MongoDB query language support
- Decoupled storage and compute architecture
- Flexible schema design

## Getting Started

All our products are now available on GitHub. You can find our repositories at:

- EloqKV: [https://github.com/eloqdata/eloqkv](https://github.com/eloqdata/eloqkv)
- EloqSQL: [https://github.com/eloqdata/eloqsql](https://github.com/eloqdata/eloqsql)
- EloqDoc: [https://github.com/eloqdata/eloqdoc](https://github.com/eloqdata/eloqdoc)

## Join Our Community

We invite developers, contributors, and database enthusiasts to:

- Star our repositories
- Try out our products
- Report issues
- Submit pull requests
- Join our discussions

## What's Next?

This is just the beginning. We are committed to:

- Building a vibrant open-source community
- Accepting contributions from the community
- Providing comprehensive documentation
- Ensuring regular releases and updates

We believe that by open-sourcing our products, we can accelerate innovation in the database space and help developers build better applications.

Stay tuned for more updates, and don't forget to star our repositories on GitHub!

## Resources

- [GitHub Repository](https://github.com/eloqdata/eloqkv)
- [Documentation](https://www.eloqdata.com/eloqkv/introduction)
- [Community Forum](https://eloqdata.discourse.group/)
