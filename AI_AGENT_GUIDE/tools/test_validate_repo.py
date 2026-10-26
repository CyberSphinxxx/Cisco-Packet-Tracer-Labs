"""Unit tests for the self-contained static repository validator."""
import json
import tempfile
import unittest
from pathlib import Path
from validate_repo import validate


class RepoValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        self.lab=self.root/'labs'/'network-fundamentals'/'hello-ios'
        self.lab.mkdir(parents=True)
        self.meta={
          'id':'PTL-0001','title':'Hello IOS','slug':'hello-ios',
          'category':'network-fundamentals','summary':'Simple CLI guide.',
          'difficulty':'beginner','topics':['ios'], 'learning_objectives':['Identify modes'],
          'estimated_minutes':None,'activity_reference':None,'packet_tracer_version':None,
          'devices':[], 'source':{'type':'original','origin':'independently authored',
                  'url':None,'permission_evidence':None},
          'license_decision':'pending_owner_selection',
          'assets':{'starter':None,'completed':None,'topology':None},
          'status':{'documentation':'draft','simulator':'not_tested','simulator_evidence':None},
          'references':[],'last_reviewed':None
        }
        self.save()
        (self.lab/'README.md').write_text('# Hello IOS\n',encoding='utf8')

    def save(self): (self.lab/'metadata.json').write_text(json.dumps(self.meta),encoding='utf8')
    def errors(self):return [msg for level,_,msg in validate(self.root) if level=='ERROR']
    def test_valid_draft(self): self.assertEqual(self.errors(),[])
    def test_missing_metadata(self):
        (self.lab/'metadata.json').unlink()
        self.assertTrue(any('missing metadata' in x for x in self.errors()))
    def test_bad_json(self):
        (self.lab/'metadata.json').write_text('{bad json',encoding='utf8')
        self.assertTrue(any('cannot parse JSON' in x for x in self.errors()))
    def test_missing_sections_reviewed(self):
        self.meta['status']['documentation']='reviewed';self.meta['references']=['https://www.cisco.com'];self.save()
        self.assertTrue(any('missing section' in x for x in self.errors()))
    def test_missing_asset(self):
        self.meta['assets']['starter']='starter.pkt';self.save()
        self.assertTrue(any('missing file' in x for x in self.errors()))
    def test_restricted_public_lab(self):
        self.meta['source']['type']='restricted';self.save()
        self.assertTrue(any('restricted assets' in x for x in self.errors()))
    def test_third_party_external_asset(self):
        (self.lab/'starter.pkt').write_bytes(b'x')
        self.meta['source']['type']='external_reference';self.meta['assets']['starter']='starter.pkt';self.save()
        self.assertTrue(any('external_reference cannot' in x for x in self.errors()))
    def test_duplicate_id(self):
        other=self.root/'labs'/'routing'/'static-route';other.mkdir(parents=True)
        m=dict(self.meta);m['category']='routing';m['slug']='static-route'
        (other/'metadata.json').write_text(json.dumps(m),encoding='utf8')
        (other/'README.md').write_text('# New',encoding='utf8')
        self.assertTrue(any('duplicate lab id' in x for x in self.errors()))
    def test_unsafe_asset(self):
        self.meta['assets']['topology']='../../../../outside.png';self.save()
        self.assertTrue(any('escapes lab folder' in x for x in self.errors()))
    def test_broken_relative_link(self):
        (self.lab/'README.md').write_text('See [missing](nope.md)',encoding='utf8')
        self.assertTrue(any('broken local link' in x for x in self.errors()))
    def test_invalid_slug(self):
        self.meta['slug']='Hello IOS';self.save()
        self.assertTrue(any('invalid lowercase' in x for x in self.errors()))
    def test_missing_simulator_evidence(self):
        self.meta['status']['simulator']='tested_pass';self.save()
        self.assertTrue(any('requires simulator_evidence' in x for x in self.errors()))

if __name__=='__main__':unittest.main()
