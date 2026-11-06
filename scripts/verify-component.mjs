import { execSync } from 'child_process';

const componentName = process.argv[2];

console.log(`\n========================================`);
if (componentName) {
  console.log(`🔍 Verifying UI Component: ${componentName}`);
} else {
  console.log(`🔍 Verifying All Components in eta-ui`);
}
console.log(`========================================\n`);

try {
  console.log(`[1/3] Checking TypeScript types...`);
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log(`  ✅ TypeScript check passed.\n`);

  console.log(`[2/3] Running Vitest tests...`);
  const testCmd = componentName
    ? `npx vitest run src/components/${componentName}`
    : `npx vitest run`;
  execSync(testCmd, { stdio: 'inherit' });
  console.log(`  ✅ Unit tests passed.\n`);

  console.log(`[3/3] Running Bundler build (tsup)...`);
  execSync('npx tsup', { stdio: 'inherit' });
  console.log(`  ✅ Build succeeded.\n`);

  console.log(`✨ All verification steps passed successfully!\n`);
  process.exit(0);
} catch (error) {
  console.error(`\n❌ Verification failed. Please inspect errors above and self-heal.\n`);
  process.exit(1);
}
