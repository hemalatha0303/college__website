const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Oracle Database connection configuration
const dbConfig = {
    user: 'college',
    password: '12345',
    connectString: 'localhost:1521/orcl'
};

// Connect to Oracle Database
async function init() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Error starting connection pool:', err);
    }
}

init();

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO students (name, email, password) VALUES (:name, :email, :password)`,
            [name, email, password],
            { autoCommit: true }
        );
        await connection.close();
        res.send('Student registered successfully!');
    } catch (err) {
        console.error('Error registering student:', err);
        res.status(500).send('Error registering student.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
