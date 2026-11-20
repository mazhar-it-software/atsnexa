import test from 'node:test';import assert from 'node:assert/strict';import {analyze,terms} from '../lib/matcher.mjs';
test('finds matching relevant terms',()=>{const r=analyze('I built projects in React and TypeScript and SQL systems.','We require React, TypeScript, AWS, SQL and Git for this role.');assert.ok(r.matched.includes('react'));assert.ok(r.missing.includes('aws'));assert.ok(r.score>0&&r.score<100)});
test('rejects insufficient text',()=>assert.throws(()=>analyze('short','short'),/30 characters/));
test('deduplicates terms',()=>assert.deepEqual(terms('react react react'),['react']));
