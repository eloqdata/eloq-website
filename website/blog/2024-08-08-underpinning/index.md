---
title: Introduction to Data Substrate (Part 1 of 3)
authors: eloq
date: 2024-08-08
tags: [Company]
---

# The Case for a Common Underpinning for Modern DataBases

This is the first part of a 3 part introduction to Data Substrate. You can find the other two parts [here](/blog/2024/08/09/landscape) and [here](/blog/2024/08/11/data-substrate). In this blog, we review some of the history of DBMS systems.

<!--truncate-->

In the early days of computing, data was primarily stored in plain files and processed using custom programs. Managing and extracting insights from these files was challenging and time-consuming. As organizations began to collect and generate more data, the limitations of file-based data management became increasingly apparent. To address these challenges, [relational database management systems (RDBMS)](https://en.wikipedia.org/wiki/Relational_database) were developed in the 1970s. These systems introduced a structured way to store and manage data, ensuring consistency, integrity, and ease of access. The introduction of RDBMS marked a significant milestone in data management, providing a robust solution that has endured over time.

RDBMS utilized a tabular data structure, organizing data into rows and columns. They also offered consistency guarantees, known as the ACID properties, which were crucial for managing data reliably. Additionally, the development of [Structured Query Language (SQL)](https://en.wikipedia.org/wiki/SQL) revolutionized how users interacted with databases. SQL provided a standardized way to query, insert, update, and delete data, making database management accessible to a broader range of users and applications. For over two decades, RDBMS and SQL dominated the world of data management, becoming the backbone of many critical systems and applications.

However, as internet usage grew and data-driven applications became more prevalent in the late 1990s and early 2000s, the landscape began to shift. In 2005, Mike Stonebraker, a pioneer of early RDBMS and later a Turing Award winner, published an influential paper titled ["One Size Does Not Fit All"](https://cs.brown.edu/~ugur/fits_all.pdf) alongside his collaborators. This work challenged the dominance of the one-size-fits-all approach that had characterized data management for decades. The paper argued that traditional RDBMS, while effective for many years, was not optimal for the emerging variety of data workloads, such as streaming data and advanced analytics. Stonebraker and his team suggested that purpose-built database systems would be needed to meet the performance and flexibility demands of these new data-intensive applications.

The impact of this paper was profound. It sparked a wave of innovation and research in the database community, leading to the development of numerous specialized database systems. These new systems were designed to handle specific types of workloads more efficiently than traditional RDBMS. Under the umbrella of NoSQL, these databases either traded off strict ACID properties to achieve better scalability or deviated from the traditional table-based data model to handle other data types, such as graphs or documents.

This period also saw significant commercialization of these new technologies. Companies began adopting purpose-built databases to better address their specific data challenges, resulting in a more diverse and fragmented database landscape. This shift underscored the importance of using the right tool for the right job, enabling more efficient and effective data management solutions. As Dr. Werner Vogels, CTO of AWS, [noted](https://www.allthingsdistributed.com/2018/06/purpose-built-databases-in-aws.html), cloud providers now offer a myriad of purpose-built database products to meet the needs of their customers.

The database landscape has evolved significantly, leading to a highly complex environment. As illustrated in a [graph](https://a16z.com/wp-content/uploads/2023/04/Unified-Data-Infrastructure-2.0-1.png) from Andreessen Horowitz's article on [emerging architectures for modern data infrastructure](https://a16z.com/emerging-architectures-for-modern-data-infrastructure/), the modern data pipeline now consists of numerous specialized components, each designed to handle specific tasks. This fragmentation has created a maze of tools and systems that users must navigate to manage their data effectively.

This complexity presents significant challenges for users. Understanding and managing data across various systems can be daunting, particularly as data becomes increasingly valuable in the AI era. As organizations generate more data, the ability to harness and utilize it efficiently becomes crucial. However, the current fragmented approach complicates data integration, governance, and utilization, making it harder for organizations to fully leverage their data.

The complexity of modern data pipelines is not just an isolated observation by us—it is widely recognized across the industry. For instance, in an [article](https://medium.com/koalabs/one-size-does-not-fit-all-in-database-systems-true-in-early-2000s-now-we-have-the-opposite-d41146bc6693) by the former CEO of Vertica, a database company co-founded by Stonebraker that specialized for analytical workloads, the current situation is described as the opposite of the early 2000s, with the proliferation of specialized database systems creating a fragmented and challenging landscape.

In our next series of articles, we will introduce a new concept called "Data Substrate." This innovative approach aims to address the challenges posed by the current fragmented database landscape. By providing a unified architecture, the Data Substrate will simplify data management, enhance efficiency, and unlock the full potential of your data. Stay tuned for an in-depth exploration of this transformative concept.
