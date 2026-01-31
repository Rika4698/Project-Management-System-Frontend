export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'STAFF';
    status: 'ACTIVE' | 'INACTIVE';
    invitedAt?: string;
    createdAt?: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    isDeleted: boolean;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}
