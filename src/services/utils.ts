import { Request, RequestOptions } from 'crawlee';

import { BASE_COMPANY_URL, graphqlQueries, GRAPHQL_URL, labels, roles } from '../consts.js';
import { input } from '../main.js';
import { Input, Startup } from '../types.js';
import { requestHeaders, scrapeHeaders } from './scrapeHeaders.js';

export const getInitialJobsListRequests = ({ role }: Input): RequestOptions[] => {
    if (role === 'all') {
        return roles.map((role) => getJobsListRequest(role, 1));
    } else {
        return roles
            .filter((role) => role === role)
            .map((role) => getJobsListRequest(role, 1));
    }
};

export const isCaptcha = async (request: Request) => {
    const { url, label } = request;
    if (url && url.includes('captcha')) {
        request.headers = await scrapeHeaders();
        throw new Error(`[${label}] Received captcha, retrying with new headers`);
    }
};

export const getJobsListRequest = (
    role: string,
    page: number = 1
): RequestOptions => {
    const payload = graphqlQueries.jobsListQuery({ role, page });

    return {
        method: 'POST',
        url: GRAPHQL_URL,
        headers: requestHeaders,
        payload: JSON.stringify(payload),
        label: labels.JOBS_LIST,
        userData: {
            role,
            initialRequest: page === 1,
        },
        useExtendedUniqueKey: true,
    };
};

export const getJobDetailsRequest = (startup: Startup): RequestOptions[] => {
    // Gets the job details for each job listing of the input role
    return startup.highlightedJobListings.map((job) => {
        const payload = graphqlQueries.jobDetailsQuery(job.id);

        return {
            method: 'POST',
            url: GRAPHQL_URL,
            headers: requestHeaders,
            payload: JSON.stringify(payload),
            label: labels.JOB_DETAILS,
            useExtendedUniqueKey: true,
        };
    });
};

export const getCompanyProfileRequest = (startupSlug: string): RequestOptions => {
    const payload = graphqlQueries.companyProfileQuery(startupSlug);

    return {
        method: 'POST',
        url: GRAPHQL_URL,
        headers: requestHeaders,
        payload: JSON.stringify(payload),
        label: labels.JOB_DETAILS,
        useExtendedUniqueKey: true,
    };
};

export const getCompaniesListRequest = (page: number): RequestOptions => {
    const payload = graphqlQueries.companiesListQuery({ page, perPage: 1000 });

    return {
        method: 'POST',
        url: GRAPHQL_URL,
        headers: requestHeaders,
        payload: JSON.stringify(payload),
        label: labels.JOB_DETAILS,
        useExtendedUniqueKey: true,
    };
};

export const getStartupDetails = (startup: Startup) => {
    if (input.startupSimple) {
        const {
            name,
            highConcept,
            productDescription,
            companySize,
            slug: startupSlug,
            companyUrl,
            logoUrl,
            locationTaggings,
            badges,
            marketTaggings,
        } = startup;

        return {
            name,
            highConcept,
            productDescription,
            companySize: companySize.replace(/SIZE_/g, '').replace(/_/g, '-'),
            companyProfileUrl: `${BASE_COMPANY_URL}/${startupSlug}`,
            companyUrl,
            logoUrl,
            locationTaggings: locationTaggings.map((tag) => tag.displayName),
            marketTaggings: marketTaggings.map((tag) => tag.displayName),
            badges: badges.map((badge) => ({
                label: badge.label,
                description: badge.tooltip,
                rating: badge.rating,
            })),
        };
    } else {
        // handle full startup details
        return {};
    }
};
