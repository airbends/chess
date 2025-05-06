import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TrickForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moves, setMoves] = useState("");
  const [level, setLevel] = useState("beginner");
  const createTrick = useMutation(api.tricks.create);
  const generateTrick = useAction(api.tricks_ai.generateTrick);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createTrick({ title, description, moves, level });
    setTitle("");
    setDescription("");
    setMoves("");
    setLevel("beginner");
    setLoading(false);
  }

  async function handleGenerateAI() {
    setAiLoading(true);
    try {
      const ai = await generateTrick({});
      setTitle(ai.title);
      setDescription(ai.description);
      setMoves(ai.moves);
    } catch (e) {
      alert("AI failed to generate a trick. Try again!");
    }
    setAiLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-blue-900/80 to-indigo-800/80 p-6 rounded-xl shadow-xl border border-blue-400/30 flex flex-col gap-4 glassmorphism"
    >
      <h3 className="text-2xl font-bold text-cyan-300 futuristic-font">Add a Chess Trick</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-1">Name</label>
          <input
            className="input-field bg-slate-900/60 text-cyan-200 border-cyan-400 placeholder:text-cyan-400"
            placeholder="Trick Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-1">Description</label>
          <textarea
            className="input-field bg-slate-900/60 text-cyan-200 border-cyan-400 placeholder:text-cyan-400"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            maxLength={200}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-1">Moves</label>
          <input
            className="input-field bg-slate-900/60 text-cyan-200 border-cyan-400 placeholder:text-cyan-400"
            placeholder="Key Moves (e.g. e4, Nf3, Bb5)"
            value={moves}
            onChange={e => setMoves(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-1">Difficulty Level</label>
          <select
            className="input-field bg-slate-900/60 text-cyan-200 border-cyan-400"
            value={level}
            onChange={e => setLevel(e.target.value)}
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className="w-full px-4 py-2 rounded bg-cyan-700/80 text-white hover:bg-cyan-600/90 transition"
          onClick={handleGenerateAI}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "Generate with AI"}
        </button>

        <button
          className="auth-button bg-gradient-to-r from-cyan-500 to-blue-700 shadow-lg hover:from-cyan-400 hover:to-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Trick"}
        </button>
      </div>
    </form>
  );
}
