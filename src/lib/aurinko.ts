// Desc: Aurinko service API
"use server";
import { auth } from "@clerk/nextjs/server"
import axios from 'axios'

type ServiceType = 'Google' | 'Office365' | 'iCloud'

export async function getAurinkoAuthUrl(serviceType: ServiceType) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType,
        scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
        responseType: "code",
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/aurinko/callback`,
    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}


export async function getToken(code: string) {
    try {
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
            auth: {
                username: process.env.AURINKO_CLIENT_ID as string,
                password: process.env.AURNIKO_CLIENT_SECRET as string
            }
        })

        return response.data as {
            accountId: number,
            accessToken: string,
            userId: string,
            userSession: string
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("get token error",error.response?.data)
        } 
        console.error("get token error",error)
    }
}

type AccountDetails = {
    email: string;
    name: string;
}

export async function getAccountInfo(accessToken: string): Promise<AccountDetails> {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        return response.data as AccountDetails;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw new Error('Failed to fetch account information');
    }
}