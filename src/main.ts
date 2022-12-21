import { CheerioCrawler, log, RequestOptions } from 'crawlee';
import { Actor } from 'apify';

import { cheerioRouter } from './routes.js';
import { getInitialJobsListRequests } from './services/utils.js';
import { scrapeHeaders } from './services/scrapeHeaders.js';
import { labels } from './consts.js';

await Actor.init();

const { role, isRemote }: { role: string; isRemote: boolean } = (await Actor.getInput()) ?? {
    role: 'all',
    isRemote: false,
};

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['SHADER'],
    countryCode: 'US',
});

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
            maxUsageCount: 15,
        }
    },
    maxRequestsPerMinute: 10,
    failedRequestHandler: async ({ request: { label, loadedUrl, url }, response }) => {
        log.warning(`STATUS ${response.statusCode} ${response.statusMessage}`, {
            url: loadedUrl || url,
        });

        await scrapeHeaders(label as string);
    },
});

await scrapeHeaders(labels.INITIAL);

const requests: RequestOptions[] = getInitialJobsListRequests(role, isRemote);

log.info(`[Cheerio] Started crawling...`);
await cheerioCrawler.run(requests);
log.info(`[Cheerio] Finished crawling.`);

await Actor.exit();
