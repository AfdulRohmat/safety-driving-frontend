// /utils/api.ts
import Cookies from 'js-cookie';

interface ApiOptions {
    method?: string;
    body?: any;
    token?: string;
}

export const fetchApi = async (endpoint: string, { method = 'GET', body }: ApiOptions = {}) => {
    const token = Cookies.get('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let status = null
    let data = null
    let error = null
    let errorResponse = null

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseData = await response.json()
        if (responseData.statusCode === 200 || responseData.statusCode === 201) {
            data = responseData.data
        } else {
            error = responseData.error
            errorResponse = responseData
        }
        status = responseData.statusCode

        console.log(`${endpoint} :`, responseData.statusCode)

    } catch (error: any) {
        error = error
    }

    return { status, data, error, errorResponse };

};


