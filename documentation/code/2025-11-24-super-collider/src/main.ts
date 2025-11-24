import OSC from "osc-js";
import "./style.css";

const osc = new OSC({ plugin: new OSC.WebsocketClientPlugin({ port: 8080 }) });
osc.open();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>SuperCollider Control</h1>
    <div class="card">
      <button id="btn-440">Play 440Hz</button>
      <button id="btn-880">Play 880Hz</button>
      <button id="btn-random">Random</button>
    </div>
    <p>Make sure 'node bridge.js' is running and 'setup.scd' is executed in SuperCollider.</p>
  </div>
`;

const sendFreq = (freq: number) => {
  const message = new OSC.Message("/play", freq);
  osc.send(message);
};

document
  .querySelector("#btn-440")
  ?.addEventListener("click", () => sendFreq(440));
document
  .querySelector("#btn-880")
  ?.addEventListener("click", () => sendFreq(880));
document
  .querySelector("#btn-random")
  ?.addEventListener("click", () => sendFreq(200 + Math.random() * 800));
