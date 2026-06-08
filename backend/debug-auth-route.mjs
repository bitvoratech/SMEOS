import { authRouter } from './dist/routes/auth.routes.js';

console.log('stack length', authRouter.stack.length);
console.log(JSON.stringify(authRouter.stack.map((x) => ({
  path: x.route && x.route.path,
  methods: x.route && x.route.methods,
})), null, 2));
