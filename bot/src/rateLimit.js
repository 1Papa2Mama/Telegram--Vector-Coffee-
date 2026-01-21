const reviewTimestamps = new Map();
const aiTimestamps = new Map();

const REVIEW_COOLDOWN_MS = 2 * 60 * 1000;
const AI_COOLDOWN_MS = 3 * 1000;

const canSendReview = (userId) => {
  const last = reviewTimestamps.get(userId) || 0;
  const now = Date.now();
  if (now - last < REVIEW_COOLDOWN_MS) {
    return false;
  }
  reviewTimestamps.set(userId, now);
  return true;
};

const canAskAi = (userId) => {
  const last = aiTimestamps.get(userId) || 0;
  const now = Date.now();
  if (now - last < AI_COOLDOWN_MS) {
    return false;
  }
  aiTimestamps.set(userId, now);
  return true;
};

module.exports = {
  canSendReview,
  canAskAi,
  REVIEW_COOLDOWN_MS,
  AI_COOLDOWN_MS,
};
