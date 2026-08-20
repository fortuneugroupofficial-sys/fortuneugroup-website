#!/usr/bin/env node
/**
 * Fortune U Group — social publishing LOGIC mock test.
 *
 * This mirrors the exact decision logic embedded in the n8n Code nodes for
 * WF-07 (content gen), WF-08/09/10 (approval gate) and WF-15 (decision/dispatch).
 * It runs with NO credentials and proves the parts that don't need a live
 * platform: prompt building, fact-check flagging, the approval gate, and the
 * dispatch router.
 *
 * Run:  node automation/test/social-flow-test.mjs
 */

const results = [];
const test = (name, fn) => {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
  }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };

/* ------------------------------------------------------------------ */
/* Mirrors WF-07 "Build Prompt" logic                                  */
/* ------------------------------------------------------------------ */
function buildPrompt(j, AUTO_PUBLISH = 'false') {
  const ALLOWED = ['youtube', 'instagram', 'facebook', 'website', 'whatsapp', 'blog'];
  const platform = String(j.platform || '').toLowerCase();
  const topic = String(j.topic || '').trim();
  if (!ALLOWED.includes(platform) || !topic) {
    return { __skip: true, __reason: 'INVALID_REQUEST', platform, topic };
  }
  const prompt = ['Compliance-safe prompt for ' + platform + ': ' + topic].join('\n');
  return { platform, topic, __prompt: prompt, __skip: false };
}

/* Mirrors WF-07 "Parse & Flag" fact-check detection */
function flagResult(parsed, raw) {
  const body = String(parsed.body || parsed.raw_text || raw);
  const flags = Array.isArray(parsed.flags) ? parsed.flags : [];
  const needsFactCheck = /\[FACT_CHECK\]/i.test(body) || flags.length > 0;
  return needsFactCheck ? 'FLAGGED' : 'PASSED';
}

/* Mirrors WF-08/09/10 "Approval Gate" logic */
function approvalGate(j, AUTO_PUBLISH = 'false') {
  const auto = String(AUTO_PUBLISH || 'false') === 'true';
  const approved = j.approval_status === 'APPROVED' || j.approved === true;
  if (!approved && !auto) return { __skip: true, __reason: 'APPROVAL_REQUIRED', status: 'BLOCKED' };
  return { ...j, __skip: false, status: 'PUBLISHING' };
}

/* Mirrors WF-15 "Build Dispatch Payload" router */
function dispatchPath(platform) {
  return {
    youtube: 'youtube/publish',
    instagram: 'instagram/publish',
    facebook: 'facebook/publish',
  }[String(platform || '').toLowerCase()] || null;
}

/* Mirrors WF-15 "Validate Decision" logic */
function validateDecision(decision) {
  const d = String(decision || '').toUpperCase();
  if (!['APPROVED', 'REJECTED'].includes(d)) throw new Error('APPROVAL_INVALID_DECISION');
  return { decision: d, dispatch: d === 'APPROVED' };
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */
test('prompt builder rejects unsupported platform', () => {
  const r = buildPrompt({ platform: 'tiktok', topic: 'x' });
  assert(r.__skip === true && r.__reason === 'INVALID_REQUEST');
});

test('prompt builder rejects empty topic', () => {
  const r = buildPrompt({ platform: 'instagram', topic: '' });
  assert(r.__skip === true);
});

test('prompt builder accepts valid platform + topic', () => {
  const r = buildPrompt({ platform: 'instagram', topic: 'term insurance' });
  assert(r.__skip === false && /compliance-safe/i.test(r.__prompt));
});

test('fact-check flags [FACT_CHECK] text', () => {
  assert(flagResult({ body: 'Returns are [FACT_CHECK] 12% p.a.' }, '') === 'FLAGGED');
});

test('fact-check flags non-empty flags array', () => {
  assert(flagResult({ body: 'ok', flags: ['verify premium claim'] }, '') === 'FLAGGED');
});

test('fact-check passes clean content', () => {
  assert(flagResult({ body: 'educational, no claims' }, '') === 'PASSED');
});

test('approval gate BLOCKS unapproved publish (default)', () => {
  const r = approvalGate({ caption: 'hi' });
  assert(r.__skip === true && r.status === 'BLOCKED' && r.__reason === 'APPROVAL_REQUIRED');
});

test('approval gate BLOCKS even with AUTO_PUBLISH=false', () => {
  const r = approvalGate({ caption: 'hi' }, 'false');
  assert(r.__skip === true);
});

test('approval gate BLOCKS with approval_status=DRAFT', () => {
  const r = approvalGate({ approval_status: 'DRAFT' });
  assert(r.__skip === true);
});

test('approval gate PASSES with approval_status=APPROVED', () => {
  const r = approvalGate({ approval_status: 'APPROVED' });
  assert(r.__skip === false);
});

test('approval gate PASSES with approved=true', () => {
  const r = approvalGate({ approved: true });
  assert(r.__skip === false);
});

test('approval gate PASSES only when AUTO_PUBLISH=true', () => {
  assert(approvalGate({}, 'true').__skip === false);
  assert(approvalGate({}, 'false').__skip === true);
});

test('dispatch router maps platforms correctly', () => {
  assert(dispatchPath('youtube') === 'youtube/publish');
  assert(dispatchPath('instagram') === 'instagram/publish');
  assert(dispatchPath('facebook') === 'facebook/publish');
  assert(dispatchPath('linkedin') === null);
});

test('decision validator rejects garbage', () => {
  let threw = false;
  try { validateDecision('maybe'); } catch { threw = true; }
  assert(threw);
});

test('decision validator accepts APPROVED and REJECTED', () => {
  assert(validateDecision('approved').dispatch === true);
  assert(validateDecision('REJECTED').dispatch === false);
});

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */
let pass = 0, fail = 0;
for (const r of results) {
  if (r.ok) { pass++; console.log('  PASS  ' + r.name); }
  else { fail++; console.log('  FAIL  ' + r.name + '  ->  ' + r.error); }
}
console.log('\n' + pass + ' passed, ' + fail + ' failed, ' + results.length + ' total');
process.exit(fail ? 1 : 0);
