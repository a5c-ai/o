const dataEngineeringDevelop = (basicDevelopmentFunction) => {
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


export const implementETLProcesses = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = dataEngineeringDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

export const implementDataStore = (task,context,basicDevelopmentFunction) => {
    const developmentFunction = dataEngineeringDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}
