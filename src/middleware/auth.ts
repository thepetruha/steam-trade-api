import { NextFunction, Request, Response } from "express";

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = (req.headers as any)?.authorization || null;

    if (!authHeader) {
        res.status(401).json({ 
            status: "error", 
            message: "Authorization token missing" 
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    //     req.body.userId = decoded.userId;
    //     next();
    // } catch (error) {
    //     console.error("Error in authenticate:", error);
    //     res.status(401).json({ 
    //         status: "error", 
    //         message: "Invalid or expired token" 
    //     });
    // }
}