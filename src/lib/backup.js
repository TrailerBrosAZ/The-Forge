export const BACKUP_VERSION = 3;

function parseStored(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

export function validateBackupObject(backup, prefix = "theforge:") {
  if (backup?.app !== "the-forge" || ![1, 2, 3].includes(backup?.version) || !backup.data || typeof backup.data !== "object") {
    throw new Error("This is not a valid The Forge backup.");
  }
  const entries = Object.entries(backup.data);
  if (entries.some(([key, value]) => !key.startsWith(prefix) || typeof value !== "string")) {
    throw new Error("The backup contains invalid data.");
  }
  if (backup.scanDocuments != null && !Array.isArray(backup.scanDocuments)) {
    throw new Error("The backup contains invalid scan documents.");
  }
  return backup;
}

export function summarizeStoredData(data, scanDocuments = [], prefix = "theforge:") {
  const profiles = parseStored(data[`${prefix}profiles`], []);
  let workoutSessions = 0, foodEntries = 0, weights = 0, measurements = 0, bodyScans = 0;
  Object.entries(data).forEach(([key, value]) => {
    const parsed = parseStored(value, null);
    if (key.endsWith(":workoutLogs") && parsed) {
      Object.values(parsed).forEach((log) => { workoutSessions += log?.sessions?.length || 0; });
    }
    if (key.endsWith(":dayLog") && parsed) {
      Object.values(parsed).forEach((day) => Object.values(day || {}).forEach((entries) => { foodEntries += entries?.length || 0; }));
    }
    if (key.endsWith(":weights") && Array.isArray(parsed)) weights += parsed.length;
    if (key.endsWith(":measurements") && Array.isArray(parsed)) measurements += parsed.length;
    if (key.endsWith(":bodyScans") && Array.isArray(parsed)) bodyScans += parsed.length;
  });
  return {
    profiles: profiles.length,
    profileNames: profiles.map((profile) => profile.name).filter(Boolean),
    workoutSessions,
    foodEntries,
    weights,
    measurements,
    bodyScans,
    scanDocuments: scanDocuments.length,
  };
}

export function createBackupObject({ appRelease, data, scanDocuments, exportedAt = new Date().toISOString() }) {
  return {
    app: "the-forge",
    version: BACKUP_VERSION,
    appRelease,
    exportedAt,
    manifest: summarizeStoredData(data, scanDocuments),
    data,
    scanDocuments,
  };
}

export function inspectBackupText(text) {
  const backup = validateBackupObject(JSON.parse(text));
  return {
    backup,
    summary: backup.manifest || summarizeStoredData(backup.data, backup.scanDocuments || []),
  };
}
