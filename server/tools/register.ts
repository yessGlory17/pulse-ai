import { tool } from "ai";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { cookies, headers } from "next/headers";

export const registerEndpoint = tool({
  description:
    "Sisteme yeni bir endpoint (bilgisayar) kaydetmek icin bu tool kullanilmalidir. Bu tool cagirildiktan sonra kullaniciya bir kurulum tokeni donecektir. Kurulum tokenini calistirmasi icin ``python python3 cli.py --reigster <token>`` komutu calistirmasi soylenmelidir.",
  parameters: z.object({
  }),
  execute: async () => {
    const header = await headers();
    const host = header.get("x-forwarded-host") || header.get("host");
    const protocol = header.get("x-forwarded-proto") || "https";

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    const response = await fetch(
      `${protocol}://${host}/api/endpoint/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken && {
            Cookie: `next-auth.session-token=${sessionToken}`,
          }),
        },
      }
    );

    const data = await response.json();
    return data;
  },
});
