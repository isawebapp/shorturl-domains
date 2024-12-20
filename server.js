const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

const dbConfig = {
    host: 'localhost',
    user: 'shorturl',
    password: 'CUjGj35Qe8wVYr1x3qSb',
    database: 'shorturl',
};

app.get('/:path', async (req, res, next) => {
    const { path } = req.params;
    const domain = req.hostname;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute(
            'SELECT redirect_url FROM paths WHERE path = ? AND domain = ?',
            [path, domain]
        );

        await connection.end();

        if (rows.length > 0) {
            res.redirect(rows[0].redirect_url);
        } else {
            next();
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use((req, res) => {
    res.redirect('https://shorturl.isawebapp.com');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
