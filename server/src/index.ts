import express from 'express';
import routes from './routes/routes';

const app = express();
const port = process.env.MYSQL_PORT || 3000;

app.listen(port, () => {
  console.log(`MedTask Server listening at http://localhost:${port}`);
});

app.use('/api', routes);
