import { getAccountInfo, getToken } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const params = req.nextUrl.searchParams;
    const status = params.get("status");

    if (status !== "success") {
        return NextResponse.json({ success: false, error: "Failed to link account" }, { status: 400 });
    }

    // Link account

    const code = params.get("code");
    if (!code) {
        return NextResponse.json({ success: false, error: "Missing code" }, { status: 400 });
    }

    const token = await getToken(code);
    if (!token) {
        return NextResponse.json({ success: false, error: "Failed to get token" }, { status: 400 });
    }

    const accountDetails = await getAccountInfo(token.accessToken);
    if (!accountDetails) {
        return NextResponse.json({ success: false, error: "Failed to get account details" }, { status: 400 });
    }

    await db.account.upsert({
        where: {
            id: token.accountId.toString()
        },
        update: {
            accessToken: token.accessToken,
        },
        create: {
            id: token.accountId.toString(),
            userId,
            accessToken: token.accessToken,
            email: accountDetails.email,
        }
    })

    return NextResponse.redirect(new URL("/mail", process.env.NEXT_PUBLIC_BASE_URL).toString());
}
