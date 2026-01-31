import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) =>
                `/users?page=${page}&limit=${limit}&search=${search}`,
              transformResponse: (response: any) => ({
        users: response.data,
        meta: response.meta,
      }),
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        updateUserStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/users/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['User'],
        }),
        inviteUser: builder.mutation({
            query: (data) => ({
                url: '/auth/invite',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
    useInviteUserMutation,
} = userApi;
