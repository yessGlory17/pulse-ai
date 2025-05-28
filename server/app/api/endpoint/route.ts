import { connectToDatabase } from "~/lib/mongo";
import authOptions from "~/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Endpoint from "~/models/endpoint.model";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user.id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const results = await Endpoint.find({ user: session.user.id });

    return NextResponse.json(
      { status: "success", data: results },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET ALL TASKS ERROR: ", error);
    return NextResponse.json(
      { status: "error", message: "Error" },
      { status: 500 }
    );
  }
}