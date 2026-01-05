import { buildBackendDevelop } from "./backend.js";
import { buildFrontendDevelop } from "./frontend.js";
import { buildNextjsAppDevelop } from "./nextjs_app.js";
import { buildReactNativeAppDevelop } from "./react_native_app.js";
import { buildInfraDevelop } from "./infra.js";
import { buildAwsCloudDevelop } from "./aws_cloud.js";
import { buildAwsServerlessDevelop } from "./aws_serverless.js";
import { buildAwsDynamodbDevelop } from "./aws_dynamodb.js";
import { buildKubernetesServiceDevelop } from "./kubernetes_service.js";
import { buildGcpCloudDevelop } from "./gcp_cloud.js";
import { buildGcpCloudRunDevelop } from "./gcp_cloudrun.js";
import { buildPostgresDbDevelop } from "./postgres_db.js";
import { buildRedisCacheDevelop } from "./redis_cache.js";
import { buildMessagingDevelop } from "./messaging.js";
import { buildEventStreamingDevelop } from "./event_streaming.js";
import { buildFastapiServiceDevelop } from "./fastapi_service.js";
import { buildGraphqlApiDevelop } from "./graphql_api.js";
import { buildGrpcServiceDevelop } from "./grpc_service.js";
import { buildRailsAppDevelop } from "./rails_app.js";
import { buildDjangoAppDevelop } from "./django_app.js";
import { buildSpringBootServiceDevelop } from "./spring_boot_service.js";
import { buildDotnetWebapiDevelop } from "./dotnet_webapi.js";
import { buildTerraformModuleDevelop } from "./terraform_module.js";
import { buildHelmChartDevelop } from "./helm_chart.js";
import { buildAzureCloudDevelop } from "./azure_cloud.js";
import { buildAzureFunctionsDevelop } from "./azure_functions.js";
import { buildStripeIntegrationDevelop } from "./stripe_integration.js";
import { buildDataDevelop } from "./data.js";
import { buildWorkersDevelop } from "./workers.js";
import { buildIntegrationDevelop } from "./integration.js";
import { buildSdkDevelop } from "./sdk.js";
import { buildPackageDevelop } from "./package.js";
import { buildExpressServiceDevelop } from "./express_service.js";
import { buildNestjsServiceDevelop } from "./nestjs_service.js";
import { buildFlaskServiceDevelop } from "./flask_service.js";
import { buildGoServiceDevelop } from "./go_service.js";
import { buildRustServiceDevelop } from "./rust_service.js";
import { buildVueAppDevelop } from "./vue_app.js";
import { buildSveltekitAppDevelop } from "./sveltekit_app.js";
import { buildAngularAppDevelop } from "./angular_app.js";
import { buildFlutterAppDevelop } from "./flutter_app.js";
import { buildAwsS3Develop } from "./aws_s3.js";
import { buildAwsSqsDevelop } from "./aws_sqs.js";
import { buildAwsEventbridgeDevelop } from "./aws_eventbridge.js";
import { buildAwsRdsPostgresDevelop } from "./aws_rds_postgres.js";
import { buildGcpPubsubDevelop } from "./gcp_pubsub.js";
import { buildGcpFirestoreDevelop } from "./gcp_firestore.js";
import { buildAzureCosmosdbDevelop } from "./azure_cosmosdb.js";
import { buildAzureServicebusDevelop } from "./azure_servicebus.js";
import { buildCliToolDevelop } from "./cli_tool.js";
import { normalizeDomainName } from "./_domain_aliases.js";

export { normalizeDomainName };

export const domainRegistry = {
  backend: buildBackendDevelop,
  frontend: buildFrontendDevelop,
  nextjs_app: buildNextjsAppDevelop,
  react_native_app: buildReactNativeAppDevelop,
  infra: buildInfraDevelop,
  aws_cloud: buildAwsCloudDevelop,
  aws_serverless: buildAwsServerlessDevelop,
  aws_dynamodb: buildAwsDynamodbDevelop,
  kubernetes_service: buildKubernetesServiceDevelop,
  gcp_cloud: buildGcpCloudDevelop,
  gcp_cloudrun: buildGcpCloudRunDevelop,
  postgres_db: buildPostgresDbDevelop,
  redis_cache: buildRedisCacheDevelop,
  messaging: buildMessagingDevelop,
  event_streaming: buildEventStreamingDevelop,
  fastapi_service: buildFastapiServiceDevelop,
  graphql_api: buildGraphqlApiDevelop,
  grpc_service: buildGrpcServiceDevelop,
  rails_app: buildRailsAppDevelop,
  django_app: buildDjangoAppDevelop,
  spring_boot_service: buildSpringBootServiceDevelop,
  dotnet_webapi: buildDotnetWebapiDevelop,
  terraform_module: buildTerraformModuleDevelop,
  helm_chart: buildHelmChartDevelop,
  azure_cloud: buildAzureCloudDevelop,
  azure_functions: buildAzureFunctionsDevelop,
  stripe_integration: buildStripeIntegrationDevelop,
  data: buildDataDevelop,
  workers: buildWorkersDevelop,
  integration: buildIntegrationDevelop,
  sdk: buildSdkDevelop,
  package: buildPackageDevelop,
  express_service: buildExpressServiceDevelop,
  nestjs_service: buildNestjsServiceDevelop,
  flask_service: buildFlaskServiceDevelop,
  go_service: buildGoServiceDevelop,
  rust_service: buildRustServiceDevelop,
  vue_app: buildVueAppDevelop,
  sveltekit_app: buildSveltekitAppDevelop,
  angular_app: buildAngularAppDevelop,
  flutter_app: buildFlutterAppDevelop,
  aws_s3: buildAwsS3Develop,
  aws_sqs: buildAwsSqsDevelop,
  aws_eventbridge: buildAwsEventbridgeDevelop,
  aws_rds_postgres: buildAwsRdsPostgresDevelop,
  gcp_pubsub: buildGcpPubsubDevelop,
  gcp_firestore: buildGcpFirestoreDevelop,
  azure_cosmosdb: buildAzureCosmosdbDevelop,
  azure_servicebus: buildAzureServicebusDevelop,
  cli_tool: buildCliToolDevelop,
};

export const buildDevelopForDomain = (domain, opts = {}) => {
  const normalized = normalizeDomainName(domain, "backend");
  const builder = domainRegistry[normalized] ?? domainRegistry.backend;
  return builder(opts);
};
