import { config } from './config/index.js';
import { createApp } from './server/index.js';

const app = createApp();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`✨ Sweet Home & Boutique CR backend corriendo en http://0.0.0.0:${config.port}`);
});

export default app;
