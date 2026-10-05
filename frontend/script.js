let selectedPacket = 1;

let autoRefill = false;



// ==========================================
// ELEMENTS
// ==========================================

const capacitySlider =
    document.getElementById(
        "capacitySlider"
    );

const rateSlider =
    document.getElementById(
        "rateSlider"
    );

const capacityNumber =
    document.getElementById(
        "capacityNumber"
    );

const rateNumber =
    document.getElementById(
        "rateNumber"
    );

const availableTokens =
    document.getElementById(
        "availableTokens"
    );

const bucketCapacity =
    document.getElementById(
        "bucketCapacity"
    );

const sentPackets =
    document.getElementById(
        "sentPackets"
    );

const selectedPacketText =
    document.getElementById(
        "selectedPacket"
    );

const tokenContainer =
    document.getElementById(
        "tokenContainer"
    );

const capacityFill =
    document.getElementById(
        "capacityFill"
    );

const capacityText =
    document.getElementById(
        "capacityText"
    );

const log =
    document.getElementById(
        "log"
    );

const status =
    document.getElementById(
        "status"
    );

const autoRefillBtn =
    document.getElementById(
        "autoRefillBtn"
    );



// ==========================================
// SELECT PACKET
// ==========================================

document
    .querySelectorAll(".packet-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".packet-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                selectedPacket =
                    Number(
                        button.dataset.size
                    );


                selectedPacketText.textContent =
                    selectedPacket;

            }
        );

    });



// ==========================================
// UPDATE SLIDER DISPLAY
// ==========================================

capacitySlider.addEventListener(
    "input",
    () => {

        capacityNumber.textContent =
            capacitySlider.value;

    }
);


rateSlider.addEventListener(
    "input",
    () => {

        rateNumber.textContent =
            rateSlider.value;

    }
);



// ==========================================
// APPLY CONFIGURATION
// ==========================================

capacitySlider.addEventListener(
    "change",
    applyConfig
);


rateSlider.addEventListener(
    "change",
    applyConfig
);


async function applyConfig() {

    const capacity =
        Number(
            capacitySlider.value
        );

    const rate =
        Number(
            rateSlider.value
        );


    try {

        const response =
            await fetch(
                "/api/config",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        capacity,
                        rate
                    })

                }
            );


        const data =
            await response.json();


        updateUI(data);

    } catch (error) {

        showStatus(
            "Connection error",
            "Could not update settings.",
            false
        );

    }
}



// ==========================================
// GENERATE TOKEN
// ==========================================

document
    .getElementById("generateBtn")
    .addEventListener(
        "click",
        generateToken
    );


async function generateToken() {

    try {

        const response =
            await fetch(
                "/api/generate",
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        updateUI(data);


        if (
            data.tokens >=
            data.capacity
        ) {

            showStatus(
                "Bucket full",
                "The bucket has reached its maximum capacity.",
                true
            );

        } else {

            showStatus(
                "Token generated",
                "One token was added to the bucket.",
                true
            );

        }

    } catch (error) {

        showStatus(
            "Connection error",
            "Backend server is not responding.",
            false
        );

    }
}



// ==========================================
// AUTO REFILL
// ==========================================

autoRefillBtn.addEventListener(
    "click",
    toggleAutoRefill
);


async function toggleAutoRefill() {

    autoRefill =
        !autoRefill;


    try {

        const response =
            await fetch(
                "/api/auto-refill",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        enabled:
                            autoRefill
                    })

                }
            );


        const data =
            await response.json();


        updateUI(data);


        if (autoRefill) {

            autoRefillBtn.textContent =
                "▶ Auto refill: ON";

            autoRefillBtn.classList.add(
                "active"
            );

        } else {

            autoRefillBtn.textContent =
                "▶ Auto refill: OFF";

            autoRefillBtn.classList.remove(
                "active"
            );

        }

    } catch (error) {

        autoRefill =
            !autoRefill;

    }
}



// ==========================================
// TRANSMIT PACKET
// ==========================================

document
    .getElementById("transmitBtn")
    .addEventListener(
        "click",
        transmitPacket
    );


async function transmitPacket() {

    try {

        const response =
            await fetch(
                "/api/transmit",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        size:
                            selectedPacket
                    })

                }
            );


        const data =
            await response.json();


        updateUI(
            data.state
        );


        if (
            data.result.success
        ) {

            showStatus(
                "Packet transmitted",
                data.result.message,
                true
            );

        } else {

            showStatus(
                "Packet blocked",
                data.result.message,
                false
            );

        }

    } catch (error) {

        showStatus(
            "Connection error",
            "Backend server is not responding.",
            false
        );

    }
}



// ==========================================
// SEND BURST
// ==========================================

document
    .getElementById("burstBtn")
    .addEventListener(
        "click",
        sendBurst
    );


async function sendBurst() {

    const packets = [
        1,
        2,
        3
    ];


    try {

        const response =
            await fetch(
                "/api/burst",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        packets
                    })

                }
            );


        const data =
            await response.json();


        updateUI(
            data.state
        );


        showStatus(
            "Burst completed",
            "Three packets were sent through the transmission gate.",
            true
        );

    } catch (error) {

        showStatus(
            "Connection error",
            "Backend server is not responding.",
            false
        );

    }
}



