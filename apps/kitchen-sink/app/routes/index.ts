import { index } from '@react-router/dev/routes';

export default function createRoutes(prefixPath: string) {
    return [index(`.${prefixPath}/Home/index.tsx`)];
}
