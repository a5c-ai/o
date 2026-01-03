const workersDevelop = (basicDevelopmentFunction) => {
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

export const implementWorkers = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = workersDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}
