'use client';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  // const query = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: () => getProfile(),
  //   retry: false,
  // });
  // if (query.isLoading) {
  //   return null;
  // }
  // if (query.isError) {
  //   redirect('/auth/signin');
  // }
  return <>{children}</>;
};

export default layout;
