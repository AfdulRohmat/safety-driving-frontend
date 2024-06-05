import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const customJwtDecode = () => {
    const token = Cookies.get('token');
    let data = null

    if (token) {
        data = jwtDecode(token);
    }

    console.log("jwtDecode: ", data)

    return data;
}