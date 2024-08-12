---
title: Configuration Checklist
summary: Learn how to quickly get started with the EloqSQL database.
---

# Prerequisite of Installing EloqKV

## System configuration

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
