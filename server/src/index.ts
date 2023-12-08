import express from 'express';
import routes from './routes/routes';
import cron from 'node-cron';
import cors from 'cors';

const app = express();
const port = process.env.MYSQL_PORT || 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`MedTask Server listening at port: ${port}`);
});

app.use('/api', routes);

// create cron job to wake the server every 14 minutes
console.log(new Date().toLocaleString());
cron.schedule('*/10 * * * *', () => {
  console.log('running a task every 10 minutes', new Date().toLocaleString(), '\n');
  const exec = require('child_process').exec;
  exec(`curl ${process.env.SELF_PING_URL}`, function (err: any, stdout: any, stderr: any) {
    console.log(stdout);
  });
});
