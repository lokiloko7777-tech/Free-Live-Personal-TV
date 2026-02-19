const els = {
  authStatusText: document.getElementById('authStatusText'),
  avatarSelect: document.getElementById('avatarSelect'),
  anonymousToggle: document.getElementById('anonymousToggle'),
  googleLoginBtn: document.getElementById('googleLoginBtn'),
  guestLoginBtn: document.getElementById('guestLoginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  userId: document.getElementById('userId'),
  incidentTitle: document.getElementById('incidentTitle'),
  incidentTags: document.getElementById('incidentTags'),
  qualityPreset: document.getElementById('qualityPreset'),
  saveUserBtn: document.getElementById('saveUserBtn'),
  loadLimitsBtn: document.getElementById('loadLimitsBtn'),
  limitsText: document.getElementById('limitsText'),
  installBtn: document.getElementById('installBtn'),
  refreshQrBtn: document.getElementById('refreshQrBtn'),
  copyLanBtn: document.getElementById('copyLanBtn'),
  shareLanBtn: document.getElementById('shareLanBtn'),
  qrUrlText: document.getElementById('qrUrlText'),
  qrImage: document.getElementById('qrImage'),
  autoUploadToggle: document.getElementById('autoUploadToggle'),
  pilotContact: document.getElementById('pilotContact'),
  pilotNote: document.getElementById('pilotNote'),
  enrollPilotBtn: document.getElementById('enrollPilotBtn'),
  pilotMyStatusText: document.getElementById('pilotMyStatusText'),
  feedbackCategory: document.getElementById('feedbackCategory'),
  feedbackMessage: document.getElementById('feedbackMessage'),
  feedbackContact: document.getElementById('feedbackContact'),
  submitFeedbackBtn: document.getElementById('submitFeedbackBtn'),
  myFeedbackText: document.getElementById('myFeedbackText'),
  processingMode: document.getElementById('processingMode'),
  preview: document.getElementById('preview'),
  captureCompatText: document.getElementById('captureCompatText'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  statusText: document.getElementById('statusText'),
  refreshVideosBtn: document.getElementById('refreshVideosBtn'),
  videosList: document.getElementById('videosList'),
  feedSort: document.getElementById('feedSort'),
  refreshFeedBtn: document.getElementById('refreshFeedBtn'),
  feedList: document.getElementById('feedList'),
  licenseVideoId: document.getElementById('licenseVideoId'),
  licenseBuyerName: document.getElementById('licenseBuyerName'),
  licenseBuyerContact: document.getElementById('licenseBuyerContact'),
  licenseAmountCents: document.getElementById('licenseAmountCents'),
  licenseCurrency: document.getElementById('licenseCurrency'),
  licenseNote: document.getElementById('licenseNote'),
  requestLicenseBtn: document.getElementById('requestLicenseBtn'),
  licenseStatusText: document.getElementById('licenseStatusText'),
  licenseFilterStatus: document.getElementById('licenseFilterStatus'),
  refreshLicensesBtn: document.getElementById('refreshLicensesBtn'),
  licensesList: document.getElementById('licensesList'),
  refreshPayoutsBtn: document.getElementById('refreshPayoutsBtn'),
  payoutsList: document.getElementById('payoutsList'),
  refreshLeaderboardBtn: document.getElementById('refreshLeaderboardBtn'),
  leaderboardList: document.getElementById('leaderboardList'),
  chatVideoText: document.getElementById('chatVideoText'),
  chatMessages: document.getElementById('chatMessages'),
  chatMessageInput: document.getElementById('chatMessageInput'),
  sendChatBtn: document.getElementById('sendChatBtn'),
  refreshProofsBtn: document.getElementById('refreshProofsBtn'),
  proofsSummaryText: document.getElementById('proofsSummaryText'),
  proofsList: document.getElementById('proofsList'),
  proofAnchorAdmin: document.getElementById('proofAnchorAdmin'),
  proofAnchorDay: document.getElementById('proofAnchorDay'),
  proofAnchorChain: document.getElementById('proofAnchorChain'),
  proofAnchorTxRef: document.getElementById('proofAnchorTxRef'),
  anchorProofBtn: document.getElementById('anchorProofBtn'),
  proofAnchorStatus: document.getElementById('proofAnchorStatus'),
  moderationCard: document.getElementById('moderationCard'),
  moderationUserId: document.getElementById('moderationUserId'),
  moderationMinutes: document.getElementById('moderationMinutes'),
  moderationReason: document.getElementById('moderationReason'),
  muteUserBtn: document.getElementById('muteUserBtn'),
  unmuteUserBtn: document.getElementById('unmuteUserBtn'),
  bulkReportStatus: document.getElementById('bulkReportStatus'),
  bulkReportNote: document.getElementById('bulkReportNote'),
  applyBulkReportsBtn: document.getElementById('applyBulkReportsBtn'),
  clearBulkSelectionBtn: document.getElementById('clearBulkSelectionBtn'),
  reportFilterStatus: document.getElementById('reportFilterStatus'),
  reportFilterReporter: document.getElementById('reportFilterReporter'),
  reportFilterVideo: document.getElementById('reportFilterVideo'),
  reportFilterFrom: document.getElementById('reportFilterFrom'),
  reportFilterTo: document.getElementById('reportFilterTo'),
  applyReportFiltersBtn: document.getElementById('applyReportFiltersBtn'),
  clearReportFiltersBtn: document.getElementById('clearReportFiltersBtn'),
  exportReportsFormat: document.getElementById('exportReportsFormat'),
  downloadReportsBtn: document.getElementById('downloadReportsBtn'),
  prevReportsPageBtn: document.getElementById('prevReportsPageBtn'),
  nextReportsPageBtn: document.getElementById('nextReportsPageBtn'),
  reportsPageText: document.getElementById('reportsPageText'),
  refreshReportsBtn: document.getElementById('refreshReportsBtn'),
  reportsList: document.getElementById('reportsList'),
  refreshMetricsBtn: document.getElementById('refreshMetricsBtn'),
  metricsSummaryText: document.getElementById('metricsSummaryText'),
  metricsList: document.getElementById('metricsList'),
  pilotFilterStatus: document.getElementById('pilotFilterStatus'),
  refreshPilotBtn: document.getElementById('refreshPilotBtn'),
  pilotSummaryText: document.getElementById('pilotSummaryText'),
  pilotList: document.getElementById('pilotList'),
  feedbackFilterStatus: document.getElementById('feedbackFilterStatus'),
  feedbackFilterCategory: document.getElementById('feedbackFilterCategory'),
  refreshFeedbackBtn: document.getElementById('refreshFeedbackBtn'),
  feedbackList: document.getElementById('feedbackList'),
  iterationTitle: document.getElementById('iterationTitle'),
  iterationGoal: document.getElementById('iterationGoal'),
  iterationStart: document.getElementById('iterationStart'),
  iterationEnd: document.getElementById('iterationEnd'),
  iterationFeedbackIds: document.getElementById('iterationFeedbackIds'),
  createIterationBtn: document.getElementById('createIterationBtn'),
  refreshIterationsBtn: document.getElementById('refreshIterationsBtn'),
  iterationStatusText: document.getElementById('iterationStatusText'),
  iterationsList: document.getElementById('iterationsList'),
  refreshLocalBtn: document.getElementById('refreshLocalBtn'),
  uploadAllLocalBtn: document.getElementById('uploadAllLocalBtn'),
  keepAllLocalBtn: document.getElementById('keepAllLocalBtn'),
  localSummaryText: document.getElementById('localSummaryText'),
  localVideosList: document.getElementById('localVideosList'),
  nodeName: document.getElementById('nodeName'),
  nodeUrl: document.getElementById('nodeUrl'),
  registerNodeBtn: document.getElementById('registerNodeBtn'),
  listNodesBtn: document.getElementById('listNodesBtn'),
  nodeText: document.getElementById('nodeText'),
  nodesList: document.getElementById('nodesList')
};

const KEY_USER_ID = 'flpt_user_id';
const KEY_AUTH_SESSION = 'flpt_auth_session';
const KEY_AVATAR = 'flpt_avatar';
const KEY_ANON = 'flpt_anonymous';
const KEY_NODE_ID = 'flpt_node_id';
const KEY_AUTO_UPLOAD = 'flpt_auto_upload';
const KEY_QUALITY_PRESET = 'flpt_quality_preset';
const DB_NAME = 'flpt_offline_db';
const DB_STORE = 'localVideos';
const MAX_DURATION_MS = 3 * 60 * 1000;
const MAX_SIZE_BYTES = 30 * 1024 * 1024;
const RECORDER_MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp8',
  'video/webm',
  'video/mp4'
];
const defaultUserId = localStorage.getItem(KEY_USER_ID) || `user-${Math.random().toString(36).slice(2, 8)}`;
els.userId.value = defaultUserId;
localStorage.setItem(KEY_USER_ID, defaultUserId);
els.avatarSelect.value = localStorage.getItem(KEY_AVATAR) || 'anonymous';
els.anonymousToggle.checked = localStorage.getItem(KEY_ANON) !== '0';
els.autoUploadToggle.checked = localStorage.getItem(KEY_AUTO_UPLOAD) === '1';
els.qualityPreset.value = localStorage.getItem(KEY_QUALITY_PRESET) || 'auto';

let mediaStream = null;
let recorder = null;
let currentSessionId = null;
let recordingStartedAt = 0;
let heartbeatTimer = null;
let localChunks = [];
let localBytes = 0;
let uploadAvailable = false;
let deferredInstallPrompt = null;
let currentLanUrl = '';
let selectedFeedVideoId = '';
let realtimeStream = null;
let realtimeReconnectTimer = null;
let realtimeApplying = false;
let isAdminUser = false;
let reportsPage = 1;
let reportsPagesTotal = 1;
let currentChunkCryptoKeyB64 = '';
let currentChunkEncryption = '';
let currentChunkCryptoKeyRef = '';
let currentChunkCryptoKey = null;
let lastProofRoots = [];
let currentCaptureProfile = 'auto-legacy';
const selectedReportIds = new Set();
const FEEDBACK_STATUS_OPTIONS = ['open', 'planned', 'in_progress', 'done', 'rejected'];
const ITERATION_STATUS_OPTIONS = ['planned', 'active', 'completed'];

const fmtBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fmtMs = (ms) => {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const NATIVE_HLS_SUPPORTED = (() => {
  try {
    const video = document.createElement('video');
    return Boolean(
      video.canPlayType('application/vnd.apple.mpegurl') ||
      video.canPlayType('application/x-mpegURL')
    );
  } catch {
    return false;
  }
})();

function getPreferredPlaybackUrl(video) {
  if (video && video.hlsMasterUrl && NATIVE_HLS_SUPPORTED) {
    return video.hlsMasterUrl;
  }
  if (video && video.fileUrl) {
    return video.fileUrl;
  }
  if (video && video.hlsMasterUrl) {
    return video.hlsMasterUrl;
  }
  return '';
}

function escapeJsString(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function openHlsWithHlsJs(hlsUrl, fallbackUrl = '') {
  const popup = window.open('', '_blank', 'noopener,noreferrer');
  if (!popup) {
    if (fallbackUrl) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      return true;
    }
    return false;
  }

  const safeHlsUrl = escapeJsString(hlsUrl);
  const safeFallbackUrl = escapeJsString(fallbackUrl);
  popup.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FLPT Playback</title>
    <style>
      html, body { margin: 0; padding: 0; background: #000; height: 100%; }
      video { width: 100vw; height: 100vh; object-fit: contain; background: #000; }
      .hint { position: fixed; left: 8px; bottom: 8px; color: #fff; font: 12px sans-serif; opacity: 0.8; }
    </style>
  </head>
  <body>
    <video id="player" controls autoplay playsinline></video>
    <div class="hint">Adaptive HLS playback</div>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js"></script>
    <script>
      const hlsUrl = '${safeHlsUrl}';
      const fallbackUrl = '${safeFallbackUrl}';
      const player = document.getElementById('player');

      function directOpen(url) {
        if (!url) {
          return;
        }
        window.location.href = url;
      }

      if (window.Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(player);
        hls.on(Hls.Events.ERROR, function (_event, data) {
          if (data && data.fatal) {
            directOpen(fallbackUrl);
          }
        });
      } else if (player.canPlayType('application/vnd.apple.mpegurl') || player.canPlayType('application/x-mpegURL')) {
        player.src = hlsUrl;
      } else {
        directOpen(fallbackUrl);
      }
    </script>
  </body>
</html>`);
  popup.document.close();
  return true;
}

function bytesToBase64(bytes) {
  let binary = '';
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function getChunkCryptoKey(keyB64) {
  if (!window.crypto || !window.crypto.subtle) {
    return null;
  }
  if (!keyB64) {
    return null;
  }
  if (currentChunkCryptoKey && currentChunkCryptoKeyRef === keyB64) {
    return currentChunkCryptoKey;
  }

  const keyBytes = base64ToBytes(keyB64);
  currentChunkCryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
  currentChunkCryptoKeyRef = keyB64;
  return currentChunkCryptoKey;
}

async function encryptChunkForUpload(chunkArrayBuffer, keyB64, encryption) {
  if (encryption !== 'aes-256-gcm' || !keyB64) {
    return { body: chunkArrayBuffer, headers: {} };
  }
  const key = await getChunkCryptoKey(keyB64);
  if (!key) {
    return { body: chunkArrayBuffer, headers: {} };
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, chunkArrayBuffer);
  return {
    body: encrypted,
    headers: {
      'x-chunk-enc': 'aes-gcm',
      'x-chunk-iv': bytesToBase64(iv)
    }
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getUserId() {
  const auth = getAuthSession();
  if (auth && auth.user && auth.user.userId) {
    return auth.user.userId;
  }
  return (els.userId.value || '').trim();
}

function getAuthSession() {
  try {
    const raw = localStorage.getItem(KEY_AUTH_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function supportsMediaRecorder() {
  return typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
}

function getSupportedMimeType() {
  if (!supportsMediaRecorder() || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  for (const mime of RECORDER_MIME_CANDIDATES) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    } catch {
    }
  }
  return '';
}

function getCaptureProfile(preset) {
  const supportedMime = getSupportedMimeType();
  const isLegacyCodec = !supportedMime || supportedMime === 'video/mp4';

  if (preset === 'high') {
    return {
      profile: isLegacyCodec ? 'high-legacy' : 'high-vp8',
      mimeType: supportedMime,
      videoBitsPerSecond: isLegacyCodec ? 1_500_000 : 2_500_000,
      timesliceMs: 1000
    };
  }

  if (preset === 'saver') {
    return {
      profile: isLegacyCodec ? 'saver-legacy' : 'saver-vp8',
      mimeType: supportedMime,
      videoBitsPerSecond: isLegacyCodec ? 450_000 : 700_000,
      timesliceMs: 2000
    };
  }

  return {
    profile: isLegacyCodec ? 'auto-legacy' : 'auto-vp8',
    mimeType: supportedMime,
    videoBitsPerSecond: navigator.onLine ? (isLegacyCodec ? 900_000 : 1_500_000) : 900_000,
    timesliceMs: 1200
  };
}

function refreshCaptureCompatibilityHint() {
  if (!els.captureCompatText) {
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    els.captureCompatText.textContent = 'Camera API not supported on this device/browser.';
    els.startBtn.disabled = true;
    return;
  }

  if (!supportsMediaRecorder()) {
    els.captureCompatText.textContent = 'MediaRecorder not supported. Use newer browser for video capture.';
    els.startBtn.disabled = true;
    return;
  }

  const mimeType = getSupportedMimeType();
  if (mimeType) {
    els.captureCompatText.textContent = `Capture profile ready (${mimeType}).`;
  } else {
    els.captureCompatText.textContent = 'Using legacy capture mode (default browser codec).';
  }
}

function getSessionToken() {
  const auth = getAuthSession();
  return auth && typeof auth.sessionToken === 'string' ? auth.sessionToken : '';
}

function getAuthHeaders() {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setAuthSession(session) {
  if (!session) {
    localStorage.removeItem(KEY_AUTH_SESSION);
    closeRealtimeStream();
    return;
  }
  localStorage.setItem(KEY_AUTH_SESSION, JSON.stringify(session));
}

function applyAuthSessionToUi() {
  const auth = getAuthSession();
  if (!auth || !auth.user) {
    els.authStatusText.textContent = 'Not logged in.';
    els.userId.readOnly = false;
    isAdminUser = false;
    els.moderationCard.hidden = true;
    if (els.proofAnchorAdmin) {
      els.proofAnchorAdmin.hidden = true;
    }
    return;
  }

  const user = auth.user;
  localStorage.setItem(KEY_USER_ID, user.userId);
  els.userId.value = user.userId;
  els.userId.readOnly = true;
  els.avatarSelect.value = user.avatar || 'anonymous';
  els.anonymousToggle.checked = Boolean(user.isAnonymous);
  isAdminUser = Boolean(user.isAdmin);
  els.moderationCard.hidden = !isAdminUser;
  if (els.proofAnchorAdmin) {
    els.proofAnchorAdmin.hidden = !isAdminUser;
  }
  const label = user.authorLabel || user.userId;
  const expires = auth.sessionExpiresAt ? new Date(auth.sessionExpiresAt).toLocaleString() : 'n/a';
  els.authStatusText.textContent = `Logged in as ${label} · avatar ${user.avatar} · provider ${user.provider} · session until ${expires}`;
}

async function refreshAuthSession() {
  const auth = getAuthSession();
  if (!auth || !auth.sessionToken) {
    return false;
  }

  const me = await api('/api/auth/me');
  const next = {
    ...auth,
    user: me.user,
    sessionExpiresAt: me.sessionExpiresAt || auth.sessionExpiresAt
  };
  setAuthSession(next);
  applyAuthSessionToUi();
  startRealtimeStream();
  return true;
}

async function ensureAuthSession() {
  try {
    const ok = await refreshAuthSession();
    if (ok) {
      return;
    }
  } catch {
    setAuthSession(null);
    applyAuthSessionToUi();
  }

  await loginGuest();
}

async function createAuthSession(payload) {
  const data = await api('/api/auth/session', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  setAuthSession(data);
  applyAuthSessionToUi();
  startRealtimeStream();
  await loadMyProfile();
  await loadLeaderboard();
  await loadFeed();
}

async function loginGuest() {
  localStorage.setItem(KEY_AVATAR, els.avatarSelect.value);
  localStorage.setItem(KEY_ANON, els.anonymousToggle.checked ? '1' : '0');
  const preferredUserId = (els.userId.value || '').trim();

  await createAuthSession({
    provider: 'guest',
    preferredUserId,
    avatar: els.avatarSelect.value,
    isAnonymous: els.anonymousToggle.checked
  });
}

async function loginWithGoogleCredential(credential) {
  localStorage.setItem(KEY_AVATAR, els.avatarSelect.value);
  localStorage.setItem(KEY_ANON, els.anonymousToggle.checked ? '1' : '0');

  await createAuthSession({
    provider: 'google',
    credential,
    avatar: els.avatarSelect.value,
    isAnonymous: els.anonymousToggle.checked
  });
}

async function logout() {
  if (getSessionToken()) {
    try {
      await api('/api/auth/logout', {
        method: 'POST',
        body: '{}'
      });
    } catch {
    }
  }

  setAuthSession(null);
  els.userId.readOnly = false;
  els.authStatusText.textContent = 'Not logged in.';
  setStatus('Logged out.');
}

function closeRealtimeStream() {
  if (realtimeReconnectTimer) {
    clearTimeout(realtimeReconnectTimer);
    realtimeReconnectTimer = null;
  }

  if (realtimeStream) {
    realtimeStream.close();
    realtimeStream = null;
  }
}

async function applyRealtimeSync(payload) {
  if (realtimeApplying) {
    return;
  }
  realtimeApplying = true;

  try {
    const tasks = [];
    if (payload.feed) {
      tasks.push(loadFeed());
      tasks.push(loadProofs());
    }
    if (payload.leaderboard) {
      tasks.push(loadLeaderboard());
    }
    if (payload.nodes) {
      tasks.push(listNodes());
    }
    if (payload.myVideos) {
      tasks.push(loadVideos(), loadLimits());
      tasks.push(loadProofs());
    }
    if (payload.chatVideoId && selectedFeedVideoId === payload.chatVideoId) {
      tasks.push(loadChat(selectedFeedVideoId));
    }
    if (payload.moderation && isAdminUser) {
      tasks.push(loadReports());
    }
    if (payload.metrics && isAdminUser) {
      tasks.push(loadMetrics());
    }
    if (payload.pilot) {
      tasks.push(loadPilotMyStatus());
      if (isAdminUser) {
        tasks.push(loadPilotParticipants());
      }
    }
    if (payload.feedback) {
      tasks.push(loadMyFeedback());
      if (isAdminUser) {
        tasks.push(loadFeedbackQueue());
      }
    }
    if (payload.iterations && isAdminUser) {
      tasks.push(loadIterations());
    }

    if (tasks.length) {
      await Promise.allSettled(tasks);
    }
  } finally {
    realtimeApplying = false;
  }
}

function shortenHash(value, size = 12) {
  const text = String(value || '');
  if (text.length <= size * 2) {
    return text;
  }
  return `${text.slice(0, size)}...${text.slice(-size)}`;
}

async function loadProofs() {
  const rootsData = await api('/api/proofs/daily-root');
  let anchorsData = { proofs: [] };

  try {
    anchorsData = await api('/api/proofs/anchors?limit=200');
  } catch {
    anchorsData = { proofs: [] };
  }

  const proofs = Array.isArray(rootsData.items) ? rootsData.items : [];
  const anchors = Array.isArray(anchorsData.proofs) ? anchorsData.proofs : [];
  lastProofRoots = proofs;

  const latestAnchorByDay = new Map();
  for (const proof of anchors) {
    if (!proof || typeof proof.day !== 'string') continue;
    const existing = latestAnchorByDay.get(proof.day);
    if (!existing) {
      latestAnchorByDay.set(proof.day, proof);
      continue;
    }
    const existingTime = new Date(existing.createdAt || 0).getTime();
    const nextTime = new Date(proof.createdAt || 0).getTime();
    if (nextTime > existingTime) {
      latestAnchorByDay.set(proof.day, proof);
    }
  }

  els.proofsList.innerHTML = '';
  if (!proofs.length) {
    els.proofsSummaryText.textContent = 'No completed-day proofs yet.';
    const li = document.createElement('li');
    li.textContent = 'No merkle roots available.';
    els.proofsList.appendChild(li);
    return;
  }

  const anchoredCount = proofs.filter((item) => latestAnchorByDay.has(item.day)).length;
  els.proofsSummaryText.textContent = `Days: ${proofs.length} · anchored: ${anchoredCount}`;

  for (const item of proofs) {
    const li = document.createElement('li');
    const day = escapeHtml(item.day);
    const clipCount = Number.isFinite(Number(item.clipCount)) ? Number(item.clipCount) : 0;
    const merkleRoot = escapeHtml(String(item.merkleRoot || ''));
    const anchor = latestAnchorByDay.get(item.day);
    const anchorLine = anchor
      ? `Anchor: ${escapeHtml(anchor.chain || 'polygon')} · ${escapeHtml(shortenHash(anchor.txRef || 'manual'))}`
      : 'Anchor: not yet anchored';

    li.innerHTML = `
      <div><strong>${day}</strong> · clips ${clipCount}</div>
      <div class="proof">Merkle root: ${escapeHtml(shortenHash(merkleRoot, 16))}</div>
      <div class="hint">${anchorLine}</div>
      ${isAdminUser ? `<button class="secondary" data-proof-action="set-day" data-day="${day}">Use day for anchor</button>` : ''}
    `;
    els.proofsList.appendChild(li);
  }

  if (isAdminUser && !els.proofAnchorDay.value && proofs[0] && proofs[0].day) {
    els.proofAnchorDay.value = proofs[0].day;
  }
}

function useProofDay(day) {
  if (!els.proofAnchorDay || !day) {
    return;
  }
  els.proofAnchorDay.value = day;
  if (els.proofAnchorStatus) {
    els.proofAnchorStatus.textContent = `Selected day ${day} for anchor.`;
  }
}

async function anchorProofDay() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }
  const day = (els.proofAnchorDay.value || '').trim();
  if (!day) {
    setStatus('Select proof day first.');
    return;
  }

  const chain = (els.proofAnchorChain.value || 'polygon').trim() || 'polygon';
  const txRef = (els.proofAnchorTxRef.value || '').trim();
  const payload = { day, chain };
  if (txRef) {
    payload.txRef = txRef;
  }

  const result = await api('/api/proofs/anchor', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (els.proofAnchorStatus) {
    const tx = result && result.proof ? result.proof.txRef : '';
    els.proofAnchorStatus.textContent = `Anchored ${day}: ${tx || 'manual reference'}`;
  }
  await loadProofs();
}

function scheduleRealtimeReconnect() {
  if (realtimeReconnectTimer) {
    return;
  }

  realtimeReconnectTimer = setTimeout(() => {
    realtimeReconnectTimer = null;
    startRealtimeStream();
  }, 2500);
}

function startRealtimeStream() {
  const token = getSessionToken();
  if (!token) {
    closeRealtimeStream();
    return;
  }

  closeRealtimeStream();
  const streamUrl = `/api/realtime/stream?sessionToken=${encodeURIComponent(token)}`;
  const source = new EventSource(streamUrl);
  realtimeStream = source;

  source.addEventListener('sync', (event) => {
    try {
      const payload = JSON.parse(event.data || '{}');
      applyRealtimeSync(payload).catch(() => {});
    } catch {
    }
  });

  source.addEventListener('ready', () => {
    setStatus('Realtime sync connected.');
  });

  source.onerror = () => {
    source.close();
    if (realtimeStream === source) {
      realtimeStream = null;
    }
    scheduleRealtimeReconnect();
  };
}

async function initGoogleLogin() {
  const config = await api('/api/config');
  if (!config.googleClientId || !window.google || !google.accounts || !google.accounts.id) {
    els.googleLoginBtn.innerHTML = '<p class="hint">Google login requires GOOGLE_CLIENT_ID on server.</p>';
    return;
  }

  google.accounts.id.initialize({
    client_id: config.googleClientId,
    callback: async (response) => {
      try {
        await loginWithGoogleCredential(response.credential);
      } catch (error) {
        setStatus(`Google login error: ${error.message}`);
      }
    }
  });

  google.accounts.id.renderButton(els.googleLoginBtn, {
    theme: 'filled_black',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    width: 320
  });
}

function getIncidentMeta() {
  return {
    incidentTitle: (els.incidentTitle.value || '').trim(),
    incidentTags: (els.incidentTags.value || '').trim()
  };
}

function setStatus(message) {
  els.statusText.textContent = message;
}

async function loadMyProfile() {
  const userId = getUserId();
  if (!userId) return;

  try {
    const profile = await api(`/api/users/${encodeURIComponent(userId)}/profile`);
    isAdminUser = Boolean(profile.isAdmin);
    els.moderationCard.hidden = !isAdminUser;
    if (profile.mutedUntil) {
      setStatus(`Muted until ${new Date(profile.mutedUntil).toLocaleString()}`);
      return;
    }
    setStatus(`Online mode · Rep ${Number(profile.reputation).toFixed(1)} · Strikes ${profile.strikes}`);
  } catch {
    setStatus('Online mode.');
  }
}

function getPreferredUrl(payload) {
  if (payload && Array.isArray(payload.lanUrls) && payload.lanUrls.length) {
    return payload.lanUrls[0];
  }
  return window.location.origin;
}

async function loadQrCode() {
  try {
    const net = await api('/api/network-urls');
    const targetUrl = getPreferredUrl(net);
    currentLanUrl = targetUrl;
    els.qrUrlText.textContent = `Scan URL: ${targetUrl}`;
    els.qrImage.src = `/api/qr?text=${encodeURIComponent(targetUrl)}`;
    els.qrImage.onclick = () => window.open(targetUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    els.qrUrlText.textContent = `QR unavailable: ${error.message}`;
  }
}

async function copyLanLink() {
  if (!currentLanUrl) {
    setStatus('LAN link još nije spreman. Klikni Refresh QR.');
    return;
  }

  try {
    await navigator.clipboard.writeText(currentLanUrl);
    setStatus('LAN link copied.');
  } catch {
    const input = document.createElement('input');
    input.value = currentLanUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setStatus('LAN link copied (fallback).');
  }
}

async function shareLanLink() {
  if (!currentLanUrl) {
    setStatus('LAN link još nije spreman. Klikni Refresh QR.');
    return;
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Free Live Personal TV (LAN)',
        text: 'Open the app on local network:',
        url: currentLanUrl
      });
      setStatus('LAN link shared.');
      return;
    } catch {
      setStatus('Share cancelled.');
      return;
    }
  }

  await copyLanLink();
  setStatus('Share nije podržan, link je kopiran.');
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        const store = db.createObjectStore(DB_STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('pendingUpload', 'pendingUpload');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbPut(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function dbGetAll() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result || []);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function dbGet(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      resolve(req.result || null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function dbDelete(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function api(path, options = {}) {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const response = await fetch(path, {
    headers: mergedHeaders,
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = typeof payload === 'object' ? payload.error : payload;

    if (response.status === 401 && path !== '/api/auth/session') {
      setAuthSession(null);
      applyAuthSessionToUi();
      closeRealtimeStream();
    }

    throw new Error(error || `Request failed ${response.status}`);
  }

  return payload;
}

async function loadLimits() {
  const userId = getUserId();
  if (!userId) {
    els.limitsText.textContent = 'Please enter user ID.';
    return;
  }
  const data = await api(`/api/limits/${encodeURIComponent(userId)}`);
  els.limitsText.textContent = `Used ${data.usedVideos}/${data.maxVideos}, remaining ${data.remainingVideos}, max ${fmtMs(data.maxDurationMs)}, max size ${fmtBytes(data.maxSizeBytes)}`;
}

async function loadVideos() {
  const userId = getUserId();
  const data = await api(`/api/videos/${encodeURIComponent(userId)}`);
  els.videosList.innerHTML = '';

  if (!data.videos.length) {
    const li = document.createElement('li');
    li.textContent = 'No videos yet.';
    els.videosList.appendChild(li);
    return;
  }

  for (const video of data.videos) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const preferredUrl = getPreferredPlaybackUrl(video);
    link.href = preferredUrl || video.fileUrl || video.hlsMasterUrl || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const title = video.incidentTitle ? ` · ${video.incidentTitle}` : '';
    const captureProfile = video.captureProfile ? ` · ${video.captureProfile}` : '';
    const playbackMode = video.hlsMasterUrl ? (NATIVE_HLS_SUPPORTED ? ' · hls-adaptive' : ' · file-fallback') : '';
    link.textContent = `${new Date(video.completedAt).toLocaleString()} · ${fmtMs(video.durationMs)} · ${fmtBytes(video.totalBytes)} · ${video.processingMode}${captureProfile}${playbackMode}${title}`;
    li.appendChild(link);
    if (video.proofHash) {
      const proof = document.createElement('div');
      proof.className = 'proof';
      proof.textContent = `Proof: ${video.proofHash.slice(0, 16)}...`;
      li.appendChild(proof);
    }
    els.videosList.appendChild(li);
  }
}

function renderFeedItem(video) {
  const li = document.createElement('li');
  const title = video.incidentTitle ? video.incidentTitle : 'Untitled incident';
  const author = video.authorLabel || 'anonymous';
  const avatar = video.avatar || 'anonymous';
  const openUrl = escapeHtml(getPreferredPlaybackUrl(video));
  const fallbackUrl = escapeHtml(video.fileUrl || video.hlsMasterUrl || '');
  const playbackMode = video.hlsMasterUrl ? (NATIVE_HLS_SUPPORTED ? 'HLS adaptive' : 'File fallback') : 'File direct';
  li.innerHTML = `
    <div><strong>${title}</strong></div>
    <div>Author: ${author} [${avatar}]</div>
    <div>${new Date(video.completedAt).toLocaleString()} · ${fmtMs(video.durationMs)} · ${fmtBytes(video.totalBytes)}</div>
    <div>Capture profile: ${escapeHtml(video.captureProfile || 'unknown')}</div>
    <div>Playback: ${playbackMode}</div>
    <div>Views: ${video.views} · Rating: ${video.ratingAvg} (${video.ratingCount}) · Chat: ${video.chatCount}</div>
    ${typeof video.trendingScore === 'number' ? `<div class="proof">Trending score: ${video.trendingScore}</div>` : ''}
    ${video.proofHash ? `<div class="proof">Proof: ${video.proofHash.slice(0, 16)}...</div>` : ''}
    <div class="row">
      <button class="secondary" data-feed-action="open" data-id="${video.id}" data-url="${openUrl}" data-fallback-url="${fallbackUrl}">Open</button>
      <button class="secondary" data-feed-action="chat" data-id="${video.id}">Open chat</button>
    </div>
    <button class="secondary" data-feed-action="license" data-id="${video.id}">Request license</button>
    <div class="row">
      <select data-feed-action="rating-value" data-id="${video.id}">
        <option value="5">Rate 5</option>
        <option value="4">Rate 4</option>
        <option value="3">Rate 3</option>
        <option value="2">Rate 2</option>
        <option value="1">Rate 1</option>
      </select>
      <button class="secondary" data-feed-action="rate" data-id="${video.id}">Submit rating</button>
    </div>
  `;
  return li;
}

function formatMoney(cents, currency) {
  const amount = (Number(cents) || 0) / 100;
  const code = (currency || 'EUR').toUpperCase();
  return `${amount.toFixed(2)} ${code}`;
}

function setLicenseVideoId(videoId) {
  if (!els.licenseVideoId) {
    return;
  }
  els.licenseVideoId.value = String(videoId || '');
  if (els.licenseStatusText) {
    els.licenseStatusText.textContent = `Selected video ${videoId} for license request.`;
  }
}

async function requestLicense() {
  const videoId = (els.licenseVideoId.value || '').trim();
  if (!videoId) {
    setStatus('Video ID is required for license request.');
    return;
  }

  const payload = {
    videoId,
    buyerName: (els.licenseBuyerName.value || '').trim(),
    buyerContact: (els.licenseBuyerContact.value || '').trim(),
    amountCents: Number(els.licenseAmountCents.value || 0),
    currency: (els.licenseCurrency.value || 'EUR').trim().toUpperCase(),
    note: (els.licenseNote.value || '').trim()
  };

  const result = await api('/api/licenses/request', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (els.licenseStatusText) {
    const id = result && result.license ? result.license.id : '';
    els.licenseStatusText.textContent = `License requested: ${id || 'ok'}`;
  }
  await loadLicenses();
  await loadPayouts();
}

async function loadLicenses() {
  const status = (els.licenseFilterStatus && els.licenseFilterStatus.value) || '';
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const data = await api(`/api/licenses${query}`);
  const items = Array.isArray(data.licenses) ? data.licenses : [];

  els.licensesList.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'No licenses found.';
    els.licensesList.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    const statusBadge = escapeHtml(item.status || 'requested');
    const amount = formatMoney(item.amountCents, item.currency);
    const payout = formatMoney(item.creatorPayoutCents, item.currency);
    const buyerName = escapeHtml(item.buyerName || '');
    const buyerContact = escapeHtml(item.buyerContact || '');
    const txRef = escapeHtml(item.txRef || '');

    li.innerHTML = `
      <div><strong>${escapeHtml(item.id)}</strong> · status: ${statusBadge}</div>
      <div>video ${escapeHtml(item.videoId)} · buyer ${buyerName || '-'} (${buyerContact || '-'})</div>
      <div>gross ${amount} · creator payout ${payout} · fee ${Number(item.platformFeePct || 0)}%</div>
      <div class="hint">txRef: ${txRef || '-'}</div>
      ${isAdminUser ? `
      <div class="row">
        <select data-license-action="status" data-license-id="${escapeHtml(item.id)}">
          <option value="requested" ${item.status === 'requested' ? 'selected' : ''}>Requested</option>
          <option value="approved" ${item.status === 'approved' ? 'selected' : ''}>Approved</option>
          <option value="paid" ${item.status === 'paid' ? 'selected' : ''}>Paid</option>
          <option value="delivered" ${item.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="rejected" ${item.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
        <button class="secondary" data-license-action="apply" data-license-id="${escapeHtml(item.id)}">Apply</button>
      </div>
      <input data-license-action="txref" data-license-id="${escapeHtml(item.id)}" type="text" value="${txRef}" placeholder="tx reference" />
      <input data-license-action="note" data-license-id="${escapeHtml(item.id)}" type="text" value="${escapeHtml(item.note || '')}" placeholder="admin note" />
      ` : ''}
    `;

    els.licensesList.appendChild(li);
  }
}

function getLicenseControl(licenseId, action) {
  return els.licensesList.querySelector(`[data-license-action="${action}"][data-license-id="${licenseId}"]`);
}

async function applyLicenseStatus(licenseId) {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const statusEl = getLicenseControl(licenseId, 'status');
  const txRefEl = getLicenseControl(licenseId, 'txref');
  const noteEl = getLicenseControl(licenseId, 'note');
  if (!statusEl) {
    return;
  }

  await api(`/api/licenses/${encodeURIComponent(licenseId)}/status`, {
    method: 'POST',
    body: JSON.stringify({
      status: statusEl.value,
      txRef: txRefEl ? (txRefEl.value || '').trim() : '',
      note: noteEl ? (noteEl.value || '').trim() : ''
    })
  });

  setStatus(`License ${licenseId.slice(0, 8)} updated.`);
  await loadLicenses();
  await loadPayouts();
}

async function handleLicenseActions(event) {
  const button = event.target.closest('button[data-license-action="apply"]');
  if (!button) {
    return;
  }
  const licenseId = button.dataset.licenseId;
  if (!licenseId) {
    return;
  }
  await applyLicenseStatus(licenseId);
}

async function loadPayouts() {
  const data = await api('/api/payouts/summary');
  const rows = Array.isArray(data.creators) ? data.creators : [];
  els.payoutsList.innerHTML = '';

  if (!rows.length) {
    const li = document.createElement('li');
    li.textContent = 'No payout rows yet.';
    els.payoutsList.appendChild(li);
    return;
  }

  for (const row of rows) {
    const li = document.createElement('li');
    li.textContent = `${row.creatorUserId} · licenses ${row.totalLicenses} (paid ${row.paidLicenses}) · gross ${formatMoney(row.grossCents, 'EUR')} · creator ${formatMoney(row.creatorPayoutCents, 'EUR')} · platform ${formatMoney(row.platformCents, 'EUR')}`;
    els.payoutsList.appendChild(li);
  }
}

async function loadFeed() {
  const sort = els.feedSort.value || 'latest';
  const data = await api(`/api/feed?sort=${encodeURIComponent(sort)}&limit=100`);
  els.feedList.innerHTML = '';

  if (!data.videos.length) {
    const li = document.createElement('li');
    li.textContent = 'No videos in public feed yet.';
    els.feedList.appendChild(li);
    return;
  }

  for (const video of data.videos) {
    els.feedList.appendChild(renderFeedItem(video));
  }
}

async function addView(videoId) {
  await api(`/api/videos/${encodeURIComponent(videoId)}/view`, {
    method: 'POST',
    body: '{}'
  });
}

function getSelectedRating(videoId) {
  const select = els.feedList.querySelector(`select[data-feed-action="rating-value"][data-id="${videoId}"]`);
  return select ? Number(select.value) : 5;
}

async function submitRating(videoId) {
  await api(`/api/videos/${encodeURIComponent(videoId)}/rate`, {
    method: 'POST',
    body: JSON.stringify({
      userId: getUserId(),
      rating: getSelectedRating(videoId)
    })
  });
  await loadFeed();
  await loadLeaderboard();
  await loadMyProfile();
  setStatus('Rating submitted.');
}

async function loadChat(videoId) {
  const data = await api(`/api/videos/${encodeURIComponent(videoId)}/chat?limit=150`);
  els.chatMessages.innerHTML = '';

  if (!data.messages.length) {
    const li = document.createElement('li');
    li.textContent = 'No messages yet.';
    els.chatMessages.appendChild(li);
    return;
  }

  for (const msg of data.messages) {
    const li = document.createElement('li');
    const rep = Number(msg.reputation || 100).toFixed(1);
    const author = msg.authorLabel || msg.userId;
    const avatar = msg.avatar || 'anonymous';
    const meta = document.createElement('div');
    meta.textContent = `${new Date(msg.createdAt).toLocaleTimeString()} · ${author} [${avatar}] (rep ${rep})`;
    const text = document.createElement('div');
    text.textContent = msg.message;
    li.appendChild(meta);
    li.appendChild(text);

    if (msg.id) {
      const reportBtn = document.createElement('button');
      reportBtn.className = 'secondary';
      reportBtn.dataset.chatAction = 'report';
      reportBtn.dataset.messageId = msg.id;
      reportBtn.dataset.videoId = videoId;
      reportBtn.textContent = 'Report';
      li.appendChild(reportBtn);
    }

    els.chatMessages.appendChild(li);
  }
}

async function reportChatMessage(videoId, messageId) {
  const reason = window.prompt('Report reason (optional):', 'spam') || '';
  await api('/api/moderation/report', {
    method: 'POST',
    body: JSON.stringify({
      videoId,
      messageId,
      reason
    })
  });
  setStatus('Message reported.');
}

async function handleChatActions(event) {
  const button = event.target.closest('button[data-chat-action]');
  if (!button) return;

  const action = button.dataset.chatAction;
  if (action !== 'report') return;

  const videoId = button.dataset.videoId || selectedFeedVideoId;
  const messageId = button.dataset.messageId;
  if (!videoId || !messageId) return;

  await reportChatMessage(videoId, messageId);
}

async function muteUser() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const targetUserId = (els.moderationUserId.value || '').trim();
  const minutes = Number(els.moderationMinutes.value || '30');
  const reason = (els.moderationReason.value || '').trim();
  if (!targetUserId) {
    setStatus('Target user ID is required.');
    return;
  }

  const result = await api('/api/moderation/mute', {
    method: 'POST',
    body: JSON.stringify({ targetUserId, minutes, reason })
  });

  setStatus(`User muted until ${new Date(result.mutedUntil).toLocaleString()}.`);
  await loadReports();
}

async function unmuteUser() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const targetUserId = (els.moderationUserId.value || '').trim();
  if (!targetUserId) {
    setStatus('Target user ID is required.');
    return;
  }

  await api('/api/moderation/unmute', {
    method: 'POST',
    body: JSON.stringify({ targetUserId })
  });

  setStatus('User unmuted.');
  await loadReports();
}

async function loadReports() {
  if (!isAdminUser) {
    els.reportsList.innerHTML = '';
    selectedReportIds.clear();
    reportsPage = 1;
    reportsPagesTotal = 1;
    if (els.reportsPageText) {
      els.reportsPageText.textContent = 'Page 1/1';
    }
    return;
  }

  const query = new URLSearchParams();
  query.set('limit', '30');
  query.set('page', String(reportsPage));

  const status = (els.reportFilterStatus && els.reportFilterStatus.value) || '';
  const reporterUserId = (els.reportFilterReporter && els.reportFilterReporter.value || '').trim();
  const videoId = (els.reportFilterVideo && els.reportFilterVideo.value || '').trim();
  const from = (els.reportFilterFrom && els.reportFilterFrom.value) || '';
  const to = (els.reportFilterTo && els.reportFilterTo.value) || '';

  if (status) query.set('status', status);
  if (reporterUserId) query.set('reporterUserId', reporterUserId);
  if (videoId) query.set('videoId', videoId);
  if (from) query.set('from', from);
  if (to) query.set('to', to);

  const data = await api(`/api/moderation/reports?${query.toString()}`);
  reportsPage = data && data.pagination && Number.isFinite(Number(data.pagination.page)) ? Number(data.pagination.page) : 1;
  reportsPagesTotal = data && data.pagination && Number.isFinite(Number(data.pagination.pages)) ? Number(data.pagination.pages) : 1;
  if (els.reportsPageText) {
    const total = data && data.pagination && Number.isFinite(Number(data.pagination.total)) ? Number(data.pagination.total) : 0;
    els.reportsPageText.textContent = `Page ${reportsPage}/${reportsPagesTotal} · total ${total}`;
  }
  els.reportsList.innerHTML = '';

  if (!data.reports || !data.reports.length) {
    const li = document.createElement('li');
    li.textContent = 'No reports.';
    els.reportsList.appendChild(li);
    selectedReportIds.clear();
    return;
  }

  const existingIds = new Set(data.reports.map((report) => report.id));
  for (const selectedId of Array.from(selectedReportIds)) {
    if (!existingIds.has(selectedId)) {
      selectedReportIds.delete(selectedId);
    }
  }

  for (const report of data.reports) {
    const li = document.createElement('li');
    const safeVideoId = escapeHtml(report.videoId);
    const safeMessageId = escapeHtml(report.messageId);
    const safeReporter = escapeHtml(report.reporterUserId);
    const safeReason = escapeHtml(report.reason || '');
    const safeAdminNote = escapeHtml(report.adminNote || '');
    const reason = safeReason ? ` · reason: ${safeReason}` : '';
    const updated = report.updatedAt ? ` · updated ${new Date(report.updatedAt).toLocaleString()}` : '';
    const adminNote = safeAdminNote ? ` · note: ${safeAdminNote}` : '';

    li.innerHTML = `
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <input type="checkbox" data-report-action="select" data-report-id="${report.id}" style="width:auto;margin:0;" ${selectedReportIds.has(report.id) ? 'checked' : ''} />
        <span>Select for bulk</span>
      </label>
      <div><strong>${new Date(report.createdAt).toLocaleString()}</strong> · status: ${report.status || 'open'}${updated}</div>
      <div>video ${safeVideoId} · message ${safeMessageId} · by ${safeReporter}${reason}${adminNote}</div>
      <div class="row">
        <select data-report-action="status" data-report-id="${report.id}">
          <option value="open" ${report.status === 'open' ? 'selected' : ''}>Open</option>
          <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          <option value="rejected" ${report.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
        <button class="secondary" data-report-action="apply" data-report-id="${report.id}">Apply</button>
      </div>
      <input data-report-action="note" data-report-id="${report.id}" type="text" placeholder="Admin note" value="${safeAdminNote}" />
    `;

    if (Array.isArray(report.history) && report.history.length) {
      const history = document.createElement('div');
      const latest = report.history[report.history.length - 1];
      history.className = 'hint';
      history.textContent = `Last action: ${latest.action} by ${latest.adminUserId || 'system'} at ${new Date(latest.at).toLocaleString()}`;
      li.appendChild(history);
    }

    els.reportsList.appendChild(li);
  }
}

async function loadMetrics() {
  if (!isAdminUser) {
    if (els.metricsSummaryText) {
      els.metricsSummaryText.textContent = 'Admin only.';
    }
    if (els.metricsList) {
      els.metricsList.innerHTML = '';
    }
    return;
  }

  const data = await api('/api/metrics/summary');
  const metrics = data && data.metrics ? data.metrics : {};
  const summary = [
    `Started ${Number(metrics.sessionStartedCount || 0)}`,
    `Completed ${Number(metrics.sessionCompletedCount || 0)}`,
    `Failed ${Number(metrics.sessionFailedCount || 0)}`,
    `Success ${Number(metrics.uploadSuccessRatePct || 0).toFixed(2)}%`,
    `Crash ${Number(metrics.crashRatePct || 0).toFixed(2)}%`,
    `TTFF p50 ${Number(metrics.ttffP50Ms || 0)}ms`,
    `TTFF p95 ${Number(metrics.ttffP95Ms || 0)}ms`
  ].join(' · ');

  if (els.metricsSummaryText) {
    const updated = metrics.updatedAt ? ` · updated ${new Date(metrics.updatedAt).toLocaleString()}` : '';
    els.metricsSummaryText.textContent = `${summary}${updated}`;
  }

  if (!els.metricsList) {
    return;
  }
  els.metricsList.innerHTML = '';
  const events = Array.isArray(data.recentClientEvents) ? data.recentClientEvents : [];
  if (!events.length) {
    const li = document.createElement('li');
    li.textContent = 'No recent client events.';
    els.metricsList.appendChild(li);
    return;
  }

  for (const event of events) {
    const li = document.createElement('li');
    li.textContent = `${new Date(event.at).toLocaleString()} · ${event.type} · ${event.userId || 'n/a'}`;
    els.metricsList.appendChild(li);
  }
}

function formatPilotSummary(summary) {
  if (!summary || typeof summary !== 'object') {
    return 'Pilot summary unavailable.';
  }
  return `Enrolled ${Number(summary.enrolledCount || 0)}/${Number(summary.maxTarget || 50)} · active ${Number(summary.activeCount || 0)} · remaining ${Number(summary.spotsRemaining || 0)} · min target ${Number(summary.minTarget || 20)} (${summary.minReached ? 'reached' : 'pending'})`;
}

async function loadPilotMyStatus() {
  const data = await api('/api/pilot/me');
  if (!els.pilotMyStatusText) {
    return;
  }

  if (!data.participant) {
    els.pilotMyStatusText.textContent = `Not enrolled. ${formatPilotSummary(data.summary)}`;
    return;
  }

  const participant = data.participant;
  const updated = participant.updatedAt ? new Date(participant.updatedAt).toLocaleString() : '-';
  els.pilotMyStatusText.textContent = `Your pilot status: ${participant.status} · updated ${updated} · ${formatPilotSummary(data.summary)}`;
}

async function enrollPilot() {
  const payload = {
    contact: (els.pilotContact && els.pilotContact.value || '').trim(),
    note: (els.pilotNote && els.pilotNote.value || '').trim()
  };

  const result = await api('/api/pilot/enroll', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (els.pilotMyStatusText) {
    els.pilotMyStatusText.textContent = `Pilot request saved with status ${result.participant.status}. ${formatPilotSummary(result.summary)}`;
  }
  if (isAdminUser) {
    await loadPilotParticipants();
  }
}

async function loadMyFeedback() {
  const data = await api('/api/feedback/my?limit=20');
  const items = Array.isArray(data.items) ? data.items : [];
  if (!els.myFeedbackText) {
    return;
  }

  if (!items.length) {
    els.myFeedbackText.textContent = 'No feedback sent yet.';
    return;
  }

  const latest = items[0] || {};
  const latestWhen = latest.updatedAt ? new Date(latest.updatedAt).toLocaleString() : '-';
  const openCount = items.filter((item) => item.status === 'open').length;
  els.myFeedbackText.textContent = `Your feedback items: ${items.length} · open ${openCount} · latest ${latest.status || 'open'} at ${latestWhen}`;
}

async function submitFeedback() {
  const message = ((els.feedbackMessage && els.feedbackMessage.value) || '').trim();
  if (!message) {
    setStatus('Feedback message is required.');
    return;
  }

  const payload = {
    category: (els.feedbackCategory && els.feedbackCategory.value) || 'general',
    message,
    contact: ((els.feedbackContact && els.feedbackContact.value) || '').trim()
  };

  await api('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (els.feedbackMessage) {
    els.feedbackMessage.value = '';
  }
  setStatus('Feedback submitted.');
  await loadMyFeedback();
  if (isAdminUser) {
    await loadFeedbackQueue();
  }
}

async function loadFeedbackQueue() {
  if (!isAdminUser) {
    if (els.feedbackList) {
      els.feedbackList.innerHTML = '';
    }
    return;
  }

  const status = (els.feedbackFilterStatus && els.feedbackFilterStatus.value) || '';
  const category = ((els.feedbackFilterCategory && els.feedbackFilterCategory.value) || '').trim();
  const query = new URLSearchParams();
  query.set('limit', '100');
  if (status) {
    query.set('status', status);
  }
  if (category) {
    query.set('category', category);
  }

  const data = await api(`/api/feedback?${query.toString()}`);
  if (!els.feedbackList) {
    return;
  }

  els.feedbackList.innerHTML = '';
  const items = Array.isArray(data.items) ? data.items : [];
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'No feedback items for selected filter.';
    els.feedbackList.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    const safeId = escapeHtml(item.id || '');
    const safeUserId = escapeHtml(item.userId || '');
    const safeCategory = escapeHtml(item.category || 'general');
    const safeMessage = escapeHtml(item.message || '');
    const safeContact = escapeHtml(item.contact || '');
    const safeAdminNote = escapeHtml(item.adminNote || '');
    const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-';

    li.innerHTML = `
      <div><strong>${safeUserId}</strong> · ${safeCategory} · status ${escapeHtml(item.status || 'open')} · updated ${updatedAt}</div>
      <div>${safeMessage}</div>
      <div class="hint">contact: ${safeContact || '-'}</div>
      <div class="row">
        <select data-feedback-action="status" data-feedback-id="${safeId}">
          ${FEEDBACK_STATUS_OPTIONS.map((option) => `<option value="${option}" ${item.status === option ? 'selected' : ''}>${option}</option>`).join('')}
        </select>
        <button class="secondary" data-feedback-action="apply" data-feedback-id="${safeId}">Apply</button>
      </div>
      <input data-feedback-action="note" data-feedback-id="${safeId}" type="text" placeholder="Admin note" value="${safeAdminNote}" />
    `;
    els.feedbackList.appendChild(li);
  }
}

function getFeedbackControl(feedbackId, action) {
  if (!els.feedbackList) {
    return null;
  }
  return els.feedbackList.querySelector(`[data-feedback-action="${action}"][data-feedback-id="${feedbackId}"]`);
}

async function updateFeedbackStatus(feedbackId) {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const statusEl = getFeedbackControl(feedbackId, 'status');
  const noteEl = getFeedbackControl(feedbackId, 'note');
  if (!statusEl) {
    return;
  }

  const result = await api(`/api/feedback/${encodeURIComponent(feedbackId)}/status`, {
    method: 'POST',
    body: JSON.stringify({
      status: statusEl.value,
      adminNote: noteEl ? (noteEl.value || '').trim() : ''
    })
  });

  setStatus(`Feedback updated to ${result.feedback.status}.`);
  await loadFeedbackQueue();
}

async function handleFeedbackActions(event) {
  const button = event.target.closest('button[data-feedback-action="apply"]');
  if (!button) {
    return;
  }
  const feedbackId = button.dataset.feedbackId;
  if (!feedbackId) {
    return;
  }
  await updateFeedbackStatus(feedbackId);
}

async function createIteration() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const title = ((els.iterationTitle && els.iterationTitle.value) || '').trim();
  if (!title) {
    setStatus('Iteration title is required.');
    return;
  }

  const feedbackIdsRaw = ((els.iterationFeedbackIds && els.iterationFeedbackIds.value) || '').trim();
  const feedbackIds = feedbackIdsRaw
    ? feedbackIdsRaw.split(',').map((entry) => entry.trim()).filter(Boolean)
    : [];

  const payload = {
    title,
    goal: ((els.iterationGoal && els.iterationGoal.value) || '').trim(),
    startDate: (els.iterationStart && els.iterationStart.value) || '',
    endDate: (els.iterationEnd && els.iterationEnd.value) || '',
    feedbackIds,
    status: 'planned'
  };

  const result = await api('/api/iterations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (els.iterationStatusText) {
    els.iterationStatusText.textContent = `Iteration created: ${result.iteration.title}`;
  }
  if (els.iterationTitle) els.iterationTitle.value = '';
  if (els.iterationGoal) els.iterationGoal.value = '';
  if (els.iterationFeedbackIds) els.iterationFeedbackIds.value = '';
  await loadIterations();
}

async function loadIterations() {
  if (!isAdminUser) {
    if (els.iterationStatusText) {
      els.iterationStatusText.textContent = 'Admin only.';
    }
    if (els.iterationsList) {
      els.iterationsList.innerHTML = '';
    }
    return;
  }

  const data = await api('/api/iterations?limit=80');
  const items = Array.isArray(data.iterations) ? data.iterations : [];
  if (els.iterationStatusText) {
    const total = data.pagination && Number.isFinite(Number(data.pagination.total)) ? Number(data.pagination.total) : items.length;
    els.iterationStatusText.textContent = `Iterations total: ${total}`;
  }
  if (!els.iterationsList) {
    return;
  }

  els.iterationsList.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'No iterations created yet.';
    els.iterationsList.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    const safeId = escapeHtml(item.id || '');
    const safeTitle = escapeHtml(item.title || '');
    const safeGoal = escapeHtml(item.goal || '');
    const start = escapeHtml(item.startDate || '-');
    const end = escapeHtml(item.endDate || '-');
    const feedbackCount = Array.isArray(item.feedbackIds) ? item.feedbackIds.length : 0;
    const updated = item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-';

    li.innerHTML = `
      <div><strong>${safeTitle}</strong> · status ${escapeHtml(item.status || 'planned')} · ${start} → ${end}</div>
      <div>${safeGoal || '-'}</div>
      <div class="hint">feedback linked: ${feedbackCount} · updated ${updated}</div>
      <div class="row">
        <select data-iteration-action="status" data-iteration-id="${safeId}">
          ${ITERATION_STATUS_OPTIONS.map((option) => `<option value="${option}" ${item.status === option ? 'selected' : ''}>${option}</option>`).join('')}
        </select>
        <button class="secondary" data-iteration-action="apply" data-iteration-id="${safeId}">Apply</button>
      </div>
    `;
    els.iterationsList.appendChild(li);
  }
}

function getIterationControl(iterationId, action) {
  if (!els.iterationsList) {
    return null;
  }
  return els.iterationsList.querySelector(`[data-iteration-action="${action}"][data-iteration-id="${iterationId}"]`);
}

async function updateIterationStatus(iterationId) {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }
  const statusEl = getIterationControl(iterationId, 'status');
  if (!statusEl) {
    return;
  }

  const result = await api(`/api/iterations/${encodeURIComponent(iterationId)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status: statusEl.value })
  });

  setStatus(`Iteration updated to ${result.iteration.status}.`);
  await loadIterations();
}

async function handleIterationActions(event) {
  const button = event.target.closest('button[data-iteration-action="apply"]');
  if (!button) {
    return;
  }
  const iterationId = button.dataset.iterationId;
  if (!iterationId) {
    return;
  }
  await updateIterationStatus(iterationId);
}

async function loadPilotParticipants() {
  if (!isAdminUser) {
    if (els.pilotSummaryText) {
      els.pilotSummaryText.textContent = 'Admin only.';
    }
    if (els.pilotList) {
      els.pilotList.innerHTML = '';
    }
    return;
  }

  const status = (els.pilotFilterStatus && els.pilotFilterStatus.value) || '';
  const query = new URLSearchParams();
  query.set('limit', '80');
  if (status) {
    query.set('status', status);
  }

  const data = await api(`/api/pilot/participants?${query.toString()}`);
  if (els.pilotSummaryText) {
    els.pilotSummaryText.textContent = formatPilotSummary(data.summary);
  }

  if (!els.pilotList) {
    return;
  }
  els.pilotList.innerHTML = '';
  const participants = Array.isArray(data.participants) ? data.participants : [];
  if (!participants.length) {
    const li = document.createElement('li');
    li.textContent = 'No pilot participants for selected filter.';
    els.pilotList.appendChild(li);
    return;
  }

  for (const participant of participants) {
    const li = document.createElement('li');
    const updatedAt = participant.updatedAt ? new Date(participant.updatedAt).toLocaleString() : '-';
    const safeId = escapeHtml(participant.id || '');
    const safeUserId = escapeHtml(participant.userId || '');
    const safeContact = escapeHtml(participant.contact || '');
    const safeAdminNote = escapeHtml(participant.adminNote || '');
    li.innerHTML = `
      <div><strong>${safeUserId}</strong> · status ${escapeHtml(participant.status || 'requested')} · updated ${updatedAt}</div>
      <div class="hint">contact: ${safeContact || '-'}</div>
      <div class="row">
        <select data-pilot-action="status" data-pilot-id="${safeId}">
          <option value="requested" ${participant.status === 'requested' ? 'selected' : ''}>Requested</option>
          <option value="approved" ${participant.status === 'approved' ? 'selected' : ''}>Approved</option>
          <option value="active" ${participant.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="paused" ${participant.status === 'paused' ? 'selected' : ''}>Paused</option>
          <option value="rejected" ${participant.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          <option value="removed" ${participant.status === 'removed' ? 'selected' : ''}>Removed</option>
        </select>
        <button class="secondary" data-pilot-action="apply" data-pilot-id="${safeId}">Apply</button>
      </div>
      <input data-pilot-action="note" data-pilot-id="${safeId}" type="text" placeholder="Admin note" value="${safeAdminNote}" />
    `;
    els.pilotList.appendChild(li);
  }
}

function getPilotControl(pilotId, action) {
  return els.pilotList.querySelector(`[data-pilot-action="${action}"][data-pilot-id="${pilotId}"]`);
}

async function updatePilotParticipantStatus(pilotId) {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }
  const statusEl = getPilotControl(pilotId, 'status');
  const noteEl = getPilotControl(pilotId, 'note');
  if (!statusEl) {
    return;
  }

  const result = await api(`/api/pilot/participants/${encodeURIComponent(pilotId)}/status`, {
    method: 'POST',
    body: JSON.stringify({
      status: statusEl.value,
      adminNote: noteEl ? (noteEl.value || '').trim() : ''
    })
  });

  setStatus(`Pilot participant updated to ${result.participant.status}.`);
  await loadPilotParticipants();
}

async function handlePilotActions(event) {
  const button = event.target.closest('button[data-pilot-action="apply"]');
  if (!button) {
    return;
  }
  const pilotId = button.dataset.pilotId;
  if (!pilotId) {
    return;
  }
  await updatePilotParticipantStatus(pilotId);
}

async function reportClientEvent(type, payload = {}) {
  try {
    await api('/api/client-events', {
      method: 'POST',
      body: JSON.stringify({
        type,
        userId: getUserId(),
        payload
      })
    });
  } catch {
  }
}

function applyReportFilters() {
  reportsPage = 1;
  loadReports().catch((error) => setStatus(`Reports error: ${error.message}`));
}

function clearReportFilters() {
  if (els.reportFilterStatus) els.reportFilterStatus.value = '';
  if (els.reportFilterReporter) els.reportFilterReporter.value = '';
  if (els.reportFilterVideo) els.reportFilterVideo.value = '';
  if (els.reportFilterFrom) els.reportFilterFrom.value = '';
  if (els.reportFilterTo) els.reportFilterTo.value = '';
  reportsPage = 1;
  loadReports().catch((error) => setStatus(`Reports error: ${error.message}`));
}

function goPrevReportsPage() {
  if (reportsPage <= 1) {
    setStatus('Already on first reports page.');
    return;
  }
  reportsPage -= 1;
  loadReports().catch((error) => setStatus(`Reports error: ${error.message}`));
}

function goNextReportsPage() {
  if (reportsPage >= reportsPagesTotal) {
    setStatus('Already on last reports page.');
    return;
  }
  reportsPage += 1;
  loadReports().catch((error) => setStatus(`Reports error: ${error.message}`));
}

function getReportControl(reportId, action) {
  return els.reportsList.querySelector(`[data-report-action="${action}"][data-report-id="${reportId}"]`);
}

async function updateReportStatus(reportId) {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const statusEl = getReportControl(reportId, 'status');
  const noteEl = getReportControl(reportId, 'note');
  if (!statusEl) {
    return;
  }

  const status = statusEl.value;
  const adminNote = noteEl ? (noteEl.value || '').trim() : '';
  await api(`/api/moderation/reports/${encodeURIComponent(reportId)}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, adminNote })
  });

  setStatus(`Report ${reportId.slice(0, 8)} updated to ${status}.`);
  await loadReports();
}

async function handleReportsActions(event) {
  const selectionInput = event.target.closest('input[data-report-action="select"]');
  if (selectionInput) {
    const reportId = selectionInput.dataset.reportId;
    if (reportId) {
      if (selectionInput.checked) {
        selectedReportIds.add(reportId);
      } else {
        selectedReportIds.delete(reportId);
      }
      setStatus(`${selectedReportIds.size} reports selected.`);
    }
    return;
  }

  const button = event.target.closest('button[data-report-action="apply"]');
  if (!button) return;

  const reportId = button.dataset.reportId;
  if (!reportId) return;
  await updateReportStatus(reportId);
}

async function handleProofActions(event) {
  const button = event.target.closest('button[data-proof-action]');
  if (!button) return;
  const action = button.dataset.proofAction;
  if (action !== 'set-day') return;
  const day = button.dataset.day || '';
  useProofDay(day);
}

async function applyBulkReportStatus() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }
  const reportIds = Array.from(selectedReportIds);
  if (!reportIds.length) {
    setStatus('No reports selected for bulk update.');
    return;
  }

  const status = els.bulkReportStatus.value;
  const adminNote = (els.bulkReportNote.value || '').trim();
  const result = await api('/api/moderation/reports/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ reportIds, status, adminNote })
  });

  setStatus(`Bulk updated ${result.updatedCount}/${reportIds.length} reports to ${status}.`);
  selectedReportIds.clear();
  await loadReports();
}

function parseDownloadFilename(headerValue, fallbackName) {
  if (!headerValue || typeof headerValue !== 'string') {
    return fallbackName;
  }

  const utfMatch = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch && utfMatch[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return fallbackName;
    }
  }

  const plainMatch = headerValue.match(/filename="?([^";]+)"?/i);
  if (plainMatch && plainMatch[1]) {
    return plainMatch[1].trim();
  }

  return fallbackName;
}

async function downloadReportsExport() {
  if (!isAdminUser) {
    setStatus('Admin only action.');
    return;
  }

  const format = els.exportReportsFormat && els.exportReportsFormat.value === 'csv' ? 'csv' : 'json';
  const endpoint = `/api/moderation/reports/export?format=${encodeURIComponent(format)}&limit=3000`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    const error = typeof payload === 'object' ? payload.error : payload;
    if (response.status === 401) {
      setAuthSession(null);
      applyAuthSessionToUi();
      closeRealtimeStream();
    }
    throw new Error(error || `Export failed ${response.status}`);
  }

  const blob = await response.blob();
  const fallbackName = `moderation-reports.${format}`;
  const filename = parseDownloadFilename(response.headers.get('content-disposition'), fallbackName);
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);

  setStatus(`Downloaded moderation export (${format.toUpperCase()}).`);
}

function clearBulkSelection() {
  selectedReportIds.clear();
  const checkboxes = els.reportsList.querySelectorAll('input[data-report-action="select"]');
  for (const checkbox of checkboxes) {
    checkbox.checked = false;
  }
  setStatus('Bulk selection cleared.');
}

async function loadLeaderboard() {
  const data = await api('/api/leaderboard?limit=20');
  els.leaderboardList.innerHTML = '';

  if (!data.users.length) {
    const li = document.createElement('li');
    li.textContent = 'No contributors yet.';
    els.leaderboardList.appendChild(li);
    return;
  }

  for (const [index, user] of data.users.entries()) {
    const li = document.createElement('li');
    li.textContent = `#${index + 1} ${user.userId} · rep ${Number(user.reputation).toFixed(1)} · helpful ${user.helpfulActions} · videos ${user.completedVideoCount}`;
    els.leaderboardList.appendChild(li);
  }
}

async function openChat(videoId) {
  selectedFeedVideoId = videoId;
  els.chatVideoText.textContent = `Chat for video: ${videoId}`;
  await loadChat(videoId);
}

async function sendChatMessage() {
  const message = (els.chatMessageInput.value || '').trim();
  if (!selectedFeedVideoId) {
    setStatus('Select video from feed first.');
    return;
  }
  if (!message) {
    setStatus('Message is empty.');
    return;
  }

  await api(`/api/videos/${encodeURIComponent(selectedFeedVideoId)}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      userId: getUserId(),
      message
    })
  });

  els.chatMessageInput.value = '';
  await loadChat(selectedFeedVideoId);
  await loadFeed();
  await loadLeaderboard();
  await loadMyProfile();
}

async function handleFeedActions(event) {
  const button = event.target.closest('button[data-feed-action]');
  if (!button) return;

  const action = button.dataset.feedAction;
  const videoId = button.dataset.id;
  if (!action || !videoId) return;

  if (action === 'open') {
    const fileUrl = button.dataset.url;
    const fallbackUrl = button.dataset.fallbackUrl;
    const targetUrl = fileUrl || fallbackUrl;
    try {
      await addView(videoId);
      if (targetUrl) {
        if (targetUrl.endsWith('.m3u8') && !NATIVE_HLS_SUPPORTED) {
          const opened = openHlsWithHlsJs(targetUrl, fallbackUrl);
          if (!opened) {
            setStatus('Playback popup blocked. Allow popups for this site.');
          }
        } else {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        setStatus('No playback URL available for this video.');
      }
      await loadFeed();
      return;
    } catch (error) {
      setStatus(`View error: ${error.message}`);
      return;
    }
  }

  if (action === 'chat') {
    try {
      await openChat(videoId);
      return;
    } catch (error) {
      setStatus(`Chat open error: ${error.message}`);
      return;
    }
  }

  if (action === 'license') {
    setLicenseVideoId(videoId);
    return;
  }

  if (action === 'rate') {
    try {
      await submitRating(videoId);
      return;
    } catch (error) {
      setStatus(`Rate error: ${error.message}`);
    }
  }
}

async function loadLocalVideos() {
  const local = await dbGetAll();
  local.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  els.localVideosList.innerHTML = '';

  const pendingCount = local.filter((v) => v.pendingUpload).length;
  const keepLocalCount = local.length - pendingCount;
  els.localSummaryText.textContent = `Total: ${local.length} · Pending upload: ${pendingCount} · Local-only: ${keepLocalCount}`;

  if (!local.length) {
    const li = document.createElement('li');
    li.textContent = 'No local videos.';
    els.localVideosList.appendChild(li);
    return;
  }

  for (const item of local) {
    const li = document.createElement('li');
    const state = item.pendingUpload ? 'pending-upload' : 'local-only';
    const captureProfile = item.captureProfile ? ` · ${item.captureProfile}` : '';
    li.innerHTML = `
      <div>${new Date(item.createdAt).toLocaleString()} · ${fmtMs(item.durationMs)} · ${fmtBytes(item.bytes)} · ${state}${captureProfile}</div>
      ${item.incidentTitle ? `<div>${item.incidentTitle}</div>` : ''}
      ${item.proofHash ? `<div class="proof">Proof: ${item.proofHash.slice(0, 16)}...</div>` : ''}
      <div class="row">
        <button class="secondary" data-action="play" data-id="${item.id}">Play</button>
        <button class="secondary" data-action="upload" data-id="${item.id}">Upload</button>
      </div>
      <div class="row">
        <button class="secondary" data-action="keep" data-id="${item.id}">Keep local</button>
        <button class="danger" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    `;
    els.localVideosList.appendChild(li);
  }
}

async function getPendingLocalVideos() {
  const local = await dbGetAll();
  return local
    .filter((v) => v.pendingUpload)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

async function saveLocalVideo({ blob, durationMs, pendingUpload }) {
  const { incidentTitle, incidentTags } = getIncidentMeta();
  const proofHash = await sha256Hex(blob);
  await dbPut({
    id: crypto.randomUUID(),
    userId: getUserId(),
    createdAt: new Date().toISOString(),
    durationMs,
    bytes: blob.size,
    proofHash,
    incidentTitle,
    incidentTags,
    processingMode: els.processingMode.value,
    captureProfile: currentCaptureProfile,
    pendingUpload: Boolean(pendingUpload),
    blob
  });
}

async function sha256Hex(blob) {
  if (!window.crypto || !window.crypto.subtle) {
    return `local-${Date.now().toString(16)}-${blob.size.toString(16)}`;
  }

  try {
    const buffer = await blob.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const bytes = new Uint8Array(digest);
    return Array.from(bytes).map((v) => v.toString(16).padStart(2, '0')).join('');
  } catch {
    return `local-${Date.now().toString(16)}-${blob.size.toString(16)}`;
  }
}

async function setKeepLocal(id) {
  const record = await dbGet(id);
  if (!record) return;
  record.pendingUpload = false;
  await dbPut(record);
}

async function keepAllLocalVideos() {
  const local = await dbGetAll();
  for (const item of local) {
    if (item.pendingUpload) {
      item.pendingUpload = false;
      await dbPut(item);
    }
  }
  await loadLocalVideos();
  setStatus('All pending videos switched to local-only.');
}

async function checkOnlineUploadPrompt() {
  if (!navigator.onLine) return;
  const pending = await getPendingLocalVideos();
  if (!pending.length) return;

  if (els.autoUploadToggle.checked) {
    await uploadAllPendingLocalVideos();
    return;
  }

  const shouldUpload = window.confirm(
    `Internet je dostupan. Imaš ${pending.length} lokalnih snimaka. Da li želiš da ih upload-uješ sada?`
  );

  if (!shouldUpload) {
    for (const item of pending) {
      item.pendingUpload = false;
      await dbPut(item);
    }
    await loadLocalVideos();
    setStatus('Snimci ostaju lokalno.');
    return;
  }

  for (const item of pending) {
    try {
      await uploadLocalVideoById(item.id);
    } catch (error) {
      setStatus(`Upload failed for local video: ${error.message}`);
      break;
    }
  }
}

async function uploadAllPendingLocalVideos() {
  const pending = await getPendingLocalVideos();
  if (!pending.length) {
    setStatus('No pending local videos for upload.');
    return;
  }

  let completed = 0;
  for (const item of pending) {
    try {
      setStatus(`Uploading ${completed + 1}/${pending.length}...`);
      await uploadLocalVideoById(item.id);
      completed += 1;
    } catch (error) {
      setStatus(`Stopped at ${completed}/${pending.length}: ${error.message}`);
      await loadLocalVideos();
      return;
    }
  }

  setStatus(`Upload complete: ${completed}/${pending.length}.`);
  await loadLocalVideos();
}

async function uploadLocalVideoById(id) {
  const record = await dbGet(id);
  if (!record) return;

  const { sessionId, chunkCryptoKey, chunkEncryption } = await api('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({
      userId: record.userId || getUserId(),
      incidentTitle: record.incidentTitle || '',
      incidentTags: record.incidentTags || '',
      captureProfile: record.captureProfile || 'offline-legacy'
    })
  });

  const chunkSize = 256 * 1024;
  const chunkCount = Math.max(1, Math.ceil(record.blob.size / chunkSize));
  const chunkDurationMs = Math.max(250, Math.floor(record.durationMs / chunkCount));

  for (let offset = 0; offset < record.blob.size; offset += chunkSize) {
    const chunkBlob = record.blob.slice(offset, offset + chunkSize);
    const chunkBuffer = await chunkBlob.arrayBuffer();
    const encryptedChunk = await encryptChunkForUpload(chunkBuffer, chunkCryptoKey, chunkEncryption);
    const resp = await fetch(`/api/sessions/${sessionId}/chunks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-chunk-duration-ms': String(chunkDurationMs),
        ...encryptedChunk.headers,
        ...getAuthHeaders()
      },
      body: encryptedChunk.body
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `Chunk upload failed (${resp.status})`);
    }
  }

  await api(`/api/sessions/${sessionId}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      processingMode: record.processingMode || 'device',
      proofHash: record.proofHash || null
    })
  });

  await dbDelete(id);
  await loadVideos();
  await loadFeed();
  await loadLocalVideos();
  await loadLimits();
  setStatus('Local video uploaded to server.');
}

async function startServerSessionIfPossible() {
  if (!navigator.onLine) {
    uploadAvailable = false;
    currentSessionId = null;
    currentChunkCryptoKeyB64 = '';
    currentChunkEncryption = '';
    return;
  }
  try {
    const { sessionId, chunkCryptoKey, chunkEncryption } = await api('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({
        userId: getUserId(),
        ...getIncidentMeta(),
        captureProfile: currentCaptureProfile
      })
    });
    currentSessionId = sessionId;
    currentChunkCryptoKeyB64 = typeof chunkCryptoKey === 'string' ? chunkCryptoKey : '';
    currentChunkEncryption = typeof chunkEncryption === 'string' ? chunkEncryption : '';
    uploadAvailable = true;
  } catch {
    uploadAvailable = false;
    currentSessionId = null;
    currentChunkCryptoKeyB64 = '';
    currentChunkEncryption = '';
  }
}

async function ensureCamera() {
  if (mediaStream) return mediaStream;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: true
    });
  } catch {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    setStatus('Audio capture unavailable on this device. Recording video-only.');
  }
  els.preview.srcObject = mediaStream;
  return mediaStream;
}

async function startRecording() {
  const userId = getUserId();
  if (!userId) {
    setStatus('Missing user ID.');
    return;
  }

  if (!supportsMediaRecorder()) {
    setStatus('MediaRecorder nije podržan. Potreban je moderniji browser.');
    return;
  }

  const stream = await ensureCamera();
  localChunks = [];
  localBytes = 0;
  recordingStartedAt = Date.now();

  const qualityPreset = els.qualityPreset.value;
  const captureProfile = getCaptureProfile(qualityPreset);
  currentCaptureProfile = captureProfile.profile;

  await startServerSessionIfPossible();

  const recorderOptions = {};
  if (captureProfile.mimeType) {
    recorderOptions.mimeType = captureProfile.mimeType;
  }
  recorderOptions.videoBitsPerSecond = captureProfile.videoBitsPerSecond;

  try {
    recorder = new MediaRecorder(stream, recorderOptions);
  } catch {
    recorder = new MediaRecorder(stream);
  }
  recorder.ondataavailable = async (event) => {
    if (!event.data || event.data.size === 0) return;

    localChunks.push(event.data);
    localBytes += event.data.size;

    if (localBytes > MAX_SIZE_BYTES) {
      setStatus('Dostignut je limit veličine (30MB).');
      stopRecording();
      return;
    }

    const durationMs = Date.now() - recordingStartedAt;
    if (durationMs >= MAX_DURATION_MS) {
      setStatus('Max duration reached (3 min). Stopping...');
      stopRecording();
      return;
    }

    if (!uploadAvailable || !currentSessionId) return;

    try {
      const chunk = await event.data.arrayBuffer();
      const encryptedChunk = await encryptChunkForUpload(chunk, currentChunkCryptoKeyB64, currentChunkEncryption);
      const resp = await fetch(`/api/sessions/${currentSessionId}/chunks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-chunk-duration-ms': '1000',
          ...encryptedChunk.headers,
          ...getAuthHeaders()
        },
        body: encryptedChunk.body
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        uploadAvailable = false;
        currentSessionId = null;
        currentChunkCryptoKeyB64 = '';
        currentChunkEncryption = '';
        setStatus(`Server upload paused: ${err.error || resp.status}. Snimak ostaje lokalno.`);
        return;
      }
    } catch (error) {
      uploadAvailable = false;
      currentSessionId = null;
      currentChunkCryptoKeyB64 = '';
      currentChunkEncryption = '';
      setStatus(`Nema mreže: čuvam lokalno (${error.message}).`);
    }
  };

  recorder.onstop = async () => {
    const durationMs = Math.min(MAX_DURATION_MS, Date.now() - recordingStartedAt);
    const finalBlob = new Blob(localChunks, { type: 'video/webm' });
    const proofHash = await sha256Hex(finalBlob);

    if (!finalBlob.size) {
      return;
    }

    let completedOnServer = false;
    if (uploadAvailable && currentSessionId) {
      try {
        await api(`/api/sessions/${currentSessionId}/complete`, {
          method: 'POST',
          body: JSON.stringify({
            processingMode: els.processingMode.value,
            proofHash
          })
        });
        completedOnServer = true;
      } catch {
        completedOnServer = false;
      }
    }

    if (!completedOnServer) {
      await saveLocalVideo({ blob: finalBlob, durationMs, pendingUpload: true });
      setStatus(`Snimak je sačuvan lokalno. Proof: ${proofHash.slice(0, 12)}...`);
    } else {
      setStatus(`Snimak sačuvan na server. Proof: ${proofHash.slice(0, 12)}...`);
    }

    localChunks = [];
    localBytes = 0;
    currentSessionId = null;
    uploadAvailable = false;
    currentChunkCryptoKeyB64 = '';
    currentChunkEncryption = '';

    await loadLimits();
    await loadVideos();
    await loadFeed();
    await loadLocalVideos();
  };

  recorder.start(captureProfile.timesliceMs);
  els.startBtn.disabled = true;
  els.stopBtn.disabled = false;
  if (currentSessionId) {
    setStatus(`Recording started (${currentCaptureProfile}). Server upload active + local backup.`);
  } else {
    setStatus(`Recording started (${currentCaptureProfile}) offline. Local save mode active.`);
  }
}

