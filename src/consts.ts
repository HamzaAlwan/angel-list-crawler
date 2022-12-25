import { gql } from 'graphql-tag';
import { input } from './main.js';

export const BASE_URL = 'https://angel.co';
export const BASE_COMPANY_URL = `${BASE_URL}/company`;
export const GRAPHQL_URL = `${BASE_URL}/graphql?fallbackAOR=talent`;
export const getJobUrl = (company: string, job: string) =>
    `${BASE_COMPANY_URL}/${company}/jobs/${job}`;

export const labels = {
    INITIAL: 'INITIAL',
    JOBS_LIST: 'JOBS_LIST',
    COMPANY_OVERVIEW: 'COMPANY_OVERVIEW',
    COMPANY_DETAILS: 'COMPANY_DETAILS',
    JOB_DETAILS: 'JOB_DETAILS',
};

export const roles = [
    'Software Engineer',
    'Engineering Manager',
    'Product Manager',
    'Backend Engineer',
    'Mobile Engineer',
    'Product Designer',
    'Frontend Engineer',
    'Full Stack Engineer',
    'Data Scientist',
    'Designer',
    'Software Architect',
    'Devops Engineer',
].map((role) => role.toLowerCase().split(' ').join('-'));

export enum JobType {
    full_time = 'Full Time',
    part_time = 'Part Time',
    contract = 'Contract',
    internship = 'Internship',
    cofounder = 'Co-founder',
}

