---
title: 为什么我们选择 C++ 开发 EloqDB
authors: eloq
date: 2024-10-26
tags: [Company]
image: /img/c_old_solid.jpg
description: 了解我们为何选择 C++ 作为 EloqKV 的开发语言，重点关注其在可扩展性、高效性和持久性方面相较于 Rust 和 Go 的优势。
featured: true
blog: true
featuredMain: true
---

我们最近推出了 [EloqKV](/blog/2024/08/16/eloqkv)，这是一个基于创新性 [数据基底](/blog/2024/08/11/data-substrate) 架构构建的分布式数据库产品。在过去几年中，**EloqData** 团队一直在不懈努力开发这款软件，确保它能够满足最高的性能和可扩展性标准。这里我们想分享一个关键细节：EloqKV 的大部分代码是用 C++ 编写的。

<!--truncate-->

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/c_old_solid.jpg').default} alt="EloqKV vs Redis Transaction" />

</div></p>

如果我们在十年前推出这个产品，使用 C++ 会是一个显而易见且不值得一提的选择。然而，现在是 2024 年，形势已经发生了变化。如今，像 [Rust](https://www.rust-lang.org/)、[Zig](https://ziglang.org/) 这样的语言，以及其他类型安全的选项如 [Golang](https://go.dev/) 被认为是现代和流行的系统编程语言。因此，当我们选择 C++，一个可能被一些人视为过时或不够"酷"，甚至容易出错和"不安全"的语言时，人们自然会好奇为什么。

在这篇文章中，我们想分享我们选择 C++ 而不是一些更新、更时髦的语言背后的思考过程，我们从历史中汲取的经验教训，以及我们对未来发展的期望。

## 选择编程语言很重要

对于任何软件项目来说，选择正确的编程语言都至关重要，但对于像数据库这样的复杂系统软件来说，这一选择变得更加重要。语言的选择会影响各个方面，包括性能、开发便利性和可维护性。在效率和可靠性至关重要的领域，编程语言是整个系统构建的基础。

对于数据库而言，这个选择的影响更为深远。数据库必须能够处理海量数据，同时提供快速的查询响应并确保数据完整性。这些要求需要一种不仅在性能上出色，而且能够支持可扩展和高效开发实践的语言。此外，数据库通常需要经过数十年的持续开发和增强，这使得可维护性成为一个关键因素。一个选择得当的语言可以简化软件功能的更新和扩展过程，确保它在不断发展的技术环境中保持相关性和有效性。

以 [Hadoop](https://hadoop.apache.org/) 大数据技术栈为例，它主要建立在 [Java 虚拟机 (JVM)](https://en.wikipedia.org/wiki/Java_virtual_machine) 之上。虽然 Java 和 JVM 生态系统一直是最受欢迎的编程语言家族之一，并因其可移植性和丰富的功能而备受赞誉，但回顾过去，这个选择可能并非没有争议。JVM 的性能和内存开销，特别是与垃圾收集相关的问题，给开发者带来了诸多挑战。事实上，[RedPanda](https://www.redpanda.com/) 和 [ScyllaDB](https://www.scylladb.com/) 就是从头开始用 C++ 重写成熟、广泛使用的基于 Java 的框架 —— Kafka 和 Cassandra 的典型例子，目的就是为了避免 JVM 的性能损失。

另一个重要的考虑因素是编程语言的普及程度和熟悉该语言的开发者的可用性。例如，[Spark](https://spark.apache.org/) 和 [Kafka](https://kafka.apache.org/) 是用 [Scala](https://www.scala-lang.org/) 开发的，而 [Couchbase](https://www.couchbase.com/) 和 [Rabbitmq](https://www.rabbitmq.com/) 则使用 [Erlang](https://www.erlang.org/)。尽管这些语言提供了强大的功能和能力，但它们并没有像其他编程语言那样被广泛采用。这种相对较低的普及度可能会在大规模开发者参与和寻找有经验的程序员方面带来挑战。工具链支持通常也不如更流行的编程语言。使用较少见的语言可能会增加招聘人才的难度，减缓开发进程，并限制社区对故障排除和创新的支持。

到 2010 年代后期，Rust 已成为开发数据库软件的主要编程语言之一。像 [TiDB](https://www.pingcap.com/)、[RisingWave](https://risingwave.com/)、[DataFusion](https://datafusion.apache.org/) 和 [NeonDB](https://neon.tech/) 这样的新项目都是利用 Rust 的能力来构建高效和高质量数据库的突出例子。值得注意的是，RisingWave 甚至发表了一篇[博客文章](https://risingwave.com/blog/building-a-cloud-database-from-scratch-why-we-moved-from-c-to-rust/)，详细说明了他们放弃十个月的 C++ 工作，重写整个代码库到 Rust 的决定。考虑到 **EloqData** 是在 2021 年左右开始其旅程的，当时 Rust 已经确立为一个用于构建安全和高性能数据库的强大编程语言，人们可能会好奇为什么我们选择了 C++。

## 在 2024 年用 C++ 从头构建数据库

当我们开始这个项目时，我们清楚地意识到 Rust 是构建数据库基础的一个极具竞争力的语言。我们最终选择 C++ 是基于三个主要因素。

C/C++ 的第一个优势在于其数据库生态系统支持。大多数现有和流行的数据库都是用 C/C++ 开发的，这提供了大量我们可以利用的资源和创新。我们的**数据基底**技术旨在创建一个统一的、模块化的架构，可以利用这些现有资源，同时避免重新发明轮子。虽然 Rust 提供了良好的 C/C++ 互操作性，但其内存管理模型和某些安全限制可能会使与许多既有项目的集成变得复杂。

C++ 的另一个优势是其对基础库的广泛支持。由于大多数操作系统和底层驱动程序都是用 C 或 C++ 编写的，这些语言的绑定通常是原生的且最受支持的 API。面向性能的 IO 和网络库，如 [DPDK](https://www.dpdk.org/)、[RDMA](https://en.wikipedia.org/wiki/Remote_direct_memory_access) 和 [liburing](https://github.com/axboe/liburing)，以及内存管理工具如 [mimalloc](https://github.com/microsoft/mimalloc)，都是用 C/C++ 开发并提供原生支持的。相比之下，其他语言通常需要额外的层来有效利用这些库。我们预计这种趋势将继续，新的硬件和操作系统抽象将首先且主要支持 C/C++。

C++ 的第三个优势是其长寿性和成熟的工具链。基础设施软件通常需要在几十年内持续更新和改进。例如，[Oracle Database](https://en.wikipedia.org/wiki/Oracle_Database) 已有超过 45 年的历史，而 [MySQL](https://en.wikipedia.org/wiki/MySQL) 和 [PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL) 也已存在约 30 年。即使是相对较新的系统，如 [Cassandra](https://cassandra.apache.org/)、[MongoDB](https://www.mongodb.com/) 和 [Redis](https://redis.io/) 也已有超过 15 年的历史。要开发一个可靠的基础设施解决方案，我们需要准备好维护代码库可能长达半个世纪。在这么长的时间里，技术世界可能发生很大的变化 —— 想想 20 年前，[Perl](https://www.perl.org/) 是一个非常流行的语言，而 [Delphi 的使用率比 Python 还高](https://observablehq.com/@mbostock/most-popular-programming-languages-2004-2021)。

在构建长期存在的软件时，考虑编程语言的长期生存能力至关重要，比如编译器的持续改进、最新的库开发，以及现代 IDE、调试器和分析器的支持。在这方面，C++ 是一个更安全的选择。它悠久的历史、活跃的开发社区和经过时间考验的韧性让我们相信它在未来几十年内将继续保持相关性和良好的支持。

当然，与许多现代语言相比，C++ 也带来了一些可能带来挑战的遗留问题。要在 C++ 项目上最大化生产力需要一定程度的纪律。虽然我们不会详细阐述我们实施的众多最佳实践来缓解 C++ 的一些缺点 —— 因为这些在其他地方已经有[广泛](https://google.github.io/styleguide/cppguide.html)的[讨论](https://github.com/cpp-best-practices/cppbestpractices)和[记录](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) —— 但我们承认，有效使用这门语言需要对编码标准和测试方法论的强烈承诺。特别是，反对使用 C++ 最严厉的论点，即内存不安全性，在使用某些现代 C++ 语言子集进行开发时可以得到显著缓解。

## 展望未来

在 **EloqData**，我们强烈坚持模块化设计理念，因为我们致力于构建一个能够支持数十年持续改进的持久系统。我们认识到有效的 API 接口设计对于提高软件开发生产力和可维护性至关重要。这一原则不仅体现在**数据基底**的整体架构中，它能够容纳各种查询和存储引擎，而且也贯穿于我们的整个软件开发过程。我们预计创新将继续涌现 —— 比如改进的内存分配器、更高效的 RPC 库和优化的哈希表实现 —— 我们的目标是在未来这些创新出现时能够利用它们。

在我们的项目中，在适当的时候尝试其他编程语言对我们来说相对简单。我们很乐意在合适的情况下用像 Rust 这样的类型安全语言来替换某些模块。Rust 是一门出色的语言，在系统社区有着强大的追随者，我们计划在未来的许多项目中更多地使用它。

与许多强调快速迭代、快速反馈循环和快速原型设计的创业公司不同，**EloqData** 采取了不同的方法。我们更加强调从一开始就把事情做对，以避免未来的技术债务。虽然这种关注可能会让我们稍微慢一点，但我们相信这是一个必要的投资。然而，值得注意的是，如果产品和技术本身缺乏可行的未来，避免未来的债务是徒劳的。最终，我们是否做出了正确的选择需要时间来验证。无论如何，我们为我们做出的决定感到自豪，并期待看到我们的努力如何帮助客户解决他们最具挑战性的数据问题。