async function stopRecording() {
  if (!recorder || recorder.state === 'inactive') return;
  recorder.stop();

  els.startBtn.disabled = false;
  els.stopBtn.disabled = true;
}

async function registerNode() {
  const nodeName = (els.nodeName.value || '').trim();
  if (!nodeName) {
    els.nodeText.textContent = 'Node name is required.';
    return;
  }

  const payload = {
    nodeName,
    publicUrl: (els.nodeUrl.value || '').trim(),
    shareResources: true,
    capabilities: ['ingest', 'storage'],
    maxStorageGb: 50,
    maxBandwidthMbps: 20
  };

  const result = await api('/api/nodes/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  localStorage.setItem(KEY_NODE_ID, result.nodeId);
  els.nodeText.textContent = `Node registered: ${result.nodeId}`;

  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }

  heartbeatTimer = setInterval(async () => {
    const nodeId = localStorage.getItem(KEY_NODE_ID);
    if (!nodeId) return;
    try {
      await api(`/api/nodes/${nodeId}/heartbeat`, { method: 'POST', body: '{}' });
    } catch {
      clearInterval(heartbeatTimer);
    }
  }, 30000);
}

async function listNodes() {
  const { nodes } = await api('/api/nodes');
  els.nodesList.innerHTML = '';

  if (!nodes.length) {
    const li = document.createElement('li');
    li.textContent = 'No registered nodes.';
    els.nodesList.appendChild(li);
    return;
  }

  for (const node of nodes) {
    const li = document.createElement('li');
    const urlPart = node.publicUrl ? ` · ${node.publicUrl}` : '';
    li.textContent = `${node.nodeName} · ${node.status}${urlPart} · ${node.maxStorageGb}GB`;
    els.nodesList.appendChild(li);
  }
}

