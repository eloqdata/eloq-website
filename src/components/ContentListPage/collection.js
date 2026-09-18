export function getCollectionName(pathname) {
  if (/\/news(?:\/|$)/.test(pathname)) return 'EloqData News';
  if (/\/post(?:\/|$)/.test(pathname)) return 'EloqData Articles';
  return 'EloqData Blog';
}
