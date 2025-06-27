import { useState, useCallback } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Chip,
  Divider,
  Progress,
  Snippet
} from '@heroui/react';
import { CodeGenerator } from '../code-generator';
import type { TypeInfoData } from '../typeinfo-parser';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleJson = `{"functions":[{"method":"post","name":"hello","param_types":[0,2,3,1,4],"return_type":2},{"method":"post","name":"request_google","param_types":[],"return_type":1}],"types":[{"id":0,"type":{"def":{"composite":{"fields":[{"name":"id","type":1,"typeName":"u64"}]}},"path":["hello_avs","nucleus","Skp"]}},{"id":1,"type":{"def":{"primitive":"u64"}}},{"id":2,"type":{"def":{"variant":{"variants":[{"fields":[{"type":1,"typeName":"u64"}],"index":0,"name":"One"},{"fields":[{"type":3,"typeName":"String"}],"index":1,"name":"Two"},{"fields":[{"type":0,"typeName":"Skp"}],"index":2,"name":"Three"}]}},"path":["hello_avs","nucleus","Src"]}},{"id":3,"type":{"def":{"primitive":"str"}}},{"id":4,"type":{"def":{"composite":{"fields":[{"type":5,"typeName":"[u8; 32]"}]}},"path":["sp_core","crypto","AccountId32"]}},{"id":5,"type":{"def":{"array":{"len":32,"type":6}}}},{"id":6,"type":{"def":{"primitive":"u8"}}}]}`;

  const handleGenerate = useCallback(async () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedCode('');

    try {
      const data: TypeInfoData = JSON.parse(jsonInput);

      const generator = new CodeGenerator(true);

      const code = generator.generateFromJson(data);
      setGeneratedCode(code);

      const validation = generator.validateGeneration(data);
      console.log("validation", validation);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON');
    } finally {
      setIsLoading(false);
    }
  }, [jsonInput]);

  const handleUseExample = useCallback(() => {
    setJsonInput(exampleJson);
  }, []);

  const handleClearAll = useCallback(() => {
    setJsonInput('');
    setGeneratedCode('');
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TypeInfo to Polkadot.js Scale Encoder Converter
          </h1>
          <p className="text-lg text-foreground-600">
            Analyze type information data and generate complete TypeScript type definitions and API functions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-fit" shadow="sm">
            <CardHeader className="flex justify-between items-center pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Type Information Input</h2>
                <Chip size="sm" color="primary" variant="dot">Step 1</Chip>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  onPress={handleUseExample}
                >
                  Use Example
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={handleClearAll}
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Please paste type information JSON data (containing functions and types fields)..."
                minRows={20}
                maxRows={25}
                variant="bordered"
                classNames={{
                  input: "font-mono text-sm"
                }}
              />

              <Divider className="my-4" />

              <div className="flex justify-between items-center">
                <Button
                  color="primary"
                  size="lg"
                  onPress={handleGenerate}
                  isLoading={isLoading}
                  disabled={!jsonInput.trim()}
                  className="font-semibold"
                >
                  {isLoading ? 'Generating...' : '🚀 Generate Code'}
                </Button>

                {error && (
                  <Chip color="danger" variant="flat" className="max-w-xs">
                    {error}
                  </Chip>
                )}
              </div>

              {isLoading && (
                <Progress
                  size="sm"
                  color="primary"
                  isIndeterminate
                  className="mt-2"
                  label="Parsing and generating code..."
                />
              )}
            </CardBody>
          </Card>

          <Card className="h-fit" shadow="sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Generated Results</h2>
                <Chip size="sm" color="success" variant="dot">Step 2</Chip>
                {generatedCode && (
                  <Chip color="success" variant="flat" size="sm">
                    Generated
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {generatedCode ? (
                <div className="space-y-4">
                  <Snippet
                    hideSymbol
                    classNames={{
                      pre: "w-full h-96 overflow-auto text-xs",
                      content: "w-full"
                    }}
                    codeString={generatedCode}
                  >
                    <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                  </Snippet>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => navigator.clipboard.writeText(generatedCode)}
                    >
                      📋 Copy Code
                    </Button>
                    <Chip color="success" variant="flat" size="sm">
                      {generatedCode.split('\n').length} lines of code
                    </Chip>
                  </div>
                </div>
              ) : (
                <div className="text-default-500 text-center py-8">
                  <div className="text-lg mb-2">📝</div>
                  Generated TypeScript code will be displayed here
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}