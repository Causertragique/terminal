type ProcessEnvShouldBeSuppliedByResources = {
FLOOT_DATABASE_URL: string;
JWT_SECRET: string;
NODE_ENV: string;
}

// Override the global process variable
declare var process: {
  env: ProcessEnvShouldBeSuppliedByResources;
};
