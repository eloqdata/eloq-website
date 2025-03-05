---
title: 配置检查清单
summary: 学习如何快速开始使用 EloqKV 数据库。
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# EloqKV 安装前置条件

`eloqctl` 工具安装和运行在控制节点上,它管理多个 EloqKV 服务器节点。我们将讨论如何在控制节点和服务器节点之间建立信任关系,以及如何调整服务器节点上的一些系统设置以使其更好地运行 EloqKV。

## 建立免密 SSH 和 Sudo

在继续之前,请手动配置控制节点和服务器节点之间的 SSH 互信和免密 sudo:

1. 以 root 用户身份登录控制机器和每台服务器机器。在每台机器上创建 `eloq` 用户账户并设置登录密码:

```
useradd -m eloq && \
passwd eloq
```

2. 要配置免密 sudo,运行以下命令并在每台机器上将 `eloq ALL=(ALL) NOPASSWD: ALL` 行追加到文件末尾:

```
visudo
```

```
eloq ALL=(ALL) NOPASSWD: ALL
```

3. 请确保每台机器上都启用了密码认证和公钥认证。密码认证对于控制机器将公钥复制到 EloqKV 节点的 `authorized_keys` 文件是必需的。而公钥认证则用于 `eloqctl` 在部署过程中执行命令。

要启用这两种认证方式,请编辑 `/etc/ssh/sshd_config` 文件:

```
sudo vi /etc/ssh/sshd_config
```

确保以下两行存在且未被注释:

```
PasswordAuthentication yes
PubkeyAuthentication yes
```

如果你修改了配置,需要重启 sshd 服务:

```
sudo systemctl restart sshd
```

4. 在控制机器上生成 SSH 密钥对:

```
ssh-keygen -t rsa
```

5. 将公钥复制到每个 EloqKV 节点:

```
ssh-copy-id -i ~/.ssh/id_rsa.pub eloq@node1
ssh-copy-id -i ~/.ssh/id_rsa.pub eloq@node2
ssh-copy-id -i ~/.ssh/id_rsa.pub eloq@node3
```

6. 验证免密 SSH 是否工作:

```
ssh eloq@node1 "hostname"
ssh eloq@node2 "hostname"
ssh eloq@node3 "hostname"
```

## 系统设置

在每个 EloqKV 节点上,需要进行以下系统设置:

- 确保 `/etc/resolv.conf` 中配置了 DNS 服务器。
- 确保配置了主机名。
  ```shell
  sudo hostnamectl set-hostname my_hostname
  ```
  编辑 /etc/hosts
  ```shell
  my_ip my_hostname
  ```
- 使用以下命令编辑配置文件 `/etc/sysctl.conf`
  ```shell
  sudo vi /etc/sysctl.conf
  ```
  在相应文件末尾添加以下配置参数
  ```shell
  kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
  ```
- 执行以下命令加载上述参数修改。
  ```shell
  sudo sysctl -p
  ```
- 为了显示当前系统的所有限制资源信息,修改 bash 配置文件
  ```shell
  sudo vi ~/.bashrc
  ```
  在相应文件末尾添加
  ```
  ulimit -c unlimited
  ```
- 添加当前用户和组对 `/var/crash` 文件夹的所有权
  ```shell
  sudo chown -R $USER:$USER /var/crash
  ```
