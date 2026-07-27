import { parseEvoltPageItems } from "./evoltParser.js";

export async function parseEvoltPdf(file) {
  if (!file) throw new Error("Choose an Evolt PDF.");
  if (file.type && file.type !== "application/pdf" && !file.name?.toLowerCase().endsWith(".pdf")) {
    throw new Error("Evolt imports currently require a PDF.");
  }
  const [{ GlobalWorkerOptions, getDocument }, { default: pdfWorker }] = await Promise.all([
    // PDF.js's default build targets only the newest Firefox/Chrome APIs.
    // The legacy build includes the polyfills required by mobile Safari.
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]);
  GlobalWorkerOptions.workerSrc = pdfWorker;
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await getDocument({ data }).promise;
  if (document.numPages < 1) throw new Error("The PDF does not contain a readable page.");
  const page = await document.getPage(1);
  const content = await page.getTextContent();
  const items = content.items.filter((item) => "str" in item).map((item) => ({
    text: item.str,
    x: item.transform[4],
    y: item.transform[5],
  }));
  const scan = parseEvoltPageItems(items, file.name);
  return { scan, pageCount: document.numPages };
}
