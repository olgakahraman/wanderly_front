import { lazy } from 'react';

const CreatePost = lazy(() => import('../pages/CreatePost.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const NewsFeed = lazy(() => import('../components/NewsFeed/NewsFeed.jsx'));

const PrivateRoutes = [
  { path: '/create-post', element: <CreatePost /> },
  { path: '/profile', element: <Profile /> },
  { path: '/news-feed', element: <NewsFeed /> },
];

export default PrivateRoutes;
