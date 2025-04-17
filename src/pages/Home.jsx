import NewsFeed from '../components/NewsFeed/NewsFeed.jsx';
import WelcomePage from '../components/Welcome/WelcomePage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <NewsFeed /> : <WelcomePage />;
};

export default Home;
