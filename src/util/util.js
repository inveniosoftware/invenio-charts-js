// Helper function to calculate position of tooltip
function isOut(valX, valY, w, h) {
  const out = {};
  out.top = (valY / h) < 0.1;
  out.left = (valX / w) < 0.1;
  out.right = (valX / w) > 0.9;
  return out;
}

export {
  isOut
};
