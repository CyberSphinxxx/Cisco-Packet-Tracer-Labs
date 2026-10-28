# Verification & Packet Tracer Assembly Guide: PTL-0008

**Lab ID:** `PTL-0008`  
**Lab Title:** Cisco IOS Navigation and Initial Device Configuration  
**Category:** `network-fundamentals`  
**Difficulty:** Beginner  

---

## 1. Physical & Packet Tracer Assembly Manifest

To construct this activity in Cisco Packet Tracer:

### Device Hardware & Module Schedule
| Device Role | Device Label | Packet Tracer Model | Module Slots | Software / IOS Version |
|---|---|---|---|---|
| Core Access Switch | **S1** | Cisco Catalyst 2960-24TT | 24x 10/100 FastEthernet, 2x 10/100/1000 Gigabit | Cisco IOS 15.0(2)SE4 (LAN Base) |
| Admin Workstation | **PC-Admin** | PC-PT (Standard Desktop) | 1x FastEthernet, 1x RS-232 Serial Port | Generic Host OS |

### Port-to-Port Cabling Matrix
| Origin Device | Origin Port | Destination Device | Destination Port | Cable Type | Packet Tracer Color |
|---|---|---|---|---|---|
| **PC-Admin** | `RS 232` | **Switch S1** | `Console` | Rollover / Console | Light Blue solid line |
| **PC-Admin** | `FastEthernet0` | **Switch S1** | `FastEthernet0/1` | Copper Straight-Through | Solid black line |

### Step-by-Step Packet Tracer Assembly
1. Open Cisco Packet Tracer.
2. Under **Network Devices -> Switches**, drag a **2960** switch onto the logical workspace. Set display name to `S1`.
3. Under **End Devices -> End Devices**, drag a **PC** onto the workspace. Set display name to `PC-Admin`.
4. Under **Connections**, select the light blue **Console** cable. Click `PC-Admin` and choose `RS 232`. Then click `S1` and choose `Console`.
5. Under **Connections**, select the solid black **Copper Straight-Through** cable. Click `PC-Admin` and choose `FastEthernet0`. Click `S1` and choose `FastEthernet0/1`.
6. Click `PC-Admin` -> **Desktop** tab -> **IP Configuration**:
   - IPv4 Address: `192.168.1.10`
   - Subnet Mask: `255.255.255.0`
   - Default Gateway: `192.168.1.1`

---

## 2. Pre-Configuration & Starter State

In the starter state (`starter`):
- Switch `S1` is at factory default settings (`Switch>` prompt, unconfigured passwords, hostname `Switch`).
- `PC-Admin` is addressed and connected via both Console and Ethernet.
- Student must perform CLI navigation, set hostname to `S1`, configure passwords, enable secret, MOTD banner, password encryption, management SVI, and save to NVRAM.

The complete reference configuration is provided in [`configs/S1.txt`](configs/S1.txt).

---

## 3. Positive Verification Tests

### Test POS-01: Console Login Authentication
- **Action:** Open PC-Admin -> Desktop -> Terminal (9600-8-N-1). Press Enter.
- **Expected Terminal Output:**
  ```text
  User Access Verification

  Password: 
  S1>
  ```
- **Criterion:** Entering console password `cisco` unlocks User EXEC mode (`S1>`).

### Test POS-02: Privileged EXEC Secret Authentication
- **Action:** At `S1>`, enter `enable`.
- **Expected Terminal Output:**
  ```text
  S1> enable
  Password: 
  S1#
  ```
- **Criterion:** Entering enable secret `class` unlocks Privileged EXEC mode (`S1#`).

### Test POS-03: Message of the Day (MOTD) Banner Display
- **Action:** Exit the console session completely (`exit`), then press Enter.
- **Expected Terminal Output:**
  ```text
  Authorized Access Only! Violators will be prosecuted.

  User Access Verification

  Password: 
  ```
- **Criterion:** MOTD banner is displayed before the authentication prompt.

### Test POS-04: Password Encryption in Running Configuration
- **Action:** At `S1#`, issue `show running-config | include password|secret`.
- **Expected Terminal Output:**
  ```text
  enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
  service password-encryption
   password 7 0822455B0A16
   password 7 0822455B0A16
  ```
- **Criterion:** Cleartext passwords (`cisco`) are encrypted as Cisco Type 7 hashes (`0822455B0A16`), and enable secret is hashed with MD5/SHA.

### Test POS-05: NVRAM Startup-Config Persistence
- **Action:** Execute `reload` on `S1#`. Confirm reload.
- **Expected Terminal Output:**
  ```text
  Proceed with reload? [confirm]
  ...
  Press RETURN to get started!
  Authorized Access Only! Violators will be prosecuted.
  User Access Verification
  Password: 
  ```
- **Criterion:** Hostname `S1` and all password protections persist across reboot.

---

## 4. Negative Verification Tests

### Test NEG-01: Rejection of Incorrect Enable Password
- **Action:** At `S1>`, enter `enable` and type an incorrect password (e.g. `wrongpass`).
- **Expected Terminal Output:**
  ```text
  S1> enable
  Password: 
  % Bad secrets

  Password: 
  ```
- **Criterion:** Switch rejects invalid password, logs `% Bad secrets`, and denies Privileged EXEC access.

### Test NEG-02: Blocked Privileged Commands in User EXEC Mode
- **Action:** From `S1>` (User EXEC), attempt to execute `configure terminal`.
- **Expected Terminal Output:**
  ```text
  S1> configure terminal
      ^
  % Invalid input detected at '^' marker.
  ```
- **Criterion:** IOS command hierarchy restricts configuration commands exclusively to Privileged EXEC mode.

---

## 5. Diagnostic & Troubleshooting Reference

| Symptom | Root Cause | Remediation Command |
|---|---|---|
| No text appears in Terminal window | Wrong PC port selected (USB instead of RS-232) or wrong cable | Verify cable is light blue Console connected to PC `RS 232` and Switch `Console` port. |
| Console password prompt does not appear | Missing `login` command under `line con 0` | Enter `line console 0` and issue `login`. |
| Passwords visible in plain text in `show run` | `service password-encryption` was omitted | Enter Global Config and issue `service password-encryption`. |
| Configuration lost after reload | Omitted `copy running-config startup-config` | Re-apply configuration and execute `copy running-config startup-config`. |
