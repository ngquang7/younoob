export function cleanYouTubeDescription(
  value: string | null | undefined
): string {
  if (!value) return "";

  return value
    .normalize("NFC")
    .replace(/^\uFEFF/, "")       // Remove a leading BOM
    .replace(/\u2060/g, "")       // Remove invisible word joiners
    .replace(/\r\n?/g, "\n")      // Normalize Windows/Mac line endings
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")   // At most one empty line
    .trim();
}