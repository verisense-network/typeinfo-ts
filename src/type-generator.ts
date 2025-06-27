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
    
    const sortedTypeIds = this.topologicalSortTypes(types);
    
    let output = '';
    
    for (const id of sortedTypeIds) {
      const typeInfo = types.get(id);
      if (typeInfo) {
        const typeDef = this.generateTypeDefinition(id, typeInfo);
        if (typeDef) {
          output += typeDef + '\n\n';
        }
      }
    }

    return output;
  }

  /**
   * Topological sort types to ensure correct dependency relationships
   */
  private topologicalSortTypes(types: Map<number, TypeInfo>): number[] {
    const dependencies = new Map<number, Set<number>>();
    const inDegree = new Map<number, number>();
    
    for (const [id] of types) {
      dependencies.set(id, new Set());
      inDegree.set(id, 0);
    }
    
    // Analyze dependencies
    for (const [id, typeInfo] of types) {
      const deps = this.getTypeDependencies(typeInfo);
      dependencies.set(id, deps);
      
      inDegree.set(id, deps.size);
    }
    
    const queue: number[] = [];
    const result: number[] = [];
    
    for (const [id, degree] of inDegree) {
      if (degree === 0) {
        queue.push(id);
      }
    }
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      result.push(currentId);
      
      for (const [id, deps] of dependencies) {
        if (deps.has(currentId)) {
          const newDegree = (inDegree.get(id) || 0) - 1;
          inDegree.set(id, newDegree);
          if (newDegree === 0) {
            queue.push(id);
          }
        }
      }
    }
    
    if (result.length < types.size) {
      for (const [id] of types) {
        if (!result.includes(id)) {
          result.push(id);
        }
      }
    }
    
    return result;
  }

  /**
   * Get the dependencies of a type
   */
  private getTypeDependencies(typeInfo: TypeInfo): Set<number> {
    const dependencies = new Set<number>();
    const def = typeInfo.ty.def;
    
    if (def.composite) {
      for (const field of def.composite.fields) {
        if (this.needsTypeDefinition(field.type)) {
          dependencies.add(field.type);
        }
      }
    }
    
    if (def.variant) {
      for (const variant of def.variant.variants) {
        if (variant.fields) {
          for (const field of variant.fields) {
            if (this.needsTypeDefinition(field.type)) {
              dependencies.add(field.type);
            }
          }
        }
      }
      
      // Check dependencies in params
      if (typeInfo.ty.params) {
        for (const param of typeInfo.ty.params) {
          if (this.needsTypeDefinition(param.type)) {
            dependencies.add(param.type);
          }
        }
      }
    }
    
    if (def.sequence) {
      if (this.needsTypeDefinition(def.sequence.type)) {
        dependencies.add(def.sequence.type);
      }
    }
    
    if (def.array) {
      if (this.needsTypeDefinition(def.array.type)) {
        dependencies.add(def.array.type);
      }
    }
    
    if (def.tuple) {
      for (const typeId of def.tuple) {
        if (this.needsTypeDefinition(typeId)) {
          dependencies.add(typeId);
        }
      }
    }
    
    return dependencies;
  }

  /**
   * Check if a type needs to be generated
   */
  private needsTypeDefinition(typeId: number): boolean {
    const types = this.parser.getTypes();
    const typeInfo = types.get(typeId);
    
    if (!typeInfo) {
      return false;
    }
    
    const def = typeInfo.ty.def;
    
    // Basic types don't need to be generated
    if (def.primitive) {
      return false;
    }
    
    // Other types need to be generated
    return true;
  }

  /**
   * Generate a single type definition
   */
  private generateTypeDefinition(id: number, typeInfo: TypeInfo): string | null {
    const typeName = this.parser.getTypeName(id);
    const def = typeInfo.ty.def;

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
      // Special handling for H160 type (single field with array type [u8; 20])
      if (this.isSpecialArrayWrapper(typeInfo, def.composite)) {
        const arrayField = def.composite.fields[0];
        const arrayTypeInfo = this.parser.getTypes().get(arrayField.type);
        if (arrayTypeInfo?.ty.def.array) {
          const byteLength = arrayTypeInfo.ty.def.array.len * 8;
          return `export const ${typeName} = U8aFixed.with(${byteLength} as U8aBitLength);`;
        }
      }
      return this.generateStructType(typeName, def.composite);
    }

    // Variant types (Enum)
    if (def.variant) {
      return this.generateEnumType(typeName, def.variant, typeInfo.ty.params);
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
        const field = variantItem.fields[0];
        const fieldType = this.parser.getTypeName(field.type);
        
        if (field.name) {
          output += `      ${variantItem.name}: Struct.with({\n`;
          output += `        ${field.name}: ${fieldType}\n`;
          output += `      }),\n`;
        } else {
          output += `      ${variantItem.name}: ${fieldType},\n`;
        }
      } else {
        // Multiple fields, create a struct
        output += `      ${variantItem.name}: Struct.with({\n`;
        for (const field of variantItem.fields) {
          const fieldType = this.parser.getTypeName(field.type);
          const fieldName = field.name || field.typeName || `field${field.type}`;
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
   * Check if composite type is a special array wrapper (like H160)
   */
  private isSpecialArrayWrapper(typeInfo: TypeInfo, composite: NonNullable<TypeDef['composite']>): boolean {
    // Check if it has path and the type name suggests it's a special type like H160
    if (typeInfo.ty.path && typeInfo.ty.path.length > 0) {
      const typeName = typeInfo.ty.path[typeInfo.ty.path.length - 1];
      // Check for H160 or similar hash types
      if (typeName === 'H160' || typeName === 'H256' || typeName === 'H512') {
        return true;
      }
    }
    
    // Check if it's a composite with single field that has typeName indicating it's an array
    if (composite.fields.length === 1) {
      const field = composite.fields[0];
      if (field.typeName && field.typeName.match(/\[u8;\s*\d+\]/)) {
        return true;
      }
      
      // Check if the field type is actually an array type
      const fieldTypeInfo = this.parser.getTypes().get(field.type);
      if (fieldTypeInfo?.ty.def.array) {
        return true;
      }
    }
    
    return false;
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