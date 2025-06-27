// TypeInfo Parser - parse typeinfo json to Polkadot.js Scale encoder
// parse typeinfo json to TypeScript type definitions and API functions

export interface TypeInfo {
  id: number;
  ty: {
    def: TypeDef;
    params?: Array<{ name: string; type: number }>;
    path?: string[];
  };
}

export interface TypeDef {
  primitive?: string;
  composite?: {
    fields: Array<{
      name?: string;
      type: number;
      typeName?: string;
    }>;
  };
  variant?: {
    variants: Array<{
      fields?: Array<{ 
        name?: string;
        type: number; 
        typeName?: string 
      }>;
      index: number;
      name: string;
    }>;
  };
  sequence?: { type: number };
  array?: { len: number; type: number };
  tuple?: number[];
}

export interface FunctionInfo {
  method: string;
  name: string;
  param_types: number[];
  return_type: number;
}

export interface TypeInfoData {
  functions: FunctionInfo[];
  types: TypeInfo[];
}

/**
 * Parser class - responsible for analyzing JSON structure and generating corresponding TypeScript code
 */
export class TypeInfoParser {
  private types: Map<number, TypeInfo> = new Map();
  private functions: FunctionInfo[] = [];
  private typeNames: Map<number, string> = new Map();

  constructor(private debug: boolean = false) {}

  /**
   * Parse type information data
   */
  public parseTypeInfo(data: TypeInfoData): void {
    this.log('Start parsing type information data...');
    
    // Parse type definitions
    for (const typeInfo of data.types) {
      this.types.set(typeInfo.id, typeInfo);
      this.log(`Parse type ID=${typeInfo.id}:`, typeInfo);
    }

    // Parse function definitions
    this.functions = data.functions;
    this.log('Parse function definitions:', this.functions);

    // Analyze type names
    this.analyzeTypeNames();
  }

  /**
   * Analyze and infer type names
   */
  private analyzeTypeNames(): void {
    this.log('Start analyzing type names...');
    
    for (const [id, typeInfo] of this.types) {
      const typeName = this.inferTypeName(id, typeInfo);
      this.typeNames.set(id, typeName);
      this.log(`Type ID=${id} -> name: ${typeName}`);
    }
  }

  /**
   * Infer type names
   */
  private inferTypeName(id: number, typeInfo: TypeInfo): string {
    const def = typeInfo.ty.def;

    // Check if it is a special Result or Option type to avoid conflicts with base classes
    if (def.variant) {
      // Check if it is a Result type
      if (def.variant.variants.length === 2 && 
          def.variant.variants.some(v => v.name === 'Ok') && 
          def.variant.variants.some(v => v.name === 'Err')) {
        return `CustomResult${id}`;
      }
      
      // Check if it is an Option type
      if (def.variant.variants.some(v => v.name === 'None') && 
          def.variant.variants.some(v => v.name === 'Some')) {
        return `CustomOption${id}`;
      }
    }

    // If there is path information, use the last part of the path
    if (typeInfo.ty.path && typeInfo.ty.path.length > 0) {
      const baseName = typeInfo.ty.path[typeInfo.ty.path.length - 1];
      
      if (typeInfo.ty.params && typeInfo.ty.params.length > 0) {
        return `${baseName}${id}`;
      }
      
      const existingTypesWithSameName = Array.from(this.types.entries())
        .filter(([otherId, otherType]) => 
          otherId !== id && 
          otherType.ty.path && 
          otherType.ty.path.length > 0 &&
          otherType.ty.path[otherType.ty.path.length - 1] === baseName
        );
      
      if (existingTypesWithSameName.length > 0) {
        return `${baseName}${id}`;
      }
      
      return baseName;
    }

    // Basic types
    if (def.primitive) {
      return this.mapPrimitiveType(def.primitive);
    }

    // Array types
    if (def.array) {
      return `U8Array${def.array.len}`;
    }

    // Sequence types (Vec)
    if (def.sequence) {
      const elementType = this.getTypeName(def.sequence.type);
      return `Vec${elementType}`;
    }

    // Tuple types
    if (def.tuple) {
      if (def.tuple.length === 0) {
        return 'Null';
      }
      return `TupleType${id}`;
    }

    // Composite types - infer name based on fields
    if (def.composite) {
      return `Type${id}`;
    }

    // Other variant types
    if (def.variant) {
      return `Type${id}`;
    }

    return `Type${id}`;
  }

  /**
   * Map basic types to Polkadot.js types
   */
  private mapPrimitiveType(primitive: string): string {
    const typeMap: Record<string, string> = {
      'str': 'Text',
      'bool': 'bool',
      'u8': 'u8',
      'u16': 'u16', 
      'u32': 'u32',
      'u64': 'u64',
      'u128': 'u128',
      'i8': 'i8',
      'i16': 'i16',
      'i32': 'i32', 
      'i64': 'i64',
      'i128': 'i128'
    };
    
    return typeMap[primitive] || primitive;
  }

  /**
   * Get type name
   */
  public getTypeName(typeId: number): string {
    return this.typeNames.get(typeId) || `Type${typeId}`;
  }

  /**
   * Get all parsed types
   */
  public getTypes(): Map<number, TypeInfo> {
    return this.types;
  }

  /**
   * Get all parsed functions
   */
  public getFunctions(): FunctionInfo[] {
    return this.functions;
  }

  /**
   * Get type name mapping
   */
  public getTypeNames(): Map<number, string> {
    return this.typeNames;
  }

  /**
   * Debug log
   */
  private log(message: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[TypeInfoParser] ${message}`, data || '');
    }
  }
} 