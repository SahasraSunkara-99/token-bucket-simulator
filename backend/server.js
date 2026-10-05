const express = require("express");
const cors = require("cors");
const path = require("path");

const TokenBucket =
    require("./tokenBucket");


const app = express();

const PORT = 3000;


const bucket =
    new TokenBucket(5, 2);


// Middleware

app.use(cors());

app.use(express.json());


// Serve frontend

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


// ==========================================
// GET CURRENT STATE
// ==========================================

app.get(
    "/api/state",
    (req, res) => {

        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// CONFIGURE BUCKET
// ==========================================

app.post(
    "/api/config",
    (req, res) => {

        const {
            capacity,
            rate
        } = req.body;


        bucket.configure(
            capacity,
            rate
        );


        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// GENERATE ONE TOKEN
// ==========================================

app.post(
    "/api/generate",
    (req, res) => {

        bucket.generateToken();


        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// AUTO REFILL
// ==========================================

app.post(
    "/api/auto-refill",
    (req, res) => {

        const {
            enabled
        } = req.body;


        bucket.setAutoRefill(
            enabled
        );


        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// TRANSMIT PACKET
// ==========================================

app.post(
    "/api/transmit",
    (req, res) => {

        const {
            size
        } = req.body;


        const result =
            bucket.transmit(size);


        res.json({

            result: result,

            state:
                bucket.getState()

        });

    }
);


// ==========================================
// SEND BURST
// ==========================================

app.post(
    "/api/burst",
    (req, res) => {

        const {
            packets
        } = req.body;


        const results =
            bucket.burst(packets);


        res.json({

            results: results,

            state:
                bucket.getState()

        });

    }
);


// ==========================================
// CLEAR LOG
// ==========================================

app.post(
    "/api/clear-log",
    (req, res) => {

        bucket.clearLog();


        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// RESET SIMULATION
// ==========================================

app.post(
    "/api/reset",
    (req, res) => {

        bucket.reset();


        res.json(
            bucket.getState()
        );

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Traffic Lab running at http://localhost:${PORT}`
        );

    }
);