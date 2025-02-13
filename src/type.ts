export type CompilerOptions = {
  target: string;
  module: string;
  moduleResolution: string;
  strict: boolean;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  esModuleInterop: boolean;
  resolveJsonModule: boolean;
  skipLibCheck: boolean;
  declarationDir: string;
  outDir: string;
}

export type TsConfig = Record<string, unknown> & {
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
};

export type PackageInitOptions = {
    name?: string;
    version?: string;
    description?: string;
    license?: string;
    esm?: boolean;
    src?: boolean;
    type?: string;
    homepage?: string;
    bugs?: { url: string };
    contributors?: { name: string; url: string }[]
    keywords?: string[];
    tsconfig?: TsConfig;
};