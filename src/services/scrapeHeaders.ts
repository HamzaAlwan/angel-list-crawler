import { PlaywrightCrawler } from 'crawlee';
import { Actor } from 'apify';

import { BASE_URL } from '../consts.js';

export let requestHeaders: any = null;

const proxyConfiguration = await Actor.createProxyConfiguration({
    // apifyProxyGroups: ['RESIDENTIAL'],
    groups: ['SHADER'],
    countryCode: 'US',
});

export const playwrightCrawler = new PlaywrightCrawler({
    proxyConfiguration,
    autoscaledPoolOptions: {
        maxConcurrency: 1,
        desiredConcurrency: 1,
    },
    navigationTimeoutSecs: 60,
    requestHandlerTimeoutSecs: 60,
    // headless: false,
    sessionPoolOptions: {
        sessionOptions: {
            maxUsageCount: 1,
        },
    },
    maxRequestRetries: 15,
    requestHandler: async ({ page, log }) => {
        const title = await page.title();
        if (title.includes('Access Denied')) {
            throw new Error('Access Denied');
        }

        log.info(`[Playwright] Scraping headers...`);

        // Click on the next page button, only way to send request to graphql
        await page.click('[aria-label="Go to page 2"]');

        const headers = await (
            await page.waitForRequest(`${BASE_URL}/graphql?fallbackAOR=talent`)
        ).allHeaders();

        if (!headers) {
            throw new Error('No headers');
        }

        log.info(`[Playwright] Headers scraped`);

        // Delete content length header, since our requests are different
        delete headers['content-length'];

        requestHeaders = headers;
    }
});

let headersScrapesCount = 0;
// This function is called when the crawler encounters an error, it's used to update the headers
export const scrapeHeaders = async () => {
    const url = `${BASE_URL}/role/r/software-engineer`;
    await playwrightCrawler.run([
        {
            url,
            uniqueKey: `${url}-${headersScrapesCount++}`,
        },
    ]);

    return requestHeaders;
};
