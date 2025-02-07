import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "../../../firebase-admin";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        console.log("Unauthorized - Redirecting to home");
        return NextResponse.redirect(new URL("/", req.url));
    }

    const { sessionClaims } = await auth();
    const { room } = await req.json();

    const session = liveblocks.prepareSession(
        sessionClaims?.email as string,
        {
            userInfo: {
                name: sessionClaims?.fullName as string || "",
                email: sessionClaims?.email as string || "",
                avatar: sessionClaims?.image as string || "",
            }
        }
    );

    const roomQuery = await adminDb
        .collection("rooms")
        .where("userId", "==", sessionClaims?.email)
        .get();

    const userInRoom = roomQuery.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();
        console.log("Authorized", room, status);
        return new Response(body, { status });
    } else {
        return NextResponse.json(
            { message: "User already in room / room not found" },
            { status: 403 }
        );
    }
}