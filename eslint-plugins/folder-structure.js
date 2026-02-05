/**
 * Enforce folder structure conventions:
 * - Components must be in their own folder (components/Button/Button.tsx)
 * - No barrel exports (index.ts) in component folders
 */

module.exports = {
  rules: {
    "component-folder-structure": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Components should be in their own folder: components/ComponentName/ComponentName.tsx",
        },
        messages: {
          wrongStructure: 'Component "{{name}}" should be at components/{{name}}/{{name}}.tsx',
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();

        // Skip test directories
        if (filename.includes("__tests__") || filename.includes(".test.")) {
          return {};
        }

        // Only check files directly in the /components/ directory (not nested __tests__)
        // Must match pattern like /components/Something not /__tests__/components
        if (!filename.match(/\/components\/[^_]/)) {
          return {};
        }

        // Skip index files - they are handled by no-barrel-exports rule
        if (filename.endsWith("index.ts") || filename.endsWith("index.tsx")) {
          return {};
        }

        return {
          Program(node) {
            // Extract component name from path
            const match = filename.match(/\/components\/([^/]+)\/([^/]+)\.(tsx?)$/);

            if (!match) {
              // File is directly in components/ without a subfolder
              const directMatch = filename.match(/\/components\/([^/]+)\.(tsx?)$/);
              if (directMatch) {
                const componentName = directMatch[1];
                context.report({
                  node,
                  messageId: "wrongStructure",
                  data: { name: componentName },
                });
              }
              return;
            }

            const [, folderName, fileName] = match;
            const fileBaseName = fileName.replace(/\.(tsx?)$/, "");

            // Folder name should match file name
            if (folderName !== fileBaseName) {
              context.report({
                node,
                messageId: "wrongStructure",
                data: { name: fileBaseName },
              });
            }
          },
        };
      },
    },
    "no-barrel-exports": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow barrel exports (index.ts) in component folders",
        },
        messages: {
          noBarrelExport:
            "Barrel exports (index.ts) are not allowed in component folders. Import directly from the component file.",
        },
        schema: [],
      },
      create(context) {
        const filename = context.getFilename();

        // Only check index files in components directory
        if (!filename.match(/\/components\/[^/]+\/index\.(ts|tsx)$/)) {
          return {};
        }

        return {
          Program(node) {
            context.report({
              node,
              messageId: "noBarrelExport",
            });
          },
        };
      },
    },
  },
};
