import express from 'express';
import { authRouter } from './dist/routes/auth.routes.js';

const app = express();
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', (_req, res) => res.json({ message: 'Backend is running', service: 'Express API' }));

console.log('stack length', app._router.stack.length);
console.log(JSON.stringify(app._router.stack.map((layer) => ({
  name: layer.name,
  regexp: layer.regexp.toString(),
  route: layer.route && layer.route.path,
  methods: layer.route && layer.route.methods,
  handleName: layer.handle && layer.handle.name,
})), null, 2));
