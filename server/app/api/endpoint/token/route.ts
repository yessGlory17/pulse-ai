import { getServerSession } from "next-auth";
import { connectToDatabase } from "~/lib/mongo";
import authOptions from "~/lib/authOptions";
import User from "~/models/user.model";
import { NextResponse } from "next/server";
import Endpoint from "~/models/endpoint.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.REGISTER_TOKEN_SECRET ?? "secret";

export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const host = headers.get("x-forwarded-host") || headers.get("host");
    const protocol = headers.get("x-forwarded-proto") || "https";

    const fullUrl = `${protocol}://${host}`;
    console.log("HOST: ", fullUrl);


    await connectToDatabase();

    const session = await getServerSession(authOptions);

    console.log("SESSION : ", session);

    const user = await User.findById(session?.user.id);

    console.log("USER BULUNDU: ", user);

    if (user) {
      //   const result = await Endpoint.insertOne(newVault);
      console.log("HOST: ", host);
      //   console.log("RESULT: ", result);

      const payload = {
        // id: result?._id,
        owner: user.id,
        target: fullUrl,
      };

      console.log("PAYLOAD: ", payload);

      const token = jwt.sign(payload, JWT_SECRET);

      console.log("TOKEN : ", token);

      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ status: "error", message: "User not found!" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error },
      { status: 500 }
    );
  }
}
