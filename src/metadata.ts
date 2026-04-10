/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger/plugin": { "models": [[import("./auth/dto/login.dto"), { "LoginDto": { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String } } }], [import("./auth/dto/register.dto"), { "RegisterDto": { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 8 } } }], [import("./auth/dto/token-response.dto"), { "TokenResponseDto": { accessToken: { required: true, type: () => String } } }]], "controllers": [[import("./auth/auth.controller"), { "AuthController": { "register": {}, "login": {} } }]] } };
};