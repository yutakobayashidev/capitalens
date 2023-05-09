import assert from "node:assert";
import { ApolloServer } from "@apollo/server";
import { NextResponse } from "next/server";
import prisma from "@src/lib/prisma";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

const typeDefs = `
  type Views {
    count: BigInt
    name: String
  }

  type Query {
    Views: [Views]
  }
`;

const resolvers = {
  Query: {
    Views: () => prisma.views.findMany(),
  },
};
const server = new ApolloServer({
  resolvers: {
    ...scalarResolvers,
    ...resolvers,
  },
  typeDefs: [...scalarTypeDefs, typeDefs],
});

export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();
  const res = await server.executeOperation({ query: json.query });
  assert(res.body.kind === "single");
  return NextResponse.json(res.body.singleResult);
}
