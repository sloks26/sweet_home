import { config } from './config/index.js';
import { createApp } from './server/index.js';

const app = createApp();

const host = process.env.HOST || '127.0.0.1';

app.listen(config.port, host, () => {
  console.log(`✨ Sweet Home & Boutique CR backend corriendo localmente en http://${host}:${config.port}`);
});

export default app;
