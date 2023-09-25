import React, { Component, useEffect, useState } from "react";
import Terminal from "../../react-console-emulator/src/Terminal";

const commands = {
  echo: {
    description: "Echo a passed string.",
    usage: "echo <string>",
    fn: (...args: string[]) => args.join(" "),
  },
};

const ConsoleEmulator = ({ value }: { value: string }) => {
  const [processCommand, setProcessCommand] = useState<() => void>();

  return (
    <>
      <button onClick={() => processCommand && processCommand()}>
        Process
      </button>
      <Terminal
        commands={commands}
        welcomeMessage={"Welcome to the React terminal!"}
        promptLabel={"me@React:~$"}
        value={value}
        setProcessCommand={setProcessCommand}
      />
    </>
  );
};

export default ConsoleEmulator;
