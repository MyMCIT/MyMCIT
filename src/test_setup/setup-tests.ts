import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// //jest.mock(...) is used to automatically mock the axios module.jest.mock('axios');
// // Create an object of type of mocked Axios.
// vitest.mock("axios");
// export const mockedAxios = axios as jest.Mocked<typeof axios>;
