const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("qr.db");

db.run(`
    CREATE TABLE IF NOT EXISTS qr_codes (
        id TEXT PRIMARY KEY,
        destination TEXT NOT NULL
    )
`);

app.post("/api/create", async (req, res) => {
    const { id, destination } = req.body;

    if (!id || !destination) {
        return res.status(400).json({
            error: "ID and destination are required"
        });
    }

    db.run(
        "INSERT INTO qr_codes (id, destination) VALUES (?, ?)",
        [id, destination],
        async function (err) {
            if (err) {
                return res.status(400).json({
                    error: "QR ID already exists"
                });
            }

            const qrURL = `${req.protocol}://${req.get("host")}/q/${id}`;

            try {
                const qrImage = await QRCode.toDataURL(qrURL);

                res.json({ id, qrURL, qrImage });
            } catch (error) {
                res.status(500).json({
                    error: "QR generation failed"
                });
            }
        }
    );
});

app.put("/api/update/:id", (req, res) => {
    const { destination } = req.body;
    const { id } = req.params;

    if (!destination) {
        return res.status(400).json({
            error: "Destination is required"
        });
    }

    db.run(
        "UPDATE qr_codes SET destination = ? WHERE id = ?",
        [destination, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "QR not found"
                });
            }

            res.json({
                message: "Destination updated successfully"
            });
        }
    );
});

app.get("/q/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT destination FROM qr_codes WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).send("Database error");
            }

            if (!row) {
                return res.status(404).send("QR code not found");
            }

            res.redirect(row.destination);
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
