import http from "../utils/http";

export type LoginParams = {
    username: string;
    password: string;
};

export const LoginAPI = {
    login: async (params: LoginParams) => {
        const res = await http.post("/api/Auth", params);
        return res.data;
    },
}