import { db } from "@/server/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { data } = await req.json();
    console.log(data)
    const id = data.id
    const email = data.email_addresses[0].email_address
    const firstName = data.first_name
    const lastName = data.last_name
    const imageUrl = data.image_url

    console.log(email, firstName, lastName, imageUrl)
    const user = await db.user.create({
        data: {
            id,
            email,
            firstName,
            lastName,
            imageUrl
        }
    })

    return Response.json({ success: true, message: "User created" });
}