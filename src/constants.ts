export const DEFAULT_TS_CONFIG = {
  compilerOptions : {
    target            : 'ES5',
    module            : 'CommonJS',
    moduleResolution  : 'Node',
    strict            : true,
    declaration       : true,
    declarationMap    : true,
    sourceMap         : true,
    esModuleInterop   : true,
    resolveJsonModule : true,
    skipLibCheck      : true,
    declarationDir    : 'dist/types',
    outDir            : 'dist',
  },
  include : ['src'],
  exclude : ['node_modules']
};