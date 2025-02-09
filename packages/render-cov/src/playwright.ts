// libs
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
// biome-ignore lint/correctness/noUnusedImports: this is being used
import { test } from '@playwright/test';

export function extendRenderCovTest<T extends typeof test>(
    test: T,
    config: {
        wait?: number;
    } = {
        wait: 500,
    },
) {
    return test.extend({
        page: [
            async ({ page }, use, testInfo) => {
                await use(page);
                config.wait && (await page.waitForTimeout(config.wait));

                // After the test we can check whether the test passed or failed.
                if (testInfo.status === testInfo.expectedStatus) {
                    const coverageJson = await page.evaluate(() => {
                        const renderCoverage = window.__RENDER_COVERAGE__;
                        const coverageJson: Record<
                            string,
                            Record<string, unknown>
                        > = {};
                        // biome-ignore lint/complexity/noForEach: This is a simple loop
                        renderCoverage?.forEach((value) => {
                            for (const renderPhase in value) {
                                const {
                                    time,
                                    reference,
                                    fileName,
                                    uid,
                                    ...rest
                                } =
                                    // biome-ignore lint/style/noNonNullAssertion: We are sure that value[renderPhase] is not null
                                    value[renderPhase]!;
                                coverageJson[uid] = coverageJson[uid] || {
                                    [renderPhase]: rest,
                                };
                                coverageJson[uid][renderPhase] = rest;
                            }
                        });

                        return Object.keys(coverageJson)
                            .sort()
                            .reduce(
                                (acc, key) => ({
                                    // biome-ignore lint/performance/noAccumulatingSpread: This is a simple object spread
                                    ...acc,
                                    [key]: coverageJson[key],
                                }),
                                {},
                            );
                    });

                    const outputDir = testInfo
                        .snapshotPath()
                        .split('/')
                        .slice(0, -1)
                        .join('/');
                    // Create the directory if it doesn't exist
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir);
                    }

                    const logFile = testInfo.snapshotPath(
                        `${testInfo.title}.json`,
                    );
                    await writeFile(
                        logFile,
                        JSON.stringify(coverageJson, undefined, 2),
                        'utf8',
                    );
                }
            },
            { scope: 'test' },
        ],
    });
}
