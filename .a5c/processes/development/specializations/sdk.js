export const sdkDevelop = (basicDevelopmentFunction) => {
    return (task,context) => {
        let developmentFunction = basicDevelopmentFunction;
        // test driven development
        if(context.scope.testDrivenDevelopment) {
            developmentFunction = withTestDrivenDevelopment(developmentFunction);        
        }
        developmentFunction = withSpecDrivenDevelopment(developmentFunction);
        developmentFunction = withCodeDocumentation(developmentFunction);
        developmentFunction = withErrorHandling(developmentFunction);
        developmentFunction = withTopDownDevelopment(developmentFunction);
        developmentFunction = withSecurity(developmentFunction);
        developmentFunction = withLogging(developmentFunction);
        developmentFunction = withCompliance(developmentFunction);
        developmentFunction = withContinousDelivery(developmentFunction);
        developmentFunction = withRefactoring(developmentFunction);
        developmentFunction = withResearchBeforeDevelopment(developmentFunction);
        developmentFunction = withPerformanceOptimization(developmentFunction);
        
        return developmentFunction(task,context);
    }
}

export const implementSDKCore = (context,developmentFunction) => {
    // build an sdk specifically for the project
    return developmentFunction("build the sdk core to base on the project requirements to meet the basic requirements of the project", context);
}
export const implementSDKExtensions = (context,developmentFunction) => {
    return developmentFunction("make the sdk extendable through sdk extensions, so that it can be used in other projects or parts of the project", context);
}

export const implementProjectSDK = (task,context,basicDevelopmentFunction) => {
    let developmentFunction = basicDevelopmentFunction;
    // aspects
    developmentFunction = sdkDevelop(developmentFunction);
    // build an sdk specifically for the project
    context.sdkCore = implementSDKCore(context,developmentFunction);    
    context.sdkExtensions = implementSDKExtensions(context,developmentFunction);
    return context;
}