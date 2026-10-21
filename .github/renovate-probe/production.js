// The fleet preset exactly as the twice-daily cron runs it, written nowhere: why has #60 not merged?
module.exports = {
  requireConfig: "ignored",
  onboarding: false,
  dryRun: "full",
  extends: ["github>reddoorla/.github:renovate-config"],
};
