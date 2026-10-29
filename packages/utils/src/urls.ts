export function toAbsoluteUrl(origin: string, pathOrUrl: string): string {
  if (pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("http://")) {
    return pathOrUrl
  }

  return new URL(pathOrUrl, origin).href
}
