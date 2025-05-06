import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import TrickForm from "./components/TrickForm";
import TrickList from "./components/TrickList";
import Profile from "./components/Profile";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";

export default function App() {
  const user = useQuery(api.auth.loggedInUser);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col futuristic-bg">
        <header className="bg-gradient-to-r from-blue-900/80 to-indigo-800/80 backdrop-blur-md p-4 border-b border-cyan-400/30 shadow-lg">
          <div>
            <h2 className="text-2xl font-extrabold text-cyan-300 futuristic-font tracking-widest drop-shadow text-center">
              Chess Strategy Generator
            </h2>
            <p className="text-cyan-200 text-sm text-center">Rishikesh Khade Chess Class</p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <SignInForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col futuristic-bg">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/80 to-indigo-800/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-cyan-400/30 shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-cyan-300 futuristic-font tracking-widest drop-shadow">
            Chess Strategy Generator
          </h2>
          <p className="text-cyan-200 text-sm">Rishikesh Khade Chess Class</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-200">{user.name}</span>
          <SignOutButton />
        </div>
      </header>
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Profile userId={user._id} />
          </div>
          <div className="space-y-8">
            <TrickForm />
            <TrickList />
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-900/80 to-indigo-800/80 backdrop-blur-md p-4 border-t border-cyan-400/30">
        <div className="max-w-4xl mx-auto text-center text-cyan-200">
          <p>@rishi_chessnerd</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
