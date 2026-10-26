"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { STRATEGY_TYPES } from "@/lib/utils";

interface StrategyEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export const StrategyEditor = ({
  value,
  onChange,
  readOnly = false,
}: StrategyEditorProps) => {
  const monacoRef = useRef<Monaco | null>(null);
  const { resolvedTheme } = useTheme();

  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      STRATEGY_TYPES,
      "tradevision-globals.d.ts",
    );
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  return (
    <div className="h-full min-h-100 rounded-lg overflow-hidden border border-border">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        beforeMount={handleEditorWillMount}
        theme={resolvedTheme === "light" ? "light" : "vs-dark"}
        loading={
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Loading editor…
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
          suggest: { showWords: true },
        }}
      />
    </div>
  );
};
