import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path configurations
const basePath = path.resolve(__dirname);
const modelsPath = path.join(basePath, 'models');
const schemaPath = path.join(basePath, 'schema.prisma');

// Function to merge all model files into the main schema
function mergePrismaSchema() {
  console.log('Merging Prisma models into schema.prisma...');

  try {
    // Check if models directory exists
    if (!fs.existsSync(modelsPath)) {
      throw new Error(`Models directory not found: ${modelsPath}`);
    }
    
    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    // Read the base schema to get generator and datasource configurations
    let baseSchema = fs.readFileSync(schemaPath, 'utf8');
    
    // Use regex to find the generator and datasource blocks
    const generatorMatch = baseSchema.match(/generator\s+\w+\s*{[\s\S]*?}/);
    const datasourceMatch = baseSchema.match(/datasource\s+\w+\s*{[\s\S]*?}/);
    
    if (!generatorMatch || !datasourceMatch) {
      throw new Error('Could not parse generator and datasource configuration from schema.prisma');
    }
    
    const generatorSection = generatorMatch[0];
    const datasourceSection = datasourceMatch[0];
    
    // Get all model files
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.prisma'));
    
    if (modelFiles.length === 0) {
      throw new Error('No .prisma model files found in the models directory');
    }
    
    // Combine all model contents
    let combinedModels = '';
    
    modelFiles.forEach(file => {
      const filePath = path.join(modelsPath, file);
      console.log(`Processing: ${file}`);
      const modelContent = fs.readFileSync(filePath, 'utf8');
      // Preserve comments but remove filepath comments
      const cleanedContent = modelContent
        .replace(/\/\/\s*filepath:.*$/mg, '')
        .trim();
      combinedModels += '\n\n' + cleanedContent;
    });
    
    // Create the final schema content
    const finalSchema = generatorSection + '\n\n' + datasourceSection + '\n' + combinedModels;
    
    // Write to schema.prisma
    fs.writeFileSync(schemaPath, finalSchema);
    
    console.log(`Successfully merged ${modelFiles.length} model files into schema.prisma`);
  } catch (error) {
    console.error('Error merging Prisma schema:', error);
    process.exit(1);
  }
}

// Execute the merge function
mergePrismaSchema();
