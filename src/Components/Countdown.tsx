import React, { useEffect, useState } from "react";

const Countdown = () => {
  const targetDate = new Date("2024-11-05T18:00:00-05:00");

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div style={{ fontSize: "40px", fontWeight: 100 }}>
        <span style={{ marginRight: "5px" }}>
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span style={{ marginRight: "5px" }}>:</span>
        <span style={{ marginRight: "5px" }}>
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span style={{ marginRight: "5px" }}>:</span>
        <span style={{ marginRight: "5px" }}>
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span style={{ marginRight: "5px" }}>:</span>
        <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
      to lock-in
    </div>
  );
};

export default Countdown;
