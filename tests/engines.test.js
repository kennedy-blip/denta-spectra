import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRgb, qlfPresets } from '../src/engines/biofilmQlfOpticalEngine.js';
import { analyzeVibration } from '../src/engines/tmjVibroarthrometryEngine.js';
import { simulateStephan } from '../src/engines/stephanDemineralizationEngine.js';
import { deltaE2000, matchShade, whitenessIndex } from '../src/engines/vitaShadeCiede2000Engine.js';
import { auditQuote } from '../src/engines/sonicBrushAndCdtAuditorEngine.js';

test('CIEDE2000 canonical reference pair and identity', () => {
  const reference=deltaE2000({L:50,a:2.6772,b:-79.7751},{L:50,a:0,b:-82.7485});
  assert.ok(Math.abs(reference-2.0425)<0.001);
  assert.equal(deltaE2000({L:60,a:3,b:8},{L:60,a:3,b:8}),0);
});

test('VITA shade matcher returns a known shade and WI_D is finite', () => {
  const shade=matchShade({L:82,a:2,b:14});
  assert.equal(shade.name,'A1');
  assert.ok(Number.isFinite(whitenessIndex({L:82,a:2,b:14})));
});

test('pH model is bounded and the cola scenario crosses the illustrative threshold', () => {
  const result=simulateStephan({acid:0.9});
  assert.equal(result.rows.length,61);
  assert.ok(result.minimumPh<5.5);
  assert.ok(result.dissolutionMinutes>0);
  assert.ok(result.rows.every(row=>row.ph>=3.2&&row.ph<=7.2));
});

test('spectral pattern and quote comparison are explanatory, not diagnoses', () => {
  assert.equal(analyzeVibration(10,1,12).label,'Brief transient-like pattern');
  const result=auditQuote([{code:'D2740',price:2400}]);
  assert.equal(result.rows[0].flag,'Above illustrative comparison range');
  assert.match(result.disclaimer,/not a local UCR/);
});

test('camera sample conversion and presets stay finite', () => {
  const sample=analyzeRgb(190,130,100);
  assert.ok(Number.isFinite(sample.ratio));
  assert.equal(qlfPresets.length,4);
});
