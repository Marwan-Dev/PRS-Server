import express, { Application, Request, Response } from 'express';

const PORT = 3000;
// create server instance
const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello World',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});

export default app;
