import { validateDevelopmentDomainSetup } from "./roles/development/validate.js";
import { domainRegistry } from "./roles/development/domains/registry.js";
import { packRegistry } from "./roles/development/domains/packs/registry.js";

export const validateA5cProcesses = () => {
  const development = validateDevelopmentDomainSetup();

  return {
    ok: true,
    development,
    developmentDomainRegistryCount: Object.keys(domainRegistry).length,
    developmentPackRegistryCount: Object.keys(packRegistry).length,
  };
};

