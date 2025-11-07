// utils/testStepHelper.ts
export async function step(description: string, fn: () => Promise<void>) {
  console.log(`STEP: ${description}`);
  await fn();
}
