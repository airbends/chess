import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

export default function TrickList() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const tricks = useQuery(api.tricks.list, selectedLevel ? { level: selectedLevel } : {}) ?? {};
  const removeTrick = useMutation(api.tricks.remove);
  const user = useQuery(api.auth.loggedInUser);

  const TrickCard = ({ trick }: { trick: any }) => (
    <div
      key={trick._id}
      className="bg-gradient-to-br from-slate-900/80 to-blue-900/80 border border-cyan-700/30 rounded-xl p-5 shadow-lg glassmorphism"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-cyan-300 futuristic-font">
          {trick.title}
        </span>
        {user?._id === trick.userId && (
          <button
            className="text-xs px-2 py-1 rounded bg-cyan-700/80 text-white hover:bg-cyan-600/90 transition"
            onClick={() => removeTrick({ trickId: trick._id })}
            title="Delete"
          >
            Delete
          </button>
        )}
      </div>
      <div className="text-cyan-200 mb-1">{trick.description}</div>
      <div className="text-cyan-400 text-sm">
        Moves: <span className="font-mono">{trick.moves}</span>
      </div>
      <div className="text-xs text-cyan-500 mt-2">
        By: {trick.profile?.name} ({trick.profile?.chessLevel})
      </div>
    </div>
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-200 futuristic-font">
          Chess Tricks Library
        </h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm transition ${
              !selectedLevel
                ? "bg-cyan-600 text-white"
                : "bg-slate-800/60 text-cyan-300 hover:bg-slate-700/60"
            }`}
            onClick={() => setSelectedLevel(null)}
          >
            All
          </button>
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`px-3 py-1 rounded-md text-sm transition ${
                selectedLevel === level
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800/60 text-cyan-300 hover:bg-slate-700/60"
              }`}
              onClick={() => setSelectedLevel(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(tricks).length === 0 && (
          <div className="text-cyan-400/80 text-center">No tricks yet. Be the first to add one!</div>
        )}
        
        {Object.entries(tricks).map(([level, levelTricks]) => (
          <div key={level} className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-300 capitalize">
              {level} Level Tricks
              <span className="text-sm text-cyan-400 ml-2">
                ({(levelTricks as any[]).length} tricks)
              </span>
            </h3>
            <div className="grid gap-4">
              {(levelTricks as any[]).map((trick) => (
                <TrickCard key={trick._id} trick={trick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
