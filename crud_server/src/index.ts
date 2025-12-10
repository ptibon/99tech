import express, { Express } from 'express';
import routes from './routes/api';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'CRUD Server API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
