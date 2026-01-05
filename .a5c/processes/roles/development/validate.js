import { domainRegistry } from "./domains/registry.js";
import { domainAliases, assertNoObviousAmbiguousAliases } from "./domains/_domain_aliases.js";
import { packRegistry } from "./domains/packs/registry.js";

export const validateDevelopmentDomainSetup = () => {
  const domainNames = Object.keys(domainRegistry);
  const packNames = Object.keys(packRegistry);

  const aliasTargets = Object.entries(domainAliases)
    .map(([, target]) => target)
    .filter(Boolean);
  const missingAliasTargets = aliasTargets.filter((t) => !domainRegistry[t]);
  if (missingAliasTargets.length) {
    throw new Error(
      "Development domain aliases point to missing domains:\n" +
        [...new Set(missingAliasTargets)].sort().map((d) => `- ${d}`).join("\n")
    );
  }

  const missingPacks = domainNames.filter((name) => !packRegistry[name]);
  if (missingPacks.length) {
    throw new Error(
      "Development domain pack registry is missing domains:\n" + missingPacks.map((d) => `- ${d}`).join("\n")
    );
  }

  const extraPacks = packNames.filter((name) => !domainRegistry[name]);
  if (extraPacks.length) {
    throw new Error(
      "Development domain pack registry has extra entries not in domain registry:\n" +
        extraPacks.map((d) => `- ${d}`).join("\n")
    );
  }

  assertNoObviousAmbiguousAliases({ aliases: domainAliases, domainNames });

  return {
    ok: true,
    domainCount: domainNames.length,
    packCount: packNames.length,
    aliasCount: Object.keys(domainAliases).length,
  };
};
