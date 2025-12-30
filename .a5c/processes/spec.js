import { plan } from "@a5c/not-a-real-package";
import { qualityGatedWork } from "./qualitygatedwork.js"

export const spec = (context) => {
  const specs = qualityGatedWork(
    (context)=>act("spec the task from the requirements, goals and constraints", context),
    context,
    ["specs are complete and accurate"],
    0.9
  );
  breakpoint("validate specs with user");
  return specs;
};

export default spec;
