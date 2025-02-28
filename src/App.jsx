
import { useState } from 'react';
import Home from './pages/Home.jsx';
import Show from './pages/Show.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedShow, setSelectedShow] = useState(null);

  const renderPage = () => {
    if (currentPage === 'show' && selectedShow) {
      return <Show 
        showId={selectedShow} 
        onBack={() => setCurrentPage('home')}
      />;
    }
    return <Home onShowSelect={(id) => {
      setSelectedShow(id);
      setCurrentPage('show');
    }} />;
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

export default App;
