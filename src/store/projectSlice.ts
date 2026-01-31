import { apiSlice } from './apiSlice';

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        getProjects: builder.query({
            query: (search) => `/projects${search ? `?search=${search}` : ''}`,
           transformResponse: (response: any) => response.data || [],
            providesTags: ['Projects'],
        }),

        createProject: builder.mutation({
            query: (projectData) => ({
                url: '/projects',
                method: 'POST',
                body: projectData,
            }),
            invalidatesTags: ['Projects'],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/projects/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Projects'],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
  
} = projectApi;
