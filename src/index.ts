import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import errorMiddleware from './middleware/error.middleware';
import config from './config';
import routes from './routes';

const PORT = config.port || 3000;
// create server instance
const app: Application = express();
// middleware to parse incoming requests
app.use(express.json());

// HTTP request logger middleware
app.use(morgan('common'));

// HTTP Security middleware
app.use(helmet());

// Apply the rate limiting middleware to all requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests, please try again after 15 minutes',
  })
);

app.use('/api', routes);

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello World',
  });
});

// post request
app.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    message: 'hello World from post request',
    data: req.body,
  });
});

app.use(errorMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message:
      'Ohhh you are lost, read the API documentation to find your way back',
  });
});

// listen to port
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});

export default app;
