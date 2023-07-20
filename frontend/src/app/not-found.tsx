import { Metadata } from "next";
import Link from "next/link";

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
          <Link
            href="/"
            className="mb-10 inline-block rounded-md border border-gray-100 bg-white px-4 py-2 font-semibold text-gray-700 shadow transition duration-500 hover:shadow-md"
          >
            ホームに戻る -&gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
