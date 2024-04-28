const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// const monitorRoute = require('./api/monitor')

const tokenRoute = require('./api/token');
const infoRoute = require('./api/info');
const analyticsRoute = require('./api/analytics');


const port = 9898;

app.use(express.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({ result: 'pong' });
});

// app.use('/monitor', monitorRoute);
app.use('/token', tokenRoute);
app.use('/info', infoRoute);
app.use('/analytics', analyticsRoute);


async function init() {
  try {
    console.log('Initializing...');
    console.log('Initialization complete.');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

init();
