---
title: 部署前配置
summary: 了解如何快速上手使用 MonoGraphDB 数据库。
---

# EloqSQL 部署前环境准备

## 软硬件要求

- 硬件配置: 建议计算和存储节点 CPU 32 物理核以上，内存 64GB 以上。日志节点推荐 3 块以上 SSD 磁盘，CPU 4 物理核以上。日志>节点支持和计算节点联合部署。
- 推荐安装 Ubuntu2004 操作系统，支持 CentOS7，CentOS Stream 8。
- 运行环境需要接入互联网访问，用于下载 EloqSQL 及其相关依赖。**注意:单机请使用 127.0.0.1。不能使用 localhost**

## 部署前配置

1. 系统配置

- 使用下面的命令编辑系统配置文件`/etc/security/limits.conf`
  ```shell
  sudo vi /etc/security/limits.conf
  ```
  在相应的文件末尾添加如下的资源限制参数
  ```shell
  * soft nofile 524288
  * hard nofile 524288
  * hard core unlimited
  * soft core unlimited
  ```
- 使用如下的命令编辑配置文件`/etc/sysctl.conf`
  ```shell
  sudo vi /etc/sysctl.conf
  ```
  在相应的文件末尾添加如下配置参数
  ```shell
  kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
  ```
- 执行如下的命令，载入上述的参数修改。
  ```shell
  sudo sysctl -p
  ```
- 为了显示当前系统所有的 limit 资源信息，修改 bash 配置文件
  ```shell
  sudo vi ~/.bashrc
  ```
  在相应的文件末尾添加
  ```
  ulimit -c unlimited
  ```
- 添加当前用户及组对于`/var/crash`文件夹的所有权
  ```shell
  sudo chown -R $USER:$USER /var/crash
  ```
- 重新登陆会话，使得上述的更改生效,然后再次登陆
  ```shell
  logout
  ```
- Ubuntu18.04 需要额外安装 gcc11
  ```shell
  sudo apt update
  sudo apt install software-properties-common -y
  sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
  sudo apt update
  sudo apt install gcc-11 g++-11 -y
  ```
- Centos8 需要额外安装 openssl10
  ```shell
  sudo dnf makecache --refresh
  sudo dnf -y install compat-openssl10
  ```

2. 网络配置
   `ssh`服务配置，用户首先需要在自己的系统上安装好相应的`ssh`服务，`ssh`服务需要有`ssh`客户端以及`ssh`服务端的支持。

- 检查 ssh、sshd 客户端是否已经安装

  ```shell
  which ssh
  which sshd
  ```

  正常情况下，用户如果上述的命令没有输出，则说明相应的服务没有安装。用户需要安装相应的 ssh 服务并且进行相应 ssh 服务的开启

- centos 安装 ssh 服务并开启
  ```shell
  ## 安装ssh客户端与服务端
  sudo yum –y install openssh-server openssh-clients
  ## 开启ssh服务
  sudo systemctl start sshd
  ## 开启ssh服务并使得系统重启后自动启动ssh服务
  sudo systemctl enable sshd
  ```
- ubuntu 安装 ssh 服务并开启

  ```shell
  ##  安装ssh客户端与服务端
  sudo apt-get install openssh-server
  ## 开启ssh服务
  sudo service ssh start
  ```

- 为了使得每个节点都可以通过公钥登陆到其他的节点，在本地需要生成自己的公钥

  > **注意：**
  > 注意此处使用的是 ed25519 加密签名算法，相比于普通的 RSA 签名算法，其更快、更安全，字节数更短。

  ```bash
  ssh-keygen -t ed25519 -f ~/.ssh/ed25519_mono
  ```

  运行上面的命令后会出现一系列提示，可以一路回车，其中有一个问题是，要不要对私钥设置口令（`passphrase`），如果担心私钥的安全，可以自行设置。
  运行结束后，会在$HOME/.ssh 目录下生成两个文件，一个是私钥文件`id_ed25519`，一个是公钥文件`id_ed25519.pub`

- 生成的公钥`id_ed25519.pub`添加到 authorized_keys
  ```shell
  cat ~/.ssh/ed25519_mono.pub >> ~/.ssh/authorized_keys
  ssh-keyscan -H 127.0.0.1 >> ~/.ssh/known_hosts
  ```
- 给 ssh 目录设置权限
  ```shell
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
