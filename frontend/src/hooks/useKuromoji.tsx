"use client";

import * as kuromoji from "kuromoji";
import { useEffect, useRef, useState } from "react";

export function useKuromoji() {
  const [isTokenizerReady, setIsTokenizerReady] = useState(false);
  const tokenizerInstanceRef =
    useRef<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>();

  useEffect(() => {
    kuromoji.builder({ dicPath: "/dict" }).build((err, tokenizer) => {
      if (err) {
        console.log(err);
      } else {
        tokenizerInstanceRef.current = tokenizer;
        setIsTokenizerReady(true);
      }
    });
  }, []);

  return { isTokenizerReady, tokenizer: tokenizerInstanceRef.current };
}
