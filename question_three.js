// 3. Resource Pooling

import genericPool from "generic-pool";

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
