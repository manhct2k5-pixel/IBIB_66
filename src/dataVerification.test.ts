import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Data Verification', () => {
  it('should not contain any forbidden strings from other campuses', () => {
    const forbiddenStrings = [
      'Ninh Bình',
      'Liêm Tuyền',
      'Quốc lộ 21B',
      'Bạch Mai cơ sở Ninh Bình',
      'Khoa Khám bệnh Khu A',
      'Khu A'
    ].map(s => s.toLowerCase());

    const allowedFileExtensions = ['.ts', '.tsx', '.json', '.md', '.html', '.css'];

    function checkFilesInDirectory(directory: string): string[] {
      const foundViolations: string[] = [];
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // skip node_modules and other common build folders just in case, though this will just be run in src/
          if (!['node_modules', 'dist', '.git', '.cache'].includes(file)) {
            foundViolations.push(...checkFilesInDirectory(fullPath));
          }
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath);
          if (allowedFileExtensions.includes(ext)) {
            // skip this test file itself
            if (fullPath.includes('dataVerification.test.ts')) {
              continue;
            }

            const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
            
            for (const forbidden of forbiddenStrings) {
              if (content.includes(forbidden)) {
                // Exceptional case: some standard html meta might have Khu A in the word, wait, 'Khu A' might be matched inside other words if not careful, but we lowercased so 'khu a'
                foundViolations.push(`File ${fullPath} contains forbidden string: ${forbidden}`);
              }
            }
          }
        }
      }

      return foundViolations;
    }

    const violations = checkFilesInDirectory(path.resolve(__dirname, '.')); // start from src
    
    expect(violations).toEqual([]);
  });
});
