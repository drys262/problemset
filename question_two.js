// 2. Streams

import { EventEmitter } from "events";
import { RandStream } from "./lib/lib";

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
