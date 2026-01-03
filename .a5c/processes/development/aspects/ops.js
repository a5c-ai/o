import { aspectWrapper } from "./aspect_wrapper";

export const withMonitoring = (developFn) => aspectWrapper("monitoring",developFn);
export const withContinousDelivery = (developFn) => aspectWrapper("continous delivery",developFn);
export const withLogging = (developFn) => aspectWrapper("logging",developFn);
export const withSecurity = (developFn) => aspectWrapper("security",developFn);
export const withCompliance = (developFn) => aspectWrapper("compliance",developFn);
