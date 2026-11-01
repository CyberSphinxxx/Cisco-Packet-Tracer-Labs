#!/usr/bin/env python3
"""Standard-library self tests of the queue controller; does not run the simulator."""
import importlib.util
import sys
sys.dont_write_bytecode = True
from pathlib import Path
import unittest
import datetime as dt

f = Path(__file__).with_name('queue.py')
spec = importlib.util.spec_from_file_location('factory_queue',f)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class FactoryQueueTests(unittest.TestCase):
    def setUp(self):
        self.q = mod.load_queue()
        self.p = mod.load_policy()
        self.state = mod.initial(self.q)
    def test_real_queue_well_formed_and_has_36_unique_ids(self):
        self.assertTrue(mod.check_queue(self.q))
        self.assertEqual(len(self.q),36)
        self.assertEqual(self.q[0]['id'],'PTL-0020')
        self.assertEqual(self.q[-1]['id'],'PTL-0055')
    def test_schema_all_valid_categories(self):
        self.assertTrue(all(x['category'] in mod.VALID_CATEGORY for x in self.q))
    def test_selects_first_eligible(self):
        existing = {'PTL-0013':(None,{'status':{'documentation':'reviewed','simulator':'tested_pass'}})}
        result=mod.select_next(self.q,self.state,existing,self.p)
        self.assertEqual(result['status'],'ready')
        self.assertEqual(result['task']['id'],'PTL-0020')
    def test_resumes_started_lab_instead_of_claiming_new(self):
        self.state['tasks']['PTL-0020']['status']='in_progress'
        result=mod.select_next(self.q,self.state,{},self.p)
        self.assertEqual(result['status'],'resume')
        self.assertEqual(result['task']['id'],'PTL-0020')
    def test_caps_time_and_block_streak(self):
        self.state['session_started_utc']=(dt.datetime.now(dt.timezone.utc)-dt.timedelta(hours=5)).isoformat()
        self.assertIn('wall-clock',mod.halt_reason(self.state,self.p))
        self.state['session_started_utc']=mod.now()
        self.state['session_consecutive_blocks']=self.p['max_consecutive_blocks']
        self.assertIn('consecutive',mod.halt_reason(self.state,self.p))
    def test_dependencies_require_verified_existence(self):
        code='PTL-0013'
        self.assertFalse(mod.dependency_met(code,self.state,{}))
        self.assertTrue(mod.dependency_met(code,self.state,{code:(None,{'status':{'simulator':'tested_pass','documentation':'reviewed'}})}))
        self.assertFalse(mod.dependency_met(code,self.state,{code:(None,{'status':{'simulator':'not_tested','documentation':'reviewed'}})}))

if __name__=='__main__':
    unittest.main(verbosity=2)
