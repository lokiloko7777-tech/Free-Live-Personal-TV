import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'node:os';
import QRCode from 'qrcode';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'node:url';
import { createDecipheriv, createHash, randomBytes, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { OAuth2Client } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'web');
const uploadsDir = path.join(rootDir, 'uploads');
const dataDir = path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'db.json');

const MAX_FREE_VIDEOS = 3;
const MAX_DURATION_MS = 3 * 60 * 1000;
const MAX_SIZE_BYTES = 30 * 1024 * 1024;
const MAX_CHUNK_BYTES = 5 * 1024 * 1024;
const CHAT_MIN_INTERVAL_MS = 2500;
const CHAT_DUPLICATE_WINDOW_MS = 30000;
const ALLOWED_AVATARS = new Set(['male', 'female', 'anonymous']);
const AUTH_SESSION_TTL_MS = Number(process.env.AUTH_SESSION_TTL_MS || 7 * 24 * 60 * 60 * 1000);
const FFMPEG_ENABLED = String(process.env.FFMPEG_ENABLED || '1') !== '0';
const FFMPEG_PRESET = process.env.FFMPEG_PRESET || 'veryfast';
const FFMPEG_CRF = Number(process.env.FFMPEG_CRF || 29);
const HLS_VARIANTS = [
  {
    name: 'low',
    height: 360,
    bandwidth: 800000,
    videoBitrate: '650k',
    maxrate: '700k',
    bufsize: '1200k',
    audioBitrate: '96k',
    resolution: '640x360'
  },
  {
    name: 'mid',
    height: 480,
    bandwidth: 1400000,
    videoBitrate: '1200k',
    maxrate: '1300k',
    bufsize: '2200k',
    audioBitrate: '96k',
    resolution: '854x480'
  },
  {
    name: 'high',
    height: 720,
    bandwidth: 2500000,
    videoBitrate: '2200k',
    maxrate: '2400k',
    bufsize: '3800k',
    audioBitrate: '128k',
    resolution: '1280x720'
  }
];
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
const REPORT_STATUSES = new Set(['open', 'resolved', 'rejected']);
const LICENSE_STATUSES = new Set(['requested', 'approved', 'paid', 'delivered', 'rejected']);
const PILOT_STATUSES = new Set(['requested', 'approved', 'active', 'paused', 'removed', 'rejected']);
const FEEDBACK_STATUSES = new Set(['open', 'planned', 'in_progress', 'done', 'rejected']);
const ITERATION_STATUSES = new Set(['planned', 'active', 'completed']);
const PILOT_MIN_TARGET = Number(process.env.PILOT_MIN_TARGET || 20);
const PILOT_MAX_TARGET = Number(process.env.PILOT_MAX_TARGET || 50);
const RATE_LIMIT_ENABLED = String(process.env.RATE_LIMIT_ENABLED || '1') !== '0';
const REQUIRE_HTTPS = String(process.env.REQUIRE_HTTPS || '0') === '1';
const ADMIN_USER_IDS = new Set(
  String(process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
);

for (const dir of [uploadsDir, dataDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ users: {}, sessions: {}, nodes: {}, reports: [], licenses: [], proofs: [], auditLogs: [], metrics: {}, clientEvents: [], pilotParticipants: [], feedbackItems: [], feedbackIterations: [] }, null, 2),
    'utf-8'
  );
}

function ensureDbShape(db) {
  if (!db.users || typeof db.users !== 'object') {
    db.users = {};
  }
  if (!db.sessions || typeof db.sessions !== 'object') {
    db.sessions = {};
  }
  if (!db.nodes || typeof db.nodes !== 'object') {
    db.nodes = {};
  }
  if (!Array.isArray(db.reports)) {
    db.reports = [];
  }
  if (!Array.isArray(db.licenses)) {
    db.licenses = [];
  }
  if (!Array.isArray(db.proofs)) {
    db.proofs = [];
  }
  if (!Array.isArray(db.auditLogs)) {
    db.auditLogs = [];
  }
  if (!db.metrics || typeof db.metrics !== 'object') {
    db.metrics = {};
  }
  if (!Array.isArray(db.clientEvents)) {
    db.clientEvents = [];
  }
  if (!Array.isArray(db.pilotParticipants)) {
    db.pilotParticipants = [];
  }
  if (!Array.isArray(db.feedbackItems)) {
    db.feedbackItems = [];
  }
  if (!Array.isArray(db.feedbackIterations)) {
    db.feedbackIterations = [];
  }

  db.reports = db.reports
    .filter((report) => report && typeof report === 'object')
    .map((report) => ensureReportShape(report));

  db.licenses = db.licenses
    .filter((license) => license && typeof license === 'object')
    .map((license) => ensureLicenseShape(license));

  db.proofs = db.proofs
    .filter((proof) => proof && typeof proof === 'object')
    .map((proof) => ensureProofShape(proof));

  db.auditLogs = db.auditLogs
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ensureAuditShape(entry));

  for (const session of Object.values(db.sessions)) {
    ensureSessionShape(session);
  }

  for (const [userId, user] of Object.entries(db.users)) {
    ensureUserShape(userId, user);
  }

  ensureMetricsShape(db.metrics);
  db.clientEvents = db.clientEvents
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      type: typeof entry.type === 'string' ? entry.type.slice(0, 80) : 'client_event',
      at: typeof entry.at === 'string' && entry.at ? entry.at : new Date().toISOString(),
      userId: typeof entry.userId === 'string' ? entry.userId.slice(0, 64) : '',
      userAgent: typeof entry.userAgent === 'string' ? entry.userAgent.slice(0, 240) : '',
      payload: entry.payload && typeof entry.payload === 'object' ? entry.payload : {}
    }));
  if (db.clientEvents.length > 2000) {
    db.clientEvents = db.clientEvents.slice(-2000);
  }
  db.pilotParticipants = db.pilotParticipants
    .filter((participant) => participant && typeof participant === 'object')
    .map((participant) => ensurePilotParticipantShape(participant))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  if (db.pilotParticipants.length > 5000) {
    db.pilotParticipants = db.pilotParticipants.slice(-5000);
  }
  db.feedbackItems = db.feedbackItems
    .filter((item) => item && typeof item === 'object')
    .map((item) => ensureFeedbackItemShape(item))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  if (db.feedbackItems.length > 10000) {
    db.feedbackItems = db.feedbackItems.slice(-10000);
  }
  db.feedbackIterations = db.feedbackIterations
    .filter((item) => item && typeof item === 'object')
    .map((item) => ensureFeedbackIterationShape(item))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  if (db.feedbackIterations.length > 2000) {
    db.feedbackIterations = db.feedbackIterations.slice(-2000);
  }

  return db;
}

function ensureFeedbackItemShape(item) {
  if (typeof item.id !== 'string' || !item.id) {
    item.id = randomUUID();
  }
  if (typeof item.userId !== 'string') {
    item.userId = '';
  }
  if (typeof item.category !== 'string') {
    item.category = 'general';
  }
  if (typeof item.message !== 'string') {
    item.message = '';
  }
  if (typeof item.contact !== 'string') {
    item.contact = '';
  }
  if (!FEEDBACK_STATUSES.has(item.status)) {
    item.status = 'open';
  }
  if (typeof item.adminNote !== 'string') {
    item.adminNote = '';
  }
  if (typeof item.createdAt !== 'string' || !item.createdAt) {
    item.createdAt = new Date().toISOString();
  }
  if (typeof item.updatedAt !== 'string' || !item.updatedAt) {
    item.updatedAt = item.createdAt;
  }
  return item;
}

function ensureFeedbackIterationShape(item) {
  if (typeof item.id !== 'string' || !item.id) {
    item.id = randomUUID();
  }
  if (typeof item.title !== 'string') {
    item.title = '';
  }
  if (typeof item.goal !== 'string') {
    item.goal = '';
  }
  if (!ITERATION_STATUSES.has(item.status)) {
    item.status = 'planned';
  }
  if (!Array.isArray(item.feedbackIds)) {
    item.feedbackIds = [];
  }
  item.feedbackIds = item.feedbackIds
    .filter((entry) => typeof entry === 'string' && entry.trim())
    .map((entry) => entry.trim())
    .slice(0, 400);
  if (typeof item.startDate !== 'string') {
    item.startDate = '';
  }
  if (typeof item.endDate !== 'string') {
    item.endDate = '';
  }
  if (typeof item.createdAt !== 'string' || !item.createdAt) {
    item.createdAt = new Date().toISOString();
  }
  if (typeof item.updatedAt !== 'string' || !item.updatedAt) {
    item.updatedAt = item.createdAt;
  }
  if (typeof item.ownerUserId !== 'string') {
    item.ownerUserId = '';
  }
  return item;
}

function ensurePilotParticipantShape(participant) {
  if (typeof participant.id !== 'string' || !participant.id) {
    participant.id = randomUUID();
  }
  if (typeof participant.userId !== 'string') {
    participant.userId = '';
  }
  if (!PILOT_STATUSES.has(participant.status)) {
    participant.status = 'requested';
  }
  if (typeof participant.contact !== 'string') {
    participant.contact = '';
  }
  if (typeof participant.note !== 'string') {
    participant.note = '';
  }
  if (typeof participant.adminNote !== 'string') {
    participant.adminNote = '';
  }
  if (typeof participant.createdAt !== 'string' || !participant.createdAt) {
    participant.createdAt = new Date().toISOString();
  }
  if (typeof participant.updatedAt !== 'string' || !participant.updatedAt) {
    participant.updatedAt = participant.createdAt;
  }
  if (typeof participant.lastEventAt !== 'string') {
    participant.lastEventAt = '';
  }
  return participant;
}

function ensureMetricsShape(metrics) {
  if (typeof metrics.sessionStartedCount !== 'number' || !Number.isFinite(metrics.sessionStartedCount)) {
    metrics.sessionStartedCount = 0;
  }
  if (typeof metrics.sessionCompletedCount !== 'number' || !Number.isFinite(metrics.sessionCompletedCount)) {
    metrics.sessionCompletedCount = 0;
  }
  if (typeof metrics.sessionFailedCount !== 'number' || !Number.isFinite(metrics.sessionFailedCount)) {
    metrics.sessionFailedCount = 0;
  }
  if (typeof metrics.chunkRejectedCount !== 'number' || !Number.isFinite(metrics.chunkRejectedCount)) {
    metrics.chunkRejectedCount = 0;
  }
  if (typeof metrics.clientCrashCount !== 'number' || !Number.isFinite(metrics.clientCrashCount)) {
    metrics.clientCrashCount = 0;
  }
  if (!Array.isArray(metrics.ttffSamplesMs)) {
    metrics.ttffSamplesMs = [];
  }
  metrics.ttffSamplesMs = metrics.ttffSamplesMs
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 120000)
    .slice(-400);
  if (typeof metrics.lastUpdatedAt !== 'string') {
    metrics.lastUpdatedAt = '';
  }
}

function metricsTouch(metrics) {
  metrics.lastUpdatedAt = new Date().toISOString();
}

function pushTtffSample(metrics, sampleMs) {
  const value = Number(sampleMs);
  if (!Number.isFinite(value) || value < 0 || value > 120000) {
    return;
  }
  metrics.ttffSamplesMs.push(Math.round(value));
  if (metrics.ttffSamplesMs.length > 400) {
    metrics.ttffSamplesMs = metrics.ttffSamplesMs.slice(-400);
  }
}

function percentile(values, p) {
  if (!Array.isArray(values) || !values.length) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[index];
}

