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
    // apifyProxyGroups: ['RESIDENTIAL'],
});

const cheerioCrawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: cheerioRouter,
    autoscaledPoolOptions: {
        maxConcurrency: 1,
        desiredConcurrency: 1,
    },
    maxRequestRetries: 8,
});

await scrapeHeaders(labels.INITIAL);

const requests: RequestOptions[] = getInitialJobsListRequests(role, isRemote);

import fs from 'fs';

fs.writeFileSync('requests.json', JSON.stringify(requests, null, 4));

process.exit()

log.info(`[Cheerio] Started crawling...`);
await cheerioCrawler.run(requests);
log.info(`[Cheerio] Finished crawling.`);

await Actor.exit();
