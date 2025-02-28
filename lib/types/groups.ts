export interface ConstituentGroup {
    id?: string;
    name: string;
    description?: string;
    type: 'geographic' | 'demographic' | 'interest' | 'custom';
    settings?: {
        allowMemberPosts: boolean;
        requireModeration: boolean;
    };
    metadata?: {
        tags: string[];
        district?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    members?: string[];
    representativeId?: string;
    moderators?: string[];
    analytics?: {
        totalMembers: number;
        activeMembers: number;
        postsCount: number;
        engagementRate: number;
    };
}