# Publishing Guide

## Publishing to NPM

### 1. Build the Library

```bash
npm run build:lib
```

### 2. Check Package Contents

```bash
npm pack --dry-run
```

This will display the list of files to be published, ensuring only necessary files are included.

### 3. Login to NPM

```bash
npm login
```

### 4. Publish

```bash
npm publish
```

### 5. Verify Publication

```bash
npm view typeinfo-ts
```

## Usage Example

Other projects can use your library like this:

```bash
npm install typeinfo-ts
```

```typescript
import { generatePolkadotCode, TypeInfoData } from 'typeinfo-ts';

const typeInfo: TypeInfoData = {
  functions: [/* ... */],
  types: [/* ... */]
};

const code = generatePolkadotCode(typeInfo);
console.log(code);
```

## Version Management

Update version:

```bash
npm version patch  # Bug fixes: 1.0.0 -> 1.0.1
npm version minor  # New features: 1.0.0 -> 1.1.0
npm version major  # Breaking changes: 1.0.0 -> 2.0.0
```

Then republish:

```bash
npm publish
```

## Library File Structure

Package structure after publishing:
```
typeinfo-ts/
├── dist/           # Compiled code
│   ├── index.js    # Main entry point
│   ├── index.d.ts  # Type declarations
│   └── ...         # Other generated files
├── package.json    # Package configuration
└── README.md       # Documentation
``` 