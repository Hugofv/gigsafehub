import request from 'supertest';
import express from 'express';
import { healthRouter } from '../health';

// Create a test app
const app = express();
app.use(express.json());
app.use('/health', healthRouter);

describe('Health Endpoint', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });
});

