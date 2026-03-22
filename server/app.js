const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes'); // ✅ ADD THIS
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API Running');
});

// ✅ CONNECT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
module.exports = app;