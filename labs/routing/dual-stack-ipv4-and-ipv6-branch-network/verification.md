# Verification Guide: PTL-0054 — Dual-Stack IPv4 and IPv6 Branch Network

This document outlines the systematic verification procedure for confirming dual-stack IPv4 and IPv6 reachability across the multi-branch enterprise topology.

## 1. Interface and Dual-Stack Configuration Audit

On each router, verify interface IP addresses, line protocol status, and link-local scope addresses:

```ios
Branch-1-R1# show ip interface brief
Branch-1-R1# show ipv6 interface brief
HQ-R2# show ip interface brief
HQ-R2# show ipv6 interface brief
Branch-2-R3# show ip interface brief
Branch-2-R3# show ipv6 interface brief
```

Expected Output Sample (`Branch-1-R1`):
```text
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up                    up      
GigabitEthernet0/1     10.1.12.1       YES manual up                    up      

GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:ACAD:10::1
GigabitEthernet0/1     [up/up]
    FE80::1
    2001:DB8:ACAD:12::1
```

## 2. Static and Default Route Verification

Verify IPv4 and IPv6 routing tables:

```ios
Branch-1-R1# show ip route static
Branch-1-R1# show ipv6 route static
HQ-R2# show ip route static
HQ-R2# show ipv6 route static
Branch-2-R3# show ip route static
Branch-2-R3# show ipv6 route static
```

Sample Expected Routes:
- `Branch-1-R1`:
  - `S*   0.0.0.0/0 [1/0] via 10.1.12.2`
  - `S   ::/0 [1/0] via 2001:DB8:ACAD:12::2`
- `HQ-R2`:
  - `S   192.168.10.0/24 [1/0] via 10.1.12.1`
  - `S   192.168.20.0/24 [1/0] via 10.1.23.2`
  - `S   2001:DB8:ACAD:10::/64 [1/0] via 2001:DB8:ACAD:12::1`
  - `S   2001:DB8:ACAD:20::/64 [1/0] via 2001:DB8:ACAD:23::3`
- `Branch-2-R3`:
  - `S*   0.0.0.0/0 [1/0] via 10.1.23.1`
  - `S   ::/0 [1/0] via 2001:DB8:ACAD:23::2`

## 3. End-to-End Traffic Matrix Verification

From `PC-BR1` command prompt, verify reachability across both address families:

```text
C:\> ping 192.168.20.10
Pinging 192.168.20.10 with 32 bytes of data:
Reply from 192.168.20.10: bytes=32 time<1ms TTL=126
Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

C:\> ping 2001:db8:acad:20::10
Pinging 2001:db8:acad:20::10 with 32 bytes of data:
Reply from 2001:db8:acad:20::10: bytes=32 time<1ms
Ping statistics for 2001:db8:acad:20::10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

From `PC-BR2` command prompt, verify reachability to HQ Central Services Loopback0:

```text
C:\> ping 172.16.1.1
Pinging 172.16.1.1 with 32 bytes of data:
Reply from 172.16.1.1: bytes=32 time<1ms TTL=254
Ping statistics for 172.16.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

C:\> ping 2001:db8:acad:100::1
Pinging 2001:db8:acad:100::1 with 32 bytes of data:
Reply from 2001:db8:acad:100::1: bytes=32 time<1ms
Ping statistics for 2001:db8:acad:100::1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

## 4. Starter Fault Isolation Verification

In the starter topology:
1. `PC-BR1` cannot reach `PC-BR2` over IPv6:
   - On `Branch-2-R3`, observe that `show ipv6 route static` does not contain `::/0`.
   - Add `ipv6 route ::/0 2001:db8:acad:23::2` to restore IPv6 connectivity.
2. `PC-BR1` cannot reach `HQ-R2` or `PC-BR2` over IPv4:
   - On `Branch-1-R1`, observe `show ip route static` lists `0.0.0.0/0 via 10.1.12.5`.
   - `10.1.12.5` is outside the WAN subnet (`10.1.12.0/30`).
   - Remove the invalid route and add `ip route 0.0.0.0 0.0.0.0 10.1.12.2`.
