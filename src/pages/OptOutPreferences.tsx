import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const OptOutPreferences = () => {
  const [preferences, setPreferences] = useState({
    marketing: true,
    analytics: true,
    thirdParty: false,
  });

  const handleSave = () => {
    localStorage.setItem("optOutPreferences", JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Opt-Out Preferences | InstallPros</title>
        <meta name="description" content="Manage your privacy and communication preferences with InstallPros." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Preferences</h1>
            <p className="text-gray-600 mb-8">
              Manage how we collect and use your data. Changes will be applied immediately.
            </p>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing" className="text-lg font-semibold text-gray-900">Marketing Communications</Label>
                  <p className="text-sm text-gray-600">Receive updates about new services and promotions.</p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics" className="text-lg font-semibold text-gray-900">Analytics & Performance</Label>
                  <p className="text-sm text-gray-600">Help us improve by allowing usage analytics.</p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="thirdParty" className="text-lg font-semibold text-gray-900">Third-Party Sharing</Label>
                  <p className="text-sm text-gray-600">Share data with trusted partners for personalized offers.</p>
                </div>
                <Switch
                  id="thirdParty"
                  checked={preferences.thirdParty}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, thirdParty: checked })}
                />
              </div>

              <Button onClick={handleSave} className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white">
                Save Preferences
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OptOutPreferences;
