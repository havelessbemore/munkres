/* eslint-disable @typescript-eslint/no-var-requires */
const { matchAsync } = require("../..");

const fns = { match: matchAsync };

addEventListener("message", async (e) => {
  const { name, args } = e.data;
  try {
    if (name == null) {
      throw new Error(`Function not specified`);
    }
    if (fns[name] == null) {
      throw new Error(`Unknown function '${name}'`);
    }
    const res = await Promise.resolve(fns[name](...args));
    postMessage({ name, res });
  } catch (err) {
    postMessage({ name, err });
  }
});
