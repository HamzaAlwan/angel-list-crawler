import { Actor } from 'apify';
import { createCheerioRouter, RequestOptions } from 'crawlee';

import { BASE_URL, BASE_COMPANY_URL, getJobUrl, JobType, labels } from './consts.js';
import { input } from './main.js';
import { scrapeHeaders } from './services/scrapeHeaders.js';
import { getJobDetailsRequest, getJobsListRequest, getStartupDetails, isCaptcha } from './services/utils.js';

import type { JobDetailsResponse, JobListingResponse } from './types.js';

export const cheerioRouter = createCheerioRouter();

cheerioRouter.addHandler(labels.JOBS_LIST, async ({ request, json, crawler, log }) => {
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
        // await isCaptcha(request);
        request.headers = await scrapeHeaders();
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

        const jobsRequests: RequestOptions[] = startups.flatMap(getJobDetailsRequest);

        await crawler.addRequests(jobsRequests);
    }
});

cheerioRouter.addHandler(labels.JOB_DETAILS, async ({ request, json, log }) => {
    const { label } = request;

    log.info(`[${label}] Processing ${request.loadedUrl || request.url}`);

    if (!json) {
        throw new Error(`[${label}] No json found for ${request.loadedUrl || request.url}`);
    }

    const {
        url,
        data: { jobListing },
    } = json as JobDetailsResponse;

    // If we get a captcha, we need to restart the playwright crawler to get new headers
    if (url && url.includes('captcha')) {
        // await isCaptcha(request);
        request.headers = await scrapeHeaders();
        throw new Error(`[${label}] Received captcha, retrying with new headers`);
    } else {
        const {
            id,
            title,
            slug,
            description,
            descriptionSnippet,
            // source,
            // atsSource,
            liveStartAt,
            public: isPublic,
            remote,
            jobType,
            yearsExperienceMin,
            visaSponsorship,
            locationNames,
            acceptedRemoteLocationNames,
            compensation,
            estimatedSalary,
            equity,
            usesEstimatedSalary,
            remoteConfig,
            skills,
            recruitingContact,
            startup,
        } = jobListing;

        // Make the property more readable
        remoteConfig.workFromHomeFlexible = remoteConfig.wfhFlexible;
        delete remoteConfig.wfhFlexible;

        // Handle job details
        const jobDetails = {
            id: id,
            title: title,
            url: getJobUrl(startup.slug, `${id}-${slug}`),
            description,
            descriptionSnippet,
            // source,
            // atsSource,
            liveStartAt,
            public: isPublic,
            remote,
            jobType: JobType[jobType as keyof typeof JobType],
            yearsExperienceMin,
            visaSponsorship,
            locationNames,
            acceptedRemoteLocationNames,
            compensation,
            estimatedSalary,
            usesEstimatedSalary,
            equity,
            remoteConfig: {
                ...remoteConfig,
                hiringTimeZones: remoteConfig.hiringTimeZones.map((tz) => tz.name),
            },
            skills: skills.map((skill) => skill.displayName),
            recruitingContact: {
                name: recruitingContact.user.name,
                profileUrl: `${BASE_URL}/p/${recruitingContact.user.slug}`,
                avatarUrl: recruitingContact.user.avatarURL,
            },
            startup: getStartupDetails(startup)
        };

        if (input.startupSimple) {
            await Actor.pushData(jobDetails);
        } else {
            // Send a new request to get more details about the startup
        }
    }
});
