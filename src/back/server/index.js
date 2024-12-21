const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

function calculateBlackScholes(S0, X, r, q, t, v) {
    const d1 = (Math.log(S0 / X) + (r - q + 0.5 * v * v) * t) / (v * Math.sqrt(t));
    const d2 = d1 - v * Math.sqrt(t);
    
    const C = S0 * Math.exp(-q * t) * normalCDF(d1) - X * Math.exp(-r * t) * normalCDF(d2);
    const P = X * Math.exp(-r * t) * normalCDF(-d2) - S0 * Math.exp(-q * t) * normalCDF(-d1);

    return { C: C.toFixed(4), P: P.toFixed(4) };
}

function normalCDF(x) {
    return (1.0 + Math.erf(x / Math.sqrt(2))) / 2.0;
}

app.post('/api/data', (req, res) => {
    const { S0, X, r, q, t, v } = req.body;
    
    if (!S0 || !X || !r || !q || !t || !v) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const result = calculateBlackScholes(S0, X, r, q, t, v);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});