"use client";

import { convertSecondsToTime } from "@src/helper/utils";
import { useCallback, useState } from "react";

export const useShareTimeInput = (initialTime: number) => {
  const [inputValue, setInputValue] = useState<string>(
    convertSecondsToTime(initialTime)
  );
  const [currentShareTime, setShareTime] = useState<number>(initialTime);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9:]/g, "");
    setInputValue(filteredValue);
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setInputValue(convertSecondsToTime(0));
      setShareTime(0);
      return;
    }

    const parts = inputValue.split(":").reverse();

    if (parts.length > 3 || parts.length < 1) {
      alert("時間のフォーマットが不正です。");
      setShareTime(0);
      setInputValue(convertSecondsToTime(0));
      return;
    }

    let totalTimeInSeconds = 0;

    for (let i = 0; i < parts.length; i++) {
      totalTimeInSeconds += Number(parts[i]) * Math.pow(60, i);
    }

    setShareTime(totalTimeInSeconds);
    setInputValue(convertSecondsToTime(totalTimeInSeconds));
  };

  const initializeInputValue = useCallback((time: number) => {
    setInputValue(convertSecondsToTime(time));
    setShareTime(time);
  }, []);

  return {
    currentShareTime,
    handleBlur,
    handleChange,
    initializeInputValue,
    inputValue,
    setInputValue,
  };
};
