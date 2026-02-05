/**
 * Enforce consistent styling patterns:
 * - Use theme values instead of hardcoded colors/spacing
 * - Warn about inline style objects (prefer StyleSheet.create or theme)
 */

module.exports = {
  rules: {
    /**
     * Warn when using hardcoded color values instead of theme
     */
    "no-hardcoded-colors": {
      meta: {
        type: "problem",
        docs: {
          description: "Use theme colors instead of hardcoded color values",
        },
        messages: {
          hardcodedColor: 'Avoid hardcoded color "{{value}}". Use theme.colors.* instead.',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();

        // Skip theme definition files
        if (filename.includes("/constants/theme")) {
          return {};
        }

        // Skip test files
        if (filename.includes("__tests__") || filename.includes(".test.")) {
          return {};
        }

        return {
          Literal(node) {
            if (typeof node.value !== "string") {
              return;
            }

            const value = node.value;

            // Check for hex colors
            if (/^#[0-9A-Fa-f]{3,8}$/.test(value)) {
              // Allow common exceptions
              if (value === "#fff" || value === "#000" || value === "#eee") {
                return; // Very common, often in legacy/placeholder code
              }

              context.report({
                node,
                messageId: "hardcodedColor",
                data: { value },
              });
            }

            // Check for rgb/rgba colors
            if (/^rgba?\s*\(/.test(value)) {
              context.report({
                node,
                messageId: "hardcodedColor",
                data: { value },
              });
            }
          },
        };
      },
    },

    /**
     * Warn about inline style objects that could use StyleSheet
     */
    "prefer-stylesheet": {
      meta: {
        type: "problem",
        docs: {
          description: "Prefer StyleSheet.create over inline style objects",
        },
        messages: {
          inlineStyle:
            "Consider moving this style to StyleSheet.create for better performance. Inline styles are acceptable for dynamic theme values.",
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
          JSXAttribute(node) {
            if (node.name.name !== "style") {
              return;
            }

            const value = node.value;

            // style={styles.something} is fine
            if (
              value?.expression?.type === "MemberExpression" &&
              value.expression.object?.name === "styles"
            ) {
              return;
            }

            // style={[styles.x, ...]} is fine (array with styles reference)
            if (value?.expression?.type === "ArrayExpression") {
              const hasStylesRef = value.expression.elements.some(
                (el) => el?.type === "MemberExpression" && el.object?.name === "styles"
              );
              if (hasStylesRef) {
                return; // Mixing styles with dynamic values is acceptable
              }
            }

            // Pure object literals without theme usage should warn
            if (value?.expression?.type === "ObjectExpression") {
              const hasThemeRef = containsThemeReference(value.expression);
              if (!hasThemeRef) {
                context.report({
                  node,
                  messageId: "inlineStyle",
                });
              }
            }
          },
        };
      },
    },
  },
};

function containsThemeReference(node) {
  if (!node) {
    return false;
  }

  if (node.type === "MemberExpression") {
    // Check for theme.* access
    if (node.object?.name === "theme") {
      return true;
    }
    return containsThemeReference(node.object);
  }

  if (node.type === "ObjectExpression") {
    return node.properties.some((prop) => containsThemeReference(prop.value));
  }

  return false;
}
