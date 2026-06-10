import type { UploadQueueFile, UploadStatus } from "./upload-types";

export const uploadTheme = {
  cream: "#F7F5F0",
  paper: "#F0EDE6",
  warm: "#E8E3D8",
  border: "rgba(0,0,0,0.07)",
  ink: "#16180F",
  inkSoft: "#3A3D2C",
  muted: "#8A8878",
  moss: "#2B4D0E",
  leaf: "#3D7A12",
  lime: "#6CC02A",
  dark: "#0E1409",
  blue: "#4AB8D4",
  amber: "#F5A623",
  red: "#E8523A",
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', 'Courier New', monospace",
};

export const statusMeta: Record<
  UploadStatus,
  { label: string; color: string; bg: string }
> = {
  selected: {
    label: "Selected",
    color: uploadTheme.muted,
    bg: "rgba(138,136,120,0.1)",
  },
  registering: {
    label: "Registering",
    color: uploadTheme.amber,
    bg: "rgba(245,166,35,0.1)",
  },
  ready: {
    label: "Ready",
    color: uploadTheme.leaf,
    bg: "rgba(61,122,18,0.1)",
  },
  uploading: {
    label: "Uploading",
    color: uploadTheme.blue,
    bg: "rgba(74,184,212,0.1)",
  },
  paused: {
    label: "Paused",
    color: uploadTheme.amber,
    bg: "rgba(245,166,35,0.1)",
  },
  uploaded: {
    label: "Uploaded",
    color: uploadTheme.lime,
    bg: "rgba(108,192,42,0.1)",
  },
  failed: {
    label: "Failed",
    color: uploadTheme.red,
    bg: "rgba(232,82,58,0.1)",
  },
};

export function createUploadId() {
  return Math.random().toString(36).slice(2, 10);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

export const demoUploadFiles: UploadQueueFile[] = [
  {
    id: createUploadId(),
    clientUploadId: createUploadId(),
    name: "foryd_bay_ortho_20240715_A.tif",
    size: 187400320,
    contentType: "image/tiff",
    gsd: "2.1cm",
    crs: "WGS84",
    bands: "RGB",
    dims: "12840 x 9620",
    lat: "53.1824N",
    lng: "3.5101W",
    status: "uploaded",
    progress: 100,
    uploadId: "upl_demo_foryd_a",
    jobId: "job_demo_foryd_a",
    s3Bucket: "ecovision-raw-media",
    s3Key: "raw/uploads/demo-user/job_demo_foryd_a/foryd_bay_ortho_20240715_A.tif",
    objectRef:
      "s3://ecovision-raw-media/raw/uploads/demo-user/job_demo_foryd_a/foryd_bay_ortho_20240715_A.tif",
    metadata: {
      surveyName: "Foryd Bay 2024",
      siteName: "Foryd Bay",
      captureDate: "2024-07-15",
      crs: "WGS84",
      gsd: "2.1cm",
    },
    canResume: false,
  },
  {
    id: createUploadId(),
    clientUploadId: createUploadId(),
    name: "foryd_bay_ortho_20240715_B.tif",
    size: 214600448,
    contentType: "image/tiff",
    gsd: "1.9cm",
    crs: "WGS84",
    bands: "RGB",
    dims: "14200 x 10400",
    lat: "53.1819N",
    lng: "3.5096W",
    status: "uploaded",
    progress: 100,
    uploadId: "upl_demo_foryd_b",
    jobId: "job_demo_foryd_b",
    s3Bucket: "ecovision-raw-media",
    s3Key: "raw/uploads/demo-user/job_demo_foryd_b/foryd_bay_ortho_20240715_B.tif",
    objectRef:
      "s3://ecovision-raw-media/raw/uploads/demo-user/job_demo_foryd_b/foryd_bay_ortho_20240715_B.tif",
    metadata: {
      surveyName: "Foryd Bay 2024",
      siteName: "Foryd Bay",
      captureDate: "2024-07-15",
      crs: "WGS84",
      gsd: "1.9cm",
    },
    canResume: false,
  },
  {
    id: createUploadId(),
    clientUploadId: createUploadId(),
    name: "clwyd_sector_04_ms.tif",
    size: 432000000,
    contentType: "image/tiff",
    gsd: "3.2cm",
    crs: "WGS84",
    bands: "MS-5",
    dims: "9600 x 7200",
    lat: "53.1836N",
    lng: "3.5118W",
    status: "selected",
    progress: 0,
    metadata: {
      surveyName: "Clwyd Sector Survey",
      siteName: "Clwyd Sector 04",
      crs: "WGS84",
      gsd: "3.2cm",
    },
    canResume: false,
  },
  {
    id: createUploadId(),
    clientUploadId: createUploadId(),
    name: "clwyd_sector_05_rgb.tif",
    size: 96400000,
    contentType: "image/tiff",
    gsd: "2.4cm",
    crs: "WGS84",
    bands: "RGB",
    dims: "8200 x 6100",
    lat: "53.1841N",
    lng: "3.5123W",
    status: "selected",
    progress: 0,
    metadata: {
      surveyName: "Clwyd Sector Survey",
      siteName: "Clwyd Sector 05",
      crs: "WGS84",
      gsd: "2.4cm",
    },
    canResume: false,
  },
];

export function filesToQueueItems(
  files: File[],
  projectId?: string,
): UploadQueueFile[] {
  return files.map((file) => ({
    id: createUploadId(),
    clientUploadId: createUploadId(),
    projectId,
    file,
    name: file.name,
    size: file.size,
    contentType: file.type || "application/octet-stream",
    gsd: "-",
    crs: "Detecting...",
    bands: file.name.toLowerCase().includes("_ms") ? "MS-5" : "RGB",
    dims: "-",
    lat: "-",
    lng: "-",
    status: "selected",
    progress: 0,
    metadata: {},
    canResume: false,
  }));
}
