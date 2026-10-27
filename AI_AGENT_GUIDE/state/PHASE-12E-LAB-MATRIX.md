# Full Curriculum Laboratory Asset & Verification Matrix — Phase 12E

**Date (UTC):** 2026-10-27<br>
**Auditor:** DeepMind Antigravity<br>
**Scope:** 13 Modular Laboratories + 1 Capstone Project (14 Curriculum Entities)<br>
**Target Simulator:** Cisco Packet Tracer 9.0.1 (Build 9.0.1.0507)

---

## 1. Master Curriculum Asset Matrix

| Lab ID | Category & Slug | Starter `.pkt` (Bytes & SHA-256) | Completed `.pkt` (Bytes & SHA-256) | Topology Canvas PNG (Bytes & SHA-256) | Starter != Completed | Live Simulator Evidence | Status |
|:---:|---|---|---|---|:---:|---|:---:|
| **PTL-0002** | `ip-addressing`<br>`router-interface-configuration` | **51,368 B**<br>`8383b13d82d1f297fed7937a00a1b5a06ee7b1b3f8727e8051979b8822967cce` | **52,322 B**<br>`a5c8299c67985afbdc37337ec6d4d3ce7540130d5b715614d151b7c5451dbb65` | **76,223 B**<br>`bea962441bb61c1ab9a6eee8b42bf2ae2d34b50996f8d9c943644fc6d3d0d3b2` | TRUE | `state/PTL-0002-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0005** | `ip-addressing`<br>`verify-connected-networks` | **52,397 B**<br>`78fb2c13d55af711e36d02abd3edb0a9209a34808a891fb8f77cde91382d98e2` | **52,588 B**<br>`fe982b8b5e039254caec7e6284819f935f63be5a7425d4a92aa359e13b280238` | **75,406 B**<br>`c9f5d66ab5f98eb4cb1e04a5da62f81c4e7c98b91ff1bd25b22626d79df1e910` | TRUE | `state/PTL-0005-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0008** | `network-fundamentals`<br>`ios-navigation-and-initial-config` | **44,426 B**<br>`5541a9bfcf574162fd07a09b92f4fb18d2afc67faff017e53653197918f06545` | **44,728 B**<br>`1ae84b84736933903c880c8d3757715df5b7e211f7b24185fdaba90c4eab82a3` | **40,076 B**<br>`886125586a10ab95788a8697f8ca33e52d12953b7b63c1dac919136de5bd0a02` | TRUE | `state/PTL-0008-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0004** | `network-security`<br>`port-security` | **56,537 B**<br>`e32275ebaae679bcd1df2cbc842ac74d38e09ff958aed6a359c28355f4907a3b` | **56,885 B**<br>`942b2b2e7e3e1d545a696a1a3af2c0ac6bdd1b6d387ee4a74cf7a4a325917203` | **43,070 B**<br>`624b923b16302c1f5191f3f0324434020a03173d62a450792d9dfe139eb99286` | TRUE | `state/PTL-0004-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0003** | `network-security`<br>`secure-switch-ssh` | **55,552 B**<br>`ec0e7c2b6c9b8ead2c15980acee8497006dc04759e71c1783caa97727a8d923d` | **56,368 B**<br>`d407e4657afad3447ad9e57a44e9dc5ab0bc4d4716ff339c1e286b6120e315ba` | **42,669 B**<br>`66ef19bdaac748b2153dcf5ea7688deb8959b89ba042ffe684c2c0abe9a1df41` | TRUE | `state/PTL-0003-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0013** | `network-security`<br>`standard-and-extended-acls` | **79,439 B**<br>`efa1c483f02a3bb6711466c2aa5f903de22e4d5e683722361e90986fab132ddf` | **80,624 B**<br>`31a3a116629718f32e02c4d7d4550fcfbe64fe57a9e4a67ed7ae95ca0b189cf2` | **46,658 B**<br>`b7890bc48470bf4e08f10c11393bd9e4f422b7e7c2c918cb6b125ef17ab3646e` | TRUE | `state/PTL-0013-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0007** | `network-security`<br>`switch-hardening` | **62,470 B**<br>`d35ccbb09ff317e0fa41b986cbb44a0672b7aeaaaf5078c23edddfa31667186c` | **63,799 B**<br>`79d51c76f8017afa5bbdf270b985fffc11cc9632f4770818b202528a41b53830` | **65,106 B**<br>`14400ef9ff308a8f2bd14fae2432b3f9ecb9765894d6e1ad9ad6a92d0d1ca1b3` | TRUE | `state/PTL-0007-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0012** | `network-services`<br>`dhcp-server-and-relay` | **62,385 B**<br>`86dd4eb12b2edd58a2461db2ac7c2b0f5cc5680556efa56ca693dd63b65bdc56` | **63,023 B**<br>`5847222d3a727d248fdccf2bcb04d6fc554e48a1a697e89b53b0f03e055e9d43` | **47,407 B**<br>`f1d32822d50a1f4630bf04870d1b6cf04ad1169b09201ffbc6f1f25d7869fe76` | TRUE | `state/PTL-0012-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0001** | `routing`<br>`dual-stack-static-routing` | **65,944 B**<br>`7c48aeb1ef390275ebd41b9e16a1b804bb361725372e21bf48465d76bc6b8774` | **65,846 B**<br>`363ed1559678cef30c92a9faed5620f6c954d66e7fde997811fd34c61d895b88` | **52,405 B**<br>`af94fb495502cb266abeb3450e3c0fb884ccd1279d07dd1ff263471976da1710` | TRUE | `state/PTL-0001-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0010** | `routing`<br>`inter-vlan-routing-router-on-a-stick` | **57,192 B**<br>`6b1e7b9a70dda32edd336e215954f4e502c53913e38690a0ffa587a344a3b676` | **58,410 B**<br>`e214f739111269451dee0472a358151c57f3ebc5a53edadf0a4f3db4c2bc5681` | **46,608 B**<br>`3eeee8d2b7a733c31e29e3b2dc3f8c8956b9cff66780f30ca2fded24f5e678b5` | TRUE | `state/PTL-0010-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0011** | `routing`<br>`single-area-ospfv2` | **61,862 B**<br>`032a3a0a04cc2c9c631fe3cdeeac04014361d0fef98ce53f5d868ffd69299f57` | **62,478 B**<br>`5de2a73f9cc5840222f0a4fcfb42ae99bf9e0ca05d68c7d2af912c46984122b8` | **47,390 B**<br>`fc37b2bde2d8dab64803931bdba86d4a4086bffca8b891d9700d25e398e6b306` | TRUE | `state/PTL-0011-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0006** | `switching`<br>`etherchannel-lacp` | **49,098 B**<br>`1230da2a9b915522d956e4fa64fe85af5753de36f703a8bde64865c066a114fb` | **50,441 B**<br>`ed9c34089b572f9d5e38cf6a9e6368bb3cf1e30247cc8cb278ba5debf75a4c0e` | **38,158 B**<br>`eda30ac7391126e74f7e759d5f09c9d76f44d246b082862f7213e616653387d6` | TRUE | `state/PTL-0006-SIMULATOR-RESULTS.md` | `tested_pass` |
| **PTL-0009** | `switching`<br>`vlan-segmentation-and-access-ports` | **47,013 B**<br>`11e44722698a3052722a44a5851016bf6c1db29169ff7530ae9e360d6c23a426` | **48,261 B**<br>`92671b5dc05096cd9c6603142408426ffbd56d1c79c9eb952beb0ca960ad1b76` | **42,297 B**<br>`06f47cdae9a02b7abd6f162df906fde226df977c6aabae055f96f11407f3a952` | TRUE | `state/PTL-0009-SIMULATOR-RESULTS.md` | `tested_pass` |
| **CAPSTONE** | `projects`<br>`small-office-network` | **65,968 B**<br>`dae44e8670c6f1a7eae06ef0087fd617c9feff9cf3453f4fd636bb67cabc9347` | **70,599 B**<br>`f7584096ccc462f3c4b87f6a5970b8f27f804151961f281523670313c35b0adb` | **48,377 B**<br>`e0ed97477ae094e9c427b802bf64b729839155a0d1c3264dab050488b3ec4b15` | TRUE | `state/PHASE-12D-CAPSTONE-RESULTS.md` | `tested_pass` |

---

## 2. Legacy Coursework Migration Asset

| Path | File Type | Exact Size | SHA-256 Checksum | Bit-Identical to Original? |
|---|---|:---:|---|:---:|
| `labs/routing/dual-stack-static-routing/dual-stack-static-routing.pkt` | Authentic Legacy `.pkt` | 64,145 B | `8d7f62a8b4e36ef0a6efb613b92e84dbed3f1c34cb5d268b9d2b7db487680b31` | **YES (Verified)** |

---

## 3. Summary Statistics

- **Total Curriculum Entities:** 14 (13 Modular Labs + 1 Capstone Project)
- **Authentic `.pkt` Binaries:** 28 (14 starter + 14 completed)
- **Authentic Canvas PNG Captures:** 14
- **Distinct Starter vs. Completed Pairs:** 14 / 14 (100% distinct)
- **Simulator Status:** 14 / 14 `tested_pass` (100% verified)
