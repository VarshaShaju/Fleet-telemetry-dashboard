import "@testing-library/jest-dom";

let origError: typeof console.error;

beforeEach(() => {
  origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      args.some(
        a =>
          typeof a === "string" &&
          a.includes("ReactDOMTestUtils.act is deprecated")
      )
    ) {
      return;
    }
    origError(...(args as []));
  };
});

afterEach(() => {
  console.error = origError;
});
