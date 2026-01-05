import { primitivesFrom, requirePrimitive } from "../../../core/primitives.js";
import { buildDevelopForDomain } from "../domains/registry.js";

export { buildDevelopForDomain };

export const requireAct = (ctx = {}) => {
  const { act } = primitivesFrom(ctx);
  return requirePrimitive("act", act);
};
