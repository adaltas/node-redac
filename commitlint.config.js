const {
  utils: { getPackages },
} = require("@commitlint/config-lerna-scopes");

module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    "scope-enum": async (ctx) => [
      2,
      "always",
      [
        ...(await getPackages(ctx)),
        "engine",
        "mdx",
        "memory",
        "project",
        "yaml",
      ],
    ],
    "scope-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "refactor",
        "revert",
        "test",
      ],
    ],
  },
};
