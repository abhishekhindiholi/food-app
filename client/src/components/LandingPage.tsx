import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import HereSection from "./HeroSection";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between h-14 max-w-7xl mx-auto px-4">
        <h1 className="font-bold md:font-extrabold text-2xl">Food Website</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/login")} variant="outline">
            Login
          </Button>
          <Button onClick={() => navigate("/signup")} className="bg-orange hover:bg-hoverOrange">
            Signup
          </Button>
        </div>
      </div>
      <HereSection />
    </div>
  );
};

export default LandingPage;