async function handleLocalVideosActions(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action || !id) return;

  try {
    if (action === 'delete') {
      await dbDelete(id);
      await loadLocalVideos();
      setStatus('Local video deleted.');
      return;
    }

    if (action === 'keep') {
      await setKeepLocal(id);
      await loadLocalVideos();
      setStatus('Video marked as local-only.');
      return;
    }

    if (action === 'play') {
      const item = await dbGet(id);
      if (!item) return;
      const url = URL.createObjectURL(item.blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }

    if (action === 'upload') {
      await uploadLocalVideoById(id);
      return;
    }
  } catch (error) {
    setStatus(`Local action error: ${error.message}`);
  }
}

function setNetworkHint() {
  if (navigator.onLine) {
    setStatus('Online mode.');
  } else {
    setStatus('Offline mode. Snimci idu lokalno.');
  }
}

els.saveUserBtn.addEventListener('click', () => {
  const id = getUserId();
  if (!id) return;
  localStorage.setItem(KEY_USER_ID, id);
  setStatus(`Saved user ID: ${id}`);
});

els.avatarSelect.addEventListener('change', () => {
  localStorage.setItem(KEY_AVATAR, els.avatarSelect.value);
  if (els.avatarSelect.value === 'anonymous') {
    els.anonymousToggle.checked = true;
    localStorage.setItem(KEY_ANON, '1');
  }
});

