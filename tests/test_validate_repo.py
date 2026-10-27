"""Unit tests for the self-contained static repository validator."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

# Add tools directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent / 'tools'))
from validate_repo import validate


class RepoValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.lab = self.root / 'labs' / 'network-fundamentals' / 'hello-ios'
        self.lab.mkdir(parents=True)
        self.meta = {
          'id': 'PTL-0001', 'title': 'Hello IOS', 'slug': 'hello-ios',
          'category': 'network-fundamentals', 'summary': 'Simple CLI guide.',
          'difficulty': 'beginner', 'topics': ['ios'], 'learning_objectives': ['Identify modes'],
          'estimated_minutes': None, 'activity_reference': None, 'packet_tracer_version': None,
          'devices': [], 'source': {'type': 'original', 'origin': 'independently authored',
                  'url': None, 'permission_evidence': None},
          'license_decision': 'pending_owner_selection',
          'assets': {'starter': None, 'completed': None, 'topology': None},
          'status': {'documentation': 'draft', 'simulator': 'not_tested', 'simulator_evidence': None},
          'references': [], 'last_reviewed': None
        }
        self.save()
        (self.lab / 'README.md').write_text('# Hello IOS\n', encoding='utf8')

    def save(self):
        (self.lab / 'metadata.json').write_text(json.dumps(self.meta), encoding='utf8')

    def errors(self):
        return [msg for level, _, msg in validate(self.root) if level == 'ERROR']

    def test_valid_draft(self):
        self.assertEqual(self.errors(), [])

    def test_missing_metadata(self):
        (self.lab / 'metadata.json').unlink()
        self.assertTrue(any('missing metadata' in x for x in self.errors()))

    def test_bad_json(self):
        (self.lab / 'metadata.json').write_text('{bad json', encoding='utf8')
        self.assertTrue(any('cannot parse JSON' in x for x in self.errors()))

    def test_missing_sections_reviewed(self):
        self.meta['status']['documentation'] = 'reviewed'
        self.meta['references'] = ['https://www.cisco.com']
        self.save()
        self.assertTrue(any('missing section' in x for x in self.errors()))

    def test_missing_asset(self):
        self.meta['assets']['starter'] = 'starter.pkt'
        self.save()
        self.assertTrue(any('missing file' in x for x in self.errors()))

    def test_restricted_public_lab(self):
        self.meta['source']['type'] = 'restricted'
        self.save()
        self.assertTrue(any('restricted assets' in x for x in self.errors()))

    def test_third_party_external_asset(self):
        (self.lab / 'starter.pkt').write_bytes(b'x')
        self.meta['source']['type'] = 'external_reference'
        self.meta['assets']['starter'] = 'starter.pkt'
        self.save()
        self.assertTrue(any('external_reference cannot' in x for x in self.errors()))

    def test_duplicate_id(self):
        other = self.root / 'labs' / 'routing' / 'static-route'
        other.mkdir(parents=True)
        m = dict(self.meta)
        m['id'] = 'PTL-0001'
        m['category'] = 'routing'
        m['slug'] = 'static-route'
        (other / 'metadata.json').write_text(json.dumps(m), encoding='utf8')
        (other / 'README.md').write_text('# New', encoding='utf8')
        self.assertTrue(any('duplicate lab id' in x for x in self.errors()))

    def test_unsafe_asset(self):
        self.meta['assets']['topology'] = '../../../../outside.png'
        self.save()
        self.assertTrue(any('escapes lab folder' in x for x in self.errors()))

    def test_broken_relative_link(self):
        (self.lab / 'README.md').write_text('See [missing](nope.md)', encoding='utf8')
        self.assertTrue(any('broken local link' in x for x in self.errors()))

    def test_invalid_slug(self):
        self.meta['slug'] = 'Hello IOS'
        self.save()
        self.assertTrue(any('invalid lowercase' in x for x in self.errors()))

    def test_missing_simulator_evidence(self):
        self.meta['status']['simulator'] = 'tested_pass'
        self.save()
        self.assertTrue(any('requires simulator_evidence' in x for x in self.errors()))

    def test_bad_category(self):
        bad_cat = self.root / 'labs' / 'unknown-category' / 'bad-lab'
        bad_cat.mkdir(parents=True)
        m = dict(self.meta)
        m['id'] = 'PTL-9999'
        m['category'] = 'unknown-category'
        m['slug'] = 'bad-lab'
        (bad_cat / 'metadata.json').write_text(json.dumps(m), encoding='utf8')
        (bad_cat / 'README.md').write_text('# Bad Category\n', encoding='utf8')
        self.assertTrue(any('unexpected top-level lab category' in x for x in self.errors()))

    def test_duplicate_slug(self):
        other = self.root / 'labs' / 'routing' / 'hello-ios'
        other.mkdir(parents=True)
        m = dict(self.meta)
        m['id'] = 'PTL-0099'
        m['category'] = 'routing'
        m['slug'] = 'hello-ios'
        (other / 'metadata.json').write_text(json.dumps(m), encoding='utf8')
        (other / 'README.md').write_text('# Other\n', encoding='utf8')
        self.assertTrue(any('duplicate global slug' in x for x in self.errors()))

    def test_permission_verified_without_evidence(self):
        self.meta['source']['type'] = 'permission_verified'
        self.meta['source']['permission_evidence'] = None
        self.save()
        self.assertTrue(any('permission_verified without concrete evidence' in x for x in self.errors()))

    def test_template_placeholder_in_reviewed(self):
        self.meta['status']['documentation'] = 'reviewed'
        self.meta['references'] = ['https://www.cisco.com']
        self.save()
        content = '\n'.join([f'## {h}\n' for h in [
            'Learning Objectives','Prerequisites','Topology','Addressing Table',
            'Lab Tasks','Configuration Walkthrough','Verification','Troubleshooting',
            'Key Takeaways','References','Files and Validation Status'
        ]]) + '\nSome text with {{unfilled_template_variable}}\n'
        (self.lab / 'README.md').write_text(content, encoding='utf8')
        self.assertTrue(any('template placeholder' in x for x in self.errors()))

    def test_invalid_difficulty(self):
        self.meta['difficulty'] = 'master_level'
        self.save()
        self.assertTrue(any('difficulty invalid' in x for x in self.errors()))

    def test_missing_required_field(self):
        del self.meta['summary']
        self.save()
        self.assertTrue(any('missing field summary' in x for x in self.errors()))

    def test_lab_index_missing_lab(self):
        docs = self.root / 'docs'
        docs.mkdir(parents=True)
        (docs / 'lab-index.md').write_text('# Lab Index\nNo labs listed here.\n', encoding='utf8')
        self.assertTrue(any('missing from docs/lab-index.md' in x for x in self.errors()))


    def test_broken_relative_link_in_learning_path(self):
        lp = self.root / 'learning-paths'
        lp.mkdir(parents=True)
        (lp / 'beginner.md').write_text('# Path\n[Nonexistent](../labs/missing/README.md)\n', encoding='utf8')
        self.assertTrue(any('broken local link' in x for x in self.errors()))

    def test_tested_pass_missing_evidence_file(self):
        self.meta['status']['simulator'] = 'tested_pass'
        self.meta['status']['simulator_evidence'] = 'nonexistent_evidence.md'
        self.save()
        self.assertTrue(any('tested_pass simulator_evidence file missing' in x for x in self.errors()))

    def test_tested_pass_missing_required_asset(self):
        (self.root / 'ev.md').write_text('# Ev\n', encoding='utf8')
        self.meta['status']['simulator'] = 'tested_pass'
        self.meta['status']['simulator_evidence'] = 'ev.md'
        self.meta['assets']['starter'] = None
        self.save()
        self.assertTrue(any('tested_pass requires assets.starter' in x for x in self.errors()))

    def test_tested_pass_identical_starter_and_completed(self):
        (self.root / 'ev.md').write_text('# Ev\n', encoding='utf8')
        (self.lab / 'starter.pkt').write_bytes(b'identical_content_1234')
        (self.lab / 'completed.pkt').write_bytes(b'identical_content_1234')
        (self.lab / 'topology.png').write_bytes(b'\x89PNG\r\n\x1a\nfakeimage')
        self.meta['status']['simulator'] = 'tested_pass'
        self.meta['status']['simulator_evidence'] = 'ev.md'
        self.meta['assets']['starter'] = 'starter.pkt'
        self.meta['assets']['completed'] = 'completed.pkt'
        self.meta['assets']['topology'] = 'topology.png'
        self.save()
        self.assertTrue(any('starter and completed assets must not be identical' in x for x in self.errors()))

    def test_tested_pass_invalid_png_topology(self):
        (self.root / 'ev.md').write_text('# Ev\n', encoding='utf8')
        (self.lab / 'starter.pkt').write_bytes(b'starter_content')
        (self.lab / 'completed.pkt').write_bytes(b'completed_content')
        (self.lab / 'topology.png').write_bytes(b'corrupted_image_header')
        self.meta['status']['simulator'] = 'tested_pass'
        self.meta['status']['simulator_evidence'] = 'ev.md'
        self.meta['assets']['starter'] = 'starter.pkt'
        self.meta['assets']['completed'] = 'completed.pkt'
        self.meta['assets']['topology'] = 'topology.png'
        self.save()
        self.assertTrue(any('must be a valid PNG image' in x for x in self.errors()))

    def test_quarantine_pka_in_labs(self):
        (self.lab / 'restricted.pka').write_bytes(b'pka_binary')
        self.assertTrue(any('restricted NetAcad .pka file detected' in x for x in self.errors()))


if __name__ == '__main__':
    unittest.main()

