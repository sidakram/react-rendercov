import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './playwright',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5173',
        screenshot: 'off',
        video: 'off',
    },
    projects: [
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],
});
