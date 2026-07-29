const DB_NAME = "the-forge-scans";
const DB_VERSION = 1;
const STORE = "documents";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open scan storage."));
  });
}

function transactionResult(mode, operation) {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const request = operation(store);
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error || new Error("Scan storage operation failed."));
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error("Scan storage transaction failed.")); };
  }));
}

export function scanDocumentKey(profileId, scanId) {
  return `${profileId}:${scanId}`;
}

export async function putScanDocument(profileId, scanId, file) {
  const record = {
    key: scanDocumentKey(profileId, scanId),
    profileId,
    scanId,
    name: file.name,
    type: file.type || "application/pdf",
    size: file.size,
    updatedAt: new Date().toISOString(),
    blob: file,
  };
  await transactionResult("readwrite", (store) => store.put(record));
  return record.key;
}

export function getScanDocument(profileId, scanId) {
  return transactionResult("readonly", (store) => store.get(scanDocumentKey(profileId, scanId)));
}

export function deleteScanDocument(profileId, scanId) {
  return transactionResult("readwrite", (store) => store.delete(scanDocumentKey(profileId, scanId)));
}

export async function listScanDocuments() {
  return transactionResult("readonly", (store) => store.getAll());
}

export async function restoreScanDocuments(records) {
  if (!Array.isArray(records) || records.length === 0) return;
  const db = await openDatabase();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    records.forEach((record) => store.put(record));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error || new Error("Could not restore scan documents."));
  });
  db.close();
}

export async function replaceScanDocuments(records = []) {
  if (!Array.isArray(records)) throw new Error("Scan document replacement requires an array.");
  const db = await openDatabase();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      store.clear();
      records.forEach((record) => store.put(record));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Could not replace scan documents."));
      tx.onabort = () => reject(tx.error || new Error("Scan document replacement was cancelled."));
    });
  } finally {
    db.close();
  }
}
