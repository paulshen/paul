import MonacoEditor from "@monaco-editor/react";

const codeValueCache: Record<string, string> = {};

export default function CodeEditor({
  blockId,
  initialCode,
}: {
  blockId: string;
  initialCode: string;
}) {
  let value = initialCode;
  if (codeValueCache[blockId] !== undefined) {
    value = codeValueCache[blockId];
  }

  return (
    <MonacoEditor
      defaultValue={value}
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES5,
          lib: ["es5"],
          module: monaco.languages.typescript.ModuleKind.ES2015,
          allowNonTsExtensions: true,
        });
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `interface Console { log(...data: any[]): void; }
        declare var console: Console;`,
          "lib.dom.d.ts"
        );

        codeValueCache[blockId] = editor.getValue();
      }}
      onChange={(value) => {
        if (value !== undefined) {
          codeValueCache[blockId] = value;
        }
      }}
      language="typescript"
      options={{
        minimap: { enabled: false },
      }}
    />
  );
}