function buildPilotSummary(participants = []) {
  const byStatus = {
    requested: 0,
    approved: 0,
    active: 0,
    paused: 0,
    removed: 0,
    rejected: 0
  };

  for (const participant of participants) {
    const status = PILOT_STATUSES.has(participant.status) ? participant.status : 'requested';
    byStatus[status] += 1;
  }

  const enrolledCount = participants.filter((participant) => participant.status !== 'removed' && participant.status !== 'rejected').length;
  const spotsRemaining = Math.max(0, PILOT_MAX_TARGET - enrolledCount);
  const progressPct = PILOT_MAX_TARGET > 0 ? Number(((enrolledCount / PILOT_MAX_TARGET) * 100).toFixed(2)) : 0;

  return {
    enrolledCount,
    activeCount: byStatus.active,
    spotsRemaining,
    minTarget: PILOT_MIN_TARGET,
    maxTarget: PILOT_MAX_TARGET,
    minReached: enrolledCount >= PILOT_MIN_TARGET,
    progressPct,
    byStatus
  };
}

function ensureUserShape(userId, user) {
  if (typeof user.completedVideoCount !== 'number' || !Number.isFinite(user.completedVideoCount)) {
    user.completedVideoCount = 0;
  }
  if (typeof user.reputation !== 'number' || !Number.isFinite(user.reputation)) {
    user.reputation = 100;
  }
  if (typeof user.helpfulActions !== 'number' || !Number.isFinite(user.helpfulActions)) {
    user.helpfulActions = 0;
  }
  if (typeof user.strikes !== 'number' || !Number.isFinite(user.strikes)) {
    user.strikes = 0;
  }
  if (typeof user.lastChatAt !== 'string') {
    user.lastChatAt = '';
  }
  if (typeof user.lastChatText !== 'string') {
    user.lastChatText = '';
  }
  if (typeof user.lastChatTextAt !== 'string') {
    user.lastChatTextAt = '';
  }
  if (typeof userId === 'string' && typeof user.userId !== 'string') {
    user.userId = userId;
  }
  if (typeof user.provider !== 'string') {
    user.provider = 'guest';
  }
  if (typeof user.googleSub !== 'string') {
    user.googleSub = '';
  }
  if (typeof user.emailMasked !== 'string') {
    user.emailMasked = '';
  }
  if (!ALLOWED_AVATARS.has(user.avatar)) {
    user.avatar = 'anonymous';
  }
  if (typeof user.isAnonymous !== 'boolean') {
    user.isAnonymous = true;
  }
  if (typeof user.publicAlias !== 'string' || !user.publicAlias) {
    user.publicAlias = `u-${userId.slice(-6)}`;
  }
  if (typeof user.loggedIn !== 'boolean') {
    user.loggedIn = false;
  }
  if (typeof user.lastLoginAt !== 'string') {
    user.lastLoginAt = '';
  }
  if (typeof user.lastLogoutAt !== 'string') {
    user.lastLogoutAt = '';
  }
  if (typeof user.authTokenHash !== 'string') {
    user.authTokenHash = '';
  }
  if (typeof user.authTokenExpiresAt !== 'string') {
    user.authTokenExpiresAt = '';
  }
  if (typeof user.isAdmin !== 'boolean') {
    user.isAdmin = false;
  }
  if (typeof user.mutedUntil !== 'string') {
    user.mutedUntil = '';
  }
  if (typeof user.muteReason !== 'string') {
    user.muteReason = '';
  }
}

function applyUserRoleFromConfig(user) {
  if (!user || typeof user.userId !== 'string') {
    return;
  }
  if (ADMIN_USER_IDS.has(user.userId)) {
    user.isAdmin = true;
  }
}

function isUserMuted(user) {
  if (!user || !user.mutedUntil) {
    return false;
  }
  const mutedUntilMs = new Date(user.mutedUntil).getTime();
  return Number.isFinite(mutedUntilMs) && mutedUntilMs > Date.now();
}

function ensureReportShape(report) {
  if (typeof report.id !== 'string' || !report.id) {
    report.id = randomUUID();
  }
  if (typeof report.videoId !== 'string') {
    report.videoId = '';
  }
  if (typeof report.messageId !== 'string') {
    report.messageId = '';
  }
  if (typeof report.reporterUserId !== 'string') {
    report.reporterUserId = '';
  }
  if (typeof report.reason !== 'string') {
    report.reason = '';
  }
  if (typeof report.createdAt !== 'string' || !report.createdAt) {
    report.createdAt = new Date().toISOString();
  }
  if (!REPORT_STATUSES.has(report.status)) {
    report.status = 'open';
  }
  if (typeof report.adminNote !== 'string') {
    report.adminNote = '';
  }
  if (typeof report.updatedAt !== 'string') {
    report.updatedAt = '';
  }
  if (!Array.isArray(report.history)) {
    report.history = [];
  }
  report.history = report.history
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      action: typeof item.action === 'string' ? item.action : 'unknown',
      adminUserId: typeof item.adminUserId === 'string' ? item.adminUserId : '',
      note: typeof item.note === 'string' ? item.note : '',
      at: typeof item.at === 'string' && item.at ? item.at : new Date().toISOString()
    }));

  return report;
}

function ensureLicenseShape(license) {
  if (typeof license.id !== 'string' || !license.id) {
    license.id = randomUUID();
  }
  if (typeof license.videoId !== 'string') {
    license.videoId = '';
  }
  if (typeof license.creatorUserId !== 'string') {
    license.creatorUserId = '';
  }
  if (typeof license.buyerName !== 'string') {
    license.buyerName = '';
  }
  if (typeof license.buyerContact !== 'string') {
    license.buyerContact = '';
  }
  if (!LICENSE_STATUSES.has(license.status)) {
    license.status = 'requested';
  }
  if (typeof license.amountCents !== 'number' || !Number.isFinite(license.amountCents)) {
    license.amountCents = 0;
  }
  if (typeof license.platformFeePct !== 'number' || !Number.isFinite(license.platformFeePct)) {
    license.platformFeePct = 20;
  }
  if (typeof license.creatorPayoutCents !== 'number' || !Number.isFinite(license.creatorPayoutCents)) {
    license.creatorPayoutCents = 0;
  }
  if (typeof license.currency !== 'string') {
    license.currency = 'EUR';
  }
  if (typeof license.createdAt !== 'string' || !license.createdAt) {
    license.createdAt = new Date().toISOString();
  }
  if (typeof license.updatedAt !== 'string') {
    license.updatedAt = '';
  }
  if (typeof license.paidAt !== 'string') {
    license.paidAt = '';
  }
  if (typeof license.deliveredAt !== 'string') {
    license.deliveredAt = '';
  }
  if (typeof license.txRef !== 'string') {
    license.txRef = '';
  }
  if (typeof license.note !== 'string') {
    license.note = '';
  }
  return license;
}

function ensureProofShape(proof) {
  if (typeof proof.id !== 'string' || !proof.id) {
    proof.id = randomUUID();
  }
  if (typeof proof.day !== 'string') {
    proof.day = '';
  }
  if (typeof proof.merkleRoot !== 'string') {
    proof.merkleRoot = '';
  }
  if (typeof proof.txRef !== 'string') {
    proof.txRef = '';
  }
  if (typeof proof.chain !== 'string') {
    proof.chain = 'polygon';
  }
  if (typeof proof.createdAt !== 'string' || !proof.createdAt) {
    proof.createdAt = new Date().toISOString();
  }
  return proof;
}

function ensureAuditShape(entry) {
  if (typeof entry.id !== 'string' || !entry.id) {
    entry.id = randomUUID();
  }
  if (typeof entry.type !== 'string') {
    entry.type = 'unknown';
  }
  if (typeof entry.userId !== 'string') {
    entry.userId = '';
  }
  if (typeof entry.at !== 'string' || !entry.at) {
    entry.at = new Date().toISOString();
  }
  if (!entry.payload || typeof entry.payload !== 'object') {
    entry.payload = {};
  }
  return entry;
}

function appendAudit(db, type, userId = '', payload = {}) {
  db.auditLogs.push(
    ensureAuditShape({
      id: randomUUID(),
      type,
      userId,
      at: new Date().toISOString(),
      payload
    })
  );
  if (db.auditLogs.length > 10000) {
    db.auditLogs = db.auditLogs.slice(-10000);
  }
}

function sha256FileHex(filePath) {
  const hash = createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function hashPair(left, right) {
  return createHash('sha256').update(`${left}:${right}`).digest('hex');
}

function buildMerkleRoot(hashes) {
  const clean = hashes
    .filter((value) => typeof value === 'string' && /^[a-f0-9]{32,128}$/i.test(value))
    .map((value) => value.toLowerCase());
  if (!clean.length) {
    return '';
  }
  let layer = clean;
  while (layer.length > 1) {
    const next = [];
    for (let index = 0; index < layer.length; index += 2) {
      const left = layer[index];
      const right = layer[index + 1] || left;
      next.push(hashPair(left, right));
    }
    layer = next;
  }
  return layer[0];
}

async function transcodeToMp4(inputPath, outputPath) {
  if (!FFMPEG_ENABLED) {
    throw new Error('FFmpeg processing disabled.');
  }
  return await new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i',
      inputPath,
      '-c:v',
      'libx264',
      '-preset',
      FFMPEG_PRESET,
      '-crf',
      String(Math.max(18, Math.min(40, FFMPEG_CRF))),
      '-movflags',
      '+faststart',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      outputPath
    ];

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += String(chunk || '');
    });
    proc.on('error', (error) => reject(error));
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with ${code}: ${stderr.slice(-400)}`));
    });
  });
}

async function transcodeToHlsVariant(inputPath, outputDir, variant) {
  if (!FFMPEG_ENABLED) {
    throw new Error('FFmpeg processing disabled.');
  }

  const playlistPath = path.join(outputDir, `${variant.name}.m3u8`);
  const segmentPattern = path.join(outputDir, `${variant.name}_%03d.ts`);

  return await new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i',
      inputPath,
      '-vf',
      `scale=-2:${variant.height}`,
      '-c:v',
      'libx264',
      '-preset',
      FFMPEG_PRESET,
      '-profile:v',
      'main',
      '-level',
      '3.1',
      '-b:v',
      variant.videoBitrate,
      '-maxrate',
      variant.maxrate,
      '-bufsize',
      variant.bufsize,
      '-g',
      '48',
      '-keyint_min',
      '48',
      '-sc_threshold',
      '0',
      '-c:a',
      'aac',
      '-b:a',
      variant.audioBitrate,
      '-ac',
      '2',
      '-ar',
      '48000',
      '-hls_time',
      '4',
      '-hls_playlist_type',
      'vod',
      '-hls_flags',
      'independent_segments',
      '-hls_segment_filename',
      segmentPattern,
      playlistPath
    ];

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += String(chunk || '');
    });
    proc.on('error', (error) => reject(error));
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(playlistPath)) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg hls(${variant.name}) exited with ${code}: ${stderr.slice(-400)}`));
    });
  });
}

async function generateHlsPack(inputPath, sessionId) {
  if (!FFMPEG_ENABLED) {
    return { hlsMasterUrl: '', hlsVariants: [] };
  }

  const sessionHlsDir = path.join(uploadsDir, 'hls', sessionId);
  fs.rmSync(sessionHlsDir, { recursive: true, force: true });
  fs.mkdirSync(sessionHlsDir, { recursive: true });

  const readyVariants = [];
  for (const variant of HLS_VARIANTS) {
    try {
      await transcodeToHlsVariant(inputPath, sessionHlsDir, variant);
      readyVariants.push({
        name: variant.name,
        bandwidth: variant.bandwidth,
        resolution: variant.resolution,
        playlistUrl: `/uploads/hls/${sessionId}/${variant.name}.m3u8`
      });
    } catch {
      continue;
    }
  }

  if (!readyVariants.length) {
    fs.rmSync(sessionHlsDir, { recursive: true, force: true });
    throw new Error('hls_generation_failed');
  }

  const masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
  for (const variant of readyVariants) {
    masterLines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${variant.resolution},CODECS="avc1.42e01e,mp4a.40.2"`,
      `${variant.name}.m3u8`
    );
  }

  fs.writeFileSync(path.join(sessionHlsDir, 'master.m3u8'), `${masterLines.join('\n')}\n`, 'utf-8');
  return {
    hlsMasterUrl: `/uploads/hls/${sessionId}/master.m3u8`,
    hlsVariants: readyVariants
  };
}

function csvEscape(value) {
  const raw = String(value ?? '');
  return `"${raw.replace(/"/g, '""')}"`;
}

