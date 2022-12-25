import { CheerioCrawler, log, RequestOptions } from 'crawlee';
import { Actor } from 'apify';

import { cheerioRouter } from './routes.js';
import { getInitialJobsListRequests } from './services/utils.js';
import { scrapeHeaders } from './services/scrapeHeaders.js';
import { Input } from './types.js';

await Actor.init();

export const input: Input = await Actor.getInput() as Input;

const proxyConfiguration = await Actor.createProxyConfiguration(input.proxyConfiguration);

const cheerioCrawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: cheerioRouter,
    autoscaledPoolOptions: {
        maxConcurrency: 1,
        desiredConcurrency: 1,
    },
    maxRequestRetries: 15,
    sessionPoolOptions: {
        sessionOptions: {
            maxUsageCount: 10,
        },
    },
    failedRequestHandler: async ({ request: { label, loadedUrl, url }, response }) => {
        log.warning(
            `[${label}] Received an error ${response.statusCode} ${response.statusMessage}`,
            {
                url: loadedUrl || url,
            }
        );

        await scrapeHeaders();
    },
});

// Get the initial headers
await scrapeHeaders();

const requests: RequestOptions[] = getInitialJobsListRequests(input);

log.info(`[Cheerio] Started crawling...`);
await cheerioCrawler.run(requests);
log.info(`[Cheerio] Finished crawling.`);

await Actor.exit();
