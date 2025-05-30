import { getServerSession } from "next-auth";
import { connectToDatabase } from "~/lib/mongo";
import User from "~/models/user.model";
import { NextResponse } from "next/server";
import Endpoint from "~/models/endpoint.model";
import authOptions from "~/lib/authOptions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { command, limit, sort_by, order } = await request.json();
    const id = (await params).id;

    console.log("COMMAND HANDLERINE ISTEK ULASTI: ", { command, id });

    await connectToDatabase();

    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user.id);

    console.log("USER BULUNDU: ", user);

    if (user) {
      const endpoint = await Endpoint.findById(id);

      if (endpoint) {
        //command => tool | 'collect_processes', 'find_process', 'collect_network' vs...

        let io = global.io;
        console.log("GLOBAL IO: ", {isHave: !!io})
        try {
          const command_response = await new Promise((resolve, reject) => {
            io.timeout(5000)
              .to(id)
              .emit(
                "tool_call",
                { command, limit, sort_by, order },
                (err, response) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(response);
                  }
                }
              );
          });

          console.log("TOOL CALL RESPONSE 2: ", command_response);

          return NextResponse.json({
            status: "success",
            message: command_response,
          });
        } catch (e) {
          return NextResponse.json({
            status: "error",
            message: e,
          });
        }
      } else {
        return NextResponse.json(
          { status: "error", message: "Endpoint not found!" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ status: "error", message: "User not found!" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error },
      { status: 500 }
    );
  }
}
