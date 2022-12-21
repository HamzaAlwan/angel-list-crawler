import { gql } from 'graphql-tag';

export const BASE_URL = 'https://angel.co';
export const GRAPHQL_URL = `${BASE_URL}/graphql?fallbackAOR=talent`;
export const COMPANY_URL = `${BASE_URL}/company`;
export const getJobUrl = (company: string, job: string) => `${COMPANY_URL}/${company}/jobs/${job}`;

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

export const graphqlQueries = {
    // JOBS LIST
    jobsList: (remote: boolean) => gql`
        query SeoLandingRoleSearchPage(${remote ? 'remote: true, ' : ''}$role: String!, $page: Int!) {
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
                    }
                }
            }
        }
    `,

    // JOB DETAILS
    jobDetails: gql`
        query JobApplicationModal($jobListingId: ID!) {
            jobListing(id: $jobListingId) {
                id
                title
                slug
                source
                description
                descriptionSnippet
                atsSource
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
                    id
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
                }
            }
        }
    `,

    // COMPANY PROFILE
    companyProfile: gql`
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
                                id
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
    `,
};
