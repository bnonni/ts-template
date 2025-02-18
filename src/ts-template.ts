
import * as Inquirer from '@inquirer/prompts';
import { mkdir, writeFile, readFile } from 'fs/promises';
import Logger from '@bnonni/logger';
import { TsConfig, PackageInitOptions } from './types.js';
import { DEFAULT_TS_CONFIG } from './constants.js';

class TsTemplate {
  static async getGitConfigUser() {
    const gitconfig = await readFile(`${process.env.HOME}/.gitconfig`, 'utf-8');
    const gitconfigUserEmail = gitconfig.match(/(email = .*)/g)?.[0] ?? 'email =';
    const gitconfigUserName = gitconfig.match(/(name = .*)/g)?.[0] ?? 'name =';
    const useremail = gitconfigUserEmail.split('=')[1] ?? '';
    const username = gitconfigUserName.split('=')[1] ?? '';
    return { useremail, username };
  }

  static async buildConfig(options: TsConfig) {
    const compilerOptions = options?.compilerOptions ?? DEFAULT_TS_CONFIG.compilerOptions;

    Logger.log('---------- tsconfig.json setup ----------');

    let useDefaults;
    do {
      useDefaults = await Inquirer.select({
        message : 'Would you like to use project defaults for tsconfig.json?',
        choices : ['Yes', 'No', 'Show defaults'],
        default : 'Yes',
      });
      if (useDefaults === 'Yes') {
        Logger.log('Using tsconfig.json defaults:', DEFAULT_TS_CONFIG);
        return DEFAULT_TS_CONFIG;
      } else if (useDefaults === 'Show defaults') {
        Logger.log('tsconfig.json defaults:', DEFAULT_TS_CONFIG);
      }
    } while (useDefaults === 'Show defaults');

    compilerOptions.target = await Inquirer.select({
      message : 'Compiler Option: target',
      choices : [
        'ES5',
        'ES6',
        'ES2015',
        'ES2016',
        'ES2017',
        'ES2018',
        'ES2019',
        'ES2020',
        'ES2021',
        'ES2022',
        'ES2023',
        'ESNext',
      ],
      default : compilerOptions.target,
    });

    compilerOptions.module = await Inquirer.select({
      message : 'Compiler Option: module',
      choices : [
        'CommonJS',
        'ES6',
        'ES2015',
        'ES2020',
        'ES2022',
        'ESNext',
        'Node16',
        'NodeNext'
      ],
      default : compilerOptions.target === 'ES5'
        ? compilerOptions.module
        : 'ES2015',
    });

    compilerOptions.moduleResolution = await Inquirer.select({
      message : 'Compiler Option: moduleResolution',
      choices : [
        'Classic',
        'Node',
        'Node16',
        'ES2022',
        'NodeNext',
        'Bundler',
      ],
      default : ['ES6', 'ES2015'].includes(compilerOptions.module)
        ? 'Classic'
        : ['Node16', 'NodeNext'].includes(compilerOptions.module)
          ? compilerOptions.module
          : 'Node'
    });

    compilerOptions.strict = await Inquirer.select({
      message : 'Compiler Option: enable strict mode?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.declaration = await Inquirer.select({
      message : 'Compiler Option: Generate declaration files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.declarationMap = await Inquirer.select({
      message : 'Compiler Option: Generate declaration map files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.sourceMap = await Inquirer.select({
      message : 'Compiler Option: Generate source map files?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.esModuleInterop = await Inquirer.select({
      message : 'Compiler Option: esModuleInterop?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.resolveJsonModule = await Inquirer.select({
      message : 'Compiler Option: resolveJsonModule?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.skipLibCheck = await Inquirer.select({
      message : 'Compiler Option: skipLibCheck?',
      choices : ['Yes', 'No'],
      default : 'Yes',
    }) === 'Yes';

    compilerOptions.declarationDir = await Inquirer.input({
      message : 'Compiler Option: declarationDir',
      default : compilerOptions.declarationDir,
    });

    compilerOptions.outDir = await Inquirer.input({
      message : 'Compiler Option: outDir',
      default : compilerOptions.outDir,
    });

    DEFAULT_TS_CONFIG.exclude = options.exclude ?? await Inquirer.input({
      message : 'TSConfig Option: exclude',
      default : `[${DEFAULT_TS_CONFIG.exclude.join(', ')}]`,
    });

    DEFAULT_TS_CONFIG.include = options.include ?? await Inquirer.input({
      message : 'TSConfig Option: exclude',
      default : `[${DEFAULT_TS_CONFIG.include.join(', ')}]`,
    });

    return DEFAULT_TS_CONFIG;
  }

