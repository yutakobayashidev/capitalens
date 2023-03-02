"use client";

import Cloud from "react-d3-cloud";

export default function WordCloud() {
  const data = [
    { text: "Hey", value: 1000 },
    { text: "lol", value: 200 },
    { text: "first impression", value: 800 },
    { text: "very cool", value: 1000000 },
    { text: "duck", value: 10 },
  ];

  return (
    <>
      <Cloud
        width={200}
        height={100}
        data={data}
        font="meiryo"
        fontWeight={700}
        rotate={0}
        padding={5}
      />
    </>
  );
}
