export const humanFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  const k = 1024;
  const sizes = ['Bytes','KB','MB','GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
