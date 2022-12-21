import { createCheerioRouter, RequestOptions } from 'crawlee';

import { labels } from './consts.js';
import { scrapeHeaders } from './services/scrapeHeaders.js';
import { getJobDetailsRequest, getJobsListRequest } from './services/utils.js';

import type { JobDetailsResponse, JobListingResponse } from './types.js';

export const cheerioRouter = createCheerioRouter();

cheerioRouter.addHandler(labels.JOBS_LIST, async ({ request, response, json, crawler, log }) => {
    const {
        label,
        userData: { role, initialRequest },
    } = request;

    log.info(`[${label}] Processing ${request.loadedUrl || request.url}`);

    if (!json) {
        throw new Error(`[${label}] No json found for ${request.loadedUrl || request.url}`);
    }

    log.info(`[${label}] Found JSON`);

    const { url, data } = json as JobListingResponse;

    // If we get a captcha, we need to restart the playwright crawler to get new headers
    if (url && url.includes('captcha')) {
        request.headers = await scrapeHeaders(label as string);
        throw new Error(`[${label}] Received captcha, retrying with new headers`);
    } else {
        if (initialRequest) {
            const totalPages = data?.talent?.seoLandingPageJobSearchResults?.pageCount;
            const totalJobs = data?.talent?.seoLandingPageJobSearchResults?.totalJobCount;

            log.info(
                `[${label}] Found ${totalPages} pages, and a total of ${totalJobs} jobs for ${role}`
            );

            const pagesRequests: RequestOptions[] = [];
            // Add all the pages to the crawler
            for (let i = 2; i <= totalPages; i++) {
                pagesRequests.push(getJobsListRequest(role, i));
            }

            await crawler.addRequests(pagesRequests);
        }
        // Handle startup requests
        const startups = data?.talent?.seoLandingPageJobSearchResults?.startups;

        if (!startups || !startups.length) {
            throw new Error('No jobs found');
        }

        const jobsRequests: RequestOptions[] = startups.flatMap((startup): RequestOptions[] => {
            return getJobDetailsRequest(startup);
        });

        await crawler.addRequests(jobsRequests);
    }
});

cheerioRouter.addHandler(labels.JOB_DETAILS, async ({ request, json, log}) => {
    const { label } = request;

    log.info(`[${label}] Processing ${request.loadedUrl || request.url}`);

    if (!json) {
        throw new Error(`[${label}] No json found for ${request.loadedUrl || request.url}`);
    }

    const { url, data } = json as JobDetailsResponse;

    if (data) {
        log.info(`[${label}] Found JSON`);
    }

    // // If we get a captcha, we need to restart the playwright crawler to get new headers
    // if (url && url.includes('captcha')) {
    //     request.headers = await scrapeHeaders(label as string);
    //     throw new Error(`[${label}] Received captcha, retrying with new headers`);
    // } else {
    //     // Handle jobs requests
    // }
});