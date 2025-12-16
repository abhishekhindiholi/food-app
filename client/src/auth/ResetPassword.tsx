import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LockKeyhole, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const loading = false;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-500">
            Enter your new password
          </p>
        </div>
        <div className="relative rounded-sm border border-gray-500">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            name="password"
            className="pl-10"
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none"/>
        </div>
        {
                loading ? <button disabled className="text-white w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</button> : (
                    <button type="submit" className="text-white w-full">Send Reset Link</button>
                )
        }
      <span>
        Back to{" "}
        <Link to="/Login" className="text-blue-500">LogIn</Link>
      </span>
      </form>
    </div>
  );
};

export default ResetPassword;