els.anonymousToggle.addEventListener('change', () => {
  localStorage.setItem(KEY_ANON, els.anonymousToggle.checked ? '1' : '0');
});

els.guestLoginBtn.addEventListener('click', () => loginGuest().catch((e) => setStatus(`Guest login error: ${e.message}`)));
els.logoutBtn.addEventListener('click', () => logout().catch((e) => setStatus(`Logout error: ${e.message}`)));

els.loadLimitsBtn.addEventListener('click', () => loadLimits().catch((e) => (els.limitsText.textContent = e.message)));
els.startBtn.addEventListener('click', () => startRecording().catch((e) => setStatus(`Start error: ${e.message}`)));
els.stopBtn.addEventListener('click', () => stopRecording().catch((e) => setStatus(`Stop error: ${e.message}`)));
els.refreshVideosBtn.addEventListener('click', () => loadVideos().catch((e) => setStatus(`Video list error: ${e.message}`)));
els.refreshFeedBtn.addEventListener('click', () => loadFeed().catch((e) => setStatus(`Feed error: ${e.message}`)));
els.feedSort.addEventListener('change', () => loadFeed().catch((e) => setStatus(`Feed sort error: ${e.message}`)));
els.requestLicenseBtn.addEventListener('click', () => requestLicense().catch((e) => setStatus(`License request error: ${e.message}`)));
els.refreshLicensesBtn.addEventListener('click', () => loadLicenses().catch((e) => setStatus(`Licenses error: ${e.message}`)));
els.licenseFilterStatus.addEventListener('change', () => loadLicenses().catch((e) => setStatus(`Licenses error: ${e.message}`)));
els.licensesList.addEventListener('click', (e) => {
  handleLicenseActions(e).catch((err) => setStatus(`License action error: ${err.message}`));
});
els.refreshPayoutsBtn.addEventListener('click', () => loadPayouts().catch((e) => setStatus(`Payouts error: ${e.message}`)));
els.refreshLeaderboardBtn.addEventListener('click', () =>
  loadLeaderboard().catch((e) => setStatus(`Leaderboard error: ${e.message}`))
);
els.feedList.addEventListener('click', (e) => {
  handleFeedActions(e).catch((err) => setStatus(`Feed action error: ${err.message}`));
});
els.refreshProofsBtn.addEventListener('click', () => loadProofs().catch((e) => setStatus(`Proofs error: ${e.message}`)));
els.anchorProofBtn.addEventListener('click', () => anchorProofDay().catch((e) => setStatus(`Anchor error: ${e.message}`)));
els.proofsList.addEventListener('click', (e) => {
  handleProofActions(e).catch((err) => setStatus(`Proof action error: ${err.message}`));
});
els.chatMessages.addEventListener('click', (e) => {
  handleChatActions(e).catch((err) => setStatus(`Chat action error: ${err.message}`));
});
els.sendChatBtn.addEventListener('click', () => sendChatMessage().catch((e) => setStatus(`Chat send error: ${e.message}`)));
els.chatMessageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendChatMessage().catch((e) => setStatus(`Chat send error: ${e.message}`));
  }
});
els.refreshLocalBtn.addEventListener('click', () => loadLocalVideos().catch((e) => setStatus(`Local list error: ${e.message}`)));
els.uploadAllLocalBtn.addEventListener('click', () => uploadAllPendingLocalVideos().catch((e) => setStatus(`Bulk upload error: ${e.message}`)));
els.keepAllLocalBtn.addEventListener('click', () => keepAllLocalVideos().catch((e) => setStatus(`Bulk keep-local error: ${e.message}`)));
els.localVideosList.addEventListener('click', (e) => {
  handleLocalVideosActions(e).catch((err) => setStatus(`Local action error: ${err.message}`));
});
els.registerNodeBtn.addEventListener('click', () => registerNode().catch((e) => (els.nodeText.textContent = e.message)));
els.listNodesBtn.addEventListener('click', () => listNodes().catch((e) => (els.nodeText.textContent = e.message)));
els.muteUserBtn.addEventListener('click', () => muteUser().catch((e) => setStatus(`Mute error: ${e.message}`)));
els.unmuteUserBtn.addEventListener('click', () => unmuteUser().catch((e) => setStatus(`Unmute error: ${e.message}`)));
els.applyBulkReportsBtn.addEventListener('click', () => applyBulkReportStatus().catch((e) => setStatus(`Bulk update error: ${e.message}`)));
els.clearBulkSelectionBtn.addEventListener('click', clearBulkSelection);
els.applyReportFiltersBtn.addEventListener('click', applyReportFilters);
els.clearReportFiltersBtn.addEventListener('click', clearReportFilters);
els.downloadReportsBtn.addEventListener('click', () =>
  downloadReportsExport().catch((e) => setStatus(`Export error: ${e.message}`))
);
els.prevReportsPageBtn.addEventListener('click', goPrevReportsPage);
els.nextReportsPageBtn.addEventListener('click', goNextReportsPage);
els.refreshReportsBtn.addEventListener('click', () => loadReports().catch((e) => setStatus(`Reports error: ${e.message}`)));
els.refreshMetricsBtn.addEventListener('click', () => loadMetrics().catch((e) => setStatus(`Metrics error: ${e.message}`)));
els.enrollPilotBtn.addEventListener('click', () => enrollPilot().catch((e) => setStatus(`Pilot enroll error: ${e.message}`)));
els.submitFeedbackBtn.addEventListener('click', () => submitFeedback().catch((e) => setStatus(`Feedback submit error: ${e.message}`)));
els.refreshPilotBtn.addEventListener('click', () => loadPilotParticipants().catch((e) => setStatus(`Pilot load error: ${e.message}`)));
els.pilotFilterStatus.addEventListener('change', () => loadPilotParticipants().catch((e) => setStatus(`Pilot filter error: ${e.message}`)));
els.refreshFeedbackBtn.addEventListener('click', () => loadFeedbackQueue().catch((e) => setStatus(`Feedback load error: ${e.message}`)));
els.feedbackFilterStatus.addEventListener('change', () => loadFeedbackQueue().catch((e) => setStatus(`Feedback filter error: ${e.message}`)));
els.createIterationBtn.addEventListener('click', () => createIteration().catch((e) => setStatus(`Iteration create error: ${e.message}`)));
els.refreshIterationsBtn.addEventListener('click', () => loadIterations().catch((e) => setStatus(`Iteration load error: ${e.message}`)));
els.pilotList.addEventListener('click', (e) => {
  handlePilotActions(e).catch((err) => setStatus(`Pilot action error: ${err.message}`));
});
els.feedbackList.addEventListener('click', (e) => {
  handleFeedbackActions(e).catch((err) => setStatus(`Feedback action error: ${err.message}`));
});
els.iterationsList.addEventListener('click', (e) => {
  handleIterationActions(e).catch((err) => setStatus(`Iteration action error: ${err.message}`));
});
els.reportsList.addEventListener('click', (e) => {
  handleReportsActions(e).catch((err) => setStatus(`Report action error: ${err.message}`));
});
els.refreshQrBtn.addEventListener('click', () => loadQrCode().catch((e) => setStatus(`QR error: ${e.message}`)));
els.copyLanBtn.addEventListener('click', () => copyLanLink().catch((e) => setStatus(`Copy error: ${e.message}`)));
els.shareLanBtn.addEventListener('click', () => shareLanLink().catch((e) => setStatus(`Share error: ${e.message}`)));
els.autoUploadToggle.addEventListener('change', () => {
  localStorage.setItem(KEY_AUTO_UPLOAD, els.autoUploadToggle.checked ? '1' : '0');
  setStatus(els.autoUploadToggle.checked ? 'Smart Sync enabled.' : 'Smart Sync disabled.');
});

