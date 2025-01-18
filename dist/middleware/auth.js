"use strict";
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { ExtendedError, Socket } from "socket.io";
// export default function authenticate(req: Request, res: Response, next: NextFunction) {
//     const authHeader = (req.headers as any)?.authorization || null;
//     if (!authHeader) {
//         res.status(401).json({ 
//             status: "error", 
//             message: "Authorization token missing" 
//         });
//         return;
//     }
//     const token = authHeader.split(" ")[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
//         req.body.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.error("Error in authenticate:", error);
//         res.status(401).json({ 
//             status: "error", 
//             message: "Invalid or expired token" 
//         });
//     }
// }
// export function socketAuthenticate(socket: Socket, next: (err?: ExtendedError) => void) {
//     const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
//     if (!token) {
//         const err = new Error('Authorization token missing');
//         return next(err);
//     }
//     try {
//         const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "default_secret");
//         socket.data.user = decoded;
//         next();
//     } catch (error) {
//         const err = new Error("Unauthorized");
//         return next(err);
//     }
// }
