import "./App.css";
import Editor from "./editor";
import { ExtensionContextProvider } from "./extension-context";
import React from "react";

function App() {
  return (
    <>
      <ExtensionContextProvider>
        <Editor></Editor>
      </ExtensionContextProvider>
    </>
  );
}

export default App;
