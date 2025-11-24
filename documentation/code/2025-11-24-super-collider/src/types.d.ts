declare module "osc-js" {
  export default class OSC {
    constructor(options?: any);
    open(options?: any): void;
    send(message: Message): void;
    on(address: string, callback: (message: Message) => void): void;
    static Message: typeof Message;
    static WebsocketClientPlugin: typeof WebsocketClientPlugin;
    static BridgePlugin: any;
  }

  export class Message {
    constructor(address: string, ...args: any[]);
    args: any[];
  }

  export class WebsocketClientPlugin {
    constructor(options?: any);
  }
}
