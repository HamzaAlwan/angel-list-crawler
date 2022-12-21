import { RequestOptions } from 'crawlee';

import { graphqlQueries, GRAPHQL_URL, labels, roles } from '../consts.js';
import { Startup } from '../types.js';
import { requestHeaders } from './scrapeHeaders.js';

export const getInitialJobsListRequests = (role: string, isRemote: boolean): RequestOptions[] => {
    if (role === 'all') {
        return roles.map((role) => getJobsListRequest(role, 1, isRemote));
    } else {
        return roles
            .filter((role) => role === role)
            .map((role) => getJobsListRequest(role, 1, isRemote));
    }
};

export const getJobsListRequest = (
    role: string,
    page: number = 1,
    isRemote: boolean = false
): RequestOptions => {
    const payload = {
        operationName: 'SeoLandingRoleSearchPage',
        variables: {
            page,
            role,
        },
        query: graphqlQueries.jobsList(isRemote).loc?.source?.body,
    };

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
    return startup.highlightedJobListings.map((job) => {
        const payload = {
            operationName: 'JobApplicationModal',
            variables: {
                jobListingId: job.id,
            },
            query: graphqlQueries.jobDetails.loc?.source?.body,
        };

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
    const payload = {
        operationName: 'CompanyProfile',
        variables: {
            startupSlug,
        },
        query: graphqlQueries.companyProfile.loc?.source?.body,
    };

    return {
        method: 'POST',
        url: GRAPHQL_URL,
        headers: requestHeaders,
        payload: JSON.stringify(payload),
        label: labels.JOB_DETAILS,
        useExtendedUniqueKey: true,
    };
};
