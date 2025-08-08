// Transform OpenAPI schema from snake_case to camelCase
function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function transformSchemaProperties(schema) {
  if (!schema || typeof schema !== 'object') return schema;

  // Handle arrays
  if (Array.isArray(schema)) {
    return schema.map(transformSchemaProperties);
  }

  const transformed = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === 'properties' && value && typeof value === 'object') {
      // Transform property names within the properties object
      const transformedProperties = {};
      for (const [propKey, propValue] of Object.entries(value)) {
        const camelKey = camelCase(propKey);
        transformedProperties[camelKey] = transformSchemaProperties(propValue);
      }
      transformed[key] = transformedProperties;
    } else if (key === 'required' && Array.isArray(value)) {
      // Transform required field names
      transformed[key] = value.map(camelCase);
    } else if (key === 'example' && value && typeof value === 'object') {
      // Transform example object keys
      const transformedExample = {};
      for (const [exampleKey, exampleValue] of Object.entries(value)) {
        transformedExample[camelCase(exampleKey)] = exampleValue;
      }
      transformed[key] = transformedExample;
    } else {
      // Recursively transform nested objects
      transformed[key] = transformSchemaProperties(value);
    }
  }

  return transformed;
}

function analyzeSchemaUsage(spec) {
  const requestSchemas = new Set();
  const responseSchemas = new Set();

  // Helper to extract schema references
  function extractSchemaRefs(schema, schemaSet) {
    if (!schema) return;

    if (schema.$ref) {
      const schemaName = schema.$ref.replace('#/components/schemas/', '');
      schemaSet.add(schemaName);
    } else if (schema.allOf || schema.oneOf || schema.anyOf) {
      const combinedSchemas = schema.allOf || schema.oneOf || schema.anyOf || [];
      combinedSchemas.forEach((subSchema) => extractSchemaRefs(subSchema, schemaSet));
    } else if (schema.items) {
      extractSchemaRefs(schema.items, schemaSet);
    } else if (schema.properties) {
      Object.values(schema.properties).forEach((prop) =>
        extractSchemaRefs(prop, schemaSet),
      );
    }
  }

  // Analyze paths to categorize schemas
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && operation !== null) {
          // Analyze request body schemas
          if (operation.requestBody && operation.requestBody.content) {
            for (const [mediaType, mediaTypeObj] of Object.entries(
              operation.requestBody.content,
            )) {
              if (mediaTypeObj.schema) {
                extractSchemaRefs(mediaTypeObj.schema, requestSchemas);
              }
            }
          }

          // Analyze parameter schemas
          if (operation.parameters) {
            operation.parameters.forEach((param) => {
              if (param.schema) {
                extractSchemaRefs(param.schema, requestSchemas);
              }
            });
          }

          // Analyze response schemas
          if (operation.responses) {
            for (const [statusCode, response] of Object.entries(operation.responses)) {
              if (response.content) {
                for (const [mediaType, mediaTypeObj] of Object.entries(
                  response.content,
                )) {
                  if (mediaTypeObj.schema) {
                    extractSchemaRefs(mediaTypeObj.schema, responseSchemas);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return { requestSchemas, responseSchemas };
}

module.exports = (spec) => {
  console.log('🔄 Analyzing schema usage...');

  // Analyze which schemas are used for requests vs responses
  const { requestSchemas, responseSchemas } = analyzeSchemaUsage(spec);

  // Find schemas that are ONLY used for responses (not requests)
  const responseOnlySchemas = new Set(
    [...responseSchemas].filter((schema) => !requestSchemas.has(schema)),
  );

  console.log(
    `📊 Found ${requestSchemas.size} request schemas, ${responseSchemas.size} response schemas`,
  );
  console.log(
    `🎯 Will transform ${responseOnlySchemas.size} response-only schemas to camelCase`,
  );
  console.log(`📝 Response-only schemas: ${Array.from(responseOnlySchemas).join(', ')}`);

  // Transform ONLY response schemas in paths
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation === 'object' && operation !== null) {
          // Transform ONLY response schemas (NOT request bodies or parameters)
          if (operation.responses) {
            for (const [statusCode, response] of Object.entries(operation.responses)) {
              if (response.content) {
                for (const [mediaType, mediaTypeObj] of Object.entries(
                  response.content,
                )) {
                  if (mediaTypeObj.schema) {
                    mediaTypeObj.schema = transformSchemaProperties(mediaTypeObj.schema);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Transform ONLY component schemas that are used exclusively for responses
  if (spec.components && spec.components.schemas) {
    for (const [schemaName, schema] of Object.entries(spec.components.schemas)) {
      if (responseOnlySchemas.has(schemaName)) {
        console.log(`  ✅ Transforming ${schemaName} to camelCase (response-only)`);
        spec.components.schemas[schemaName] = transformSchemaProperties(schema);
      } else if (requestSchemas.has(schemaName)) {
        console.log(`  ⏭️  Keeping ${schemaName} as snake_case (used in requests)`);
      } else {
        console.log(`  ❓ Keeping ${schemaName} as snake_case (usage unclear)`);
      }
    }
  }

  console.log('✅ Smart schema transformation completed!');
  return spec;
};
