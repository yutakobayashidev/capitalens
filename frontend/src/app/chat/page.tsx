import { auth } from "@auth";
import { Country } from "@src/types/country";
import type { Metadata } from "next";

import Chat from "./Chat";

export const metadata: Metadata = {
  title: "チャットAI",
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

  const presidentPromise = fetch(
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

  const countriesPromise = fetch(
    "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
  );

  const sessionPromise = auth();
  const [response, session, countries_flag] = await Promise.all([
    presidentPromise,
    sessionPromise,
    countriesPromise,
  ]);
  const president_data = await response.json();
  const countries: Country[] = await countries_flag.json();

  return (
    <Chat
      user={session?.user}
      countries={countries}
      president={president_data.results.bindings[0].personLabel.value}
    />
  );
}
