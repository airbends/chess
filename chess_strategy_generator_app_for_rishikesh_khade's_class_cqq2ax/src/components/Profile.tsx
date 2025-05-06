import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function Profile({ userId }: { userId: Id<"users"> }) {
  const profile = useQuery(api.profiles.get, { userId });
  const updateProfile = useMutation(api.profiles.update);
  const userTricks = useQuery(api.tricks.listUserTricks, { userId });
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [chessLevel, setChessLevel] = useState(profile?.chessLevel ?? "");
  
  if (!profile || !userTricks) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({ name, bio, chessLevel });
    setEditing(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/80 p-6 rounded-xl shadow-xl border border-cyan-700/30">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <textarea
              className="input-field"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              required
            />
            <select
              className="input-field"
              value={chessLevel}
              onChange={(e) => setChessLevel(e.target.value)}
              required
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="auth-button">Save</button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cyan-300">{profile.name}</h2>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded bg-cyan-700 text-white"
              >
                Edit Profile
              </button>
            </div>
            <p className="text-cyan-200">{profile.bio}</p>
            <div className="text-cyan-400">Level: {profile.chessLevel}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cyan-300">My Tricks</h3>
        <div className="grid gap-4">
          {userTricks.tricks.map((trick) => (
            <div
              key={trick._id}
              className="bg-gradient-to-br from-slate-900/80 to-blue-900/80 p-4 rounded-lg border border-cyan-700/30"
            >
              <h4 className="font-bold text-cyan-300">{trick.title}</h4>
              <p className="text-cyan-200">{trick.description}</p>
              <div className="text-cyan-400 font-mono mt-2">{trick.moves}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
