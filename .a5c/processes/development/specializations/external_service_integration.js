export const externalServiceIntegrationDevelop = (basicDevelopmentFunction) => {
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
        return developmentFunction(task,context);
    }
}

export const implementExternalServiceIntegration = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = externalServiceIntegrationDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}