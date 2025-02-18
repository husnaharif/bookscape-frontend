import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseUrl";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: (builder.mutation) ({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            })
        }),
        getOrderByEmail: (builder.query) ({
            query: (email) => ({
                url: `/email/${email}`
            }),
            providesTags: ['Orders']
        }),
        
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
              url: `/orders/${id}/status`,
              method: "PUT",
              body: { status },
            }),
            invalidatesTags: ['Orders'],
          }),
    
    })
})

export const {useCreateOrderMutation, useGetOrderByEmailQuery, useUpdateOrderStatusMutation} = ordersApi;

export default ordersApi;