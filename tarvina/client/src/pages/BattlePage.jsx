import { useEffect, useState } from "react";
import api from "../services/api";

export default function BattlePage() {
  const [matches, setMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Eşleşmeleri yükle
  // localStorage'daki token değiştiğinde yeniden çalışır
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const res = await api.post("/matches/start");
        setMatches(res.data);
        setCurrentRound(1);
      } catch (err) {
        console.error("Maçlar yüklenirken hata oluştu:", err);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [localStorage.getItem('token')]); // Token değişimini dinle

  // Oy kullanma
  const handleVote = async (matchId, choice) => {
    try {
      const res = await api.post(`/votes/${matchId}`, { choice });

      setMatches((prev) =>
        prev.map((m) =>
          m._id === matchId
            ? { ...m, votesA: res.data.votesA, votesB: res.data.votesB }
            : m
        )
      );
    } catch (err) {
      console.error("Oy kullanma hatası:", err.response?.data?.error || err.message);
      alert("Oy verme işlemi başarısız oldu. Lütfen tekrar deneyin veya giriş yapın.");
    }
  };

  // Sonraki turu başlat
  const handleNextRound = async () => {
    try {
      const res = await api.post("/matches/next-round", { currentRound });

      if (res.data.winner) {
        setWinner(res.data.winner);
        setMatches([]);
      } else {
        setMatches(res.data);
        setCurrentRound((r) => r + 1);
      }
    } catch (err) {
      console.error("Sonraki tura geçme hatası:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Sonraki tura geçilemedi.");
    }
  };

  const allMatchesVoted = matches.every(m => m.votesA + m.votesB > 0);

  if (isLoading) {
    return <p className="p-6 text-center">Yükleniyor...</p>;
  }

  if (winner) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🏆 Şampiyon 🏆</h1>
        <p className="text-xl font-semibold">{winner.title}</p>
        <p className="text-md text-gray-600">✍️ {winner.author}</p>
      </div>
    );
  }

  if (!matches.length) {
    return <p className="p-6">Eşleşme bulunamadı. Lütfen yeni bir blog yazısı ekleyin.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Round {currentRound}</h1>

      <div className="grid gap-6">
        {matches.map((m) => {
          if (!m.postB) {
            return null;
          }

          const total = m.votesA + m.votesB;
          const percentA = total ? ((m.votesA / total) * 100).toFixed(1) : 0;
          const percentB = total ? ((m.votesB / total) * 100).toFixed(1) : 0;

          return (
            <div key={m._id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                {/* Post A */}
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-semibold">{m.postA?.title}</h2>
                  <button
                    onClick={() => handleVote(m._id, "A")}
                    className={`mt-2 px-4 py-2 rounded ${
                      m.votesA > m.votesB && total > 0 ? 'bg-blue-600' : 'bg-blue-500'
                    } text-white hover:bg-blue-600`}
                  >
                    Oy Ver
                  </button>
                  <p className="mt-1 text-sm">
                    {percentA}% ({m.votesA} oy)
                  </p>
                </div>

                {/* Post B */}
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-semibold">{m.postB?.title}</h2>
                  <button
                    onClick={() => handleVote(m._id, "B")}
                    className={`mt-2 px-4 py-2 rounded ${
                      m.votesB > m.votesA && total > 0 ? 'bg-green-600' : 'bg-green-500'
                    } text-white hover:bg-green-600`}
                  >
                    Oy Ver
                  </button>
                  <p className="mt-1 text-sm">
                    {percentB}% ({m.votesB} oy)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleNextRound}
          className={`px-6 py-3 text-white rounded ${
            allMatchesVoted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!allMatchesVoted}
        >
          Sonraki Tura Geç
        </button>
      </div>
    </div>
  );
}