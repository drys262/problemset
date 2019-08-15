// 1. Asynchronous Operations

import { RandStream, asyncOp } from "./lib/lib";

let inputs = ["A", ["B", "C"], "D"];
const doAsync = async arr => {
  for (const value of arr) {
    if (!Array.isArray(value)) await asyncOp(value);
    else await Promise.all(value.map(v => asyncOp(v)));
  }
};
doAsync(inputs);
