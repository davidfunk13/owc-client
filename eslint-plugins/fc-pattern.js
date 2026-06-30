/**
 * Custom ESLint plugin to enforce FC component pattern:
 * - const Component: FC<Props> = () => {};
 * - export default Component; (at bottom, not inline)
 */

module.exports = {
  rules: {
    /**
     * Enforces that React components use FC or FC<Props> type annotation
     */
    "require-fc-typing": {
      meta: {
        type: "problem",
        docs: {
          description: "Require FC typing for React components",
        },
        messages: {
          missingFCType:
            'Component "{{name}}" should be typed with FC or FC<Props>. Use: const {{name}}: FC = () => {} or const {{name}}: FC<{{name}}Props> = () => {}',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();
        // Skip test files — mock components inside tests aren't subject to FC conventions
        if (filename.includes("__tests__") || filename.includes(".test.")) {
          return {};
        }
        return {
          VariableDeclarator(node) {
            // Check if it's an arrow function
            if (!node.init || node.init.type !== "ArrowFunctionExpression") {
              return;
            }

            // Check if it looks like a component (PascalCase name)
            const name = node.id?.name;
            if (!name || !/^[A-Z]/.test(name)) {
              return;
            }

            // Check if it returns JSX (component indicator)
            const body = node.init.body;
            const returnsJSX =
              body?.type === "JSXElement" ||
              body?.type === "JSXFragment" ||
              (body?.type === "BlockStatement" &&
                body.body?.some(
                  (stmt) =>
                    stmt.type === "ReturnStatement" &&
                    (stmt.argument?.type === "JSXElement" ||
                      stmt.argument?.type === "JSXFragment" ||
                      stmt.argument?.type === "ConditionalExpression" ||
                      stmt.argument?.type === "LogicalExpression")
                ));

            if (!returnsJSX) {
              return;
            }

            // Check if it has FC type annotation
            const typeAnnotation = node.id?.typeAnnotation?.typeAnnotation;
            if (!typeAnnotation) {
              context.report({
                node: node.id,
                messageId: "missingFCType",
                data: { name },
              });
              return;
            }

            // Check if the type is FC or React.FC
            const typeName = typeAnnotation.typeName?.name || typeAnnotation.typeName?.right?.name;

            if (typeName !== "FC" && typeName !== "FunctionComponent") {
              context.report({
                node: node.id,
                messageId: "missingFCType",
                data: { name },
              });
            }
          },
        };
      },
    },

    /**
     * Enforces that default exports are at the bottom of the file, not inline
     */
    "no-inline-default-export": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow inline default exports for components",
        },
        messages: {
          inlineExport:
            'Use "export default {{name}};" at the bottom of the file instead of "export default function/const"',
        },
        schema: [],
      },
      create(context) {
        return {
          ExportDefaultDeclaration(node) {
            // Allow export default from other modules: export { x as default } from 'y'
            if (node.declaration?.type === "Identifier") {
              return; // This is fine: export default ComponentName;
            }

            // Check for inline function declaration
            if (node.declaration?.type === "FunctionDeclaration") {
              const name = node.declaration.id?.name || "Component";
              context.report({
                node,
                messageId: "inlineExport",
                data: { name },
              });
            }

            // Check for inline arrow function
            if (node.declaration?.type === "ArrowFunctionExpression") {
              context.report({
                node,
                messageId: "inlineExport",
                data: { name: "Component" },
              });
            }
          },
        };
      },
    },
  },
};
