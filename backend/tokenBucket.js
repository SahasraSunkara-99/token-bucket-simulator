class TokenBucket {

    constructor(capacity = 5, rate = 2) {

        this.capacity = capacity;
        this.rate = rate;

        this.tokens = capacity;

        this.sent = 0;
        this.blocked = 0;

        this.autoRefill = false;

        this.events = [];

        this.lastRefill = Date.now();

        this.addEvent(
            `Welcome! The bucket starts with ${capacity} tokens.`
        );
    }


    /*
     * Automatically add tokens according to
     * the configured token generation rate.
     */

    refill() {

        if (!this.autoRefill) {
            return;
        }

        const now = Date.now();

        const elapsedSeconds =
            (now - this.lastRefill) / 1000;

        const newTokens =
            elapsedSeconds * this.rate;

        if (newTokens > 0) {

            this.tokens =
                Math.min(
                    this.capacity,
                    this.tokens + newTokens
                );

            this.lastRefill = now;
        }
    }


    /*
     * Manually generate one token.
     */

    generateToken() {

        this.refill();

        if (this.tokens < this.capacity) {

            this.tokens += 1;

            this.tokens =
                Math.min(
                    this.tokens,
                    this.capacity
                );

            this.addEvent(
                "1 token generated manually."
            );

        } else {

            this.addEvent(
                "Bucket is full. Token not added."
            );
        }

        this.lastRefill = Date.now();
    }


    /*
     * Change bucket capacity and token rate.
     */

    configure(capacity, rate) {

        this.refill();

        this.capacity =
            Math.max(
                1,
                Math.min(
                    15,
                    Number(capacity)
                )
            );

        this.rate =
            Math.max(
                1,
                Math.min(
                    10,
                    Number(rate)
                )
            );

        this.tokens =
            Math.min(
                this.tokens,
                this.capacity
            );

        this.lastRefill = Date.now();

        this.addEvent(
            `Settings changed: Capacity ${this.capacity}, Token rate ${this.rate}/s`
        );
    }


    /*
     * Turn automatic refill ON or OFF.
     */

    setAutoRefill(value) {

        this.refill();

        this.autoRefill = Boolean(value);

        this.lastRefill = Date.now();

        if (this.autoRefill) {

            this.addEvent(
                `Auto refill turned ON at ${this.rate} tokens/sec.`
            );

        } else {

            this.addEvent(
                "Auto refill turned OFF."
            );
        }
    }


    /*
     * Transmit a packet.
     * One token is required for each data unit.
     */

    transmit(packetSize) {

        this.refill();

        packetSize = Number(packetSize);

        if (packetSize <= 0) {

            return {
                success: false,
                message: "Invalid packet size."
            };
        }


        if (packetSize <= this.tokens) {

            this.tokens -= packetSize;

            this.sent++;

            this.addEvent(
                `✓ Packet of ${packetSize} unit(s) transmitted successfully.`
            );

            return {

                success: true,

                message:
                    `Packet of ${packetSize} unit(s) transmitted.`

            };

        } else {

            this.blocked++;

            this.addEvent(
                `✕ Packet of ${packetSize} unit(s) blocked - insufficient tokens.`
            );

            return {

                success: false,

                message:
                    `Packet blocked. Need ${packetSize} tokens, but only ${this.tokens.toFixed(1)} available.`

            };
        }
    }


    /*
     * Send multiple packets.
     */

    burst(packets) {

        const results = [];

        for (const packet of packets) {

            results.push(
                this.transmit(packet)
            );
        }

        return results;
    }


    /*
     * Clear only the transmission log.
     */

    clearLog() {

        this.events = [];

        this.addEvent(
            "Transmission log cleared."
        );
    }


    /*
     * Reset complete simulation.
     */

    reset() {

        this.tokens = this.capacity;

        this.sent = 0;

        this.blocked = 0;

        this.events = [];

        this.lastRefill = Date.now();

        this.addEvent(
            `Simulation reset. Bucket starts with ${this.capacity} tokens.`
        );
    }


    /*
     * Add event to log.
     */

    addEvent(message) {

        const time =
            new Date().toLocaleTimeString();

        this.events.unshift({

            time: time,

            message: message

        });


        if (this.events.length > 30) {

            this.events.pop();

        }
    }


    /*
     * Return current state.
     */

    getState() {

        this.refill();

        return {

            capacity:
                this.capacity,

            rate:
                this.rate,

            tokens:
                this.tokens,

            sent:
                this.sent,

            blocked:
                this.blocked,

            autoRefill:
                this.autoRefill,

            events:
                this.events

        };
    }
}


module.exports = TokenBucket;