const fs = require('fs');
const path = require('path');

// Directory containing model schema files
const modelsDir = path.join(__dirname, 'models');
// Output file
const outputFile = path.join(__dirname, 'schema.prisma');

// Read the header template that contains database connection and generator settings
const headerTemplate = fs.readFileSync(path.join(__dirname, 'header.prisma'), 'utf8');

// Initialize output with the header
let mergedSchema = headerTemplate;
let modelContent = '';

// Check if the models directory exists
if (fs.existsSync(modelsDir)) {
  // Process each model file
  const modelFiles = fs.readdirSync(modelsDir)
    .filter(file => file.endsWith('.prisma'));
  
  console.log(`Found ${modelFiles.length} model files to merge`);
  
  // Read and concatenate each model file
  modelFiles.forEach(file => {
    console.log(`Processing ${file}...`);
    const filePath = path.join(modelsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Add model content
    modelContent += `\n// ${file.replace('.prisma', '')} Models\n${content}\n`;
  });
} else {
  console.warn('Models directory does not exist:', modelsDir);
}

// Combine header and models
mergedSchema += modelContent;

// Write the merged schema to the output file
fs.writeFileSync(outputFile, mergedSchema);
console.log(`Schema merged successfully into ${outputFile}`);
