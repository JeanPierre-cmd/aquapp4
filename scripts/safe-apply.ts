import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting safe apply process...');

const TARGET_FILE = path.join(process.cwd(), 'src/components/Infrastructure/Infrastructure.tsx');

// --- Snippets to be inserted ---
const IMPORT_SNIPPET = `import { NotificationBell } from '../../modules/notifications/components/Bell';`;
const COMPONENT_SNIPPET = `
        <div className="absolute top-6 right-6">
          <NotificationBell theme="dark" />
        </div>`;

// --- Markers for insertion ---
const IMPORT_MARKER = "import React, { useState } from 'react';";
const CONTAINER_MARKER = /className="bg-gradient-to-r.*text-white"/;
const CONTAINER_REPLACEMENT = `className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-xl p-6 text-white relative"`;
const COMPONENT_MARKER = `<div className="flex items-center space-x-3 mb-2">`;

const applyChanges = (content: string): string => {
  let newContent = content;
  if (!newContent.includes(IMPORT_SNIPPET)) {
    newContent = newContent.replace(IMPORT_MARKER, `${IMPORT_MARKER}\n${IMPORT_SNIPPET}`);
  }
  if (!newContent.includes('relative')) {
    newContent = newContent.replace(CONTAINER_MARKER, CONTAINER_REPLACEMENT);
  }
  if (!newContent.includes('<NotificationBell')) {
     newContent = newContent.replace(COMPONENT_MARKER, `${COMPONENT_SNIPPET}\n        ${COMPONENT_MARKER}`);
  }
  return newContent;
};

const main = () => {
  let originalContent: string;
  try {
    originalContent = fs.readFileSync(TARGET_FILE, 'utf-8');
  } catch (error) {
    console.error(`❌ Error reading target file: ${TARGET_FILE}`, error);
    process.exit(1);
  }

  const isAlreadyApplied = originalContent.includes(IMPORT_SNIPPET);

  if (isAlreadyApplied) {
    console.log('🟡 Bell component seems to be already applied. Skipping insertion, running checks only.');
  } else {
    console.log('Applying changes to insert Bell component...');
    const newContent = applyChanges(originalContent);
    fs.writeFileSync(TARGET_FILE, newContent, 'utf-8');
    console.log('📝 Changes written to file.');
  }

  let success = false;
  try {
    console.log('\nRunning type checks (tsc)...');
    execSync('pnpm exec tsc --noEmit', { stdio: 'inherit' });
    
    console.log('\nRunning production build (vite)...');
    execSync('pnpm exec vite build --emptyOutDir=false', { stdio: 'inherit' });
    
    console.log('\n✅ Checks passed.');
    success = true;

  } catch (error) {
    console.error('\n❌ Checks failed. An error occurred during validation.');
  } finally {
    if (success) {
      console.log('\n✨ SAFE_APPLY_OK: Changes have been successfully applied and verified.');
    } else {
      if (!isAlreadyApplied) {
        console.error('\n⏪ SAFE_APPLY_REVERTED: Reverting changes due to check failures.');
        fs.writeFileSync(TARGET_FILE, originalContent, 'utf-8');
      } else {
        console.error('\n❌ SAFE_APPLY_FAILED: Checks failed, but no changes were made by this script.');
      }
      process.exit(1);
    }
  }
};

main();
