import Chat from "./Chat";
import { auth } from "@auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "チャット",
};

export default async function Page() {
  const sparqlQuery = `
  SELECT ?person ?personLabel ?start ?end 
  WHERE {
    ?person wdt:P39 wd:Q274948;
            p:P39 ?statement.
    ?statement ps:P39 wd:Q274948.
    OPTIONAL { ?statement pq:P580 ?start. }
    OPTIONAL { ?statement pq:P582 ?end. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "ja" }
  }
  ORDER BY DESC(?start)
  `;

  const url = "https://query.wikidata.org/sparql";

  const fetchPromise = fetch(
    url + "?query=" + encodeURIComponent(sparqlQuery),
    {
      headers: {
        Accept: "application/sparql-results+json",
      },
      next: {
        revalidate: 2592000,
      },
    }
  );

  const sessionPromise = auth();
  const [response, session] = await Promise.all([fetchPromise, sessionPromise]);

  const data = await response.json();

  return (
    <Chat
      user={session?.user}
      president={data.results.bindings[0].personLabel.value}
    />
  );
}
