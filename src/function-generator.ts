// Function Generator - Generate Polkadot.js API call functions
import type { FunctionInfo } from './typeinfo-parser';
import { TypeInfoParser } from './typeinfo-parser';

/**
 * Function Generator - Responsible for generating API call functions
 */
export class FunctionGenerator {
  private parser: TypeInfoParser;

  constructor(parser: TypeInfoParser, private debug: boolean = false) {
    this.parser = parser;
  }

  /**
   * Generate all API functions
   */
  public generateAllFunctions(): string {
    this.log('Starting to generate API functions...');
    
    const functions = this.parser.getFunctions();
    let output = '';

    for (const func of functions) {
      const funcDef = this.generateFunction(func);
      if (funcDef) {
        output += funcDef + '\n\n';
      }
    }

    return output;
  }

  /**
   * Generate a single API function
   */
  private generateFunction(func: FunctionInfo): string {
    this.log(`Generating function: ${func.name}`, func);

    const returnType = this.parser.getTypeName(func.return_type);
    const parameterCode = this.generateParameters(func);
    const encodingCode = this.generateEncoding(func);
    const decodingCode = this.generateDecoding(func, returnType);
    const apiCallCode = this.generateApiCall(func);

    return `export async function ${func.name}(nucleusId: string${parameterCode}): Promise<any> {
  if (!api) throw new Error('API not initialized');
${encodingCode}
  const response = await api.rpc('nucleus_${func.method}', nucleusId, '${func.name}'${apiCallCode});

  const responseBytes = Buffer.from(response as string, "hex");
  return ${decodingCode};
}`;
  }

  /**
   * Generate function parameters
   */
  private generateParameters(func: FunctionInfo): string {
    if (func.param_types.length === 0) {
      return '';
    }

    const params: string[] = [];
    
    if (func.param_types.length === 1) {
      const argName = this.getArgumentName(func, 0);
      params.push(`, ${argName}Arg: any`);
    } else {
      // Multiple parameters
      func.param_types.forEach((typeId, index) => {
        const argName = this.getArgumentName(func, index);
        params.push(`, ${argName}Arg: any`);
      });
    }

    return params.join('');
  }

  /**
   * Generate encoding code
   */
  private generateEncoding(func: FunctionInfo): string {
    if (func.param_types.length === 0) {
      return '';  // No encoding needed for functions without parameters
    }

    if (func.param_types.length === 1) {
      const paramType = this.parser.getTypeName(func.param_types[0]);
      const argName = this.getArgumentName(func, 0);
      
      // For single parameter, generate encoding code directly
      return `  const ${argName} = new ${paramType}(registry, ${argName}Arg);`;
    } else {
      // Multiple parameters, use Tuple
      const paramTypes = func.param_types.map(typeId => this.parser.getTypeName(typeId));
      const argNames = func.param_types.map((_, index) => `${this.getArgumentName(func, index)}Arg`);
      
      return `  const args = new Tuple(registry, [${paramTypes.join(', ')}], [${argNames.join(', ')}]);`;
    }
  }

  /**
   * Generate API call parameter code
   */
  private generateApiCall(func: FunctionInfo): string {
    if (func.param_types.length === 0) {
      return ", u8aToHex(new Uint8Array([0]))";  // 0x00 for functions without arguments
    } else {
      const encodingVar = this.getEncodingVariable(func);
      return `, u8aToHex(${encodingVar}?.toU8a())`;
    }
  }

  /**
   * Generate decoding code
   */
  private generateDecoding(func: FunctionInfo, returnType: string): string {
    // Generate decoding code based on return type
    if (this.isSimpleType(returnType)) {
      return `new ${returnType}(registry, responseBytes)`;
    } else {
      return `new ${returnType}(registry, responseBytes)`;
    }
  }

  /**
   * Get encoding variable name
   */
  private getEncodingVariable(func: FunctionInfo): string {
    if (func.param_types.length === 0) {
      return 'emptyData';
    } else if (func.param_types.length === 1) {
      return this.getArgumentName(func, 0);
    } else {
      return 'args';
    }
  }

  /**
   * Get parameter name
   */
  private getArgumentName(func: FunctionInfo, index: number): string {
    // Generate appropriate parameter names based on function name and parameter position
    const baseNames = [
      'id', 'arg', 'args', 'param', 'data', 'value', 
      'account_id', 'community_id', 'user', 'limit', 
      'gt', 'account_ids', 'community', 'tx'
    ];

    if (func.param_types.length === 1) {
      // Single parameter, infer from function name
      if (func.name.includes('account')) return 'account_id';
      if (func.name.includes('community')) return 'community_id';
      if (func.name.includes('user')) return 'user';
      if (func.name.includes('key')) return 'key';
      if (func.name.includes('mode')) return 'args';
      if (func.name.includes('alias')) return 'args';
      if (func.name.includes('thread')) return 'args';
      if (func.name.includes('comment')) return 'args';
      if (func.name.includes('invite')) return 'args';
      if (func.name.includes('create')) return 'args';
      if (func.name.includes('activate')) return 'arg';
      if (func.name.includes('pay')) return 'arg';
      if (func.name.includes('set')) return 'args';
      if (func.name.includes('post')) return 'args';
      if (func.name.includes('generate')) return 'args';
      if (func.name.includes('get')) return 'id';
      
      return 'arg';
    } else {
      // Multiple parameters, use base names
      return baseNames[index % baseNames.length];
    }
  }

  /**
   * Check if it's a simple type
   */
  private isSimpleType(typeName: string): boolean {
    const simpleTypes = [
      'Text', 'bool', 'u8', 'u16', 'u32', 'u64', 'u128',
      'i8', 'i16', 'i32', 'i64', 'i128', 'Null'
    ];
    return simpleTypes.includes(typeName);
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[FunctionGenerator] ${message}`, data || '');
    }
  }
} 