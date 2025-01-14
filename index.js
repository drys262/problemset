// solutions here

import { RandStream, asyncOp } from "./lib/lib";
import { EventEmitter } from "events";
import genericPool from "generic-pool";

// 1. Asynchronous Operations

let inputs = ["A", ["B", "C"], "D"];

const doAsync = async arr => {
  for (const value of arr) {
    if (!Array.isArray(value)) await asyncOp(value);
    else await Promise.all(value.map(v => asyncOp(v)));
  }
};

doAsync(inputs);

// 2. Streams

class RandStringSource extends EventEmitter {
  constructor(randStream) {
    super();
    randStream.on("data", data =>
      data
        .split(".")
        .filter(value => value !== "")
        .slice(0, -1)
        .forEach(value => this.emit("data", value))
    );
  }
}

let source = new RandStringSource(new RandStream());
source.on("data", data => {
  console.log(data);
});

// 3. Resource Pooling

class Resource {
  constructor(index) {
    this.index = index;
  }
  release = ({ pool }) => {
    pool.release(this);
  };
}

class ResourceManager {
  constructor(count) {
    this.count = count;
    let index = 1;
    const factory = {
      create: () => {
        return new Promise((resolve, reject) => resolve(new Resource(index++)));
      },
      destroy: res => {}
    };
    const opts = {
      max: count,
      min: count
    };
    this.pool = genericPool.createPool(factory, opts);
  }

  borrow = async callback => {
    const res = await this.pool.acquire();
    callback(res);
  };
}

const pool = new ResourceManager(2);

const timestamp = Date.now();

pool.borrow(res => {
  console.log("RES: 1");
  setTimeout(() => {
    res.release(pool);
  }, 500);
});

pool.borrow(res => {
  console.log("RES: 2");
});

pool.borrow(res => {
  console.log("RES: 3");
  console.log("DURATION: " + (Date.now() - timestamp));
});
