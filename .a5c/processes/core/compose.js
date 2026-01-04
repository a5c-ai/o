export const applyMiddlewares = (baseDevelop, ...middlewares) => {
  return middlewares.reduceRight((next, middleware) => middleware(next), baseDevelop);
};

export const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((value, fn) => fn(value), input);

