export * from "./analytics.js";
export * from "./data_engineering.js";
export * from "./data_science.js";
export * from "./design.js";
export * from "./devops.js";
export * from "./engineering.js";
export * from "./go_to_market.js";
export * from "./operations.js";
export * from "./finance.js";
export * from "./legal_compliance.js";
export * from "./people.js";
export * from "./platform_engineering.js";
export * from "./product.js";
export * from "./product_strategy.js";
export * from "./project.js";
export * from "./qa.js";
export * from "./customer_success.js";
export * from "./security.js";
export * from "./sales_ops_revops.js";
export * from "./support.js";
export * from "./marketing_growth.js";
export * from "./technical_writing.js";
export * as development from "./development/index.js";
export * as entrepreneur from "./entrepreneur/index.js";

import * as analytics from "./analytics.js";
import * as dataEngineering from "./data_engineering.js";
import * as dataScience from "./data_science.js";
import * as design from "./design.js";
import * as devops from "./devops.js";
import * as engineering from "./engineering.js";
import * as goToMarket from "./go_to_market.js";
import * as operations from "./operations.js";
import * as finance from "./finance.js";
import * as legalCompliance from "./legal_compliance.js";
import * as people from "./people.js";
import * as platformEngineering from "./platform_engineering.js";
import * as product from "./product.js";
import * as productStrategy from "./product_strategy.js";
import * as project from "./project.js";
import * as qa from "./qa.js";
import * as customerSuccess from "./customer_success.js";
import * as security from "./security.js";
import * as salesOpsRevops from "./sales_ops_revops.js";
import * as support from "./support.js";
import * as marketingGrowth from "./marketing_growth.js";
import * as technicalWriting from "./technical_writing.js";
import * as development from "./development/index.js";
import * as entrepreneur from "./entrepreneur/index.js";

export const roleRegistry = {
  analytics,
  data_engineering: dataEngineering,
  data_science: dataScience,
  design,
  devops,
  engineering,
  go_to_market: goToMarket,
  operations,
  finance,
  legal_compliance: legalCompliance,
  people,
  platform_engineering: platformEngineering,
  product,
  product_strategy: productStrategy,
  project,
  qa,
  customer_success: customerSuccess,
  security,
  sales_ops_revops: salesOpsRevops,
  support,
  marketing_growth: marketingGrowth,
  technical_writing: technicalWriting,
  development,
  entrepreneur,
};