function formatReportsCsv(reports) {
  const header = [
    'id',
    'createdAt',
    'updatedAt',
    'status',
    'videoId',
    'messageId',
    'reporterUserId',
    'reason',
    'adminNote',
    'historyCount',
    'latestHistoryAction',
    'latestHistoryAdminUserId',
    'latestHistoryAt',
    'latestHistoryNote'
  ];

  const lines = [header.join(',')];
  for (const report of reports) {
    const safeReport = ensureReportShape(report);
    const latestHistory = safeReport.history.length ? safeReport.history[safeReport.history.length - 1] : null;
    const row = [
      safeReport.id,
      safeReport.createdAt,
      safeReport.updatedAt,
      safeReport.status,
      safeReport.videoId,
      safeReport.messageId,
      safeReport.reporterUserId,
      safeReport.reason,
      safeReport.adminNote,
      String(safeReport.history.length),
      latestHistory ? latestHistory.action : '',
      latestHistory ? latestHistory.adminUserId : '',
      latestHistory ? latestHistory.at : '',
      latestHistory ? latestHistory.note : ''
    ];
    lines.push(row.map(csvEscape).join(','));
  }

  return lines.join('\n');
}

function sanitizeAvatar(value) {
  return ALLOWED_AVATARS.has(value) ? value : 'anonymous';
}

function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) {
    return '';
  }
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return '';
  }
  const prefix = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0] || '*'}*`;
  return `${prefix}@${domain}`;
}

function toPublicAuthor(user, fallbackUserId) {
  const avatar = sanitizeAvatar(user && user.avatar);
  if (!user) {
    return {
      authorId: fallbackUserId,
      authorLabel: `u-${String(fallbackUserId || '').slice(-6)}`,
      avatar: 'anonymous',
      isAnonymous: true
    };
  }

  const authorLabel = user.isAnonymous ? 'anonymous' : (user.publicAlias || `u-${String(fallbackUserId || '').slice(-6)}`);
  return {
    authorId: user.userId || fallbackUserId,
    authorLabel,
    avatar,
    isAnonymous: Boolean(user.isAnonymous)
  };
}

function hashToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

function issueAuthToken(user) {
  const rawToken = randomBytes(32).toString('hex');
  user.authTokenHash = hashToken(rawToken);
  user.authTokenExpiresAt = new Date(Date.now() + AUTH_SESSION_TTL_MS).toISOString();
  return {
    token: rawToken,
    expiresAt: user.authTokenExpiresAt
  };
}

function parseBearerToken(req) {
  const authorization = req.header('authorization') || '';
  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return '';
  }
  return authorization.slice(7).trim();
}

function resolveAuthUserByToken(db, token) {
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  for (const [userId, user] of Object.entries(db.users)) {
    ensureUserShape(userId, user);
    if (user.authTokenHash !== tokenHash) {
      continue;
    }

    const expiresAt = new Date(user.authTokenExpiresAt).getTime();
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      user.authTokenHash = '';
      user.authTokenExpiresAt = '';
      user.loggedIn = false;
      return null;
    }

    return { userId, user };
  }

  return null;
}

function resolveAuthUser(db, req) {
  const token = parseBearerToken(req);
  return resolveAuthUserByToken(db, token);
}

function requireAuthUser(db, req, res) {
  const auth = resolveAuthUser(db, req);
  if (!auth) {
    res.status(401).json({ error: 'Valid auth session is required.' });
    return null;
  }
  return auth;
}

function requireSameUser(authUserId, targetUserId, res) {
  if (authUserId !== targetUserId) {
    res.status(403).json({ error: 'Action is allowed only for the authenticated user.' });
    return false;
  }
  return true;
}

function requireAdmin(auth, res) {
  if (!auth || !auth.user || !auth.user.isAdmin) {
    res.status(403).json({ error: 'Admin privileges are required.' });
    return false;
  }
  return true;
}

async function verifyGoogleCredential(credential) {
  if (!googleClient || !GOOGLE_CLIENT_ID) {
    const error = new Error('Google auth is not configured on this server.');
    error.code = 'google_not_configured';
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.sub) {
    const error = new Error('Invalid Google credential payload.');
    error.code = 'google_invalid';
    throw error;
  }

  return {
    googleSub: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : ''
  };
}

function ensureSessionShape(session) {
  if (typeof session.views !== 'number' || !Number.isFinite(session.views)) {
    session.views = 0;
  }
  if (!session.ratings || typeof session.ratings !== 'object') {
    session.ratings = {};
  }
  if (!Array.isArray(session.chat)) {
    session.chat = [];
  }
  if (typeof session.proofHash !== 'string' && session.proofHash !== null) {
    session.proofHash = null;
  }
  if (typeof session.incidentTitle !== 'string') {
    session.incidentTitle = '';
  }
  if (typeof session.incidentTags !== 'string') {
    session.incidentTags = '';
  }
  if (typeof session.processingError !== 'string') {
    session.processingError = '';
  }
  if (typeof session.chunkCryptoKey !== 'string') {
    session.chunkCryptoKey = '';
  }
  if (typeof session.chunkEncryption !== 'string') {
    session.chunkEncryption = '';
  }
  if (typeof session.captureProfile !== 'string') {
    session.captureProfile = '';
  }
  if (typeof session.hlsMasterUrl !== 'string') {
    session.hlsMasterUrl = '';
  }
  if (!Array.isArray(session.hlsVariants)) {
    session.hlsVariants = [];
  }
  session.hlsVariants = session.hlsVariants
    .filter((variant) => variant && typeof variant === 'object')
    .map((variant) => ({
      name: typeof variant.name === 'string' ? variant.name.slice(0, 24) : '',
      bandwidth: Number.isFinite(Number(variant.bandwidth)) ? Number(variant.bandwidth) : 0,
      resolution: typeof variant.resolution === 'string' ? variant.resolution.slice(0, 32) : '',
      playlistUrl: typeof variant.playlistUrl === 'string' ? variant.playlistUrl.slice(0, 256) : ''
    }))
    .filter((variant) => variant.name && variant.bandwidth > 0 && variant.playlistUrl);
  if (typeof session.hlsError !== 'string') {
    session.hlsError = '';
  }
  if (typeof session.firstChunkAt !== 'string') {
    session.firstChunkAt = '';
  }
}

function decodeBase64(value) {
  try {
    return Buffer.from(String(value || ''), 'base64');
  } catch {
    return null;
  }
}

function decryptChunkAesGcm(encryptedBody, keyB64, ivB64) {
  const key = decodeBase64(keyB64);
  const iv = decodeBase64(ivB64);
  if (!key || key.length !== 32) {
    throw new Error('invalid_chunk_key');
  }
  if (!iv || iv.length < 12 || iv.length > 16) {
    throw new Error('invalid_chunk_iv');
  }
  if (!encryptedBody || encryptedBody.length <= 16) {
    throw new Error('invalid_chunk_payload');
  }

  const tag = encryptedBody.subarray(encryptedBody.length - 16);
  const ciphertext = encryptedBody.subarray(0, encryptedBody.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

function getRatingStats(session) {
  const values = Object.values(session.ratings || {})
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

  if (!values.length) {
    return { ratingAvg: 0, ratingCount: 0 };
  }

  const sum = values.reduce((acc, value) => acc + value, 0);
  const avg = sum / values.length;
  return { ratingAvg: Number(avg.toFixed(2)), ratingCount: values.length };
}

function toPublicVideo(session, usersMap = {}) {
  const { ratingAvg, ratingCount } = getRatingStats(session);
  const user = usersMap[session.userId];
  const author = toPublicAuthor(user, session.userId);
  return {
    id: session.id,
    userId: session.userId,
    fileUrl: `/uploads/${session.filename}`,
    durationMs: session.durationMs,
    totalBytes: session.totalBytes,
    completedAt: session.completedAt,
    processingMode: session.processingMode,
    proofHash: session.proofHash,
    captureProfile: session.captureProfile || '',
    hlsMasterUrl: session.hlsMasterUrl || '',
    hlsVariants: Array.isArray(session.hlsVariants) ? session.hlsVariants : [],
    incidentTitle: session.incidentTitle || '',
    incidentTags: session.incidentTags || '',
    ...author,
    views: session.views || 0,
    ratingAvg,
    ratingCount,
    chatCount: Array.isArray(session.chat) ? session.chat.length : 0
  };
}

function calculateTrendingScore(video) {
  const ageHours = Math.max(0, (Date.now() - new Date(video.completedAt).getTime()) / 3600000);
  const freshness = 1 / (1 + ageHours / 12);
  const ratingBoost = video.ratingCount > 0 ? video.ratingAvg : 0;
  const social = video.chatCount * 0.7;
  const popularity = video.views * 1.2;
  const proofBoost = video.proofHash ? 3 : 0;
  const score = (popularity + ratingBoost * 5 + social + proofBoost) * freshness;
  return Number(score.toFixed(3));
}

function userPublicProfile(userId, user) {
  const author = toPublicAuthor(user, userId);
  return {
    userId,
    ...author,
    provider: user.provider,
    emailMasked: user.emailMasked,
    loggedIn: user.loggedIn,
    isAdmin: Boolean(user.isAdmin),
    mutedUntil: user.mutedUntil || '',
    reputation: user.reputation,
    helpfulActions: user.helpfulActions,
    strikes: user.strikes,
    completedVideoCount: user.completedVideoCount,
    createdAt: user.createdAt || null
  };
}

function loadDb() {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return ensureDbShape(db);
}

function saveDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

function upsertUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      userId,
      provider: 'guest',
      googleSub: '',
      emailMasked: '',
      avatar: 'anonymous',
      isAnonymous: true,
      publicAlias: `u-${userId.slice(-6)}`,
      loggedIn: false,
      isAdmin: false,
      mutedUntil: '',
      muteReason: '',
      lastLoginAt: '',
      lastLogoutAt: '',
      authTokenHash: '',
      authTokenExpiresAt: '',
      completedVideoCount: 0,
      reputation: 100,
      helpfulActions: 0,
      strikes: 0,
      lastChatAt: '',
      lastChatText: '',
      lastChatTextAt: '',
      createdAt: new Date().toISOString()
    };
  }

  ensureUserShape(userId, db.users[userId]);
  applyUserRoleFromConfig(db.users[userId]);
}

const app = express();
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';
const realtimeClients = new Map();
let realtimeRevision = 0;
const rateLimitStore = new Map();

function writeSseEvent(res, eventName, payload) {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastRealtimeUpdate(payload) {
  realtimeRevision += 1;
  const eventPayload = {
    revision: realtimeRevision,
    at: new Date().toISOString(),
    ...payload
  };

  for (const client of realtimeClients.values()) {
    writeSseEvent(client.res, 'sync', eventPayload);
  }
}

function getLanUrls(listenPort) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const net of Object.values(interfaces)) {
    for (const netInfo of net || []) {
      if (netInfo.family === 'IPv4' && !netInfo.internal) {
        urls.push(`http://${netInfo.address}:${listenPort}`);
      }
    }
  }

  return urls;
}

