import OSC from "osc-js";

const config = {
  udpClient: {
    port: 57110,
    host: "127.0.0.1",
  },
  wsServer: {
    port: 8080,
  },
};

const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.open();
console.log(
  "OSC Bridge running on ws://localhost:8080 -> udp://127.0.0.1:57110"
);
