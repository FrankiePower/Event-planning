import React from "react";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export function TimePickerwithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [picktime, setPicktime] = useState("10:00");

  return (
    <div>
      <TimePicker onChange={setPicktime} value={picktime} />
    </div>
  );
}
