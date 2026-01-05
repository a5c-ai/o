import { commonPlanningCriteria } from "./_shared_criteria.js";

import * as frontend from "./frontend.js";
import * as nextjs from "./nextjs_app.js";
import * as backend from "./backend.js";
import * as infra from "./infra.js";
import * as awsCloud from "./aws_cloud.js";
import * as awsServerless from "./aws_serverless.js";
import * as kubernetes from "./kubernetes_service.js";
import * as gcpCloud from "./gcp_cloud.js";
import * as gcpCloudRun from "./gcp_cloudrun.js";
import * as reactNative from "./react_native_app.js";
import * as postgresDb from "./postgres_db.js";
import * as redisCache from "./redis_cache.js";
import * as messaging from "./messaging.js";
import * as eventStreaming from "./event_streaming.js";
import * as fastapiService from "./fastapi_service.js";
import * as awsDynamodb from "./aws_dynamodb.js";
import * as graphqlApi from "./graphql_api.js";
import * as grpcService from "./grpc_service.js";
import * as railsApp from "./rails_app.js";
import * as djangoApp from "./django_app.js";
import * as springBoot from "./spring_boot_service.js";
import * as dotnetWebapi from "./dotnet_webapi.js";
import * as terraformModule from "./terraform_module.js";
import * as helmChart from "./helm_chart.js";
import * as azureCloud from "./azure_cloud.js";
import * as azureFunctions from "./azure_functions.js";
import * as stripeIntegration from "./stripe_integration.js";
import * as data from "./data.js";
import * as workers from "./workers.js";
import * as integration from "./integration.js";
import * as sdk from "./sdk.js";
import * as pkg from "./package.js";
import * as expressService from "./express_service.js";
import * as nestjsService from "./nestjs_service.js";
import * as flaskService from "./flask_service.js";
import * as goService from "./go_service.js";
import * as rustService from "./rust_service.js";
import * as vueApp from "./vue_app.js";
import * as sveltekitApp from "./sveltekit_app.js";
import * as angularApp from "./angular_app.js";
import * as flutterApp from "./flutter_app.js";
import * as awsS3 from "./aws_s3.js";
import * as awsSqs from "./aws_sqs.js";
import * as awsEventbridge from "./aws_eventbridge.js";
import * as awsRdsPostgres from "./aws_rds_postgres.js";
import * as gcpPubsub from "./gcp_pubsub.js";
import * as gcpFirestore from "./gcp_firestore.js";
import * as azureCosmosdb from "./azure_cosmosdb.js";
import * as azureServicebus from "./azure_servicebus.js";
import * as cliTool from "./cli_tool.js";
import { normalizeDomainName } from "../_domain_aliases.js";

export { normalizeDomainName };

export const packRegistry = {
  frontend,
  nextjs_app: nextjs,
  backend,
  infra,
  aws_cloud: awsCloud,
  aws_serverless: awsServerless,
  kubernetes_service: kubernetes,
  gcp_cloud: gcpCloud,
  gcp_cloudrun: gcpCloudRun,
  react_native_app: reactNative,
  postgres_db: postgresDb,
  redis_cache: redisCache,
  messaging,
  event_streaming: eventStreaming,
  fastapi_service: fastapiService,
  aws_dynamodb: awsDynamodb,
  graphql_api: graphqlApi,
  grpc_service: grpcService,
  rails_app: railsApp,
  django_app: djangoApp,
  spring_boot_service: springBoot,
  dotnet_webapi: dotnetWebapi,
  terraform_module: terraformModule,
  helm_chart: helmChart,
  azure_cloud: azureCloud,
  azure_functions: azureFunctions,
  stripe_integration: stripeIntegration,
  data,
  workers,
  integration,
  sdk,
  package: pkg,
  express_service: expressService,
  nestjs_service: nestjsService,
  flask_service: flaskService,
  go_service: goService,
  rust_service: rustService,
  vue_app: vueApp,
  sveltekit_app: sveltekitApp,
  angular_app: angularApp,
  flutter_app: flutterApp,
  aws_s3: awsS3,
  aws_sqs: awsSqs,
  aws_eventbridge: awsEventbridge,
  aws_rds_postgres: awsRdsPostgres,
  gcp_pubsub: gcpPubsub,
  gcp_firestore: gcpFirestore,
  azure_cosmosdb: azureCosmosdb,
  azure_servicebus: azureServicebus,
  cli_tool: cliTool,
};

export const getDomainPlanningPack = (domain) => {
  const normalized = normalizeDomainName(domain, "backend");
  return packRegistry[normalized] ?? packRegistry.backend;
};

export const getDomainCriteriaPack = (domain) => {
  const pack = getDomainPlanningPack(domain);
  const domainSpecific = typeof pack.criteriaPack === "function" ? pack.criteriaPack() : [];
  return [...commonPlanningCriteria, ...domainSpecific];
};
