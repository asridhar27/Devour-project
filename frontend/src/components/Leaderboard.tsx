import { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import { toast } from 'react-hot-toast';

export interface LeaderboardEntry {
  communityId: string;
  communityName: string;
  communityLogo: string;
  totalExperience: number;
  numberOfUsers: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:8080/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        toast.error('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Top Community Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="leaderboard-cell">Rank</th>
            <th className="leaderboard-cell">Community</th>
            <th className="leaderboard-cell">EXP</th>
            <th className="leaderboard-cell">Users</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((entry, index) => (
            <tr key={entry.communityId} className="leaderboard-row">
              <td className="leaderboard-cell">{index + 1}</td>
              <td className="leaderboard-cell">
                <img src={entry.communityLogo} alt={entry.communityName} className="community-logo" />
                {entry.communityName}
              </td>
              <td className="leaderboard-cell">{entry.totalExperience}</td>
              <td className="leaderboard-cell">{entry.numberOfUsers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;