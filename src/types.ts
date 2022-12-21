// [Start] JOB LISTINGS
export type JobListingResponse = {
    data: {
        talent: {
            seoLandingPageJobSearchResults: {
                totalJobCount: number;
                totalStartupCount: number;
                perPage: number;
                pageCount: number;
                startups: Startup[];
            };
        };
    };
    url?: string;
};
// [End] JOB LISTINGS

// [Start] JOB DETAILS
export type JobDetailsResponse = {
    data: {
        jobListing: {
            id: string;
            title: string;
            slug: string;
            source: string;
            description: string;
            descriptionSnippet: string;
            atsSource: null;
            liveStartAt: number;
            public: boolean;
            remote: boolean;
            jobType: string;
            yearsExperienceMin: number;
            visaSponsorship: boolean;
            locationNames: string[];
            acceptedRemoteLocationNames: any[];
            compensation: string;
            estimatedSalary: null;
            equity: string;
            usesEstimatedSalary: boolean;
            remoteConfig: RemoteConfig;
            skills: Skill[];
            recruitingContact: RecruitingContact;
            startup: Startup;
        };
    };
    url?: string;
};
// [End] JOB DETAILS

// [Start] COMPANY PROFILE
export type companyProfileResponse = {
    data: {
        startup: Startup;
    };
};

export type StartupFull = Startup & {
    hiring: boolean;
    isOperating: null;
    hasPremiumJobs: boolean;
    published: boolean;
    mediaUploads: any[];
    totalRaisedAmount: number;
    isShell: boolean;
    isIncubator: boolean;
    cultureMediaUploads: any[];
    perks: any[];
    startupRounds: {
        totalCount: number;
        edges: {
            node: {
                id: string;
                roundType: string;
                closedAt: number;
                valuation: number;
            };
        }[];
    };
    jobListingsConnection: JobListingsConnection;
    stories: Stories;
    twitterURL: string;
    blogURL: string;
    facebookURL: string;
    linkedInURL: string;
    productHuntURL: string;
};

export type JobListingsConnection = {
    totalCount: number;
    edges: {
        node: {
            id: string;
            description: string;
            descriptionSnippet: string;
            slug: string;
            atsSource: null;
            liveStartAt: number;
            title: string;
            public: boolean;
            remote: boolean;
            jobType: string;
            yearsExperienceMin: number;
            visaSponsorship: boolean;
            locationNames: string[];
            acceptedRemoteLocationNames: string[];
            compensation: string;
            estimatedSalary: null;
            equity: string;
            usesEstimatedSalary: boolean;
            remoteConfig: RemoteConfig;
            skills: Skill[];
            recruitingContact: RecruitingContact;
        };
    }[];
}

export type Stories = {
    totalCount: number;
    edges: {
        node: {
            id: string;
            title: string;
            summaryHTML: string;
            slug: string;
            scheduledAt: number;
            provider: {
                id: string;
                name: string;
            };
            authors: {
                id: string;
                name: string;
            }[];
            thumbnail: {
                id: string;
                isProcessed: boolean;
                medium: {
                    id: string;
                    url: string;
                    width: number;
                    height: number;
                };
            };
        };
    }[];
}
// [End] COMPANY PROFILE

// [Start] SHARED
export type Startup = {
    id: string;
    name: string;
    slug: string;
    logoURL: string;
    productDescription?: string;
    companyURL: string;
    companySize: string;
    highConcept: string;
    badges: {
        id: string;
        label: string;
        tooltip: string;
        rating: null | string;
    }[];
    highlightedJobListings: {
        id: string;
        slug: string;
        title: string;
    }[];
    marketTaggings: Skill[];
};

export type Skill = {
    id: string;
    displayName: string;
    slug: string;
};

export type RemoteConfig = {
    id: string;
    kind: string;
    wfhFlexible: boolean;
    collaborationStartAt: null;
    collaborationEndAt: null;
    collaborationTimeZone: null;
    hiringTimeZones: {
        id: string;
        name: string;
    }[];
};

export type RecruitingContact = {
    id: string;
    user: {
        id: string;
        name: string;
        avatarURL: string;
    };
};
// [End] SHARED

export type Output = {
    company: {
        id: string;
        name: string;
        logo: string;
        url: string;
    };
    recruiter: {
        id: string;
        name: string;
        avatar: string | null;
    };
    jobId: string;
    jobTitle: string;
    jobType: string;
    requiredSkills: string[];
    acceptedRemoteLocationNames: string[];
    visaSponsorship: boolean;
    yearsExperienceMin: number;
    remote: boolean;
    public: boolean;
    locations: string[];
    compensation: string;
    estimatedSalary: string;
    equity: string;
    usesEstimatedSalary: boolean;
    offsiteListingUrl: boolean;
    shouldApplyOffsite: false;
};
