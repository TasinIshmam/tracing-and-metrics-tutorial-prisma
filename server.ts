import { PrismaClient } from "@prisma/client";
import express, { request, Request, response, Response } from "express";

const app = express();
const port = 4000;

const prisma = new PrismaClient({});

app.get("/users/random", async (_req: Request, res: Response) => {
    try {
        let users = await prisma.user.findMany({
            include: {
                posts: true
            }
        });

        // select 10 users randomly 
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        const selectedUsers = shuffledUsers.slice(0, 10);

        res.status(200).json(selectedUsers);
    } catch (e) {
        res.status(500).json({ error: 500, details: e });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});
