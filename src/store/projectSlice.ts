import { apiSlice } from './apiSlice';

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        getProjects: builder.query({
            query: (search) => `/projects${search ? `?search=${search}` : ''}`,
            providesTags: ['Project'],
        }),

        createProject: builder.mutation({
            query: (projectData) => ({
                url: '/projects',
                method: 'POST',
                body: projectData,
            }),
            invalidatesTags: ['Project'],
        }),
      
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
  
} = projectApi;
