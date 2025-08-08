const fs = require('fs');
const path = require('path');

// Configuration
const GENERATED_FILE = 'src/services/api/generated/summitServerAPI.ts';
const OUTPUT_DIR = 'src/services/api/generated';
const API_BASE_PATH = '/api/';

// Helper function to extract API group from URL
function getApiGroup(url) {
  if (!url.includes(API_BASE_PATH)) return 'misc';

  const pathAfterApi = url.split(API_BASE_PATH)[1];
  const firstSegment = pathAfterApi.split('/')[0];

  return firstSegment || 'misc';
}

// Helper function to get function name from export statement
function getFunctionName(line) {
  const match = line.match(/export const (\w+)/);
  return match ? match[1] : null;
}

// Helper function to extract URL from function body
function extractUrl(functionBody) {
  const urlMatch = functionBody.match(/url:\s*[`'"]([^`'"]+)[`'"]/);
  return urlMatch ? urlMatch[1] : null;
}

// Helper function to determine if this is a React Query hook
function isReactQueryHook(functionName) {
  return (
    functionName.startsWith('use') ||
    functionName.includes('MutationOptions') ||
    functionName.includes('QueryOptions') ||
    functionName.includes('QueryKey')
  );
}

// Helper function to extract the base function name from React Query hooks
function getBaseFunctionName(hookName) {
  // Remove prefixes and suffixes to get the base function name
  if (hookName.startsWith('use')) {
    return hookName.replace(/^use/, '').toLowerCase();
  }
  if (hookName.includes('MutationOptions')) {
    return hookName.replace(/^get(.+)MutationOptions$/, '$1').toLowerCase();
  }
  if (hookName.includes('QueryOptions')) {
    return hookName.replace(/^get(.+)QueryOptions$/, '$1').toLowerCase();
  }
  if (hookName.includes('QueryKey')) {
    return hookName.replace(/^get(.+)QueryKey$/, '$1').toLowerCase();
  }
  return hookName.toLowerCase();
}

// Note: No need to fix function code anymore since Orval generates correct syntax

// Main organization function
function organizeApiHooks() {
  try {
    console.log('🔄 Organizing generated API hooks...');

    // Read the generated file
    const generatedContent = fs.readFileSync(GENERATED_FILE, 'utf8');

    // Split content into sections
    const lines = generatedContent.split('\n');

    // Extract imports and types section (but exclude the mutator import)
    let importSection = '';
    let typeSection = '';
    let currentSection = 'imports';
    let sectionEndIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('export const') && line.includes('=')) {
        sectionEndIndex = i;
        break;
      }

      // Skip all mutator import lines
      if (
        line.includes('import mutator from') ||
        line.includes('import { default } from') ||
        line.includes('../config/mutator') ||
        line.includes('../../config/mutator')
      ) {
        continue;
      }

      if (currentSection === 'imports') {
        importSection += line + '\n';
        if (line.includes("} from './model';")) {
          currentSection = 'types';
        }
      } else if (currentSection === 'types') {
        typeSection += line + '\n';
      }
    }

    // First pass: collect all API functions and their groups
    const apiGroups = {};
    const baseFunctionGroups = {}; // Maps base function names to their groups

    // Parse functions and group them
    let currentFunction = '';
    let currentFunctionLines = [];
    let currentUrl = '';
    let functionGroup = 'misc';

    for (let i = sectionEndIndex; i < lines.length; i++) {
      const line = lines[i];

      // Check if this is the start of a new function
      if (line.startsWith('export const') && line.includes('=')) {
        // Save previous function if exists
        if (currentFunction) {
          const isHook = isReactQueryHook(currentFunction);

          // For hooks, try to find the related API function's group
          if (isHook) {
            const baseName = getBaseFunctionName(currentFunction);
            // Try to find the group from a matching API function
            functionGroup = baseFunctionGroups[baseName] || 'misc';
          }

          if (!apiGroups[functionGroup]) {
            apiGroups[functionGroup] = {
              functions: [],
              imports: new Set(),
            };
          }

          apiGroups[functionGroup].functions.push({
            name: currentFunction,
            code: currentFunctionLines.join('\n'),
            isHook: isHook,
          });

          // If this is an API function, record its group for related hooks
          if (!isHook && currentUrl) {
            baseFunctionGroups[currentFunction.toLowerCase()] = functionGroup;
          }
        }

        // Start new function
        currentFunction = getFunctionName(line);
        currentFunctionLines = [line];
        currentUrl = '';
        functionGroup = 'misc'; // Reset group
      } else if (currentFunction) {
        currentFunctionLines.push(line);

        // Extract URL from function body to determine group
        if (!currentUrl) {
          const url = extractUrl(line);
          if (url) {
            currentUrl = url;
            functionGroup = getApiGroup(url);
          }
        }

        // Check if function ended (next export or end of file)
        if (
          (i + 1 < lines.length && lines[i + 1].startsWith('export const')) ||
          i === lines.length - 1
        ) {
          if (currentFunction) {
            const isHook = isReactQueryHook(currentFunction);

            // For hooks, try to find the related API function's group
            if (isHook) {
              const baseName = getBaseFunctionName(currentFunction);
              functionGroup = baseFunctionGroups[baseName] || functionGroup;
            }

            if (!apiGroups[functionGroup]) {
              apiGroups[functionGroup] = {
                functions: [],
                imports: new Set(),
              };
            }

            apiGroups[functionGroup].functions.push({
              name: currentFunction,
              code: currentFunctionLines.join('\n'),
              isHook: isHook,
            });

            // If this is an API function, record its group for related hooks
            if (!isHook && currentUrl) {
              baseFunctionGroups[currentFunction.toLowerCase()] = functionGroup;
            }
          }
          currentFunction = '';
          currentFunctionLines = [];
          currentUrl = '';
        }
      }
    }

    // Create organized files
    const allExports = [];

    Object.keys(apiGroups).forEach((group) => {
      const groupData = apiGroups[group];
      const groupDir = path.join(OUTPUT_DIR, group);

      // Create group directory
      if (!fs.existsSync(groupDir)) {
        fs.mkdirSync(groupDir, { recursive: true });
      }

      // Generate file content with corrected imports
      let fileContent =
        importSection.replace(/} from '\.\/model';/g, "} from '../model';") + '\n';
      if (typeSection.trim()) {
        fileContent += typeSection + '\n';
      }
      fileContent += "import mutator from '../../config/mutator';\n\n";

      // Sort functions: API functions first, then hooks
      const sortedFunctions = [
        ...groupData.functions.filter((f) => !f.isHook),
        ...groupData.functions.filter((f) => f.isHook),
      ];

      // Add functions
      sortedFunctions.forEach((func) => {
        fileContent += func.code + '\n\n';
        allExports.push(`export { ${func.name} } from './${group}';`);
      });

      // Write group file
      const groupFile = path.join(groupDir, 'index.ts');
      fs.writeFileSync(groupFile, fileContent);

      const hookCount = groupData.functions.filter((f) => f.isHook).length;
      const functionCount = groupData.functions.filter((f) => !f.isHook).length;

      console.log(
        `✅ Created ${group}/index.ts with ${groupData.functions.length} functions (${functionCount} API calls, ${hookCount} React Query hooks)`,
      );
    });

    // Create main index file
    const mainIndexContent = `// Auto-generated API exports organized by endpoint groups
// Generated by organize-api.js script

// Export model types
export * from './model';

// Export organized API functions
${allExports.join('\n')}
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), mainIndexContent);

    // Create a detailed summary file
    const summaryContent = `# API Organization Summary

Generated on: ${new Date().toISOString()}

## API Groups:
${Object.keys(apiGroups)
  .map((group) => {
    const groupData = apiGroups[group];
    const hookCount = groupData.functions.filter((f) => f.isHook).length;
    const functionCount = groupData.functions.filter((f) => !f.isHook).length;
    return `- **${group}**: ${groupData.functions.length} functions (${functionCount} API calls, ${hookCount} React Query hooks)`;
  })
  .join('\n')}

## Functions by Group:

${Object.entries(apiGroups)
  .map(([group, data]) => {
    const hooks = data.functions.filter((f) => f.isHook);
    const functions = data.functions.filter((f) => !f.isHook);

    return `### ${group}

**API Functions:**
${functions.map((f) => `- ${f.name}`).join('\n')}

**React Query Hooks:**
${hooks.map((f) => `- ${f.name}`).join('\n')}`;
  })
  .join('\n\n')}

## Usage Examples:

\`\`\`typescript
// Import from organized folders
import { 
  authLoginCreate, 
  useAuthLoginCreate 
} from '@/services/api/generated/auth';

import { 
  projectCreate, 
  useProjectCreate 
} from '@/services/api/generated/project';

// Or import from main index
import { 
  authLoginCreate,
  useAuthLoginCreate,
  projectCreate,
  useProjectCreate
} from '@/services/api/generated';
\`\`\`
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'API_ORGANIZATION.md'), summaryContent);

    console.log('🎉 API hooks organized successfully!');
    console.log(`📁 Created ${Object.keys(apiGroups).length} API groups`);
    console.log(`📄 Check ${OUTPUT_DIR}/API_ORGANIZATION.md for details`);
  } catch (error) {
    console.error('❌ Error organizing API hooks:', error.message);
    process.exit(1);
  }
}

// Run the organization
organizeApiHooks();
