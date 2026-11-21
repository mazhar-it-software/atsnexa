import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,terms} from '../lib/matcher.mjs';

test('score is rounded percentage of distinct extracted job terms matched', () => {
 const resume='Professional developer with experience building React, SQL and TypeScript solutions.';
 const job='Seeking React TypeScript SQL AWS Docker Git professionals for our engineering team.';
 const result=analyze(resume,job);
 assert.equal(result.total,result.matched.length+result.missing.length);
 assert.equal(result.score,Math.round(100*result.matched.length/result.total));
 assert.ok(result.matched.includes('react'));
 assert.ok(result.missing.includes('aws'));
});
test('duplicate job terms count once',()=>assert.deepEqual(terms('react react react'),['react']));
test('empty or short input rejected',()=>assert.throws(()=>analyze('short','short'),/30 characters/));
test('text limits enforced',()=>assert.throws(()=>analyze('x'.repeat(50001),'y'.repeat(30)),/50,000/));
