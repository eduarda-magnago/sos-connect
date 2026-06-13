export function getMediaUrl(path?: string | null) {
  return path && /^https?:\/\//i.test(path) ? path : null;
}
