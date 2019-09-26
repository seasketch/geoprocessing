// copied from https://github.com/prisma/serverless-plugin-typescript/blob/master/src/Serverless.d.ts
declare namespace Serverless {
  interface Instance {
    cli: {
      log(str: string): void;
    };

    config: {
      servicePath: string;
    };

    service: {
      service: string;
      provider: {
        name: string;
        stage: string;
        iamRoleStatements: Array<any>;
        environment?: any;
        region: string;
      };
      functions: {
        [key: string]: Serverless.Function;
      };
      package: Serverless.Package;
      getAllFunctions(): string[];
      resources: any;
      custom: any;
    };

    pluginManager: PluginManager;
  }

  interface Options {
    function?: string;
    watch?: boolean;
    extraServicePath?: string;
  }

  interface Function {
    handler: string;
    package?: Serverless.Package;
    memorySize: number;
    timeout: number;
    events: any;
    name: string;
  }

  interface Package {
    include: string[];
    exclude: string[];
    artifact?: string;
    individually?: boolean;
  }

  interface PluginManager {
    spawn(command: string): Promise<void>;
  }
}
