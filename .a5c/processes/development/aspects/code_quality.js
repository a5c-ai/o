import { aspectWrapper } from "./aspect_wrapper";
export const withRefactoring = (developFn) => aspectWrapper("refactoring",developFn);
export const withCodeDocumentation = (developFn) => aspectWrapper("in-code documentation",developFn);
export const withPerformanceOptimization = (developFn) => aspectWrapper("performance optimization",developFn);
export const withErrorHandling = (developFn) => aspectWrapper("error handling",developFn);

