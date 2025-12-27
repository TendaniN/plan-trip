import { useState } from "react";
import "./app.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </MantineProvider>
  );
};

export default App;
