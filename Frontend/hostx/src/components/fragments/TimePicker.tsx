import React from "react";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export function TimePickerwithRange({}: React.HTMLAttributes<HTMLDivElement>) {
  const [picktime, setPicktime] = useState("10:00");

  return (
    <div>
      <TimePicker
        onChange={(value) => setPicktime(value!.toString())}
        value={picktime}
      />
    </div>
  );
}
