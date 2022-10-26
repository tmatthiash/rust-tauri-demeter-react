import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const listener = listen('got-udp', (e) => {
    const bits = e.payload.data;
    const bytesToBitsArray = bits.map((byte) => {
      const bitsWithOutLeadingZeros = byte.toString(2);
      const bitsWithLeadingZeros =
        "00000000".substr(bitsWithOutLeadingZeros.length) +
        bitsWithOutLeadingZeros;
        return bitsWithLeadingZeros;
    })
    const combinedBits = bytesToBitsArray.join("");
    const splitArray = combinedBits.match(/.{1,32}/g);
    const splitWithLineBreaks = splitArray.map((x, i) => `Row ${i}: ` + x +'\n');
    const reCombinedBits = splitWithLineBreaks.join("");

    const para = document.getElementById("buffer-msg");
    para.innerHTML = reCombinedBits;
    // bufferMsgEl.textContent = splitWithLineBreaks;
  })

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      {/* <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div> */}

      <p>{greetMsg}</p>
      <p id="buffer-msg"></p>
    </div>
  );
}

export default App;
