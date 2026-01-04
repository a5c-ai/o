import { withQualityGatedIterativeDevelopment } from "../aspects/quality_gated_iterative";
import { withCodeDocumentation } from "../aspects/code_documentation";
import { withPerformanceOptimization } from "../aspects/performance_optimization";
import { withErrorHandling } from "../aspects/error_handling";
import { withSecurity } from "../aspects/security";
import { withLogging } from "../aspects/logging";
import { withTestDrivenDevelopment } from "../aspects/test_driven";
import { withSpecDrivenDevelopment } from "../aspects/spec_driven";
import { withResearchBeforeDevelopment } from "../aspects/research_driven";
import { withTopDownDevelopment } from "../aspects/top_down";

export const backendDevelop = (basicDevelopmentFunction) => {
    return (task,context) => {
        // implement backend
        let developmentFunction = basicDevelopmentFunction;
        
        // aspects
        developmentFunction = withQualityGatedIterativeDevelopment(developmentFunction);
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

