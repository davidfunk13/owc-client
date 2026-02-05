/**
 * Custom ESLint plugin to enforce React performance patterns:
 * - Presentational components in /components should use React.memo
 */

module.exports = {
  rules: {
    /**
     * Enforces that components in the components directory use React.memo
     */
    "require-memo-for-components": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Require React.memo for components in /components directory",
        },
        messages: {
          missingMemo:
            'Component "{{name}}" in /components should be wrapped with React.memo() for performance. Define as: const {{name}}Component: FC<Props> = () => {...}; export const {{name}} = memo({{name}}Component);',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename?.() || context.filename || "";

        // Only check files in /components directory
        if (!filename.includes("/components/")) {
          return {};
        }

        // Skip test files and index files
        if (
          filename.includes("__tests__") ||
          filename.includes(".test.") ||
          filename.endsWith("index.ts") ||
          filename.endsWith("index.tsx")
        ) {
          return {};
        }

        let hasMemoImport = false;
        let memoWrappedComponents = new Set();
        let exportedComponents = new Set();

        return {
          // Track memo imports
          ImportDeclaration(node) {
            if (node.source?.value === "react") {
              node.specifiers?.forEach((spec) => {
                if (spec.imported?.name === "memo") {
                  hasMemoImport = true;
                }
              });
            }
          },

          // Track memo() calls and what variable they're assigned to
          VariableDeclarator(node) {
            if (
              node.init?.type === "CallExpression" &&
              (node.init.callee?.name === "memo" ||
                (node.init.callee?.type === "MemberExpression" &&
                  node.init.callee?.property?.name === "memo"))
            ) {
              const name = node.id?.name;
              if (name) {
                memoWrappedComponents.add(name);
              }
            }
          },

          // Track class components (don't need memo)
          ClassDeclaration(node) {
            const name = node.id?.name;
            if (name && /^[A-Z]/.test(name)) {
              memoWrappedComponents.add(name);
            }
          },

          // Track named exports
          ExportNamedDeclaration(node) {
            // export const Component = ...
            if (node.declaration?.type === "VariableDeclaration") {
              node.declaration.declarations?.forEach((decl) => {
                const name = decl.id?.name;
                if (name && /^[A-Z]/.test(name)) {
                  // Check if it's a memo() call
                  if (
                    decl.init?.type === "CallExpression" &&
                    (decl.init.callee?.name === "memo" ||
                      decl.init.callee?.property?.name === "memo")
                  ) {
                    memoWrappedComponents.add(name);
                  }
                  exportedComponents.add(name);
                }
              });
            }
          },

          // Track default exports
          ExportDefaultDeclaration(node) {
            if (node.declaration?.type === "Identifier") {
              const name = node.declaration.name;
              if (name && /^[A-Z]/.test(name)) {
                exportedComponents.add(name);
              }
            }
          },

          // Check at the end of the file
          "Program:exit"() {
            exportedComponents.forEach((name) => {
              // Skip if already wrapped with memo
              if (memoWrappedComponents.has(name)) {
                return;
              }

              // Skip components that end with "Component" (internal naming)
              if (name.endsWith("Component")) {
                return;
              }

              // Report if not wrapped
              context.report({
                loc: { line: 1, column: 0 },
                messageId: "missingMemo",
                data: { name },
              });
            });
          },
        };
      },
    },
  },
};
