const userState = new Map();

const STATES = {
  NONE: "none",
  REVIEW: "review",
  AI: "ai",
};

const getState = (userId) => userState.get(userId) || STATES.NONE;
const setState = (userId, state) => userState.set(userId, state);
const clearState = (userId) => userState.delete(userId);

module.exports = {
  STATES,
  getState,
  setState,
  clearState,
};
