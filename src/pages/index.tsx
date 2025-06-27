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

  const exampleJson = `{"functions":[{"method":"post","name":"set_llm_key","param_types":[0],"return_type":1},{"method":"post","name":"create_community","param_types":[3],"return_type":16},{"method":"post","name":"activate_community","param_types":[18],"return_type":1},{"method":"post","name":"set_mode","param_types":[19],"return_type":1},{"method":"post","name":"set_community","param_types":[21],"return_type":1},{"method":"post","name":"pay_to_join","param_types":[23],"return_type":1},{"method":"post","name":"invite_user","param_types":[24],"return_type":1},{"method":"get","name":"get_invite_tickets","param_types":[17,13],"return_type":15},{"method":"post","name":"generate_invite_tickets","param_types":[26],"return_type":1},{"method":"post","name":"post_thread","param_types":[27],"return_type":32},{"method":"post","name":"post_comment","param_types":[33],"return_type":32},{"method":"get","name":"get_community","param_types":[17],"return_type":36},{"method":"get","name":"get_raw_contents","param_types":[6,17],"return_type":44},{"method":"get","name":"get_raw_content","param_types":[6],"return_type":47},{"method":"get","name":"get_events","param_types":[15,17],"return_type":49},{"method":"post","name":"set_alias","param_types":[53],"return_type":1},{"method":"get","name":"get_account_info","param_types":[13],"return_type":55},{"method":"get","name":"get_reward_payloads","param_types":[17,13],"return_type":57},{"method":"get","name":"get_accounts","param_types":[31],"return_type":59},{"method":"get","name":"get_balances","param_types":[13,61,17],"return_type":62},{"method":"get","name":"check_permission","param_types":[17,13],"return_type":9},{"method":"get","name":"get_invite_fee","param_types":[],"return_type":6},{"method":"get","name":"get_account_count","param_types":[],"return_type":6}],"types":[{"id":0,"ty":{"def":{"primitive":"str"}}},{"id":1,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":2}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":2},{"name":"E","type":0}],"path":["Result"]}},{"id":2,"ty":{"def":{"tuple":[]}}},{"id":3,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":4,"typeName":"T"}]}},"params":[{"name":"T","type":4},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":4,"ty":{"def":{"composite":{"fields":[{"name":"name","type":0,"typeName":"String"},{"name":"mode","type":5,"typeName":"CommunityMode"},{"name":"logo","type":0,"typeName":"String"},{"name":"token","type":7,"typeName":"TokenMetadataArg"},{"name":"slug","type":0,"typeName":"String"},{"name":"description","type":0,"typeName":"String"},{"name":"prompt","type":0,"typeName":"String"},{"name":"llm_name","type":0,"typeName":"String"},{"name":"llm_api_host","type":10,"typeName":"Option<String>"},{"name":"llm_key","type":10,"typeName":"Option<String>"}]}},"path":["vemodel","args","CreateCommunityArg"]}},{"id":5,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"Public"},{"index":1,"name":"InviteOnly"},{"fields":[{"type":6,"typeName":"u128"}],"index":2,"name":"PayToJoin"}]}},"path":["vemodel","CommunityMode"]}},{"id":6,"ty":{"def":{"primitive":"u128"}}},{"id":7,"ty":{"def":{"composite":{"fields":[{"name":"name","type":0,"typeName":"String"},{"name":"symbol","type":0,"typeName":"String"},{"name":"total_issuance","type":6,"typeName":"u128"},{"name":"decimals","type":8,"typeName":"u8"},{"name":"new_issue","type":9,"typeName":"bool"},{"name":"contract","type":10,"typeName":"Option<String>"},{"name":"image","type":10,"typeName":"Option<String>"}]}},"path":["vemodel","args","TokenMetadataArg"]}},{"id":8,"ty":{"def":{"primitive":"u8"}}},{"id":9,"ty":{"def":{"primitive":"bool"}}},{"id":10,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":0}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":0}],"path":["Option"]}},{"id":11,"ty":{"def":{"composite":{"fields":[{"type":12,"typeName":"[u8; 65]"}]}},"path":["vemodel","crypto","EcdsaSignature"]}},{"id":12,"ty":{"def":{"array":{"len":65,"type":8}}}},{"id":13,"ty":{"def":{"composite":{"fields":[{"type":14,"typeName":"[u8; 20]"}]}},"path":["vemodel","H160"]}},{"id":14,"ty":{"def":{"array":{"len":20,"type":8}}}},{"id":15,"ty":{"def":{"primitive":"u64"}}},{"id":16,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":17}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":17},{"name":"E","type":0}],"path":["Result"]}},{"id":17,"ty":{"def":{"primitive":"u32"}}},{"id":18,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"tx","type":0,"typeName":"String"}]}},"path":["vemodel","args","ActivateCommunityArg"]}},{"id":19,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":20,"typeName":"T"}]}},"params":[{"name":"T","type":20},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":20,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"mode","type":5,"typeName":"CommunityMode"}]}},"path":["vemodel","args","SetModeArg"]}},{"id":21,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":22,"typeName":"T"}]}},"params":[{"name":"T","type":22},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":22,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"logo","type":0,"typeName":"String"},{"name":"description","type":0,"typeName":"String"},{"name":"slug","type":0,"typeName":"String"},{"name":"mode","type":5,"typeName":"CommunityMode"}]}},"path":["vemodel","args","SetCommunityArg"]}},{"id":23,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"tx","type":0,"typeName":"String"}]}},"path":["vemodel","args","PaysFeeArg"]}},{"id":24,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":25,"typeName":"T"}]}},"params":[{"name":"T","type":25},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":25,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"invitee","type":13,"typeName":"AccountId"}]}},"path":["vemodel","args","InviteUserArgs"]}},{"id":26,"ty":{"def":{"composite":{"fields":[{"name":"community_id","type":17,"typeName":"CommunityId"},{"name":"tx","type":0,"typeName":"String"}]}},"path":["vemodel","args","GenerateInviteTicketArgs"]}},{"id":27,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":28,"typeName":"T"}]}},"params":[{"name":"T","type":28},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":28,"ty":{"def":{"composite":{"fields":[{"name":"community","type":0,"typeName":"String"},{"name":"title","type":0,"typeName":"String"},{"name":"content","type":29,"typeName":"Vec<u8>"},{"name":"images","type":30,"typeName":"Vec<String>"},{"name":"mention","type":31,"typeName":"Vec<AccountId>"}]}},"path":["vemodel","args","PostThreadArg"]}},{"id":29,"ty":{"def":{"sequence":{"type":8}}}},{"id":30,"ty":{"def":{"sequence":{"type":0}}}},{"id":31,"ty":{"def":{"sequence":{"type":13}}}},{"id":32,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":6}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":6},{"name":"E","type":0}],"path":["Result"]}},{"id":33,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":34,"typeName":"T"}]}},"params":[{"name":"T","type":34},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":34,"ty":{"def":{"composite":{"fields":[{"name":"thread","type":6,"typeName":"ContentId"},{"name":"content","type":29,"typeName":"Vec<u8>"},{"name":"images","type":30,"typeName":"Vec<String>"},{"name":"mention","type":31,"typeName":"Vec<AccountId>"},{"name":"reply_to","type":35,"typeName":"Option<ContentId>"}]}},"path":["vemodel","args","PostCommentArg"]}},{"id":35,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":6}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":6}],"path":["Option"]}},{"id":36,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":37}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":37},{"name":"E","type":0}],"path":["Result"]}},{"id":37,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":38}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":38}],"path":["Option"]}},{"id":38,"ty":{"def":{"composite":{"fields":[{"name":"id","type":0,"typeName":"String"},{"name":"mode","type":5,"typeName":"CommunityMode"},{"name":"logo","type":0,"typeName":"String"},{"name":"name","type":0,"typeName":"String"},{"name":"slug","type":0,"typeName":"String"},{"name":"description","type":0,"typeName":"String"},{"name":"token_info","type":39,"typeName":"TokenMetadata"},{"name":"agent_contract","type":40,"typeName":"Option<AccountId>"},{"name":"prompt","type":0,"typeName":"String"},{"name":"platform_bnb_benefit","type":15,"typeName":"u64"},{"name":"creator_bnb_benefit","type":15,"typeName":"u64"},{"name":"creator","type":13,"typeName":"AccountId"},{"name":"agent_pubkey","type":13,"typeName":"AccountId"},{"name":"llm_vendor","type":41,"typeName":"LlmVendor"},{"name":"llm_assistant_id","type":0,"typeName":"String"},{"name":"status","type":42,"typeName":"CommunityStatus"},{"name":"created_time","type":43,"typeName":"i64"}]}},"path":["vemodel","Community"]}},{"id":39,"ty":{"def":{"composite":{"fields":[{"name":"name","type":0,"typeName":"String"},{"name":"symbol","type":0,"typeName":"String"},{"name":"total_issuance","type":6,"typeName":"u128"},{"name":"decimals","type":8,"typeName":"u8"},{"name":"new_issue","type":9,"typeName":"bool"},{"name":"contract","type":13,"typeName":"AccountId"},{"name":"image","type":10,"typeName":"Option<String>"}]}},"path":["vemodel","TokenMetadata"]}},{"id":40,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":13}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":13}],"path":["Option"]}},{"id":41,"ty":{"def":{"variant":{"variants":[{"fields":[{"name":"key","type":0,"typeName":"String"}],"index":0,"name":"OpenAI"},{"fields":[{"name":"key","type":0,"typeName":"String"},{"name":"host","type":0,"typeName":"String"}],"index":1,"name":"DeepSeek"}]}},"path":["vemodel","LlmVendor"]}},{"id":42,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"PendingCreation"},{"fields":[{"type":6,"typeName":"u128"}],"index":1,"name":"WaitingTx"},{"fields":[{"type":0,"typeName":"String"}],"index":2,"name":"CreateFailed"},{"index":3,"name":"Active"},{"fields":[{"type":15,"typeName":"u64"}],"index":4,"name":"Frozen"},{"fields":[{"type":0,"typeName":"String"}],"index":5,"name":"TokenIssued"}]}},"path":["vemodel","CommunityStatus"]}},{"id":43,"ty":{"def":{"primitive":"i64"}}},{"id":44,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":45}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":45},{"name":"E","type":0}],"path":["Result"]}},{"id":45,"ty":{"def":{"sequence":{"type":46}}}},{"id":46,"ty":{"def":{"tuple":[6,29]}}},{"id":47,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":48}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":48},{"name":"E","type":0}],"path":["Result"]}},{"id":48,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":29}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":29}],"path":["Option"]}},{"id":49,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":50}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":50},{"name":"E","type":0}],"path":["Result"]}},{"id":50,"ty":{"def":{"sequence":{"type":51}}}},{"id":51,"ty":{"def":{"tuple":[15,52]}}},{"id":52,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":17,"typeName":"CommunityId"}],"index":0,"name":"CommunityCreated"},{"fields":[{"type":17,"typeName":"CommunityId"}],"index":1,"name":"CommunityUpdated"},{"fields":[{"type":6,"typeName":"ContentId"}],"index":2,"name":"ThreadPosted"},{"fields":[{"type":6,"typeName":"ContentId"}],"index":3,"name":"ThreadDeleted"},{"fields":[{"type":6,"typeName":"ContentId"}],"index":4,"name":"CommentPosted"},{"fields":[{"type":6,"typeName":"ContentId"}],"index":5,"name":"CommentDeleted"}]}},"path":["vemodel","Event"]}},{"id":53,"ty":{"def":{"composite":{"fields":[{"name":"signature","type":11,"typeName":"S"},{"name":"signer","type":13,"typeName":"AccountId"},{"name":"nonce","type":15,"typeName":"u64"},{"name":"payload","type":54,"typeName":"T"}]}},"params":[{"name":"T","type":54},{"name":"S","type":11}],"path":["vemodel","args","Args"]}},{"id":54,"ty":{"def":{"composite":{"fields":[{"name":"alias","type":0,"typeName":"String"}]}},"path":["vemodel","args","SetAliasArg"]}},{"id":55,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":56}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":56},{"name":"E","type":0}],"path":["Result"]}},{"id":56,"ty":{"def":{"composite":{"fields":[{"name":"nonce","type":15,"typeName":"u64"},{"name":"address","type":13,"typeName":"H160"},{"name":"last_transfer_block","type":15,"typeName":"u64"},{"name":"alias","type":10,"typeName":"Option<String>"},{"name":"last_post_at","type":15,"typeName":"u64"}]}},"path":["vemodel","Account"]}},{"id":57,"ty":{"def":{"sequence":{"type":58}}}},{"id":58,"ty":{"def":{"composite":{"fields":[{"name":"payload","type":29,"typeName":"Vec<u8>"},{"name":"signature","type":29,"typeName":"Vec<u8>"},{"name":"agent_contract","type":13,"typeName":"AccountId"},{"name":"token_symbol","type":0,"typeName":"String"},{"name":"token_contract","type":13,"typeName":"AccountId"},{"name":"withdrawed","type":9,"typeName":"bool"}]}},"path":["vemodel","RewardPayload"]}},{"id":59,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":60}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":60},{"name":"E","type":0}],"path":["Result"]}},{"id":60,"ty":{"def":{"sequence":{"type":56}}}},{"id":61,"ty":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":17}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":17}],"path":["Option"]}},{"id":62,"ty":{"def":{"variant":{"variants":[{"fields":[{"type":63}],"index":0,"name":"Ok"},{"fields":[{"type":0}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":63},{"name":"E","type":0}],"path":["Result"]}},{"id":63,"ty":{"def":{"sequence":{"type":64}}}},{"id":64,"ty":{"def":{"tuple":[38,6]}}}]}`;

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