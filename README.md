# TypeInfo-TS

A library for generating Polkadot.js TypeScript code from Substrate runtime type information.

## Features

- 🚀 Automatically generate TypeScript type definitions from Substrate type information
- 📦 Generate Polkadot.js compatible API call functions
- 🔧 Support complex types like Struct, Enum, Result, Option, etc.
- ✨ Special handling for hash types like H160, H256
- 🛠️ Complete type registration and API initialization code

## Installation

```bash
npm install @verisense-network/typeinfo-ts
```

## Quick Start

```typescript
import { generatePolkadotCode, TypeInfoData } from '@verisense-network/typeinfo-ts';

// Your Substrate runtime type information data
const typeInfoData: TypeInfoData = {
  functions: [
    {
      method: "get",
      name: "get_account_count",
      param_types: [],
      return_type: 6
    }
  ],
  types: [
    // ... type definitions
  ]
};

// Generate complete TypeScript code
const generatedCode = generatePolkadotCode(typeInfoData, true); // true enables debugging

console.log(generatedCode);
```

## Advanced Usage

If you need more fine-grained control, you can use individual generators:

```typescript
import { 
  TypeInfoParser, 
  TypeGenerator, 
  FunctionGenerator, 
  CodeGenerator 
} from '@verisense-network/typeinfo-ts';

// Create parser
const parser = new TypeInfoParser(true); // Enable debugging
parser.parseTypeInfo(typeInfoData);

// Generate type definitions
const typeGenerator = new TypeGenerator(parser, true);
const types = typeGenerator.generateAllTypes();

// Generate function definitions
const functionGenerator = new FunctionGenerator(parser, true);
const functions = functionGenerator.generateAllFunctions();

// Or use the complete code generator
const codeGenerator = new CodeGenerator(true);
const completeCode = codeGenerator.generateFromJson(typeInfoData);
```

## API Reference

### `generatePolkadotCode(data, debug?)`

Generates complete Polkadot.js TypeScript code.

**Parameters:**
- `data: TypeInfoData` - Substrate type information data
- `debug?: boolean` - Whether to enable debug logging (default false)

**Returns:** `string` - Generated TypeScript code

### Core Classes

#### `TypeInfoParser`
Parses and manages type information data.

#### `TypeGenerator` 
Generates TypeScript type definitions.

#### `FunctionGenerator`
Generates API call functions.

#### `CodeGenerator`
Combines all generators to produce complete code.

## Generated Code Examples

For H160 type, generates:
```typescript
export const H160 = U8aFixed.with(160 as U8aBitLength);
```

For parameter-less functions, generates:
```typescript
export async function get_account_count(nucleusId: string): Promise<any> {
  if (!api) throw new Error('API not initialized');

  const response = await api.rpc('nucleus_get', nucleusId, 'get_account_count', '');

  const responseBytes = Buffer.from(response as string, "hex");
  return new u128(registry, responseBytes);
}
```

## License

MIT

## Contributing

Issues and Pull Requests are welcome!
