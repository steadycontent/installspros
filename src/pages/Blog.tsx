import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const blogPosts = [
  {
    title: "Getting Started with Starlink: A Complete Guide",
    excerpt: "Everything you need to know about setting up Starlink for your home or business.",
    date: "2024-01-15",
    slug: "getting-started-starlink",
  },
  {
    title: "Smart Home Automation: Top Trends for 2024",
    excerpt: "Discover the latest smart home technologies and how they can improve your daily life.",
    date: "2024-01-10",
    slug: "smart-home-trends-2024",
  },
  {
    title: "Starlink for RVs and Mobile Homes",
    excerpt: "How to stay connected on the road with Starlink mobile installation.",
    date: "2024-01-05",
    slug: "starlink-rv-mobile",
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog | InstallPros — Satellite Internet & Smart Home Tips</title>
        <meta name="description" content="Expert tips, guides, and news about satellite internet installation and smart home automation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                InstallPros{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Blog
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Tips, guides, and news for satellite internet and smart home enthusiasts.
              </p>
            </div>

            <div className="space-y-6">
              {blogPosts.map((post) => (
                <article key={post.slug} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                </article>
              ))}
            </div>

            <p className="text-center text-gray-500 mt-12">
              More articles coming soon!
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
