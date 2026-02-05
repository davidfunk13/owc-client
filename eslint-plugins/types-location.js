/**
 * Enforce types are defined in the /types folder, not scattered in component files.
 * Exceptions: inline props interfaces for components (e.g., interface ButtonProps)
 */

module.exports = {
  rules: {
    "types-in-types-folder": {
      meta: {
        type: "problem",
        docs: {
          description: "Types and interfaces should be defined in the /types folder",
        },
        messages: {
          typeInWrongLocation:
            'Type "{{name}}" should be defined in the /types folder and imported. Move it to types/{{suggested}}.ts',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();

        // Skip files in the types folder
        if (filename.includes("/types/")) {
          return {};
        }

        // Skip test files
        if (filename.includes("__tests__") || filename.includes(".test.")) {
          return {};
        }

        return {
          TSTypeAliasDeclaration(node) {
            const name = node.id.name;

            // Allow common local type patterns
            if (name === "Props" || name.endsWith("Props")) {
              return; // Props interfaces are allowed inline
            }

            context.report({
              node,
              messageId: "typeInWrongLocation",
              data: {
                name,
                suggested: inferTypeFile(filename),
              },
            });
          },

          TSInterfaceDeclaration(node) {
            const name = node.id.name;

            // Allow Props interfaces inline (component-specific)
            if (name === "Props" || name.endsWith("Props")) {
              return;
            }

            context.report({
              node,
              messageId: "typeInWrongLocation",
              data: {
                name,
                suggested: inferTypeFile(filename),
              },
            });
          },
        };
      },
    },
  },
};

function inferTypeFile(filename) {
  if (filename.includes("/components/")) {
    return "components";
  }
  if (filename.includes("/contexts/")) {
    return "contexts";
  }
  if (filename.includes("/hooks/")) {
    return "hooks";
  }
  if (filename.includes("/lib/")) {
    return "api";
  }
  return "index";
}
