const cors = require('cors')
require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());


const port = process.env.PORT;
app.listen(port, () => console.log('CORS-enabled web Server is listening on port', port));
