export const backendDevelop = (basicDevelopmentFunction) => {
    return (task,context) => {
        // implement backend
        let developmentFunction = basicDevelopmentFunction;
        
        // aspects
        developmentFunction = withIterativeDevelopment(developmentFunction);
        developmentFunction = withCodeDocumentation(developmentFunction);
        developmentFunction = withPerformanceOptimization(developmentFunction);
        developmentFunction = withErrorHandling(developmentFunction);
        developmentFunction = withSecurity(developmentFunction);
        developmentFunction = withLogging(developmentFunction);
        // development approaches
        developmentFunction = withTestDrivenDevelopment(developmentFunction);
        developmentFunction = withSpecDrivenDevelopment(developmentFunction);
        developmentFunction = withResearchBeforeDevelopment(developmentFunction);
        developmentFunction = withTopDownDevelopment(developmentFunction);
        return developmentFunction(task,context);
    }
}

export const implementProjectBackend = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = backendDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