export const graphqlQueries = {
    // JOBS LIST QUERY
    jobsListQuery: ({ page, role }: { page: number; role: string }) => {
        const query = gql`
        query SeoLandingRoleSearchPage(${
            input.remoteOnly ? 'remote: true, ' : ''
        }$role: String!, $page: Int!) {
            talent {
                seoLandingPageJobSearchResults(role: $role, page: $page) {
                    totalJobCount
                    totalStartupCount
                    perPage
                    pageCount
                    startups {
                        id
                        name
                        slug
                        logoUrl
                        companyUrl
                        companySize
                        highConcept
                        badges {
                            id
                            label
                            tooltip
                            rating
                        }
                        highlightedJobListings {
                            id
                            slug
                            title
                        }
                        marketTaggings {
                            id
                            slug
                            displayName
                        }
                        locationTaggings {
                            id
                            slug
                            displayName
                        }
                    }
                }
            }
        }
    `;

        return {
            operationName: 'SeoLandingRoleSearchPage',
            variables: {
                page,
                role,
            },
            query: query.loc?.source?.body,
        };
    },

    // JOB DETAILS QUERY
    jobDetailsQuery: (jobListingId: string) => {
        const query = gql`
            query JobApplicationModal($jobListingId: ID!) {
                jobListing(id: $jobListingId) {
                    id
                    title
                    slug
                    source
                    atsSource
                    description
                    descriptionSnippet
                    liveStartAt
                    public
                    remote
                    jobType
                    yearsExperienceMin
                    visaSponsorship
                    locationNames
                    acceptedRemoteLocationNames
                    compensation
                    estimatedSalary
                    equity
                    usesEstimatedSalary
                    remoteConfig {
                        kind
                        wfhFlexible
                        collaborationStartAt
                        collaborationEndAt
                        collaborationTimeZone {
                            id
                            name
                        }
                        hiringTimeZones {
                            id
                            name
                        }
                    }
                    skills {
                        id
                        displayName
                        slug
                    }
                    recruitingContact {
                        id
                        user {
                            id
                            name
                            avatarUrl
                        }
                    }
                    startup {
                        id
                        name
                        highConcept
                        productDescription
                        companySize
                        slug
                        companyUrl
                        logoUrl
                        badges {
                            id
                            label
                            tooltip
                            rating
                        }
                        marketTaggings {
                            id
                            slug
                            displayName
                        }
                        locationTaggings {
                            id
                            slug
                            displayName
                        }
                    }
                }
            }
        `;
        return {
            operationName: 'JobApplicationModal',
            variables: {
                jobListingId,
            },
            query: query.loc?.source?.body,
        };
    },

    // COMPANY PROFILE
    companyProfileQuery: (startupSlug: string) => {
        const query = gql`
            query CompanyProfile($startupSlug: String!) {
                startup(slug: $startupSlug) {
                    id
                    name
                    highConcept
                    productDescription
                    companySize
                    logoUrl
                    hiring
                    isOperating
                    hasPremiumJobs
                    published
                    badges {
                        id
                        label
                        tooltip
                        rating
                    }
                    mediaUploads(section: "overview") {
                        id
                        imageUrl
                        videoUrl
                        videoThumbnailUrl
                        mime
                        section
                        order
                    }
                    marketTaggings {
                        id
                        slug
                        displayName
                    }
                    locationTaggings {
                        id
                        slug
                        displayName
                    }
                    totalRaisedAmount
                    startupRounds {
                        totalCount
                        edges {
                            node {
                                id
                                roundType
                                closedAt
                                valuation
                            }
                        }
                    }

                    jobListingsConnection(first: 150) {
                        totalCount
                        edges {
                            node {
                                id
                                description
                                descriptionSnippet
                                slug
                                source
                                atsSource
                                liveStartAt
                                title
                                public
                                remote
                                jobType
                                yearsExperienceMin
                                visaSponsorship
                                locationNames
                                acceptedRemoteLocationNames
                                compensation
                                estimatedSalary
                                equity
                                usesEstimatedSalary
                                remoteConfig {
                                    kind
                                    wfhFlexible
                                    collaborationStartAt
                                    collaborationEndAt
                                    collaborationTimeZone {
                                        id
                                        name
                                    }
                                    hiringTimeZones {
                                        id
                                        name
                                    }
                                }
                                skills {
                                    id
                                    displayName
                                    slug
                                }
                                recruitingContact {
                                    id
                                    user {
                                        id
                                        name
                                        slug
                                        avatarUrl
                                    }
                                }
                            }
                        }
                    }
                    isShell
                    isIncubator
                    cultureMediaUploads: mediaUploads(section: "culture") {
                        id
                        imageUrl
                        videoUrl
                        videoThumbnailUrl
                        mime
                        section
                        order
                    }
                    perks: culturePerks {
                        id
                        category
                        title
                        description
                    }

                    stories(first: 25) {
                        totalCount
                        edges {
                            node {
                                id
                                title
                                summaryHtml
                                slug
                                scheduledAt
                                provider {
                                    id
                                    name
                                }
                                authors {
                                    ... on User {
                                        id
                                        name
                                    }
                                }
                                thumbnail {
                                    id
                                    isProcessed
                                    medium {
                                        id
                                        url
                                        width
                                        height
                                    }
                                }
                            }
                        }
                    }
                    companyUrl
                    twitterUrl
                    blogUrl
                    facebookUrl
                    linkedInUrl
                    productHuntUrl
                }
            }
        `;
        return {
            operationName: 'CompanyProfile',
            variables: {
                startupSlug,
            },
            query: query.loc?.source?.body,
        };
    },

    // Companies List
    companiesListQuery: ({ page, perPage }: { page: number; perPage: number }) => {
        const query = gql`
            query DiscoverStartupSearch(
                $location: String
                $page: Int!
                $perPage: Int
                $market: String
                $isRemote: Boolean
            ) {
                talent {
                    seoLandingPageStartupSearchResults(
                        location: $location
                        page: $page
                        perPage: $perPage
                        market: $market
                        remote: $isRemote
                    ) {
                        totalStartupCount
                        perPage
                        pageCount
                        startups {
                            ...DiscoverStartupFragment
                        }
                    }
                }
            }

            fragment DiscoverStartupFragment on StartupResult {
                id
                name
                slug
                logoUrl
                companyUrl
                companySize
                highConcept
                badges {
                    id
                    label
                    tooltip
                    rating
                }
                highlightedJobListings {
                    id
                    slug
                    title
                }
                marketTaggings {
                    id
                    slug
                    displayName
                }
                locationTaggings {
                    id
                    slug
                    displayName
                }
            }
        `;

        return {
            operationName: 'DiscoverStartupSearch',
            variables: { page, perPage, isRemote: input.remoteOnly },
            query: query.loc?.source?.body,
        };
    },
};
