/**
 * Presentation helpers the header and homepage derive from: topic labels,
 * the beginner path, "Start with lab 1" and the hero's popular links.
 */
import { describe, expect, it } from 'vitest';
import { labelFromSlug } from '../../src/lib/content/repository';
import { beginnerPath, labTopics, pathLabs, popularLabs, startLab } from '../../src/lib/site';
import { realRepo } from '../helpers/repo';

describe('labelFromSlug', () => {
  it('keeps networking acronyms in capitals', () => {
    expect(labelFromSlug('vlsm')).toBe('VLSM');
    expect(labelFromSlug('arp')).toBe('ARP');
    expect(labelFromSlug('flsm-and-cidr')).toBe('FLSM and CIDR');
    expect(labelFromSlug('mac-address')).toBe('MAC Address');
    expect(labelFromSlug('dhcpv4-relay')).toBe('DHCPv4 Relay');
    expect(labelFromSlug('ipv6-addressing')).toBe('IPv6 Addressing');
    expect(labelFromSlug('ospfv2')).toBe('OSPFv2');
    expect(labelFromSlug('standard-acls')).toBe('Standard ACLs');
    expect(labelFromSlug('nat-and-stp')).toBe('NAT and STP');
    expect(labelFromSlug('etherchannel-lacp')).toBe('EtherChannel LACP');
  });

  it('no topic in the real library is shown with a lower-case acronym', () => {
    const repo = realRepo();
    const labels = repo.topics.map((t) => t.label);
    for (const bad of ['Vlsm', 'Arp', 'Mac', 'Ios', 'Vlan', 'Acl', 'Ssh', 'Dhcp', 'Ospf']) {
      expect(labels.some((l) => l.split(' ').includes(bad)), bad).toBe(false);
    }
  });
});

describe('homepage and header data', () => {
  const repo = realRepo();

  it('the beginner path is found by slug and lists its labs in order, once each', () => {
    const path = beginnerPath(repo)!;
    expect(path.slug).toMatch(/beginner/);
    const ids = pathLabs(path, repo).map((l) => l.id);
    const expected = [...new Set(path.steps.filter((s) => s.labId).map((s) => s.labId))];
    expect(ids).toEqual(expected);
  });

  it('"Start with lab 1" is the first lab of the beginner path', () => {
    const path = beginnerPath(repo)!;
    expect(startLab(repo)?.id).toBe(path.steps.find((s) => s.labId)?.labId);
  });

  it('popular links are real labs outside the beginner path with distinct labels', () => {
    const beginner = new Set(pathLabs(beginnerPath(repo), repo).map((l) => l.id));
    const popular = popularLabs(repo);
    expect(popular.length).toBeGreaterThan(0);
    expect(popular.length).toBeLessThanOrEqual(5);
    for (const { lab } of popular) {
      expect(repo.labs).toContain(lab);
      expect(beginner.has(lab.id)).toBe(false);
    }
    expect(new Set(popular.map((p) => p.label)).size).toBe(popular.length);
  });

  it('topic chips leave out Cisco IOS and the category names', () => {
    const topics = labTopics(repo);
    expect(topics).not.toContain('cisco-ios');
    for (const c of repo.categories) expect(topics).not.toContain(c.slug);
    expect(new Set(topics).size).toBe(topics.length);
  });
});