const OPENAPI_ROUTE_CATALOG = [
  { method: 'get', path: '/api/health', tag: 'Public', summary: 'Health check' },
  { method: 'get', path: '/api/config', tag: 'Public', summary: 'Frontend config' },
  { method: 'get', path: '/api/network-urls', tag: 'Public', summary: 'LAN/localhost URLs' },
  { method: 'get', path: '/api/qr', tag: 'Public', summary: 'Generate QR SVG' },
  { method: 'get', path: '/api/docs.json', tag: 'Public', summary: 'OpenAPI JSON spec' },
  { method: 'get', path: '/api/docs', tag: 'Public', summary: 'Swagger UI' },
  { method: 'get', path: '/api/limits/:userId', tag: 'Public', summary: 'User tier limits' },
  { method: 'get', path: '/api/videos/:userId', tag: 'Public', summary: 'Completed videos by user' },
  { method: 'get', path: '/api/feed', tag: 'Public', summary: 'Public feed' },
  { method: 'post', path: '/api/licenses/request', tag: 'Licensing', summary: 'Create license request' },
  { method: 'get', path: '/api/licenses', tag: 'Licensing', summary: 'List licenses' },
  { method: 'get', path: '/api/payouts/summary', tag: 'Licensing', summary: 'Payout aggregate' },
  { method: 'get', path: '/api/nodes', tag: 'Nodes', summary: 'List community nodes' },

  { method: 'post', path: '/api/auth/session', tag: 'Auth', summary: 'Create auth session' },
  { method: 'get', path: '/api/auth/me', tag: 'Auth', summary: 'Session introspection', auth: true },
  { method: 'post', path: '/api/auth/logout', tag: 'Auth', summary: 'Logout session', auth: true },

  { method: 'post', path: '/api/moderation/report', tag: 'Moderation', summary: 'Report chat message', auth: true },
  { method: 'get', path: '/api/moderation/reports', tag: 'Moderation', summary: 'List reports', auth: true, admin: true },
  { method: 'get', path: '/api/moderation/reports/export', tag: 'Moderation', summary: 'Export reports', auth: true, admin: true },
  { method: 'post', path: '/api/moderation/reports/:reportId/status', tag: 'Moderation', summary: 'Update report status', auth: true, admin: true },
  { method: 'post', path: '/api/moderation/reports/bulk-status', tag: 'Moderation', summary: 'Bulk update report status', auth: true, admin: true },
  { method: 'post', path: '/api/moderation/mute', tag: 'Moderation', summary: 'Mute user', auth: true, admin: true },
  { method: 'post', path: '/api/moderation/unmute', tag: 'Moderation', summary: 'Unmute user', auth: true, admin: true },

  { method: 'get', path: '/api/pilot/me', tag: 'Pilot', summary: 'Current pilot status', auth: true },
  { method: 'post', path: '/api/pilot/enroll', tag: 'Pilot', summary: 'Enroll in pilot', auth: true },
  { method: 'get', path: '/api/pilot/participants', tag: 'Pilot', summary: 'Pilot participants list', auth: true, admin: true },
  { method: 'post', path: '/api/pilot/participants/:participantId/status', tag: 'Pilot', summary: 'Update pilot participant status', auth: true, admin: true },
  { method: 'get', path: '/api/pilot/summary', tag: 'Pilot', summary: 'Pilot summary', auth: true, admin: true },

  { method: 'post', path: '/api/feedback', tag: 'Feedback', summary: 'Submit feedback', auth: true },
  { method: 'get', path: '/api/feedback/my', tag: 'Feedback', summary: 'My feedback entries', auth: true },
  { method: 'get', path: '/api/feedback', tag: 'Feedback', summary: 'Feedback queue', auth: true, admin: true },
  { method: 'post', path: '/api/feedback/:feedbackId/status', tag: 'Feedback', summary: 'Update feedback status', auth: true, admin: true },
  { method: 'post', path: '/api/iterations', tag: 'Feedback', summary: 'Create iteration', auth: true, admin: true },
  { method: 'get', path: '/api/iterations', tag: 'Feedback', summary: 'List iterations', auth: true, admin: true },
  { method: 'post', path: '/api/iterations/:iterationId/status', tag: 'Feedback', summary: 'Update iteration status', auth: true, admin: true },

  { method: 'get', path: '/api/realtime/stream', tag: 'Realtime', summary: 'SSE realtime stream', auth: true },
  { method: 'post', path: '/api/sessions', tag: 'Ingest', summary: 'Start capture session', auth: true },
  { method: 'post', path: '/api/sessions/:sessionId/chunks', tag: 'Ingest', summary: 'Upload chunk', auth: true },
  { method: 'post', path: '/api/sessions/:sessionId/complete', tag: 'Ingest', summary: 'Complete capture session', auth: true },
  { method: 'post', path: '/api/client-events', tag: 'Ops', summary: 'Send client telemetry', auth: true },

  { method: 'get', path: '/api/proofs/daily-root', tag: 'Proof', summary: 'Get daily merkle roots' },
  { method: 'post', path: '/api/proofs/anchor', tag: 'Proof', summary: 'Anchor root', auth: true, admin: true },
  { method: 'get', path: '/api/proofs/anchors', tag: 'Proof', summary: 'List anchor entries' },
  { method: 'post', path: '/api/licenses/:licenseId/status', tag: 'Licensing', summary: 'Update license status', auth: true, admin: true },
  { method: 'get', path: '/api/audit', tag: 'Ops', summary: 'Audit logs', auth: true, admin: true },
  { method: 'get', path: '/api/metrics/summary', tag: 'Ops', summary: 'Metrics summary', auth: true, admin: true },

  { method: 'post', path: '/api/videos/:videoId/view', tag: 'Social', summary: 'Increment view count' },
  { method: 'post', path: '/api/videos/:videoId/rate', tag: 'Social', summary: 'Submit rating', auth: true },
  { method: 'get', path: '/api/videos/:videoId/chat', tag: 'Social', summary: 'Read chat thread' },
  { method: 'post', path: '/api/videos/:videoId/chat', tag: 'Social', summary: 'Send chat message', auth: true },
  { method: 'get', path: '/api/users/:userId/profile', tag: 'Social', summary: 'Get private profile', auth: true },
  { method: 'get', path: '/api/leaderboard', tag: 'Social', summary: 'Reputation leaderboard' },

  { method: 'post', path: '/api/nodes/register', tag: 'Nodes', summary: 'Register node' },
  { method: 'post', path: '/api/nodes/:nodeId/heartbeat', tag: 'Nodes', summary: 'Node heartbeat' },
  { method: 'post', path: '/api/nodes/:nodeId/unregister', tag: 'Nodes', summary: 'Unregister node' }
];

function toOpenApiPath(pathTemplate) {
  return pathTemplate.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function getPathParameters(pathTemplate) {
  const matches = pathTemplate.match(/:([A-Za-z0-9_]+)/g) || [];
  return matches.map((segment) => {
    const name = segment.slice(1);
    return {
      name,
      in: 'path',
      required: true,
      schema: { type: 'string' }
    };
  });
}

function buildOpenApiSpec(req) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const paths = {};

  for (const route of OPENAPI_ROUTE_CATALOG) {
    const openApiPath = toOpenApiPath(route.path);
    if (!paths[openApiPath]) {
      paths[openApiPath] = {};
    }

    const operation = {
      tags: [route.tag],
      summary: route.summary,
      responses: {
        200: { description: 'OK' },
        400: { description: 'Bad request' },
        401: { description: 'Unauthorized' },
        403: { description: 'Forbidden' },
        404: { description: 'Not found' },
        429: { description: 'Too many requests' },
        500: { description: 'Internal server error' }
      }
    };

    const parameters = getPathParameters(route.path);
    if (parameters.length) {
      operation.parameters = parameters;
    }

    if (route.auth || route.admin) {
      operation.security = [{ bearerAuth: [] }];
    }

    if (route.admin) {
      operation.description = 'Admin-only endpoint.';
    }

    paths[openApiPath][route.method] = operation;
  }

  const uniqueTags = [...new Set(OPENAPI_ROUTE_CATALOG.map((entry) => entry.tag))]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name }));

  return {
    openapi: '3.0.3',
    info: {
      title: 'Free Live Personal TV API',
      version: '1.0.0',
      description: 'Swagger/OpenAPI documentation for backend routes.'
    },
    servers: [{ url: baseUrl }],
    tags: uniqueTags,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token'
        }
      }
    },
    paths
  };
}

function getClientIp(req) {
  const forwardedFor = req.header('x-forwarded-for');
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function getRateBucket(key, windowMs) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const next = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(key, next);
    return next;
  }
  return bucket;
}

function createRateLimiter({ name, windowMs, max, keyBuilder }) {
  return (req, res, next) => {
    if (!RATE_LIMIT_ENABLED) {
      next();
      return;
    }
    const scope = keyBuilder(req);
    const bucketKey = `${name}:${scope}`;
    const bucket = getRateBucket(bucketKey, windowMs);
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    const resetSec = Math.max(0, Math.ceil((bucket.resetAt - Date.now()) / 1000));
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(resetSec));

    if (bucket.count > max) {
      res.status(429).json({
        error: 'Too many requests. Please slow down.',
        limit: max,
        retryAfterSec: resetSec
      });
      return;
    }

    next();
  };
}

function basicRequestGuard(req, res, next) {
  const payloadText = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const inspect = `${req.originalUrl || ''} ${payloadText || ''}`.toLowerCase();
  if (inspect.includes('../') || inspect.includes('<script') || inspect.includes('union select')) {
    res.status(403).json({ error: 'Blocked by security policy.' });
    return;
  }
  next();
}

function enforceHttps(req, res, next) {
  if (!REQUIRE_HTTPS) {
    next();
    return;
  }

  const protoHeader = String(req.header('x-forwarded-proto') || '').split(',')[0].trim().toLowerCase();
  const isSecure = req.secure || protoHeader === 'https';
  if (isSecure) {
    next();
    return;
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    const hostHeader = req.header('host') || 'localhost';
    res.redirect(308, `https://${hostHeader}${req.originalUrl || '/'}`);
    return;
  }

  res.status(426).json({ error: 'HTTPS is required for this endpoint.' });
}

app.set('trust proxy', true);
app.use(helmet({
  contentSecurityPolicy: false,
  hsts: REQUIRE_HTTPS
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false
      }
    : false,
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' }
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(basicRequestGuard);
app.use(enforceHttps);
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(publicDir));

const authLimiter = createRateLimiter({
  name: 'auth',
  windowMs: 15 * 60 * 1000,
  max: 40,
  keyBuilder: (req) => getClientIp(req)
});

const apiLimiter = createRateLimiter({
  name: 'api',
  windowMs: 60 * 1000,
  max: 600,
  keyBuilder: (req) => getClientIp(req)
});

const chunkLimiter = createRateLimiter({
  name: 'chunks',
  windowMs: 60 * 1000,
  max: 300,
  keyBuilder: (req) => {
    const userToken = parseBearerToken(req).slice(0, 16);
    return `${getClientIp(req)}:${req.params?.sessionId || 'none'}:${userToken}`;
  }
});

app.use('/api', apiLimiter);

app.get('/api/docs.json', (req, res) => {
  res.json(buildOpenApiSpec(req));
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, {
  swaggerOptions: {
    url: '/api/docs.json'
  },
  customSiteTitle: 'Free Live Personal TV API Docs'
}));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'free-live-personal-tv', time: new Date().toISOString() });
});

app.get('/api/config', (_req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

app.post('/api/auth/session', authLimiter, async (req, res) => {
  const {
    provider = 'guest',
    credential = '',
    preferredUserId = '',
    avatar = 'anonymous',
    isAnonymous = true
  } = req.body || {};

  const db = loadDb();
  let userId = '';
  const newUserId = () => `u-${randomUUID().replace(/-/g, '').slice(0, 10)}`;

  if (provider === 'google') {
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'credential is required for google login.' });
    }

    let verified;
    try {
      verified = await verifyGoogleCredential(credential);
    } catch (error) {
      if (error && error.code === 'google_not_configured') {
        return res.status(503).json({ error: error.message });
      }
      return res.status(401).json({ error: 'Google credential verification failed.' });
    }

    const existing = Object.entries(db.users).find(([, user]) => user.googleSub === verified.googleSub);
    if (existing) {
      userId = existing[0];
    } else {
      userId = newUserId();
      upsertUser(db, userId);
      db.users[userId].provider = 'google';
      db.users[userId].googleSub = verified.googleSub;
      db.users[userId].emailMasked = maskEmail(verified.email);
      db.users[userId].publicAlias = `citizen-${userId.slice(-4)}`;
    }

    if (!db.users[userId].emailMasked && verified.email) {
      db.users[userId].emailMasked = maskEmail(verified.email);
    }
  } else {
    const preferred = typeof preferredUserId === 'string' ? preferredUserId.trim() : '';
    const preferredValid = /^[a-zA-Z0-9_-]{3,40}$/.test(preferred);
    userId = preferredValid ? preferred : newUserId();
    upsertUser(db, userId);
    db.users[userId].provider = 'guest';
    db.users[userId].publicAlias = `citizen-${userId.slice(-4)}`;
  }

  upsertUser(db, userId);
  const user = db.users[userId];
  applyUserRoleFromConfig(user);
  user.avatar = sanitizeAvatar(avatar);
  user.isAnonymous = user.avatar === 'anonymous' ? true : Boolean(isAnonymous);
  user.loggedIn = true;
  user.lastLoginAt = new Date().toISOString();
  const authSession = issueAuthToken(user);
  saveDb(db);

  return res.json({
    ok: true,
    sessionToken: authSession.token,
    sessionExpiresAt: authSession.expiresAt,
    user: userPublicProfile(userId, user)
  });
});

