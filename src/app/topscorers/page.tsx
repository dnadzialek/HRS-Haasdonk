import { MATCHES } from "../../data/matches";

export default function TopScorersPage() {
  // Aggregate scorers
  const playerStats: Record<string, { totalGoals: number; matchesPlayed: number }> = {};

  MATCHES.forEach(match => {
    match.scorers.forEach(scorer => {
      if (!playerStats[scorer.name]) {
        playerStats[scorer.name] = { totalGoals: 0, matchesPlayed: 0 };
      }
      playerStats[scorer.name].totalGoals += scorer.goals;
      playerStats[scorer.name].matchesPlayed += 1;
    });
  });

  // Sort by total goals descending
  const sortedPlayers = Object.entries(playerStats)
    .sort((a, b) => b[1].totalGoals - a[1].totalGoals)
    .map(([name, stats], index) => ({
      name,
      ...stats,
      rank: index + 1
    }));

  return (
    <div className="p-4 md:p-12 overflow-y-auto w-full h-full relative z-10 bg-slate-50">
      <header className="mb-8 md:mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-red-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-1 md:mb-2">Seizoen 2026</h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Top<span className="text-red-600">schutters</span>
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-20">
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-4 text-center">
          <h2 className="text-white font-black text-xl tracking-widest uppercase">Klassement</h2>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-slate-400 font-bold text-sm uppercase tracking-wider text-center w-16">#</th>
                <th className="p-4 text-slate-400 font-bold text-sm uppercase tracking-wider">Speler</th>
                <th className="p-4 text-red-500 font-bold text-sm uppercase tracking-wider text-center">Goals</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.name} className={`border-b border-slate-50 transition-colors hover:bg-slate-50 ${index === 0 ? 'bg-amber-50/30' : ''}`}>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                      index === 0 ? 'bg-amber-400 text-amber-900' :
                      index === 1 ? 'bg-slate-300 text-slate-700' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {player.rank}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800 text-lg">
                    {player.name}
                    {index === 0 && <span className="ml-2 text-xl" title="Topschutter">👑</span>}
                  </td>
                  <td className="p-4 text-center font-black text-xl text-red-600">
                    {player.totalGoals}
                  </td>
                </tr>
              ))}
              {sortedPlayers.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 font-medium italic">
                    Nog geen doelpunten geregistreerd.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

