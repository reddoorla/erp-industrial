module.exports = {
  dryRun: "full",
  requireConfig: "ignored",
  onboarding: false,
  extends: ["github>reddoorla/.github:renovate-config"],
  lockFileMaintenance: {
    prCreation: "immediate",
  },
};
