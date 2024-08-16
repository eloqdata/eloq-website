---
title: Configuration Checklist
summary: Learn how to quickly get started with the EloqSQL database.
---

# Prerequisite of Installing EloqKV

## Preparing the Management Node

The `eloqctl` utility operates on a management server node and is responsible for deploying and managing multiple nodes running EloqKV instances.

### Establish SSH Mutual Trust and Passwordless Sudo Access

Before proceeding, manually configure SSH mutual trust and passwordless sudo between the management node and the EloqKV nodes:

1. Log in to each target machine as the root user. Create the `eloq` user account on each machine and set a login password for this account:

```
useradd eloq && \
passwd eloq
```

2. To configure passwordless sudo, run the following command and append the line `eloq ALL=(ALL) NOPASSWD: ALL` to the end of the file:

```
visudo
```

```
eloq ALL=(ALL) NOPASSWD: ALL
```

3. Log in to the control machine using the `eloq` user, then run the following command. Replace 10.0.0.1 with the IP address of your target machine, and enter the `eloq` user password for the target machine when prompted. Once the command is executed, SSH mutual trust will be established. Repeat this process for other machines as needed. You need to configure SSH mutual trust between the control machine and itself as well.

Note: Newly created `eloq` users do not have a .ssh directory. To create this directory, generate an RSA key using the appropriate command.

```
ssh-keygen -t rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub 10.0.0.1
```

4. Log in to the control machine using the `eloq` user account, and then attempt to log in to the target machine's IP address using SSH. If you can log in without entering a password, SSH mutual trust has been successfully configured.

```
ssh 10.0.0.1
```

```
[eloq@10.0.0.1 ~]$
```

5. After logging in to the target machine as the `eloq` user, run the following command. If everything is fine, then passwordless sudo for the `eloq` user has been successfully configured.

```
sudo ls
```

## System configuration for EloqKV Nodes

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
- Create a user with sudo privilege.
  ```shell
  sudo adduser newuser
  sudo usermod -aG wheel newuser
  sudo visudo
  newuser ALL=(ALL) NOPASSWD: ALL
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
- Configure ssh service in `/etc/ssh/sshd_config`.
  ```shell
  PubkeyAuthentication yes
  AuthorizedKeysFile .ssh/authorized_keys
  ```
  Restart ssh service
  ```shell
  sudo systemctl restart sshd
  ```
- Login the session for the above changes to take effect, then log in again

  ```shell
  log out
  ```
