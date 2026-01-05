export * from "./analytics.js";
export * from "./data_engineering.js";
export * from "./data_science.js";
export * from "./design.js";
export * from "./devops.js";
export * from "./engineering.js";
export * from "./platform_engineering.js";
export * from "./product.js";
export * from "./project.js";
export * from "./qa.js";
export * from "./security.js";
export * from "./support.js";
export * from "./technical_writing.js";
export * as development from "./development/index.js";

import * as analytics from "./analytics.js";
import * as dataEngineering from "./data_engineering.js";
import * as dataScience from "./data_science.js";
import * as design from "./design.js";
import * as devops from "./devops.js";
import * as engineering from "./engineering.js";
import * as platformEngineering from "./platform_engineering.js";
import * as product from "./product.js";
import * as project from "./project.js";
import * as qa from "./qa.js";
import * as security from "./security.js";
import * as support from "./support.js";
import * as technicalWriting from "./technical_writing.js";
import * as development from "./development/index.js";

export const roleRegistry = {
  analytics,
  data_engineering: dataEngineering,
  data_science: dataScience,
  design,
  devops,
  engineering,
  platform_engineering: platformEngineering,
  product,
  project,
  qa,
  security,
  support,
  technical_writing: technicalWriting,
  development,
};

