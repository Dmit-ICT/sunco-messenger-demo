import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { passControl, sendMessage } from './src/sunshine-util.js'

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));

const allowedOrigins = process.env.CORS_ALLOW_URL.split(',');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get("/", (req, res) => {
    res.status(200).send({ success: true });
})

app.post("/messages", messageHandler)

async function messageHandler(req, res) {

    console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));

    try {

        // Ignore v1 webhooks
        if (req.body.version) {
            console.log("Old version webhooks are received. Please use v2 webhooks.");
            return res.end();
        }

        const trigger = req.body.events[0].type;
        const author = req.body.events[0].payload.message?.author?.type;
        const metadata = req.body.events[0].payload.message?.metadata;

        // Ignore if it is not a user message
        if (trigger !== "conversation:message" || author !== "user") {
            return res.end();
        }

        // Optional, send auto message to customer when error ocurr
        if (metadata?.type === 'error_message') {
            // await sendMessage(req, "Testing");
        }

        await passControl(req, res);

    } catch (err) {
        console.log(err)
        res.status(500).send(err.message);
    }
}

app.listen(process.env.PORT, () => {
    console.log('Server started on port ', process.env.PORT);
})