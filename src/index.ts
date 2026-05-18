import app from './server';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

app.use('/api/task', taskRoutes);
app.use(errorHandler);
