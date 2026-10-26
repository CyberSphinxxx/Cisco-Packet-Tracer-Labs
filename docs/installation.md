# Installing Cisco Packet Tracer

This guide provides official instructions for obtaining and installing Cisco Packet Tracer.

---

## 1. Official Download Source
Cisco Packet Tracer is free software provided by Cisco for educational use, but requires a free registration with Cisco Networking Academy or Cisco Skills for All.

> [!IMPORTANT]
> Never download Packet Tracer executables or installers from unverified third-party mirror websites or file-sharing platforms. Always use Cisco's official educational portal.

### Steps to Download:
1. Visit the official Cisco Skills for All portal:
   [https://skillsforall.com/](https://skillsforall.com/) or [https://www.netacad.com/portal/learning](https://www.netacad.com/portal/learning)
2. Enroll in the free introductory course **"Getting Started with Cisco Packet Tracer"**.
3. Once enrolled, navigate to the course download section.
4. Select the appropriate installer for your operating system:
   - **Windows:** 64-bit installer (`.exe`)
   - **Ubuntu Linux:** Debian package (`.deb`)
   - **macOS:** Apple disk image (`.dmg`)
5. Run the installer and follow on-screen prompts.
6. When launching Packet Tracer for the first time, log in using your registered Cisco Skills for All / NetAcad account credentials.

---

## 2. System Requirements
- **OS:** Windows 10/11 (64-bit), Ubuntu 22.04 LTS or 24.04 LTS (64-bit), macOS 12+ (64-bit / Apple Silicon via Rosetta or native build).
- **RAM:** Minimum 4 GB RAM (8 GB recommended for multi-device topologies).
- **Storage:** At least 1.5 GB free disk space.
- **Resolution:** 1024x768 minimum display resolution.

---

## 3. Verifying Your Installation
1. Launch Cisco Packet Tracer.
2. Under the bottom-left device palette, click **Network Devices** -> **Routers**.
3. Drag a **Router 4321** or **Router 2911** onto the workspace canvas.
4. Click the device, switch to the **CLI** tab, and verify that the virtual bootloader finishes loading and prompts:
   ```text
   Router>
   ```
5. If the CLI prompt appears without crashes, your simulation environment is ready.
