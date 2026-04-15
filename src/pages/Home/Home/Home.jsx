import { Helmet } from "react-helmet-async";
import Category from '../Category/Category';
import Contact from '../Contact/Contact';
import Banner from '../Banner/Banner';

const Home = () => {
  return (
    <div className="space-y-16 px-4 md:px-8">
      
      <Helmet>
        <title>Home | My Website</title>
      </Helmet>

      <Banner></Banner>
      <Category />
      <Contact />

    </div>
  );
};

export default Home;