app.get('/api/auth/me', (req, res) => {
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  applyUserRoleFromConfig(auth.user);

  return res.json({
    ok: true,
    sessionExpiresAt: auth.user.authTokenExpiresAt,
    user: userPublicProfile(auth.userId, auth.user)
  });
});

app.post('/api/auth/logout', (req, res) => {
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  auth.user.loggedIn = false;
  auth.user.authTokenHash = '';
  auth.user.authTokenExpiresAt = '';
  auth.user.lastLogoutAt = new Date().toISOString();
  saveDb(db);
  broadcastRealtimeUpdate({ auth: true, userId: auth.userId });

  return res.json({ ok: true });
});

app.post('/api/moderation/report', (req, res) => {
  const { videoId, messageId, reason = '' } = req.body || {};
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'videoId is required.' });
  }
  if (!messageId || typeof messageId !== 'string') {
    return res.status(400).json({ error: 'messageId is required.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const report = {
    id: randomUUID(),
    videoId,
    messageId,
    reporterUserId: auth.userId,
    reason: typeof reason === 'string' ? reason.slice(0, 300) : '',
    createdAt: new Date().toISOString(),
    status: 'open',
    adminNote: '',
    updatedAt: '',
    history: []
  };

  db.reports.push(ensureReportShape(report));
  if (db.reports.length > 3000) {
    db.reports = db.reports.slice(-3000);
  }
  appendAudit(db, 'moderation_report_created', auth.userId, {
    reportId: report.id,
    videoId,
    messageId
  });
  saveDb(db);
  broadcastRealtimeUpdate({ moderation: true });

  return res.status(201).json({ ok: true, reportId: report.id });
});

app.get('/api/moderation/reports', (req, res) => {
  const pageRaw = Number(req.query.page || 1);
  const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
  const limitRaw = Number(req.query.limit || 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, limitRaw)) : 50;
  const status = typeof req.query.status === 'string' && REPORT_STATUSES.has(req.query.status) ? req.query.status : '';
  const reporterUserId = typeof req.query.reporterUserId === 'string' ? req.query.reporterUserId.trim() : '';
  const videoId = typeof req.query.videoId === 'string' ? req.query.videoId.trim() : '';
  const from = typeof req.query.from === 'string' ? req.query.from.trim() : '';
  const to = typeof req.query.to === 'string' ? req.query.to.trim() : '';
  const fromMs = from ? new Date(from).getTime() : NaN;
  const toMs = to ? new Date(to).getTime() : NaN;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const filtered = db.reports
    .filter((report) => {
      if (status && report.status !== status) {
        return false;
      }
      if (reporterUserId && report.reporterUserId !== reporterUserId) {
        return false;
      }
      if (videoId && report.videoId !== videoId) {
        return false;
      }

      const createdMs = new Date(report.createdAt).getTime();
      if (Number.isFinite(fromMs) && (!Number.isFinite(createdMs) || createdMs < fromMs)) {
        return false;
      }
      if (Number.isFinite(toMs) && (!Number.isFinite(createdMs) || createdMs > toMs + 24 * 3600 * 1000 - 1)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;
  const reports = filtered.slice(start, start + limit);

  return res.json({
    reports,
    pagination: {
      page: safePage,
      limit,
      total,
      pages
    }
  });
});

app.get('/api/moderation/reports/export', (req, res) => {
  const formatRaw = typeof req.query.format === 'string' ? req.query.format.trim().toLowerCase() : 'json';
  const format = formatRaw === 'csv' ? 'csv' : 'json';
  const limitRaw = Number(req.query.limit || 1000);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(3000, limitRaw)) : 1000;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const exportedAt = new Date().toISOString();
  const reports = db.reports
    .slice(-limit)
    .reverse()
    .map((report) => ensureReportShape({ ...report }));

  if (format === 'csv') {
    const csv = formatReportsCsv(reports);
    const filename = `moderation-reports-${exportedAt.slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csv);
  }

  const filename = `moderation-reports-${exportedAt.slice(0, 19).replace(/[:T]/g, '-')}.json`;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.json({
    ok: true,
    exportedAt,
    count: reports.length,
    reports
  });
});

app.post('/api/moderation/reports/:reportId/status', (req, res) => {
  const { reportId } = req.params;
  const { status, adminNote = '' } = req.body || {};

  if (!REPORT_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be one of: open, resolved, rejected.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const report = db.reports.find((entry) => entry.id === reportId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  ensureReportShape(report);
  report.status = status;
  report.adminNote = typeof adminNote === 'string' ? adminNote.slice(0, 500) : '';
  report.updatedAt = new Date().toISOString();
  report.history.push({
    action: 'status_update',
    adminUserId: auth.userId,
    note: report.adminNote,
    at: report.updatedAt
  });

  if (report.history.length > 100) {
    report.history = report.history.slice(-100);
  }

  appendAudit(db, 'moderation_report_status_update', auth.userId, {
    reportId,
    status: report.status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ moderation: true, reportId, status: report.status });

  return res.json({ ok: true, report: ensureReportShape(report) });
});

app.post('/api/moderation/reports/bulk-status', (req, res) => {
  const { reportIds = [], status, adminNote = '' } = req.body || {};

  if (!Array.isArray(reportIds) || !reportIds.length) {
    return res.status(400).json({ error: 'reportIds must be a non-empty array.' });
  }
  if (reportIds.length > 500) {
    return res.status(400).json({ error: 'reportIds max length is 500.' });
  }
  if (!REPORT_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be one of: open, resolved, rejected.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const ids = Array.from(new Set(reportIds.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim())));
  if (!ids.length) {
    return res.status(400).json({ error: 'No valid report IDs provided.' });
  }

  const note = typeof adminNote === 'string' ? adminNote.slice(0, 500) : '';
  const updatedAt = new Date().toISOString();
  const updatedIds = [];
  const missingIds = [];

  for (const id of ids) {
    const report = db.reports.find((entry) => entry.id === id);
    if (!report) {
      missingIds.push(id);
      continue;
    }

    ensureReportShape(report);
    report.status = status;
    report.adminNote = note;
    report.updatedAt = updatedAt;
    report.history.push({
      action: 'bulk_status_update',
      adminUserId: auth.userId,
      note,
      at: updatedAt
    });
    if (report.history.length > 100) {
      report.history = report.history.slice(-100);
    }
    updatedIds.push(id);
  }

  appendAudit(db, 'moderation_reports_bulk_status_update', auth.userId, {
    status,
    updatedCount: updatedIds.length,
    missingCount: missingIds.length
  });
  saveDb(db);
  broadcastRealtimeUpdate({ moderation: true, status, updatedCount: updatedIds.length });

  return res.json({
    ok: true,
    status,
    updatedCount: updatedIds.length,
    updatedIds,
    missingIds
  });
});

app.post('/api/moderation/mute', (req, res) => {
  const { targetUserId, minutes = 30, reason = '' } = req.body || {};
  if (!targetUserId || typeof targetUserId !== 'string') {
    return res.status(400).json({ error: 'targetUserId is required.' });
  }

  const muteMinutes = Number(minutes);
  if (!Number.isFinite(muteMinutes) || muteMinutes < 1 || muteMinutes > 10080) {
    return res.status(400).json({ error: 'minutes must be between 1 and 10080.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  upsertUser(db, targetUserId);
  const target = db.users[targetUserId];
  target.mutedUntil = new Date(Date.now() + muteMinutes * 60 * 1000).toISOString();
  target.muteReason = typeof reason === 'string' ? reason.slice(0, 300) : '';

  appendAudit(db, 'moderation_user_muted', auth.userId, {
    targetUserId,
    mutedUntil: target.mutedUntil
  });
  saveDb(db);
  broadcastRealtimeUpdate({ moderation: true, userId: targetUserId });

  return res.json({ ok: true, targetUserId, mutedUntil: target.mutedUntil });
});

app.post('/api/moderation/unmute', (req, res) => {
  const { targetUserId } = req.body || {};
  if (!targetUserId || typeof targetUserId !== 'string') {
    return res.status(400).json({ error: 'targetUserId is required.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  upsertUser(db, targetUserId);
  const target = db.users[targetUserId];
  target.mutedUntil = '';
  target.muteReason = '';

  appendAudit(db, 'moderation_user_unmuted', auth.userId, {
    targetUserId
  });
  saveDb(db);
  broadcastRealtimeUpdate({ moderation: true, userId: targetUserId });

  return res.json({ ok: true, targetUserId });
});

app.get('/api/pilot/me', (req, res) => {
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const participant = db.pilotParticipants.find((entry) => entry.userId === auth.userId) || null;
  return res.json({
    participant,
    summary: buildPilotSummary(db.pilotParticipants)
  });
});

app.post('/api/pilot/enroll', (req, res) => {
  const { contact = '', note = '' } = req.body || {};
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const nowIso = new Date().toISOString();
  let participant = db.pilotParticipants.find((entry) => entry.userId === auth.userId);
  const summaryBefore = buildPilotSummary(db.pilotParticipants);

  if (!participant && summaryBefore.enrolledCount >= PILOT_MAX_TARGET) {
    return res.status(409).json({ error: 'Closed beta cohort is currently full.' });
  }

  if (!participant) {
    participant = ensurePilotParticipantShape({
      id: randomUUID(),
      userId: auth.userId,
      status: 'requested',
      contact: String(contact || '').slice(0, 180),
      note: String(note || '').slice(0, 300),
      adminNote: '',
      createdAt: nowIso,
      updatedAt: nowIso,
      lastEventAt: nowIso
    });
    db.pilotParticipants.push(participant);
  } else {
    participant = ensurePilotParticipantShape(participant);
    if (participant.status === 'removed' || participant.status === 'rejected') {
      participant.status = 'requested';
    }
    participant.contact = String(contact || participant.contact || '').slice(0, 180);
    participant.note = String(note || participant.note || '').slice(0, 300);
    participant.updatedAt = nowIso;
    participant.lastEventAt = nowIso;
  }

  appendAudit(db, 'pilot_enroll_request', auth.userId, {
    participantId: participant.id,
    status: participant.status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ pilot: true, userId: auth.userId });

  return res.status(201).json({
    ok: true,
    participant,
    summary: buildPilotSummary(db.pilotParticipants)
  });
});

app.get('/api/pilot/participants', (req, res) => {
  const status = typeof req.query.status === 'string' && PILOT_STATUSES.has(req.query.status) ? req.query.status : '';
  const pageRaw = Number(req.query.page || 1);
  const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
  const limitRaw = Number(req.query.limit || 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, limitRaw)) : 50;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const filtered = db.pilotParticipants.filter((participant) => !status || participant.status === status);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;

  return res.json({
    participants: filtered.slice(start, start + limit),
    pagination: {
      page: safePage,
      pages,
      total,
      limit
    },
    summary: buildPilotSummary(db.pilotParticipants)
  });
});

app.post('/api/pilot/participants/:participantId/status', (req, res) => {
  const { participantId } = req.params;
  const { status, adminNote = '' } = req.body || {};
  if (!PILOT_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid pilot status.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const participant = db.pilotParticipants.find((entry) => entry.id === participantId);
  if (!participant) {
    return res.status(404).json({ error: 'Pilot participant not found.' });
  }

  const summaryBefore = buildPilotSummary(db.pilotParticipants);
  const wasEnrolled = participant.status !== 'removed' && participant.status !== 'rejected';
  const willBeEnrolled = status !== 'removed' && status !== 'rejected';
  if (!wasEnrolled && willBeEnrolled && summaryBefore.enrolledCount >= PILOT_MAX_TARGET) {
    return res.status(409).json({ error: 'Closed beta cohort is currently full.' });
  }

  participant.status = status;
  participant.adminNote = String(adminNote || '').slice(0, 300);
  participant.updatedAt = new Date().toISOString();
  participant.lastEventAt = participant.updatedAt;

  appendAudit(db, 'pilot_status_update', auth.userId, {
    participantId: participant.id,
    userId: participant.userId,
    status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ pilot: true, moderation: true });

  return res.json({
    ok: true,
    participant,
    summary: buildPilotSummary(db.pilotParticipants)
  });
});

app.get('/api/pilot/summary', (req, res) => {
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  return res.json({ summary: buildPilotSummary(db.pilotParticipants) });
});

app.post('/api/feedback', (req, res) => {
  const { category = 'general', message = '', contact = '' } = req.body || {};
  const text = typeof message === 'string' ? message.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'Feedback message is required.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const feedback = ensureFeedbackItemShape({
    id: randomUUID(),
    userId: auth.userId,
    category: typeof category === 'string' ? category.trim().slice(0, 40) || 'general' : 'general',
    message: text.slice(0, 1200),
    contact: typeof contact === 'string' ? contact.trim().slice(0, 180) : '',
    status: 'open',
    adminNote: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  db.feedbackItems.push(feedback);
  appendAudit(db, 'feedback_submitted', auth.userId, {
    feedbackId: feedback.id,
    category: feedback.category
  });
  saveDb(db);
  broadcastRealtimeUpdate({ feedback: true, userId: auth.userId });

  return res.status(201).json({ ok: true, feedback });
});

app.get('/api/feedback/my', (req, res) => {
  const limitRaw = Number(req.query.limit || 20);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, limitRaw)) : 20;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const items = db.feedbackItems
    .filter((item) => item.userId === auth.userId)
    .slice(0, limit);
  return res.json({ items });
});

app.get('/api/feedback', (req, res) => {
  const status = typeof req.query.status === 'string' && FEEDBACK_STATUSES.has(req.query.status) ? req.query.status : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const pageRaw = Number(req.query.page || 1);
  const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
  const limitRaw = Number(req.query.limit || 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(300, limitRaw)) : 50;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const filtered = db.feedbackItems.filter((item) => {
    if (status && item.status !== status) {
      return false;
    }
    if (category && item.category !== category) {
      return false;
    }
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;

  return res.json({
    items: filtered.slice(start, start + limit),
    pagination: {
      page: safePage,
      pages,
      total,
      limit
    }
  });
});

app.post('/api/feedback/:feedbackId/status', (req, res) => {
  const { feedbackId } = req.params;
  const { status, adminNote = '' } = req.body || {};
  if (!FEEDBACK_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid feedback status.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const feedback = db.feedbackItems.find((item) => item.id === feedbackId);
  if (!feedback) {
    return res.status(404).json({ error: 'Feedback item not found.' });
  }

  feedback.status = status;
  feedback.adminNote = typeof adminNote === 'string' ? adminNote.slice(0, 400) : '';
  feedback.updatedAt = new Date().toISOString();

  appendAudit(db, 'feedback_status_updated', auth.userId, {
    feedbackId,
    status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ feedback: true });

  return res.json({ ok: true, feedback });
});

app.post('/api/iterations', (req, res) => {
  const { title = '', goal = '', startDate = '', endDate = '', status = 'planned', feedbackIds = [] } = req.body || {};
  const safeTitle = typeof title === 'string' ? title.trim() : '';
  if (!safeTitle) {
    return res.status(400).json({ error: 'Iteration title is required.' });
  }
  if (!ITERATION_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid iteration status.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const iteration = ensureFeedbackIterationShape({
    id: randomUUID(),
    title: safeTitle.slice(0, 140),
    goal: typeof goal === 'string' ? goal.trim().slice(0, 600) : '',
    status,
    feedbackIds: Array.isArray(feedbackIds) ? feedbackIds : [],
    startDate: typeof startDate === 'string' ? startDate.slice(0, 10) : '',
    endDate: typeof endDate === 'string' ? endDate.slice(0, 10) : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerUserId: auth.userId
  });

  db.feedbackIterations.push(iteration);
  appendAudit(db, 'feedback_iteration_created', auth.userId, {
    iterationId: iteration.id,
    status: iteration.status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ iterations: true, feedback: true });

  return res.status(201).json({ ok: true, iteration });
});

app.get('/api/iterations', (req, res) => {
  const status = typeof req.query.status === 'string' && ITERATION_STATUSES.has(req.query.status) ? req.query.status : '';
  const pageRaw = Number(req.query.page || 1);
  const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
  const limitRaw = Number(req.query.limit || 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, limitRaw)) : 50;

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const filtered = db.feedbackIterations.filter((item) => !status || item.status === status);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;

  return res.json({
    iterations: filtered.slice(start, start + limit),
    pagination: {
      page: safePage,
      pages,
      total,
      limit
    }
  });
});

app.post('/api/iterations/:iterationId/status', (req, res) => {
  const { iterationId } = req.params;
  const { status } = req.body || {};
  if (!ITERATION_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid iteration status.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const iteration = db.feedbackIterations.find((item) => item.id === iterationId);
  if (!iteration) {
    return res.status(404).json({ error: 'Iteration not found.' });
  }

  iteration.status = status;
  iteration.updatedAt = new Date().toISOString();
  appendAudit(db, 'feedback_iteration_status_updated', auth.userId, {
    iterationId,
    status
  });
  saveDb(db);
  broadcastRealtimeUpdate({ iterations: true });

  return res.json({ ok: true, iteration });
});

app.get('/api/realtime/stream', (req, res) => {
  const tokenFromQuery = typeof req.query.sessionToken === 'string' ? req.query.sessionToken.trim() : '';
  const token = tokenFromQuery || parseBearerToken(req);
  const db = loadDb();
  const auth = resolveAuthUserByToken(db, token);

  if (!auth) {
    return res.status(401).json({ error: 'Valid auth session is required.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  const clientId = randomUUID();
  const keepAliveTimer = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 20000);

  realtimeClients.set(clientId, {
    clientId,
    userId: auth.userId,
    res,
    keepAliveTimer
  });

  writeSseEvent(res, 'ready', {
    clientId,
    userId: auth.userId,
    revision: realtimeRevision,
    at: new Date().toISOString()
  });

  writeSseEvent(res, 'sync', {
    revision: realtimeRevision,
    at: new Date().toISOString(),
    initial: true,
    feed: true,
    leaderboard: true,
    myVideos: true,
    limits: true
  });

  req.on('close', () => {
    const existing = realtimeClients.get(clientId);
    if (existing) {
      clearInterval(existing.keepAliveTimer);
      realtimeClients.delete(clientId);
    }
  });
});

app.get('/api/network-urls', (_req, res) => {
  const lanUrls = getLanUrls(port);
  res.json({
    localhostUrl: `http://localhost:${port}`,
    lanUrls
  });
});

