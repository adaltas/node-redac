import scopes from "@commitlint/config-lerna-scopes";

export default {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    "scope-enum": async (ctx) => [
      2,
      "always",
      [
        ...(await scopes.utils.getPackages(ctx)),
        "engine",
        "mdx",
        "memory",
        "project",
        "release",
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