els.qualityPreset.addEventListener('change', () => {
  localStorage.setItem(KEY_QUALITY_PRESET, els.qualityPreset.value);
  refreshCaptureCompatibilityHint();
  setStatus(`Quality preset: ${els.qualityPreset.value}`);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

window.addEventListener('online', () => {
  setNetworkHint();
  checkOnlineUploadPrompt().catch(() => {});
});

window.addEventListener('offline', () => {
  setNetworkHint();
});

window.addEventListener('error', (event) => {
  const message = event && event.message ? String(event.message).slice(0, 200) : 'window_error';
  reportClientEvent('client_crash', {
    source: 'window.error',
    message
  }).catch(() => {});
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event && event.reason ? String(event.reason).slice(0, 200) : 'unhandled_rejection';
  reportClientEvent('client_crash', {
    source: 'unhandledrejection',
    reason
  }).catch(() => {});
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  els.installBtn.hidden = false;
});

els.installBtn.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    setStatus('Install prompt nije dostupan. Koristi browser meni: Add to Home Screen.');
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  els.installBtn.hidden = true;
});

async function bootstrap() {
  refreshCaptureCompatibilityHint();
  setNetworkHint();
  await ensureAuthSession();
  startRealtimeStream();
  await Promise.allSettled([
    loadLimits(),
    loadVideos(),
    loadFeed(),
    loadLeaderboard(),
    loadLocalVideos(),
    loadLicenses(),
    loadPayouts(),
    listNodes(),
    loadQrCode(),
    loadMyProfile(),
    loadProofs(),
    loadReports(),
    loadMetrics(),
    loadPilotMyStatus(),
    loadPilotParticipants(),
    loadMyFeedback(),
    loadFeedbackQueue(),
    loadIterations(),
    initGoogleLogin()
  ]);
}

bootstrap().catch((error) => setStatus(`Bootstrap error: ${error.message}`));
