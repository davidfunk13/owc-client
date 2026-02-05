/**
 * Custom ESLint plugin to enforce error handling patterns:
 * - Async functions should have try-catch
 * - Promise chains should have .catch()
 */

module.exports = {
  rules: {
    /**
     * Enforces that promise chains have .catch() handlers
     */
    "require-promise-catch": {
      meta: {
        type: "problem",
        docs: {
          description: "Require .catch() on promise chains",
        },
        messages: {
          missingCatch: "Promise chain should have a .catch() handler to handle potential errors",
        },
        schema: [],
      },
      create(context) {
        return {
          CallExpression(node) {
            // Check if this is a .then() call
            if (
              node.callee?.type !== "MemberExpression" ||
              node.callee?.property?.name !== "then"
            ) {
              return;
            }

            // Get the parent to check what happens after .then()
            const parent = node.parent;

            // If parent is another member expression with .catch(), we're good
            if (parent?.type === "MemberExpression" && parent?.parent?.type === "CallExpression") {
              const nextCall = parent.parent;
              if (
                nextCall.callee?.property?.name === "catch" ||
                nextCall.callee?.property?.name === "finally"
              ) {
                return;
              }
            }

            // If this .then() is chained after another .then(), check the chain
            if (
              node.callee?.object?.type === "CallExpression" &&
              node.callee?.object?.callee?.property?.name === "then"
            ) {
              return; // Let the outer .then() handle the check
            }

            // Check if this is the end of the chain (not followed by .catch)
            if (
              parent?.type === "ExpressionStatement" ||
              (parent?.type === "MemberExpression" &&
                parent?.property?.name !== "catch" &&
                parent?.property?.name !== "finally")
            ) {
              // Skip if the .then() is inside a .catch() callback
              let currentNode = node;
              while (currentNode.parent) {
                if (
                  currentNode.parent.type === "CallExpression" &&
                  currentNode.parent.callee?.property?.name === "catch"
                ) {
                  return;
                }
                currentNode = currentNode.parent;
              }

              context.report({
                node,
                messageId: "missingCatch",
              });
            }
          },
        };
      },
    },

    /**
     * Enforces that async functions in useEffect have error handling
     */
    "require-async-error-handling": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Require error handling in async functions within useEffect",
        },
        messages: {
          missingTryCatch: "Async function in useEffect should have try-catch error handling",
        },
        schema: [],
      },
      create(context) {
        return {
          CallExpression(node) {
            // Check if this is a useEffect call
            if (node.callee?.name !== "useEffect") {
              return;
            }

            // Get the callback (first argument)
            const callback = node.arguments?.[0];
            if (!callback || callback.type !== "ArrowFunctionExpression") {
              return;
            }

            // Check the callback body for async function calls
            const body = callback.body;
            if (body?.type !== "BlockStatement") {
              return;
            }

            // Look for async function declarations inside useEffect
            body.body?.forEach((statement) => {
              // Check for const fn = async () => {} pattern
              if (
                statement.type === "VariableDeclaration" &&
                statement.declarations?.[0]?.init?.async === true
              ) {
                const asyncFn = statement.declarations[0].init;

                // Check if the function body has try-catch
                if (asyncFn.body?.type === "BlockStatement") {
                  const hasTryCatch = asyncFn.body.body?.some((s) => s.type === "TryStatement");

                  if (!hasTryCatch) {
                    context.report({
                      node: statement,
                      messageId: "missingTryCatch",
                    });
                  }
                }
              }
            });
          },
        };
      },
    },
  },
};
