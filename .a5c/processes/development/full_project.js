import { implementDesktopFrontend, implementMobileFrontend, implementWebFrontend, implementCLI } from "./specializations/frontends";
import { implementProjectBackend } from "./specializations/backend";
import { implementProjectSDK } from "./specializations/sdk";
import { implementProjectPackage } from "./specializations/package";
import { implementExternalServiceIntegration } from "./specializations/external_service_integration";
import { implementWorkers } from "./specializations/workers";
import { implementDataStore } from "./specializations/data_engineering";
import { implementInfrastructure } from "./specializations/infrastructure";
import { implementETLProcesses } from "./specializations/data_engineering";
import { withQualityGatedIterativeDevelopment } from "./aspects/quality_gated_iterative";

export const partTypes = [
    'mobile-frontend',
    'desktop-frontend',
    'web-frontend',
    'cli',
    'backend',
    'sdk',
    'package',
    'external service',
    'workers',
    'datastore',
    'infrastructure',
    'etl',
    'other'
]
export const designSystem = (context) => {
    return withResearchBeforeDevelopment(act)("choose the design system to use for the project or frontend", context);
}
export const utils = (context) => {
    return act("choose the utils to use for the project or frontend", context);
}
export const types = (context) => {
    return act("design the types or frontend", context);
}
export const hooks = (context) => {
    return act("choose the hooks to use for the project or frontend", context);
}
export const components = (context) => {
    return act("choose the components to use for the project or frontend", context);
}
export const pages = (context) => {
    return act("choose the pages to use for the project or frontend", context);
}
export const routes = (context) => {
    return act("choose the routes to use for the project or frontend", context);
}
export const styles = (context) => {
    return act("choose the styles to use for the project or frontend", context);
}
export const animations = (context) => {
    return act("choose the animations to use for the project or frontend", context);
}
export const lookandfeel = (context) => {
    return withResearchBeforeDevelopment(act)("choose the look and feel to use for the project or frontend", context);
}
export const frontendDefinition = (platform, context) => {
    context.platform = platform;
    context.lookandfeel = lookandfeel(context);
    context.designSystem = designSystem(context);
    context.utils = utils(context);
    context.types = types(context);
    context.hooks = hooks(context);
    context.components = components(context);
    context.pages = pages(context);
    context.routes = routes(context);
    context.styles = styles(context);
    context.animations = animations(context);
    return context;
}

export const mobileClientsDefinitions = (context) => {
    return frontendDefinition("mobile", context);
}
export const desktopClientsDefinitions = (context) => {
    return frontendDefinition("desktop", context);
}
export const webClientsDefinitions = (context) => {
    return frontendDefinition("web", context);
}

export const cliClientsDefinitions = (context) => {
    return frontendDefinition("cli", context);
}

export const clientsDefinitions = (context) => {
    if(context.scope.frontend) {
        if(context.scope.mobile) {
            context.mobileClientsDefinitions = mobileClientsDefinitions(context);
        }
        if(context.scope.desktop) {
            context.desktopClientsDefinitions = desktopClientsDefinitions(context);
        }
        if(context.scope.web) {
            context.webClientsDefinitions = webClientsDefinitions(context);
        }
    }
    if(context.scope.cli) {
        context.cliClientsDefinitions = cliClientsDefinitions(context);
    }
    return context;
}

