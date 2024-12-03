---
title: Configuration Checklist
summary: Learn how to quickly get started with the EloqSQL database.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Prerequisite of Installing EloqKV

The `eloqctl` utility is installed and operated on a control node, it manages several EloqKV server nodes. We discuss how to establish trust between control node and the server nodes,
and some system setting adjustments on the server nodes to make them run EloqKV better.

## Establish Passwordless SSH and Sudo

Before proceeding, please manually configure SSH mutual trust and passwordless sudo between the control node and the server nodes:

1. Log in on control machine and each server machine as the root user. Create the `eloq` user account on each machine and set a login password:

```
useradd -m eloq && \
passwd eloq
```

2. To configure passwordless sudo, run the following command and append the line `eloq ALL=(ALL) NOPASSWD: ALL` to the end of the file on each machine:

```
visudo
```

```
eloq ALL=(ALL) NOPASSWD: ALL
```

3. Please ensure that both password authentication and public key authentication are enabled on each machine. Password authentication is necessary for the control machine to copy the public key to the `authorized_keys` file of the EloqKV nodes. Public key authentication, on the other hand, is used by the `eloqctl` tool to deploy EloqKV clusters. You can verify and configure these settings in the SSH configuration file as follows:

```
sudo vi /etc/ssh/sshd_config
```

Ensure the following line is set (uncomment if necessary):

```
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

Restart the SSH service to apply the changes:

<Tabs
groupId="language"
defaultValue="rhel"
values={[
{ label: 'Rhel', value: 'rhel', },
{ label: 'Ubuntu', value: 'ubuntu', }
]
}>

<TabItem value="rhel">
```shell
sudo systemctl restart sshd
```
</TabItem>

<TabItem value="ubuntu">
```shell
sudo systemctl restart ssh
```
</TabItem>
</Tabs>

4. Log in to the control machine as the `eloq` user, generate an SSH key, and configure SSH mutual trust between the control machine and itself. Note that password should be skipped when running `ssk-keygen`.

```
ssh-keygen -t rsa
cat .ssh/id_rsa.pub >> .ssh/authorized_keys
```

Please check permissions on .ssh directory.

```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

```

5. Configure SSH mutual trust between the control machine and the server machines. Replace 10.0.0.1 with the IP address of your target machine, and enter the `eloq` user password for the target machine when prompted. Once the command is executed, SSH mutual trust will be established. Repeat this process for each EloqKV machine.

```
ssh-copy-id -i ~/.ssh/id_rsa.pub 10.0.0.1
```

6. Log in to the control machine using the `eloq` user account, and then attempt to log in to the target machine's IP address using SSH. If you can log in without entering a password, SSH mutual trust has been successfully configured.

```
ssh 10.0.0.1
```

```
eloq@10.0.0.1:~$
```

## System configuration for EloqKV Server Nodes

Below are some necessary configurations to be made before installing EloqKV

- Ensure your system is connected to the network and can update its package repositories using `yum update` or `apt update`.
- Edit the system configuration file `/etc/security/limits.conf or /etc/security/limits.d/20-nproc.conf` using the following command
  ```shell
  sudo vi /etc/security/limits.conf
  ```
  Add the following resource limit parameters at the end of the corresponding file
  ```shell
  * soft nofile 524288
  * hard nofile 524288
  * hard core unlimited
  * soft core unlimited
  ```
- Ensure DNS server is configured in `/etc/resolv.conf`.
- Ensure hostname is configured.
  ```shell
  sudo hostnamectl set-hostname my_hostname
  ```
  Edit /etc/hosts
  ```shell
  my_ip my_hostname
  ```
- Use the following command to edit the configuration file `/etc/sysctl.conf`
  ```shell
  sudo vi /etc/sysctl.conf
  ```
  Add the following configuration parameters at the end of the corresponding file
  ```shell
  kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
  ```
- Execute the following command to load the above parameter modification.
  ```shell
  sudo sysctl -p
  ```
- In order to display all limit resource information of the current system, modify the bash configuration file
  ```shell
  sudo vi ~/.bashrc
  ```
  Add at the end of the corresponding file
  ```
  ulimit -c unlimited
  ```
- Add current user and group ownership to `/var/crash` folder
  ```shell
  sudo chown -R $USER:$USER /var/crash
  ```
