import './App.css'
import UserCommunityRelationshipManager from './components/UserCommunityRelationshipManager'
import Leaderboard from './components/leaderboard';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Toaster position="bottom-right"/>
      <div>
        <a href="https://frameonesoftware.com" target="_blank">
          <img src="/logo.png" className="logo" alt="Frame One Software Logo" />
        </a>
      </div>
      <div>
        <Leaderboard />
        <UserCommunityRelationshipManager />
      </div>
    </>
  )
}

export default App;