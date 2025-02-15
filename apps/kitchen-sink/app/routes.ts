import type { RouteConfig } from '@react-router/dev/routes';
import createRoutes from './routes/index';

export default [...createRoutes('/routes')] satisfies RouteConfig;
