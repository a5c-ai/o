const infrastructureDevelop = (basicDevelopmentFunction) => {   
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

export const implementInfrastructure = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = infrastructureDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}
