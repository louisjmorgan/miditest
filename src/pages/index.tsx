import Image from "next/image";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";

import * as navigator from "jzz";

import { JZZ } from "jzz";
import useKeys from "@/model/useKeys";
import ConsoleEmulator from "@/components/ConsoleEmulator";

const inter = Inter({ subsets: ["latin"] });

const setupJZZ = async () => {
  const midi = await JZZ();
  const port = await midi.openMidiOut(1);
  return port;
};

export default function Home() {
  const JZZPort = useRef<any>();
  useEffect(() => {
    navigator.requestMIDIAccess().then(
      (e) => console.log(e, "success"),
      (e) => console.log(e, "fail")
    );
    // ...

    setupJZZ().then((port) => (JZZPort.current = port));

    return () => {
      navigator.close();
    };
  }, []);

  const playNoteOn = useCallback(async (note: number) => {
    if (!JZZPort.current) return;
    console.log("play note", note);

    const port = await JZZPort.current;
    port.send([0x90, note, 127]); // note on
  }, []);

  const playNoteOff = useCallback(async (note: number) => {
    if (!JZZPort.current) return;
    console.log("play note", note);

    const port = await JZZPort.current;
    port.send([0x90, note, 0]); // note on
  }, []);

  const playNoteTime = useCallback(async (note: number, wait: number) => {
    const port = await JZZPort.current;
    port.send([0x90, note, 127]).wait(wait).send([0x90, note, 0]); // note on
  }, []);

  const flushNotes = useCallback(async () => {
    if (!JZZPort.current) return;
    const port = await JZZPort.current;
    port.allSoundOff(0);
  }, []);

  const [state, setState] = useState({
    editing: {
      name: false,
      node: false,
      modal: false,
    },
  });

  const output = useKeys(
    state,
    playNoteOn,
    playNoteOff,
    flushNotes,
    playNoteTime,
    () => null
  );

  return (
    <main
    // className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ConsoleEmulator value={output.map((e) => e.key).join("")} />
    </main>
  );
}
