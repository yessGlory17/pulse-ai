import { connectToDatabase } from "~/lib/mongo";
import authOptions from "~/lib/authOptions";
import { getServerSession } from "next-auth";
import User from "~/models/user.model";
import Endpoint from "~/models/endpoint.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { hostname, username, owner } = body;

    console.log("WORKSAPCE BODY: ", { hostname, username, owner });

    await connectToDatabase();

    const session = await getServerSession(authOptions);

    console.log("SESSION : ", session);

    const user = await User.findById(owner);

    console.log("USER BULUNDU: ", user);

    if (user) {
      const endpoint = {
        hostname,
        username,
        user: user.id,
      };

      console.log("ENDPOINT PAYLOAD: ", endpoint)

      const result = await Endpoint.insertOne(endpoint);

      console.log("RESULT: ", result);

      return NextResponse.json({ status: "success", id: result?._id });
    }

    return NextResponse.json({ status: "error", message: "User not found!" });
  } catch (error) {
    return NextResponse.json({ status: "error", message: error });
  }
}

//alinan token ile buraya kayit istegi yapacak
//hostname, username, localip, gibi bilgiler gonderecek.