  static async init({
    name,
    version,
    description,
    license,
    esm,
    src,
    type,
    homepage,
    contributors,
    keywords,
    tsconfig = DEFAULT_TS_CONFIG,
  }: PackageInitOptions = {}) {
    Logger.info('Welcome to the init-ts-template');
    try {
      tsconfig ??= JSON.parse(tsconfig);
    } catch (error: any) {
      Logger.error(error.message);
      Logger.warn('PackageCommand: Failed to parse tsconfig from CLI, using default');
    }

    if(name) {
      Logger.info(`Creating new TypeScript package: ${name}`);
    }

    name ??= await Inquirer.input({
      message     : 'Package Name:',
      required    : true,
      default     : 'my-package',
      transformer : (value) => value.replace('@drpm', '')
    });

    version ??= await Inquirer.input({
      message  : 'Version:',
      required : true,
      default  : '0.1.0'
    });

    description ??= await Inquirer.input({
      message  : 'Description:',
      required : true,
      default  : 'My Cool Package'
    });

    const packageManager = await Inquirer.select({
      message : 'Package Manager:',
      choices : ['npm', 'yarn', 'pnpm'],
    });

    const tsConfigTemplate = esm
      ? await this.buildConfig(tsconfig)
      : undefined;

    license ??= await Inquirer.input({
      message  : 'License:',
      required : true,
      default  : 'UNLICENSED'
    });

    src ??= await Inquirer.select({
      message : 'Use src/ directory?',
      choices : ['Yes', 'No'],
      default : 'Yes'
    }) === 'Yes';

    esm ??= await Inquirer.select({
      message : 'Default ESM?',
      choices : ['Yes', 'No'],
      default : 'Yes'
    }) === 'Yes';

    const main ='./dist/cjs/index.js';
    const module = './dist/esm/index.js';
    const types = './dist/types/index.d.ts';

    type ??= await Inquirer.select({
      message : 'Build type:',
      choices : ['module', 'commonjs'],
      default : 'module'
    });

    homepage ??= await Inquirer.input({
      message  : 'Project homepage URL:',
      required : true,
    });

    const respository = {
      type : 'git',
      url  : `${
        homepage
          .replace('https://', 'git+ssh://git@')
          .replace('.com/', '.com:')
      }.git`
    };

    const bugs = `${homepage}/issues`;

    contributors ??= [];
    const { useremail, username } = await this.getGitConfigUser();
    const numContributors = await Inquirer.input({
      message : 'Number of contributors:',
      default : '1',
    });
    while (contributors.length < Number(numContributors)) {
      const name = await Inquirer.input({
        message : `Contributor ${contributors.length + 1} Name:`,
        default : username,
      });
      const email = await Inquirer.input({
        message : `Contributor ${contributors.length + 1} Email:`,
        default : useremail
      });
      const url = await Inquirer.input({
        message : `Contributor ${contributors.length + 1} URL:`,
        default : `https://github.com/${username}`
      });
      contributors.push({ name, email, url });
    }

    const addKeywords = await Inquirer.select({
      message : 'Add keywords?',
      choices : ['Yes', 'No'],
    });
    keywords ??= [name];
    while(addKeywords === 'Yes') {
      const keyword = await Inquirer.input({
        message  : 'Keyword (leave blank to skip):',
        required : true,
      });
      if(!keyword) break;
      keywords.push(keyword);
    }

    const pasckageJsonContent = {
      name,
      version,
      type,
      description,
      main,
      module,
      types,
      license,
      homepage,
      respository,
      bugs,
      exports : {
        '.' : {
          types,
          import  : module,
          require : main
        }
      },
      publishConfig : { access: 'public' },
      engines       : { node: '>=22.0.0' },
      dependencies  : {  },
      scripts       : {
        start       : `node ${main}`,
        clean       : 'rimraf dist coverage tests/compiled',
        build       : `${packageManager} clean && ${packageManager} build:esm && ${packageManager} build:cjs`,
        'build:esm' : `rimraf dist/esm dist/types && ${packageManager} tsc -p tsconfig.json`,
        'build:cjs' : 'rimraf dist/cjs && tsc -p tsconfig.cjs.json && echo \'{"type": "commonjs"}\' > ./dist/cjs/package.json'
      }
    };

    // Create package directory
    const srcDir = src ? `${name}/src` : name;
    await mkdir(srcDir, { recursive: true });
    await writeFile(`${srcDir}/index.ts`, 'console.log("Hello, World!");');

    // Write package.json to disk
    await writeFile(`${name}/package.json`, JSON.stringify(pasckageJsonContent, null, 2));
    Logger.log('Generated package.json');

    // Create a custom .npmrc file with settings
    await writeFile(`${name}/.npmrc`, '');
    Logger.log('Generated blank .npmrc');

    if (tsConfigTemplate) {
      await writeFile(`${name}/tsconfig.json`, JSON.stringify(tsConfigTemplate, null, 2));
      Logger.log('Generated tsconfig.json');
    }
    Logger.log(`New TS template project ${pasckageJsonContent.name} created successfully!`);
  }
}

export default TsTemplate;