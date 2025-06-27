// Type Generator - generate Polkadot.js TypeScript type definitions
import type { TypeInfo, TypeDef } from './typeinfo-parser';
import { TypeInfoParser } from './typeinfo-parser';

/**
 * Type Generator - responsible for generating TypeScript type definitions
 */
export class TypeGenerator {
  private parser: TypeInfoParser;
  private generatedTypes: Set<string> = new Set();
  private typeImports: Set<string> = new Set();

  constructor(parser: TypeInfoParser, private debug: boolean = false) {
    this.parser = parser;
    
    // Add basic imports
    this.typeImports.add('Text');
    this.typeImports.add('u8');
    this.typeImports.add('u16');
    this.typeImports.add('u32');
    this.typeImports.add('u64');
    this.typeImports.add('u128');
    this.typeImports.add('i8');
    this.typeImports.add('i16');
    this.typeImports.add('i32');
    this.typeImports.add('i64');
    this.typeImports.add('i128');
    this.typeImports.add('bool');
    this.typeImports.add('Null');
    this.typeImports.add('Enum');
    this.typeImports.add('Result');
    this.typeImports.add('Vec');
    this.typeImports.add('Tuple');
    this.typeImports.add('Option');
    this.typeImports.add('Struct');
    this.typeImports.add('Bytes');
    this.typeImports.add('U8aFixed');
    this.typeImports.add('VecFixed');
  }

  /**
   * Generate all type definitions
   */
  public generateAllTypes(): string {
    this.log('Start generating type definitions...');
    
    const types = this.parser.getTypes();
    let output = '';
    
    // Then generate complex type definitions
    for (const [id, typeInfo] of types) {
      const typeDef = this.generateTypeDefinition(id, typeInfo);
      if (typeDef) {
        output += typeDef + '\n\n';
      }
    }

    return output;
  }

  /**
   * Generate a single type definition
   */
  private generateTypeDefinition(id: number, typeInfo: TypeInfo): string | null {
    const typeName = this.parser.getTypeName(id);
    const def = typeInfo.type.def;

    this.log(`Generate type definition: ID=${id}, name=${typeName}`, def);

    // Skip basic types
    if (def.primitive) {
      return null;
    }

    // Skip already generated types
    if (this.generatedTypes.has(typeName)) {
      return null;
    }

    this.generatedTypes.add(typeName);

    // Composite types (Struct)
    if (def.composite) {
      return this.generateStructType(typeName, def.composite);
    }

    // Variant types (Enum)
    if (def.variant) {
      return this.generateEnumType(typeName, def.variant, typeInfo.type.params);
    }

    // Array types
    if (def.array) {
      const byteLength = def.array.len * 8;
      return `export const ${typeName} = U8aFixed.with(${byteLength} as U8aBitLength);`;
    }

    // Sequence types
    if (def.sequence) {
      const elementType = this.parser.getTypeName(def.sequence.type);
      return `export const ${typeName} = Vec.with(${elementType});`;
    }

    // Tuple types
    if (def.tuple) {
      if (def.tuple.length === 0) {
        // Avoid duplicate definition of Null
        if (typeName === 'Null') {
          return null;
        }
        return `export const ${typeName} = Null;`;
      }
      const types = def.tuple.map(t => this.parser.getTypeName(t));
      return `export const ${typeName} = Tuple.with([${types.join(', ')}]);`;
    }

    return null;
  }

  /**
   * Generate struct type
   */
  private generateStructType(typeName: string, composite: NonNullable<TypeDef['composite']>): string {
    this.log(`Generate struct type: ${typeName}`, composite);

    let output = `export class ${typeName} extends Struct {\n`;
    output += `  constructor(registry: Registry, value?: any) {\n`;
    output += `    super(registry, {\n`;

    for (const field of composite.fields) {
      const fieldName = field.name || 'field';
      const fieldType = this.parser.getTypeName(field.type);
      output += `    ${fieldName}: ${fieldType},\n`;
    }

    output += `    }, value);\n`;
    output += `  }\n`;
    output += `}`;

    return output;
  }