app.get('/api/qr', async (req, res) => {
  const rawText = req.query.text;
  const text = typeof rawText === 'string' ? rawText.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'Missing query param: text' });
  }

  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      margin: 1,
      width: 320
    });

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    return res.send(svg);
  } catch {
    return res.status(500).json({ error: 'QR generation failed' });
  }
});

app.get('/api/limits/:userId', (req, res) => {
  const { userId } = req.params;
  const db = loadDb();
  upsertUser(db, userId);
  const used = db.users[userId].completedVideoCount;

  res.json({
    userId,
    maxVideos: MAX_FREE_VIDEOS,
    usedVideos: used,
    remainingVideos: Math.max(0, MAX_FREE_VIDEOS - used),
    maxDurationMs: MAX_DURATION_MS,
    maxSizeBytes: MAX_SIZE_BYTES
  });
});

app.post('/api/sessions', (req, res) => {
  const { userId, incidentTitle, incidentTags, captureProfile } = req.body || {};

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireSameUser(auth.userId, userId, res)) {
    return;
  }
  upsertUser(db, userId);

  if (db.users[userId].completedVideoCount >= MAX_FREE_VIDEOS) {
    return res.status(403).json({ error: 'Free tier limit reached (3 videos max).' });
  }

  const sessionId = randomUUID();
  const filename = `${sessionId}.webm`;
  const chunkCryptoKey = randomBytes(32).toString('base64');

  db.sessions[sessionId] = {
    id: sessionId,
    userId,
    filename,
    status: 'recording',
    durationMs: 0,
    totalBytes: 0,
    startedAt: new Date().toISOString(),
    firstChunkAt: '',
    completedAt: null,
    processingMode: 'device',
    proofHash: null,
    incidentTitle: typeof incidentTitle === 'string' ? incidentTitle.slice(0, 120) : '',
    incidentTags: typeof incidentTags === 'string' ? incidentTags.slice(0, 120) : '',
    captureProfile: typeof captureProfile === 'string' ? captureProfile.slice(0, 64) : '',
    hlsMasterUrl: '',
    hlsVariants: [],
    hlsError: '',
    chunkCryptoKey,
    chunkEncryption: 'aes-256-gcm',
    views: 0,
    ratings: {},
    chat: [],
    errors: []
  };

  ensureMetricsShape(db.metrics);
  db.metrics.sessionStartedCount += 1;
  metricsTouch(db.metrics);

  saveDb(db);

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, Buffer.alloc(0));

  return res.status(201).json({
    sessionId,
    uploadUrl: `/api/sessions/${sessionId}/chunks`,
    completeUrl: `/api/sessions/${sessionId}/complete`,
    chunkEncryption: 'aes-256-gcm',
    chunkCryptoKey
  });
});

