module.exports = {
  extends: ["eslint:recommended", "prettier", "next/core-web-vitals"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