// ==========================================
// RESET
// ==========================================

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetSimulation
    );


async function resetSimulation() {

    try {

        const response =
            await fetch(
                "/api/reset",
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        updateUI(data);


        autoRefill = false;

        autoRefillBtn.textContent =
            "▶ Auto refill: OFF";

        autoRefillBtn.classList.remove(
            "active"
        );


        showStatus(
            "Simulation reset",
            "The bucket has been restored to its initial state.",
            true
        );

    } catch (error) {

        showStatus(
            "Connection error",
            "Could not reset simulation.",
            false
        );

    }
}



// ==========================================
// CLEAR LOG
// ==========================================

document
    .getElementById("clearLogBtn")
    .addEventListener(
        "click",
        clearLog
    );


async function clearLog() {

    try {

        const response =
            await fetch(
                "/api/clear-log",
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        updateUI(data);

    } catch (error) {

        console.log(error);

    }
}



// ==========================================
// PRINT
// ==========================================

document
    .getElementById("printBtn")
    .addEventListener(
        "click",
        () => {

            window.print();

        }
    );



// ==========================================
// UPDATE UI
// ==========================================

function updateUI(data) {

    const tokens =
        Number(data.tokens);

    const capacity =
        Number(data.capacity);


    // Statistics

    availableTokens.textContent =
        tokens.toFixed(1);

    bucketCapacity.textContent =
        capacity;

    sentPackets.textContent =
        data.sent;


    capacityNumber.textContent =
        capacity;

    rateNumber.textContent =
        data.rate;



    // Capacity bar

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (tokens / capacity) * 100
            )
        );


    capacityFill.style.width =
        `${percentage}%`;


    capacityText.textContent =
        `${tokens.toFixed(1)} of ${capacity} tokens stored`;



    // Draw tokens

    drawTokens(
        tokens,
        capacity
    );



    // Log

    updateLog(
        data.events
    );



    // Auto refill state

    if (
        typeof data.autoRefill !==
        "undefined"
    ) {

        autoRefill =
            data.autoRefill;


        if (autoRefill) {

            autoRefillBtn.textContent =
                "▶ Auto refill: ON";

            autoRefillBtn.classList.add(
                "active"
            );

        } else {

            autoRefillBtn.textContent =
                "▶ Auto refill: OFF";

            autoRefillBtn.classList.remove(
                "active"
            );

        }

    }
}



// ==========================================
// DRAW TOKEN CIRCLES
// ==========================================

function drawTokens(
    tokens,
    capacity
) {

    tokenContainer.innerHTML = "";


    const fullTokens =
        Math.floor(tokens);


    const decimal =
        tokens - fullTokens;


    for (
        let i = 0;
        i < fullTokens;
        i++
    ) {

        const token =
            document.createElement(
                "div"
            );


        token.className =
            "token";


        token.textContent =
            "T";


        tokenContainer.appendChild(
            token
        );

    }


    // Partial token

    if (
        decimal >= 0.25 &&
        fullTokens < capacity
    ) {

        const token =
            document.createElement(
                "div"
            );


        token.className =
            "token";


        token.style.opacity =
            Math.max(
                0.3,
                decimal
            );


        token.textContent =
            "T";


        tokenContainer.appendChild(
            token
        );

    }
}



// ==========================================
// LOG
// ==========================================

function updateLog(events) {

    if (
        !events ||
        events.length === 0
    ) {

        log.innerHTML = `
            <div class="log-item">
                Welcome! The bucket starts with tokens.
            </div>
        `;

        return;
    }


    log.innerHTML =
        events
            .map(event => {

                return `
                    <div class="log-item">

                        <span class="log-time">
                            ${event.time}
                        </span>

                        ${event.message}

                    </div>
                `;

            })
            .join("");
}



// ==========================================
// STATUS MESSAGE
// ==========================================

function showStatus(
    title,
    message,
    success
) {

    status.classList.remove(
        "success",
        "error"
    );


    if (success) {

        status.classList.add(
            "success"
        );

    } else {

        status.classList.add(
            "error"
        );

    }


    status.innerHTML = `

        <span class="status-dot"></span>

        <div>

            <strong>
                ${title}
            </strong>

            <p>
                ${message}
            </p>

        </div>

    `;
}



// ==========================================
// AUTOMATIC STATE REFRESH
// ==========================================

setInterval(
    async () => {

        try {

            const response =
                await fetch(
                    "/api/state"
                );


            const data =
                await response.json();


            updateUI(data);

        } catch (error) {

            // Server may not be started yet.

        }

    },
    500
);



// ==========================================
// INITIAL LOAD
// ==========================================

getInitialState();


async function getInitialState() {

    try {

        const response =
            await fetch(
                "/api/state"
            );


        const data =
            await response.json();


        updateUI(data);

    } catch (error) {

        showStatus(
            "Backend not connected",
            "Start the Node.js server using npm start.",
            false
        );

    }
}