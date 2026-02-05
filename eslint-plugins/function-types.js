/**
 * Enforce proper function type definitions:
 * - Non-component functions should have explicit return types
 * - Prefer separate type definitions over inline parameter types for complex functions
 */

module.exports = {
  rules: {
    "require-function-return-type": {
      meta: {
        type: "problem",
        docs: {
          description: "Non-trivial functions should have explicit return types",
        },
        messages: {
          missingReturnType: 'Function "{{name}}" should have an explicit return type annotation',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();

        // Skip test files
        if (filename.includes("__tests__") || filename.includes(".test.")) {
          return {};
        }

        return {
          // Arrow functions assigned to variables
          VariableDeclarator(node) {
            if (!node.init || node.init.type !== "ArrowFunctionExpression") {
              return;
            }

            const name = node.id?.name;
            if (!name) {
              return;
            }

            // Skip React components (PascalCase)
            if (/^[A-Z]/.test(name)) {
              return;
            }

            // Skip simple callbacks and handlers (lowercase, short)
            if (name.startsWith("handle") || name.startsWith("on")) {
              return;
            }

            // Check if it has a return type annotation
            const arrowFn = node.init;
            if (!arrowFn.returnType && !node.id.typeAnnotation) {
              // Only warn for exported functions or functions with async
              const parent = node.parent?.parent;
              const isExported =
                parent?.type === "ExportNamedDeclaration" ||
                parent?.type === "ExportDefaultDeclaration";
              const isAsync = arrowFn.async;

              if (isExported || isAsync) {
                context.report({
                  node: node.id,
                  messageId: "missingReturnType",
                  data: { name },
                });
              }
            }
          },

          // Regular function declarations
          FunctionDeclaration(node) {
            const name = node.id?.name;
            if (!name) {
              return;
            }

            // Skip React components
            if (/^[A-Z]/.test(name)) {
              return;
            }

            // Check for return type
            if (!node.returnType) {
              const parent = node.parent;
              const isExported =
                parent?.type === "ExportNamedDeclaration" ||
                parent?.type === "ExportDefaultDeclaration";

              if (isExported || node.async) {
                context.report({
                  node: node.id,
                  messageId: "missingReturnType",
                  data: { name },
                });
              }
            }
          },
        };
      },
    },
  },
};
