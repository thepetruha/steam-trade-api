import { Response } from "express";

export enum Status {
    Ok = 200,
    InternalServerError = 500,
    NotFound = 404,
    BadRequest = 400,
    NoAuthorization = 401
}

class Handler {
    public response(res: Response, status: number | Status, data: any, message?: string) {
        const s = (status === 200 || status === 201) ? "ok" : "error";
        res.status(status).json({
            status: s,
            message,
            data 
        });
    }
}

export default Handler;