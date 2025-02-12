require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const generative = require('./AI_Model/generate_program');
const port=process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
app.use("/generate", generative);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
