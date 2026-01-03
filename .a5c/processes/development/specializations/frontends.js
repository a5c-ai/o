export const frontendDevelop = (basicDevelopmentFunction) => {
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
        if(context.scope.security_handling) {
            developmentFunction = withSecurity(developmentFunction);
        }
        if(context.scope.compliance_handling) {
            developmentFunction = withCompliance(developmentFunction);
        }
        if(context.scope.continous_delivery) {
            developmentFunction = withContinousDelivery(developmentFunction);
        }
        if(context.scope.refactoring_after_development) {
            developmentFunction = withRefactoring(developmentFunction);
        }
        return developmentFunction(task,context);
    }
}


export const implementDesktopFrontend = (task,context,basicDevelopmentFunction) => {    
    const developmentFunction = frontendDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

export const implementMobileFrontend = (task,context,basicDevelopmentFunction) => {    
    const developmentFunction = frontendDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

export const implementWebFrontend = (task,context,basicDevelopmentFunction) => {    
    const developmentFunction = frontendDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

export const implementCLI = (task,context,basicDevelopmentFunction) => {    
    const developmentFunction = frontendDevelop(basicDevelopmentFunction);
    return developmentFunction(task,context);
}

