require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const cors = require("cors"); 

connectDB();

app.use(cors({
  origin: "*"
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});