export const systemDesign = (context) => {
    context.lookandfeel = lookandfeel(context);
    context.architecture = architecture(context);
    context.stack = stack(context);
    context.dataModel = dataModel(context);
    context.integrationsStrategy = integrationsStrategy(context);
    context.clientsDefinitions = clientsDefinitions(context);
    return context;
}
export const requirements = (context) => {
    return withQualityGatedIterativeDevelopment(act)("define the requirements of the project", context);
}
export const goals = (context) => {
    return act("define the goals of the project", context);
}
export const constraints = (context) => {
    return act("define the constraints of the project", context);
}
export const spec = (context) => {
    return withQualityGatedIterativeDevelopment(act)("define the spec of the project", context);
}
export const architecture = (context) => {
    return act("define the architecture of the project", context);
}
export const stack = (context) => {
    return withResearchBeforeDevelopment(act)("define the stack of the project", context);
}
export const dataModel = (context) => {
    return withQualityGatedIterativeDevelopment(act)("define the data model of the project", context);
}
export const integrationsStrategy = (context) => {
    return withResearchBeforeDevelopment(act)("define the integrations strategy of the project", context);
}
export const scope = (context) => {
    return withQualityGatedIterativeDevelopment(act)("define the scope of the project", context);
}
export const define = (context) => {
    context.requirements = requirements(context);
    context.goals = goals(context);
    context.constraints = constraints(context);
    context.scope = scope(context);
    context.spec = spec(context);
    breakpoint();
    return context;
}

export const fullstackApp = (context) => {
    const basicDevelopmentFunction = (task,context) => develop(task,context);
    let developmentFunction = basicDevelopmentFunction;        
    context = define(context);
    context.systemDesign = systemDesign(context);
    const parts = act("identify the parts of the project from the system design, list them by order of development/dependency (array of strings)", context);
    context.projectPartsForBreakdown = parts;
    // go over parts and develop each part
    for (const part of context.projectPartsForBreakdown) {
        if(part.type === "mobile-frontend") 
            implementMobileFrontend(part,context,developmentFunction);        
        else if(part.type === "desktop-frontend") 
            implementDesktopFrontend(part,context,developmentFunction);        
        else if(part.type === "web-frontend") 
            implementWebFrontend(part,context,developmentFunction);
        else if(part.type === "cli") 
            implementCLI(part,context,developmentFunction);
        else if(part.type === "backend") 
            implementProjectBackend(part,context,developmentFunction);
        else if(part.type === "sdk") 
            implementProjectSDK(part,context,developmentFunction);
        else if(part.type === "package") 
            implementProjectPackage(part,context,developmentFunction);
        else if(part.type === "external service") 
            implementExternalServiceIntegration(part,context,developmentFunction);
        else if(part.type === "workers") 
            implementWorkers(part,context,developmentFunction);
        else if(part.type === "datastore") 
            implementDataStore(part,context,developmentFunction);
        else if(part.type === "infrastructure") 
            implementInfrastructure(part,context,developmentFunction);
        else if(part.type === "etl") 
            implementETLProcesses(part,context,developmentFunction);
        else 
            developmentFunction(part,context,developmentFunction);
    }
    return context;
}

export const produceEnhancement = (task,context) => {
    // produce the enhancement    
    let developmentFunction = develop;
    developmentFunction = withQualityGatedIterativeDevelopment(developmentFunction);
    developmentFunction = withTestDrivenDevelopment(developmentFunction);
    developmentFunction = withSpecDrivenDevelopment(developmentFunction);
    developmentFunction = withTopDownDevelopment(developmentFunction);
    
    return developmentFunction(task,context);
}

export const produceChange = (task,context) => {
    // produce the change
    let developmentFunction = develop;
    developmentFunction = withQualityGatedIterativeDevelopment(developmentFunction);
    developmentFunction = withTestDrivenDevelopment(developmentFunction);
    developmentFunction = withSpecDrivenDevelopment(developmentFunction);
    developmentFunction = withTopDownDevelopment(developmentFunction);

    return developmentFunction(task,context);
}

export const produceFix = (task,context) => {
    // produce the bug fix
    let developmentFunction = develop;
    developmentFunction = withQualityGatedIterativeDevelopment(developmentFunction);
    developmentFunction = withTestDrivenDevelopment(developmentFunction);
    developmentFunction = withSpecDrivenDevelopment(developmentFunction);    
    developmentFunction = withTopDownDevelopment(developmentFunction);
    
    return developmentFunction(task,context);
}