  /**
   * Generate enum type
   */
  private generateEnumType(typeName: string, variant: NonNullable<TypeDef['variant']>, params?: Array<{ name: string; type: number }>): string {
    this.log(`Generate enum type: ${typeName}`, variant);

    // Special handling for Result type
    if (this.isResultType(variant)) {
      return this.generateResultType(typeName, variant, params);
    }

    // Special handling for Option type
    if (this.isOptionType(variant)) {
      return this.generateOptionType(typeName, variant, params);
    }

    // Normal enum type
    let output = `export class ${typeName} extends Enum {\n`;
    output += `  constructor(registry: Registry, value?: any) {\n`;
    output += `    super(registry, {\n`;

    for (const variantItem of variant.variants) {
      if (!variantItem.fields || variantItem.fields.length === 0) {
        output += `      ${variantItem.name}: Null,\n`;
      } else if (variantItem.fields.length === 1) {
        const fieldType = this.parser.getTypeName(variantItem.fields[0].type);
        output += `      ${variantItem.name}: ${fieldType},\n`;
      } else {
        // Multiple fields, create a struct
        output += `      ${variantItem.name}: Struct.with({\n`;
        for (const field of variantItem.fields) {
          const fieldType = this.parser.getTypeName(field.type);
          const fieldName = field.typeName || `field${field.type}`;
          output += `        ${fieldName}: ${fieldType},\n`;
        }
        output += `      }),\n`;
      }
    }

    output += `    }, value);\n`;
    output += `  }\n`;
    output += `}`;

    return output;
  }

  /**
   * Generate Result type
   */
  private generateResultType(typeName: string, variant: NonNullable<TypeDef['variant']>, params?: Array<{ name: string; type: number }>): string {
    if (params && params.length >= 2) {
      const okType = this.parser.getTypeName(params[0].type);
      const errType = this.parser.getTypeName(params[1].type);
      return `export class ${typeName} extends Result.with({ Ok: ${okType}, Err: ${errType} }) {
  constructor(registry: Registry, value?: any) {
    super(registry, value);
  }
}`;
    }

    // Fallback to basic Result generation
    const okVariant = variant.variants.find(v => v.name === 'Ok');
    const errVariant = variant.variants.find(v => v.name === 'Err');
    
    const okType = okVariant?.fields?.[0] ? this.parser.getTypeName(okVariant.fields[0].type) : 'Null';
    const errType = errVariant?.fields?.[0] ? this.parser.getTypeName(errVariant.fields[0].type) : 'Text';
    
    return `export class ${typeName} extends Result.with({ Ok: ${okType}, Err: ${errType} }) {
  constructor(registry: Registry, value?: any) {
    super(registry, value);
  }
}`;
  }

  /**
   * Generate Option type
   */
  private generateOptionType(typeName: string, variant: NonNullable<TypeDef['variant']>, params?: Array<{ name: string; type: number }>): string {
    if (params && params.length >= 1) {
      const innerType = this.parser.getTypeName(params[0].type);
      return `export class ${typeName} extends Option.with(${innerType}) {
  constructor(registry: Registry, value?: any) {
    super(registry, value);
  }
}`;
    }

    // Fallback to basic Option generation
    const someVariant = variant.variants.find(v => v.name === 'Some');
    const innerType = someVariant?.fields?.[0] ? this.parser.getTypeName(someVariant.fields[0].type) : 'Text';
    
    return `export class ${typeName} extends Option.with(${innerType}) {
  constructor(registry: Registry, value?: any) {
    super(registry, value);
  }
}`;
  }

  /**
   * Check if it is a Result type
   */
  private isResultType(variant: NonNullable<TypeDef['variant']>): boolean {
    return variant.variants.length === 2 &&
           variant.variants.some(v => v.name === 'Ok') &&
           variant.variants.some(v => v.name === 'Err');
  }

  /**
   * Check if it is an Option type
   */
  private isOptionType(variant: NonNullable<TypeDef['variant']>): boolean {
    return variant.variants.length === 2 &&
           variant.variants.some(v => v.name === 'None') &&
           variant.variants.some(v => v.name === 'Some');
  }

  /**
   * Get types to import
   */
  public getRequiredImports(): string[] {
    return Array.from(this.typeImports);
  }

  /**
   * Debug log
   */
  private log(message: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[TypeGenerator] ${message}`, data || '');
    }
  }
} 