// @ts-check

/** Import project dependencies */
import express from 'express';

/** Setting up */
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT;
const app = express();

app.get('/healthcheck', (_, res) => res.send('OK'));
app.use('/node_modules', express.static('./node_modules'));
app.use('/', express.static('./dist'));

app.listen(PORT, () => {
  console.info(`${
    isProd ? 'Production' : 'Development'
  } Express running at port ${PORT}...`);
});
