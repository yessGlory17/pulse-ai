import { tool } from "ai";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { cookies, headers } from "next/headers";

export const getEndpoints = tool({
  description:
    "Sisteme kayitli olan tum endpointleri (bilgisayarlari) listeler.",
  parameters: z.object({}),
  execute: async () => {
    // const session = await getSession();
    const header = await headers();
    const host = header.get("x-forwarded-host") || header.get("host");
    const protocol = header.get("x-forwarded-proto") || "https";

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    const response = await fetch(
      `${protocol}://${host}/api/endpoint`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken && {
            Cookie: `next-auth.session-token=${sessionToken}`,
          }),
        },
      }
    );

    const data = await response.json();
    console.log("ENDPOINT LIST: ", data)
    return data;
  },
});