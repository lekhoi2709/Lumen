import { SearchCodeIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import heroImage from "../assets/home/heroImage.png";
import trendingImage1 from "../assets/home/trendingImage1.png";
import trendingImage2 from "../assets/home/trendingImage2.png";
import trendingImage3 from "../assets/home/trendingImage3.png";
import trendingImage4 from "../assets/home/trendingImage4.png";
import Layout from "@/layouts/layout";
import { useAuth } from "@/contexts/auth-context";
import { verifyRefreshToken } from "@/services/api/auth-api";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

function HeroSection() {
  return (
    <div className="flex items-center justify-between bg-orange-50 p-10">
      <div className="max-w-lg">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">
          Turn your ambition into a{" "}
          <span className="text-orange-500">success story</span>
        </h1>
        <p className="mb-8 text-gray-600">
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>
        <div className="flex items-center overflow-hidden rounded-full bg-white shadow-lg">
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
          className="overflow-hidden rounded-lg shadow-lg"
          style={{ borderRadius: "50%" }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-orange-500 p-2">
          <div className="h-0 w-0 border-b-4 border-l-8 border-t-4 border-white"></div>
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
    <div className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-4xl font-extrabold text-foreground">
          <span className="text-orange-500">Top</span> Trending
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Here are top trending categories across multiple platforms you can
          pick your field and start learning with the best match for you.
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trendingCourses.map((course, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-muted shadow-lg"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-foreground">
                  {course.title}
                </h3>
                <div className="mt-2 flex items-center">
                  <StarIcon size={20} className="text-orange-500" />
                  <span className="ml-1 text-foreground">{course.rating}</span>
                  <span className="ml-2 text-muted-foreground">
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      await verifyRefreshToken()
        .then((res) => {
          loginAct(res);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout sidebar={false} footer={true} className="mt-[72px] pt-0">
      <HeroSection />
      <TrendingSection />
    </Layout>
  );
}

export default Home;
