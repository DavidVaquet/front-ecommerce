export const isBarcodeLike = (value) => {
  const v = (value || '').trim();
  if (!v) return false;
  
  const BARCODE_REGEX = /^[A-Za-z0-9\-_.]+$/; 
  return BARCODE_REGEX.test(v) && v.length >= 6 && v.length <= 32;
};