app.post('/api/sessions/:sessionId/chunks', chunkLimiter, express.raw({ type: '*/*', limit: '5mb' }), (req, res) => {
  const { sessionId } = req.params;
  const chunkDurationMs = Number(req.header('x-chunk-duration-ms') || '1000');
  const chunkEnc = String(req.header('x-chunk-enc') || '').toLowerCase();
  const chunkIv = String(req.header('x-chunk-iv') || '');

  if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({ error: 'Chunk binary body required.' });
  }

  if (req.body.length > MAX_CHUNK_BYTES) {
    return res.status(413).json({ error: 'Chunk too large.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  const session = db.sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (!requireSameUser(auth.userId, session.userId, res)) {
    return;
  }

  if (session.status !== 'recording') {
    return res.status(409).json({ error: 'Session is not in recording state.' });
  }

  let chunkBody = req.body;
  if (chunkEnc === 'aes-gcm') {
    if (!session.chunkCryptoKey) {
      return res.status(400).json({ error: 'Encrypted chunk sent but no session crypto key available.' });
    }
    try {
      chunkBody = decryptChunkAesGcm(req.body, session.chunkCryptoKey, chunkIv);
    } catch {
      return res.status(400).json({ error: 'Chunk decrypt failed.' });
    }
  }

  const nextTotalBytes = session.totalBytes + chunkBody.length;
  const nextDuration = session.durationMs + (Number.isFinite(chunkDurationMs) ? chunkDurationMs : 1000);

  if (nextTotalBytes > MAX_SIZE_BYTES) {
    session.status = 'stopped_limit';
    session.errors.push('size_limit_exceeded');
    ensureMetricsShape(db.metrics);
    db.metrics.sessionFailedCount += 1;
    db.metrics.chunkRejectedCount += 1;
    metricsTouch(db.metrics);
    saveDb(db);
    broadcastRealtimeUpdate({ limits: true, myVideos: true, metrics: true, userId: session.userId });
    return res.status(413).json({ error: 'Size limit exceeded (30MB).' });
  }

  if (nextDuration > MAX_DURATION_MS) {
    session.status = 'stopped_limit';
    session.errors.push('duration_limit_exceeded');
    ensureMetricsShape(db.metrics);
    db.metrics.sessionFailedCount += 1;
    db.metrics.chunkRejectedCount += 1;
    metricsTouch(db.metrics);
    saveDb(db);
    broadcastRealtimeUpdate({ limits: true, myVideos: true, metrics: true, userId: session.userId });
    return res.status(422).json({ error: 'Duration limit exceeded (3 minutes).' });
  }

  if (!session.firstChunkAt) {
    session.firstChunkAt = new Date().toISOString();
  }

  const filePath = path.join(uploadsDir, session.filename);
  fs.appendFileSync(filePath, chunkBody);

  session.totalBytes = nextTotalBytes;
  session.durationMs = nextDuration;
  saveDb(db);

  return res.status(202).json({ ok: true, totalBytes: session.totalBytes, durationMs: session.durationMs });
});

app.post('/api/sessions/:sessionId/complete', async (req, res) => {
  const { sessionId } = req.params;
  const { processingMode, proofHash } = req.body || {};

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  const session = db.sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  if (!requireSameUser(auth.userId, session.userId, res)) {
    return;
  }

  if (session.status !== 'recording') {
    return res.status(409).json({ error: `Session cannot be completed from status: ${session.status}` });
  }

  session.status = 'completed';
  session.completedAt = new Date().toISOString();
  session.processingMode = processingMode === 'server' ? 'server' : 'device';
  session.chunkCryptoKey = '';
  session.chunkEncryption = '';
  session.hlsMasterUrl = '';
  session.hlsVariants = [];
  session.hlsError = '';

  const inputPath = path.join(uploadsDir, session.filename);
  if (session.processingMode === 'server') {
    try {
      const targetFilename = `${session.id}.mp4`;
      const outputPath = path.join(uploadsDir, targetFilename);
      await transcodeToMp4(inputPath, outputPath);
      if (fs.existsSync(outputPath)) {
        if (fs.existsSync(inputPath) && inputPath !== outputPath) {
          fs.unlinkSync(inputPath);
        }
        session.filename = targetFilename;
      }
    } catch (error) {
      session.processingError = String(error && error.message ? error.message : 'ffmpeg_processing_failed').slice(0, 400);
      session.errors.push('server_processing_failed');
    }
  }

  const finalPath = path.join(uploadsDir, session.filename);
  try {
    const hls = await generateHlsPack(finalPath, session.id);
    session.hlsMasterUrl = hls.hlsMasterUrl;
    session.hlsVariants = hls.hlsVariants;
  } catch (error) {
    session.hlsMasterUrl = '';
    session.hlsVariants = [];
    session.hlsError = String(error && error.message ? error.message : 'hls_generation_failed').slice(0, 300);
    session.errors.push('hls_generation_failed');
  }

  let computedProofHash = '';
  try {
    if (fs.existsSync(finalPath)) {
      computedProofHash = sha256FileHex(finalPath);
    }
  } catch {
    computedProofHash = '';
  }
  const payloadProofHash = typeof proofHash === 'string' ? proofHash.toLowerCase().slice(0, 128) : '';
  session.proofHash = computedProofHash || payloadProofHash || null;

  const user = db.users[session.userId];
  user.completedVideoCount += 1;
  user.helpfulActions += 1;
  user.reputation = Math.min(1000, user.reputation + 2);

  ensureMetricsShape(db.metrics);
  db.metrics.sessionCompletedCount += 1;
  if (session.startedAt && session.firstChunkAt) {
    const startedMs = new Date(session.startedAt).getTime();
    const firstChunkMs = new Date(session.firstChunkAt).getTime();
    if (Number.isFinite(startedMs) && Number.isFinite(firstChunkMs) && firstChunkMs >= startedMs) {
      pushTtffSample(db.metrics, firstChunkMs - startedMs);
    }
  }
  metricsTouch(db.metrics);

  appendAudit(db, 'session_completed', session.userId, {
    sessionId,
    processingMode: session.processingMode,
    proofHash: session.proofHash,
    processingError: session.processingError || ''
  });

  saveDb(db);
  broadcastRealtimeUpdate({ feed: true, myVideos: true, limits: true, leaderboard: true, metrics: true, userId: session.userId });

  return res.json({
    ok: true,
    sessionId,
    fileUrl: `/uploads/${session.filename}`,
    hlsMasterUrl: session.hlsMasterUrl || '',
    hlsVariants: Array.isArray(session.hlsVariants) ? session.hlsVariants : [],
    proofHash: session.proofHash,
    usedVideos: user.completedVideoCount,
    remainingVideos: Math.max(0, MAX_FREE_VIDEOS - user.completedVideoCount)
  });
});

app.post('/api/client-events', (req, res) => {
  const { type = 'client_event', payload = {}, userId = '' } = req.body || {};
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }

  const safeType = typeof type === 'string' && type.trim() ? type.trim().slice(0, 80) : 'client_event';
  const safePayload = payload && typeof payload === 'object' ? payload : {};
  const safeUserId = typeof userId === 'string' && userId.trim() ? userId.trim().slice(0, 64) : auth.userId;
  const event = {
    type: safeType,
    at: new Date().toISOString(),
    userId: safeUserId,
    userAgent: String(req.header('user-agent') || '').slice(0, 240),
    payload: safePayload
  };

  db.clientEvents.push(event);
  if (db.clientEvents.length > 2000) {
    db.clientEvents = db.clientEvents.slice(-2000);
  }

  ensureMetricsShape(db.metrics);
  if (safeType === 'client_crash') {
    db.metrics.clientCrashCount += 1;
  }
  metricsTouch(db.metrics);
  saveDb(db);
  broadcastRealtimeUpdate({ metrics: true });
  return res.status(202).json({ ok: true });
});

app.get('/api/proofs/daily-root', (_req, res) => {
  const db = loadDb();
  const byDay = new Map();

  for (const session of Object.values(db.sessions)) {
    if (session.status !== 'completed' || !session.proofHash || !session.completedAt) {
      continue;
    }
    const day = session.completedAt.slice(0, 10);
    if (!byDay.has(day)) {
      byDay.set(day, []);
    }
    byDay.get(day).push(String(session.proofHash));
  }

  const items = Array.from(byDay.entries())
    .map(([day, hashes]) => ({
      day,
      clipCount: hashes.length,
      merkleRoot: buildMerkleRoot(hashes)
    }))
    .sort((a, b) => String(b.day).localeCompare(String(a.day)));

  return res.json({ items });
});

app.post('/api/proofs/anchor', (req, res) => {
  const { day, chain = 'polygon', txRef = '' } = req.body || {};
  if (!day || typeof day !== 'string') {
    return res.status(400).json({ error: 'day is required in YYYY-MM-DD format.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const hashes = Object.values(db.sessions)
    .filter((session) => session.status === 'completed' && session.completedAt && session.completedAt.startsWith(day) && session.proofHash)
    .map((session) => String(session.proofHash));

  if (!hashes.length) {
    return res.status(404).json({ error: 'No proof hashes found for selected day.' });
  }

  const merkleRoot = buildMerkleRoot(hashes);
  const proof = ensureProofShape({
    id: randomUUID(),
    day,
    merkleRoot,
    chain: String(chain || 'polygon').slice(0, 40),
    txRef: String(txRef || `manual-${randomUUID().slice(0, 8)}`).slice(0, 120),
    createdAt: new Date().toISOString()
  });
  db.proofs.push(proof);
  appendAudit(db, 'proof_anchor_recorded', auth.userId, {
    day,
    merkleRoot,
    chain: proof.chain,
    txRef: proof.txRef
  });
  saveDb(db);

  return res.status(201).json({ ok: true, proof });
});

app.get('/api/proofs/anchors', (_req, res) => {
  const limitRaw = Number(_req.query.limit || 200);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(2000, limitRaw)) : 200;
  const db = loadDb();
  const proofs = db.proofs
    .map((proof) => ensureProofShape({ ...proof }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  return res.json({ proofs });
});

app.post('/api/licenses/request', (req, res) => {
  const { videoId, buyerName = '', buyerContact = '', amountCents = 0, currency = 'EUR', note = '' } = req.body || {};
  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'videoId is required.' });
  }

  const db = loadDb();
  const session = db.sessions[videoId];
  if (!session || session.status !== 'completed') {
    return res.status(404).json({ error: 'Video not found.' });
  }

  const normalizedAmount = Math.max(0, Math.floor(Number(amountCents) || 0));
  const platformFeePct = 20;
  const creatorPayoutCents = Math.max(0, Math.floor(normalizedAmount * (100 - platformFeePct) / 100));
  const nowIso = new Date().toISOString();

  const license = ensureLicenseShape({
    id: randomUUID(),
    videoId,
    creatorUserId: session.userId,
    buyerName: String(buyerName || '').slice(0, 120),
    buyerContact: String(buyerContact || '').slice(0, 200),
    status: 'requested',
    amountCents: normalizedAmount,
    platformFeePct,
    creatorPayoutCents,
    currency: String(currency || 'EUR').slice(0, 8).toUpperCase(),
    note: String(note || '').slice(0, 300),
    createdAt: nowIso,
    updatedAt: nowIso,
    paidAt: '',
    deliveredAt: '',
    txRef: ''
  });

  db.licenses.push(license);
  appendAudit(db, 'license_requested', '', { licenseId: license.id, videoId: license.videoId });
  saveDb(db);

  return res.status(201).json({ ok: true, license });
});

app.post('/api/licenses/:licenseId/status', (req, res) => {
  const { licenseId } = req.params;
  const { status, txRef = '', note = '' } = req.body || {};
  if (!LICENSE_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid license status.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const license = db.licenses.find((entry) => entry.id === licenseId);
  if (!license) {
    return res.status(404).json({ error: 'License not found.' });
  }

  ensureLicenseShape(license);
  license.status = status;
  license.updatedAt = new Date().toISOString();
  if (status === 'paid') {
    license.paidAt = license.updatedAt;
  }
  if (status === 'delivered') {
    license.deliveredAt = license.updatedAt;
  }
  if (txRef) {
    license.txRef = String(txRef).slice(0, 120);
  }
  if (note) {
    license.note = String(note).slice(0, 300);
  }

  appendAudit(db, 'license_status_updated', auth.userId, {
    licenseId,
    status
  });
  saveDb(db);

  return res.json({ ok: true, license });
});

app.get('/api/licenses', (req, res) => {
  const status = typeof req.query.status === 'string' && LICENSE_STATUSES.has(req.query.status) ? req.query.status : '';
  const db = loadDb();
  const items = db.licenses
    .filter((license) => !status || license.status === status)
    .map((license) => ensureLicenseShape({ ...license }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ licenses: items });
});

app.get('/api/payouts/summary', (req, res) => {
  const db = loadDb();
  const byCreator = new Map();

  for (const licenseRaw of db.licenses) {
    const license = ensureLicenseShape(licenseRaw);
    if (!byCreator.has(license.creatorUserId)) {
      byCreator.set(license.creatorUserId, {
        creatorUserId: license.creatorUserId,
        totalLicenses: 0,
        paidLicenses: 0,
        grossCents: 0,
        creatorPayoutCents: 0,
        platformCents: 0
      });
    }

    const row = byCreator.get(license.creatorUserId);
    row.totalLicenses += 1;
    row.grossCents += license.amountCents;
    row.creatorPayoutCents += license.creatorPayoutCents;
    row.platformCents += Math.max(0, license.amountCents - license.creatorPayoutCents);
    if (license.status === 'paid' || license.status === 'delivered') {
      row.paidLicenses += 1;
    }
  }

  const creators = Array.from(byCreator.values()).sort((a, b) => b.creatorPayoutCents - a.creatorPayoutCents);
  return res.json({ creators });
});

app.get('/api/audit', (req, res) => {
  const limitRaw = Number(req.query.limit || 100);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(1000, limitRaw)) : 100;
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  const entries = db.auditLogs.slice(-limit).reverse();
  return res.json({ entries });
});

app.get('/api/metrics/summary', (req, res) => {
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireAdmin(auth, res)) {
    return;
  }

  ensureMetricsShape(db.metrics);
  const started = db.metrics.sessionStartedCount;
  const completed = db.metrics.sessionCompletedCount;
  const failed = db.metrics.sessionFailedCount;
  const crashes = db.metrics.clientCrashCount;
  const ttff = db.metrics.ttffSamplesMs;
  const successRate = started > 0 ? (completed / started) * 100 : 0;
  const crashRate = started > 0 ? (crashes / started) * 100 : 0;

  const recentClientEvents = db.clientEvents
    .slice(-20)
    .reverse()
    .map((entry) => ({
      type: entry.type,
      at: entry.at,
      userId: entry.userId,
      userAgent: entry.userAgent
    }));

  return res.json({
    metrics: {
      sessionStartedCount: started,
      sessionCompletedCount: completed,
      sessionFailedCount: failed,
      chunkRejectedCount: db.metrics.chunkRejectedCount,
      clientCrashCount: crashes,
      uploadSuccessRatePct: Number(successRate.toFixed(2)),
      crashRatePct: Number(crashRate.toFixed(2)),
      ttffP50Ms: Math.round(percentile(ttff, 0.5)),
      ttffP95Ms: Math.round(percentile(ttff, 0.95)),
      ttffSampleCount: ttff.length,
      updatedAt: db.metrics.lastUpdatedAt || ''
    },
    recentClientEvents
  });
});

