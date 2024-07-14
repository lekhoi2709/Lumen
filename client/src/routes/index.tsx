import { SearchCodeIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import heroImage from "../assets/home/heroImage.png";
import trendingImage1 from "../assets/home/trendingImage1.png";
import trendingImage2 from "../assets/home/trendingImage2.png";
import trendingImage3 from "../assets/home/trendingImage3.png";
import trendingImage4 from "../assets/home/trendingImage4.png";
import Layout from "@/layouts/layout";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";

function HeroSection() {
  return (
    <div className="flex items-center justify-between p-10 bg-orange-50">
      <div className="max-w-lg">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Turn your ambition into a{" "}
          <span className="text-orange-500">success story</span>
        </h1>
        <p className="text-gray-600 mb-8">
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>
        <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search your favourite course"
            className="flex-grow p-4 text-lg text-gray-600 outline-none"
          />
          <button className="bg-orange-500 p-4">
            <SearchCodeIcon size={24} color="#ffffff" />
          </button>
        </div>
      </div>
      <div className="relative">
        <img
          src={heroImage}
          alt="Hero"
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ borderRadius: "50%" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full p-2">
          <div className="w-0 h-0 border-l-8 border-t-4 border-b-4 border-white"></div>
        </div>
      </div>
    </div>
  );
}

function TrendingSection() {
  const trendingCourses = [
    {
      title: "Web Development",
      rating: 4.5,
      reviews: "101,744",
      image: trendingImage1,
    },
    { title: "Python", rating: 4.5, reviews: "101,744", image: trendingImage2 },
    {
      title: "Accounting",
      rating: 4.5,
      reviews: "101,744",
      image: trendingImage3,
    },
    {
      title: "Marketing",
      rating: 4.5,
      reviews: "101,744",
      image: trendingImage4,
    },
  ];

  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-foreground text-center mb-4">
          <span className="text-orange-500">Top</span> Trending
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Here are top trending categories across multiple platforms you can
          pick your field and start learning with the best match for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingCourses.map((course, index) => (
            <div
              key={index}
              className="bg-muted shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-foreground">
                  {course.title}
                </h3>
                <div className="flex items-center mt-2">
                  <StarIcon size={20} className="text-orange-500" />
                  <span className="text-foreground ml-1">{course.rating}</span>
                  <span className="text-muted-foreground ml-2">
                    ({course.reviews})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { user, loginAct } = useAuth();
  const refreshToken = localStorage.getItem("refreshToken");

  const verifyRefreshToken = async () => {
    await axios
      .get(`${process.env.API_URL}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        loginAct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!user && refreshToken) {
    verifyRefreshToken();
  }

  return (
    <Layout sidebar={false} footer={true} className="pt-0 mt-[72px]">
      <HeroSection />
      <TrendingSection />
    </Layout>
  );
}

export default Home;
