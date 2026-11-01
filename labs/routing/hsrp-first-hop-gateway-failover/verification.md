# Verification Guide: PTL-0032 HSRP First-Hop Gateway Failover

This document details the complete positive and negative testing matrix for **PTL-0032: HSRP First-Hop Gateway Failover**, executed and verified inside Cisco Packet Tracer 9.0.1.

---

## 1. Positive Verification (POS)

### POS-01: Virtual Gateway IP Reachability
From `PC1`, send ICMP echo requests to the configured default gateway address (`192.168.1.1`):

```cmd
PC> ping 192.168.1.1

Pinging 192.168.1.1 with 32 bytes of data:

Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255
Reply from 192.168.1.1: bytes=32 time<1ms TTL=255

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```
*Result:* 100% success rate (4/4 packets received). Confirms that the HSRP active router is answering ARP and forwarding packets on behalf of the virtual gateway IP.

---

### POS-02: End-to-End External Destination Reachability
From `PC1`, send ICMP echo requests through the HSRP first-hop gateway to the external `Web-Server` (`203.0.113.100`):

```cmd
PC> ping 203.0.113.100

Pinging 203.0.113.100 with 32 bytes of data:

Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127

Ping statistics for 203.0.113.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
```
*Result:* 100% success rate. Verifies end-to-end packet forwarding from internal LAN through the HSRP virtual gateway, across the core network, to the destination server.

---

### POS-03: Primary Gateway HSRP State Verification (Edge-R1)
Verify HSRP standby group status on `Edge-R1` using `show standby brief`:

```cisco
Edge-R1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gig0/0/1    1    110 P Active   local           192.168.1.3     192.168.1.1    
```
*Result:* `Edge-R1` reports `Active` state with priority `110`, preemption enabled (`P`), and recognizes `192.168.1.3` as the `Standby` router.

---

### POS-04: Standby Gateway HSRP State Verification (Edge-R2)
Verify HSRP standby group status on `Edge-R2` using `show standby brief`:

```cisco
Edge-R2# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gig0/0/1    1    100 P Standby  192.168.1.2     local           192.168.1.1    
```
*Result:* `Edge-R2` reports `Standby` state with priority `100`, preemption enabled (`P`), and recognizes `192.168.1.2` as the `Active` router.

---

### POS-05: Deliberate Gateway Failover Verification
Administratively shut down the active LAN interface on `Edge-R1` (`GigabitEthernet0/0/1`). After hold timer expiration (10 seconds), examine `Edge-R2`:

```cisco
Edge-R2# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gig0/0/1    1    100 P Active   local           unknown         192.168.1.1    
```
Verify that `PC1` continues to reach external server `203.0.113.100` seamlessly:

```cmd
PC> ping 203.0.113.100

Pinging 203.0.113.100 with 32 bytes of data:

Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
Reply from 203.0.113.100: bytes=32 time<1ms TTL=127
```
*Result:* Seamless failover confirmed. The standby router assumes forwarding responsibilities and client communication is maintained without reconfiguring PC default gateway settings.

---

### POS-06: Preemption and Recovery Verification
Re-enable `GigabitEthernet0/0/1` on `Edge-R1` (`no shutdown`). Because `Edge-R1` has higher priority (`110 > 100`) and `preempt` configured:

```cisco
Edge-R1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gig0/0/1    1    110 P Active   local           192.168.1.3     192.168.1.1    
```

```cisco
Edge-R2# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gig0/0/1    1    100 P Standby  192.168.1.2     local           192.168.1.1    
```
*Result:* Preemption confirmed. `Edge-R1` automatically regains the `Active` role and `Edge-R2` gracefully yields back to `Standby`.

---

## 2. Negative Verification (NEG)

### NEG-01: Unconfigured HSRP Default Gateway Reachability Failure
In the starter lab state (`starter.pkt`), before HSRP is configured on `Edge-R1` and `Edge-R2`:

```cmd
PC> ping 192.168.1.1

Pinging 192.168.1.1 with 32 bytes of data:

Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 192.168.1.1:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)
```
*Evaluation:* Passes negative criteria. Without HSRP configured, no network node responds to ARP requests for `192.168.1.1`, demonstrating the failure mode that FHRP resolves.

---

### NEG-02: Missing Preemption Behavior
If `Edge-R1` priority is configured higher (`110`) but `standby 1 preempt` is omitted, `Edge-R1` will not overthrow `Edge-R2` when recovering from a failure. `Edge-R2` remains Active indefinitely until rebooted. Configuring `standby 1 preempt` on the primary router is mandatory for predictable failback behavior.
