import { tool } from "ai";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { cookies, headers } from "next/headers";

export const getProcessListByID = tool({
  description:
    "Endpoint idsiyle bilgisayarda en çok kaynak kullanan süreçleri getirir. Cevap olarak processleri dondurur.",
  parameters: z.object({
    // metric: z.enum(['cpu', 'memory']).describe('Kullanım metriği: cpu veya memory'),
    limit: z
      .number()
      .min(1)
      .max(20)
      .default(5)
      .describe("Döndürülecek maksimum işlem sayısı."),
    sort_by: z
      .enum(["cpu", "memory"])
      .describe("'cpu' veya 'memory' değerlerinden birine gore siralama yapar"),
    order: z
      .enum(["asc", "desc"])
      .describe("'asc' (artan) veya 'desc' (azalan) sıralama yönü."),
    id: z.string().describe("Her bir bilgisayarin idsidir"),
  }),
  execute: async ({ id, limit, sort_by, order }) => {
    console.log("GET PROCESS BY ID TOOLU CALISTI: ", id);
    // const session = await getSession();
    const header = await headers();
    const host = header.get("x-forwarded-host") || header.get("host");
    const protocol = header.get("x-forwarded-proto") || "https";

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const response = await fetch(
      `http://${host}:${protocol}/api/endpoint/${id}/command`,
      {
        method: "POST",
        body: JSON.stringify({
          command: "collect_processes",
          limit,
          sort_by,
          order,
          //   user_id: session?.user.id,
        }),
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken && {
            Cookie: `next-auth.session-token=${sessionToken}`,
          }),
        },
      }
    );

    const data = await response.json();
    console.log("PROCESS TOOL CEVABI: ", data, id);
    return data;
  },
});
