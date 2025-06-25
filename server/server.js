require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const generative = require('./AI_Model/generate_program');
const register=require('./routes/registerRoutes');
const upload=require('./routes/uploadRoutes');


const port=process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/generate", generative);
app.use("/api",register);
app.use("/api",upload);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
