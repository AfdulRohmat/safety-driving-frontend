// /services/auth.ts
import Cookies from 'js-cookie';
import { NextRequest, NextResponse } from 'next/server';

export const login = async (email: string, password: string): Promise<{ status: any, data: any, error: any }> => {

    let status = null
    let data = null
    let error = null

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password }),
        });

        const dataResponse = await response.json();

        console.log(dataResponse)

        data = dataResponse.data
        status = response.status

        const token = data.accessToken;

        const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
        Cookies.set('token', token, { expires: inFifteenMinutes });

    } catch (error: any) {
        console.log("error :", error)
        error = error.message
    }
    return { status, data, error };
};

export const logout = async (req: NextRequest) => {
    Cookies.remove('token')

    return NextResponse.redirect(new URL('/login', req.url));
}
