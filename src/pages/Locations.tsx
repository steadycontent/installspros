import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const locations = [
  { state: "Colorado", cities: ["Denver", "Colorado Springs", "Boulder", "Fort Collins"] },
  { state: "Texas", cities: ["Houston", "Dallas", "Austin", "San Antonio"] },
  { state: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville"] },
  { state: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham"] },
  { state: "Georgia", cities: ["Atlanta", "Savannah", "Augusta", "Columbus"] },
  { state: "South Carolina", cities: ["Charleston", "Columbia", "Greenville", "Myrtle Beach"] },
  { state: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"] },
  { state: "Virginia", cities: ["Virginia Beach", "Richmond", "Norfolk", "Arlington"] },
  { state: "Arizona", cities: ["Phoenix", "Tucson", "Scottsdale", "Mesa"] },
  { state: "Illinois", cities: ["Chicago", "Aurora", "Naperville", "Rockford"] },
  { state: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"] },
  { state: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"] },
  { state: "Michigan", cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing"] },
  { state: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"] },
  { state: "Alabama", cities: ["Birmingham", "Huntsville", "Montgomery", "Mobile"] },
  { state: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green", "Covington"] },
  { state: "Missouri", cities: ["Kansas City", "St. Louis", "Springfield", "Columbia"] },
  { state: "Oregon", cities: ["Portland", "Eugene", "Salem", "Bend"] },
  { state: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Vancouver"] },
  { state: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"] },
  { state: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"] },
  { state: "New York", cities: ["New York City", "Buffalo", "Albany", "Rochester"] },
  { state: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"] },
  { state: "Arkansas", cities: ["Little Rock", "Fayetteville", "Fort Smith", "Jonesboro"] },
  { state: "Minnesota", cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth"] },
  { state: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"] },
  { state: "Maryland", cities: ["Baltimore", "Annapolis", "Frederick", "Rockville"] },
  { state: "Nevada", cities: ["Las Vegas", "Reno", "Henderson", "Sparks"] },
  { state: "New Jersey", cities: ["Newark", "Jersey City", "Trenton", "Atlantic City"] },
  { state: "Massachusetts", cities: ["Boston", "Worcester", "Springfield", "Cambridge"] },
  { state: "New Mexico", cities: ["Albuquerque", "Santa Fe", "Las Cruces", "Rio Rancho"] },
  { state: "Idaho", cities: ["Boise", "Meridian", "Nampa", "Idaho Falls"] },
  { state: "Utah", cities: ["Salt Lake City", "Provo", "Ogden", "St. George"] },
  { state: "Nebraska", cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island"] },
  { state: "Kansas", cities: ["Wichita", "Overland Park", "Kansas City", "Topeka"] },
  { state: "Mississippi", cities: ["Jackson", "Gulfport", "Hattiesburg", "Biloxi"] },
  { state: "Connecticut", cities: ["Hartford", "New Haven", "Stamford", "Bridgeport"] },
];

const Locations = () => {
  return (
    <>
      <Helmet>
        <title>Service Locations | InstallPros - 37 States Starlink Installation</title>
        <meta name="description" content="InstallPros provides Starlink and smart home installation services across 37 U.S. states. Find a location near you." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Nationwide
                </span>{" "}
                Service Coverage
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our certified installers are available across 37 states. Find service in your area.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {locations.map((location) => (
                <div key={location.state} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">{location.state}</h2>
                  </div>
                  <ul className="space-y-2">
                    {location.cities.map((city) => (
                      <li key={city} className="text-gray-600 text-sm">{city}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Don't see your location?</h2>
              <p className="mb-6 opacity-90">We're expanding rapidly. Contact us for availability in your area.</p>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contact-us">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Locations;
