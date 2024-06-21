---
title: Prerequisite of Installing EloqKV
summary: Learn how to quickly get started with the EloqSQL database.
---

# Prerequisite of Installing EloqKV

## System configuration

Below are some necessary configurations to be made before installing EloqKV

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
- login the session for the above changes to take effect, then log in again

  ```shell
  log out
  ```