app.get('/api/videos/:userId', (req, res) => {
  const { userId } = req.params;
  const db = loadDb();

  const sessions = Object.values(db.sessions)
    .filter((session) => session.userId === userId && session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .map((session) => toPublicVideo(session, db.users));

  res.json({ videos: sessions });
});

app.get('/api/feed', (req, res) => {
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'latest';
  const limitRaw = Number(req.query.limit || 100);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, limitRaw)) : 100;

  const db = loadDb();
  const feed = Object.values(db.sessions)
    .filter((session) => session.status === 'completed')
    .map((session) => toPublicVideo(session, db.users));

  if (sort === 'views') {
    feed.sort((a, b) => b.views - a.views || new Date(b.completedAt) - new Date(a.completedAt));
  } else if (sort === 'rating') {
    feed.sort(
      (a, b) =>
        b.ratingAvg - a.ratingAvg ||
        b.ratingCount - a.ratingCount ||
        new Date(b.completedAt) - new Date(a.completedAt)
    );
  } else if (sort === 'trending') {
    feed.forEach((video) => {
      video.trendingScore = calculateTrendingScore(video);
    });
    feed.sort((a, b) => b.trendingScore - a.trendingScore || new Date(b.completedAt) - new Date(a.completedAt));
  } else {
    feed.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  return res.json({
    sort,
    total: feed.length,
    videos: feed.slice(0, limit)
  });
});

app.post('/api/videos/:videoId/view', (req, res) => {
  const { videoId } = req.params;
  const db = loadDb();
  const session = db.sessions[videoId];

  if (!session || session.status !== 'completed') {
    return res.status(404).json({ error: 'Video not found.' });
  }

  ensureSessionShape(session);
  session.views += 1;
  saveDb(db);
  broadcastRealtimeUpdate({ feed: true, videoId });

  return res.json({ ok: true, videoId, views: session.views });
});

app.post('/api/videos/:videoId/rate', (req, res) => {
  const { videoId } = req.params;
  const { userId, rating } = req.body || {};

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireSameUser(auth.userId, userId, res)) {
    return;
  }
  upsertUser(db, userId);
  const session = db.sessions[videoId];
  if (!session || session.status !== 'completed') {
    return res.status(404).json({ error: 'Video not found.' });
  }

  ensureSessionShape(session);
  session.ratings[userId] = numericRating;
  db.users[userId].helpfulActions += 1;
  db.users[userId].reputation = Math.min(1000, db.users[userId].reputation + 1);
  const { ratingAvg, ratingCount } = getRatingStats(session);
  saveDb(db);
  broadcastRealtimeUpdate({ feed: true, leaderboard: true, videoId, userId });

  return res.json({ ok: true, videoId, ratingAvg, ratingCount });
});

app.get('/api/videos/:videoId/chat', (req, res) => {
  const { videoId } = req.params;
  const limitRaw = Number(req.query.limit || 100);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, limitRaw)) : 100;

  const db = loadDb();
  const session = db.sessions[videoId];
  if (!session || session.status !== 'completed') {
    return res.status(404).json({ error: 'Video not found.' });
  }

  ensureSessionShape(session);
  const messages = session.chat.slice(-limit).map((entry) => {
    const user = db.users[entry.userId];
    const author = toPublicAuthor(user, entry.userId);
    return {
      ...entry,
      reputation: user && Number.isFinite(user.reputation) ? user.reputation : 100,
      authorLabel: author.authorLabel,
      avatar: author.avatar
    };
  });
  return res.json({ videoId, messages });
});

app.post('/api/videos/:videoId/chat', (req, res) => {
  const { videoId } = req.params;
  const { userId, message } = req.body || {};

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const text = typeof message === 'string' ? message.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'message is required.' });
  }

  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireSameUser(auth.userId, userId, res)) {
    return;
  }
  upsertUser(db, userId);
  const session = db.sessions[videoId];
  if (!session || session.status !== 'completed') {
    return res.status(404).json({ error: 'Video not found.' });
  }

  ensureSessionShape(session);
  const user = db.users[userId];

  if (isUserMuted(user)) {
    return res.status(403).json({
      error: 'You are muted and cannot send chat messages right now.',
      mutedUntil: user.mutedUntil
    });
  }

  const now = Date.now();
  const lastChatAt = user.lastChatAt ? new Date(user.lastChatAt).getTime() : 0;
  if (Number.isFinite(lastChatAt) && now - lastChatAt < CHAT_MIN_INTERVAL_MS) {
    user.strikes += 1;
    user.reputation = Math.max(0, user.reputation - 5);
    saveDb(db);
    return res.status(429).json({ error: 'Too many messages. Please slow down.' });
  }

  const lastTextAt = user.lastChatTextAt ? new Date(user.lastChatTextAt).getTime() : 0;
  const normalizedLast = (user.lastChatText || '').trim().toLowerCase();
  const normalizedCurrent = text.toLowerCase();
  if (
    normalizedLast &&
    normalizedLast === normalizedCurrent &&
    Number.isFinite(lastTextAt) &&
    now - lastTextAt < CHAT_DUPLICATE_WINDOW_MS
  ) {
    user.strikes += 1;
    user.reputation = Math.max(0, user.reputation - 4);
    saveDb(db);
    return res.status(429).json({ error: 'Duplicate message detected. Please write something new.' });
  }

  const entry = {
    id: randomUUID(),
    userId: userId.slice(0, 40),
    message: text.slice(0, 500),
    createdAt: new Date().toISOString(),
    reputation: user.reputation,
    authorLabel: toPublicAuthor(user, userId).authorLabel,
    avatar: sanitizeAvatar(user.avatar)
  };

  session.chat.push(entry);
  if (session.chat.length > 1000) {
    session.chat = session.chat.slice(-1000);
  }

  user.lastChatAt = entry.createdAt;
  user.lastChatText = entry.message;
  user.lastChatTextAt = entry.createdAt;
  user.helpfulActions += 1;
  user.reputation = Math.min(1000, user.reputation + 0.5);

  saveDb(db);
  broadcastRealtimeUpdate({
    feed: true,
    leaderboard: true,
    chatVideoId: videoId,
    userId
  });
  return res.status(201).json({ ok: true, videoId, message: entry });
});

app.get('/api/users/:userId/profile', (req, res) => {
  const { userId } = req.params;
  const db = loadDb();
  const auth = requireAuthUser(db, req, res);
  if (!auth) {
    return;
  }
  if (!requireSameUser(auth.userId, userId, res)) {
    return;
  }
  upsertUser(db, userId);
  const user = db.users[userId];
  saveDb(db);
  return res.json(userPublicProfile(userId, user));
});

app.get('/api/leaderboard', (req, res) => {
  const limitRaw = Number(req.query.limit || 20);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 20;

  const db = loadDb();
  const users = Object.entries(db.users)
    .map(([userId, user]) => userPublicProfile(userId, user))
    .sort(
      (a, b) =>
        b.reputation - a.reputation ||
        b.helpfulActions - a.helpfulActions ||
        b.completedVideoCount - a.completedVideoCount
    )
    .slice(0, limit);

  return res.json({ users });
});

app.post('/api/nodes/register', (req, res) => {
  const {
    nodeName,
    publicUrl,
    shareResources = false,
    capabilities = [],
    maxStorageGb = 0,
    maxBandwidthMbps = 0
  } = req.body || {};

  if (!nodeName || typeof nodeName !== 'string') {
    return res.status(400).json({ error: 'nodeName is required.' });
  }

  const db = loadDb();
  const nodeId = randomUUID();

  db.nodes[nodeId] = {
    id: nodeId,
    nodeName,
    publicUrl: typeof publicUrl === 'string' ? publicUrl : '',
    shareResources: Boolean(shareResources),
    capabilities: Array.isArray(capabilities) ? capabilities : [],
    maxStorageGb: Number(maxStorageGb) || 0,
    maxBandwidthMbps: Number(maxBandwidthMbps) || 0,
    status: 'online',
    createdAt: new Date().toISOString(),
    lastHeartbeatAt: new Date().toISOString()
  };

  saveDb(db);
  broadcastRealtimeUpdate({ nodes: true });

  return res.status(201).json({
    ok: true,
    nodeId,
    heartbeatUrl: `/api/nodes/${nodeId}/heartbeat`,
    unregisterUrl: `/api/nodes/${nodeId}/unregister`
  });
});

app.post('/api/nodes/:nodeId/heartbeat', (req, res) => {
  const { nodeId } = req.params;
  const db = loadDb();
  const node = db.nodes[nodeId];

  if (!node) {
    return res.status(404).json({ error: 'Node not found.' });
  }

  node.status = 'online';
  node.lastHeartbeatAt = new Date().toISOString();
  saveDb(db);
  broadcastRealtimeUpdate({ nodes: true });

  return res.json({ ok: true, nodeId, lastHeartbeatAt: node.lastHeartbeatAt });
});

app.post('/api/nodes/:nodeId/unregister', (req, res) => {
  const { nodeId } = req.params;
  const db = loadDb();
  const node = db.nodes[nodeId];

  if (!node) {
    return res.status(404).json({ error: 'Node not found.' });
  }

  node.status = 'offline';
  node.lastHeartbeatAt = new Date().toISOString();
  saveDb(db);
  broadcastRealtimeUpdate({ nodes: true });

  return res.json({ ok: true, nodeId, status: 'offline' });
});

app.get('/api/nodes', (_req, res) => {
  const db = loadDb();
  const now = Date.now();
  const nodes = Object.values(db.nodes)
    .map((node) => {
      const last = new Date(node.lastHeartbeatAt).getTime();
      const isOnline = Number.isFinite(last) && now - last < 70_000;
      return {
        ...node,
        status: isOnline ? 'online' : 'stale'
      };
    })
    .sort((a, b) => new Date(b.lastHeartbeatAt) - new Date(a.lastHeartbeatAt));

  res.json({ nodes });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, host, () => {
  const lanUrls = getLanUrls(port);
  console.log(`MVP server running on http://localhost:${port}`);
  console.log(`Listening host: ${host}`);

  if (lanUrls.length) {
    console.log('LAN test URLs:');
    for (const url of lanUrls) {
      console.log(`- ${url}`);
    }
  }
});
