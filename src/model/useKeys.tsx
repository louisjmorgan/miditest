import { useState, useEffect } from "react";

const DISALLOWED_KEYS: string[] = ["Control", "Shift"];
// Object.values({}).forEach((command: any) => {
//   const array = command.split(",");
//   array.forEach((entry: any) => DISALLOWED_KEYS.push(entry));
// });

const useKeys = (
  state: any,
  playNoteOn: (note: number) => void,
  playNoteOff: (note: number) => void,
  flushNotes: () => void,
  playNoteTime: (note: number, wait: number) => void,
  processCommand: () => void
) => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const [output, setOutput] = useState<KeyboardEvent[]>([]);

  useEffect(() => {
    const onFocus = () => {
      flushNotes();
      setPressedKeys([]);
    };

    const onBlur = () => {
      flushNotes();
      setPressedKeys([]);
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Calls onFocus when the window first loads
    onFocus();
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e);
      e.preventDefault();

      if (!playNoteOff || !playNoteOn) return;

      const key = e.key;

      if (key === "Enter") {
        // processCommand();
        console.log("process command");
        return;
      }

      if (key === "Backspace") {
        const last = output.slice(-1);
        if (!last || last.length === 0) return;
        playNoteTime(Number(last[0].which) % 127, 100);
        setOutput((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "Shift") {
        return;
      }

      if (e.repeat) {
        return;
      }

      if (state.editing.modal) return;

      // && !pressedKeys.includes(key)
      if (!DISALLOWED_KEYS.includes(key)) {
        console.log(e);
        playNoteOn(Number(e.which) % 127);
        if (!state.editing) e.preventDefault();
        // setPressedKeys((previousPressedKeys) => [...previousPressedKeys, key]);
        setOutput((prev) => [...prev, e]);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (state.editing.modal) return;

      const key = e.key;
      console.log(e);
      if (!DISALLOWED_KEYS.includes(key)) {
        playNoteOff(Number(e.which) % 127);
        // setPressedKeys((previousPressedKeys) =>
        //   previousPressedKeys.filter((k) => k !== key)
        // );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [state.editing, playNoteOff, playNoteOn, processCommand]);

  return output;
};

export default useKeys;
