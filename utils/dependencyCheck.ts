import { readFileSync } from 'fs';
import { join } from 'path';

export const checkCircularDependencies = (entryPath: string, visited = new Set<string>()) => {
  if (visited.has(entryPath)) {
    console.error(`Circular dependency detected at: ${entryPath}`);
    return true;
  }

  visited.add(entryPath);
  
  try {
    const content = readFileSync(entryPath, 'utf8');
    const importRegex = /import.*from\s+['"](.+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const fullPath = join(entryPath, '..', importPath);
        if (checkCircularDependencies(fullPath + '.ts', new Set(visited))) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${entryPath}`);
  }

  return false;
};