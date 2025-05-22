

import axios from "./axios";

const url = 'Login';

export const login = async (email: string, password: string) => {
    const response = await axios.post<{ token: string }>(url + '/login', {
        email,
        password
    });

    return response; 
};
