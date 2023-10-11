import Button from "@src/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function Page() {
  return (
    <div className="my-12">
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        <h1 className="text-center text-9xl font-bold">404</h1>
        <div className="text-center">
          <img
            src="/undraw_Synchronize_re_4irq.png"
            alt="Synchronize"
            width="432"
            className="mx-auto mb-4"
            height="308"
          />
          <Button title="ホームに戻る ->" pathname="/" />
        </div>
      </div>
    </div>
  );
}
