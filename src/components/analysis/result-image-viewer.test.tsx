import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ResultImageViewer, selectResultImage } from "./result-image-viewer";

const views = [
  { id: "original", label: "Original", url: "https://example.test/original.png" },
  { id: "overlay", label: "Overlay", url: "https://example.test/overlay.png" },
  { id: "segmentation", label: "Segmentation", url: "https://example.test/mask.png" },
];
it("defaults immediately to the classified overlay with honest loading and aspect-ratio preservation", () => {
  const html = renderToStaticMarkup(<ResultImageViewer views={views} previewError={false} />);
  expect(html).toContain('src="https://example.test/overlay.png"');
  expect(html).toContain("Classified Overlay");
  expect(html).toContain("Loading classified overlay…");
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain("object-contain");
  expect(html).toContain("h-auto");
  expect(html).not.toContain("%");
});
it("only offers views with backend URLs", () => {
  const html = renderToStaticMarkup(<ResultImageViewer views={[views[0], { ...views[1], url: null }]} previewError={false} />);
  expect(html).toContain(">Original</button>");
  expect(html).not.toContain(">Overlay</button>");
  expect(html).not.toContain(">Segmentation</button>");
  expect(html).toContain('src="https://example.test/original.png"');
});
it("falls back through existing artifacts without retry loops", () => {
  const failed = new Set<string>();
  expect(selectResultImage(views, "overlay", failed)?.id).toBe("overlay");
  failed.add(views[1].url);
  expect(selectResultImage(views, "overlay", failed)?.id).toBe("original");
  failed.add(views[0].url);
  expect(selectResultImage(views, "overlay", failed)?.id).toBe("segmentation");
  failed.add(views[2].url);
  expect(selectResultImage(views, "overlay", failed)).toBeUndefined();
  failed.delete(views[1].url);
  expect(selectResultImage(views, "overlay", failed)?.id).toBe("overlay");
});
it("honours selection and allows a renewed artifact URL after an earlier failure", () => {
  expect(selectResultImage(views, "segmentation", new Set())?.id).toBe("segmentation");
  expect(selectResultImage([{ ...views[1], url: "https://example.test/renewed.png" }], "overlay", new Set([views[1].url]))?.id).toBe("overlay");
});
it("shows an empty state without fabricating an image", () => {
  const html = renderToStaticMarkup(<ResultImageViewer views={[]} previewError={false} />);
  expect(html).toContain("No image artifact was returned.");
  expect(html).not.toContain("<img");
});
