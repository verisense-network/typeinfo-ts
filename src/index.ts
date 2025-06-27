// TypeInfo-TS - Polkadot.js TypeScript code generator
// Main library exports

export { TypeInfoParser } from './typeinfo-parser';
export { TypeGenerator } from './type-generator';
export { FunctionGenerator } from './function-generator';
export { CodeGenerator } from './code-generator';

// Import for internal use
import { CodeGenerator } from './code-generator';
import type { TypeInfoData } from './typeinfo-parser';

// Export types and interfaces
export type {
  TypeInfo,
  TypeDef,
  FunctionInfo,
  TypeInfoData
} from './typeinfo-parser';

/**
 * Convenience function to generate complete Polkadot.js TypeScript code
 * @param data TypeInfo data from Substrate runtime
 * @param debug Enable debug logging
 * @returns Generated TypeScript code
 */
export function generatePolkadotCode(data: TypeInfoData, debug: boolean = false): string {
  const generator = new CodeGenerator(debug);
  return generator.generateFromJson(data);
} 