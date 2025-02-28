import { useState, useEffect } from 'react';

export default function Home({ onShowSelect }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('https://mahnoorspodcastshow.netlify.app/')
      .then(res => res.json())
      .then(data => {
        setShows(data);
        setLoading(false);
      });
  }, []);

  const genres = {
    all: 'All Shows',
    1: 'Personal Growth',
    2: 'Investigative Journalism',
    3: 'History',
    4: 'Comedy',
    5: 'Entertainment',
    6: 'Business',
    7: 'Fiction',
    8: 'News',
    9: 'Kids and Family'
  };

  const filteredShows = selectedGenre === 'all' 
    ? shows 
    : shows.filter(show => show.genres.includes(Number(selectedGenre)));

  const sortedShows = [...filteredShows].sort((a, b) => {
    return sortDirection === 'asc' 
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  if (loading) {
    return <div className="loading">Loading shows...</div>;
  }

  return (
    <div className="container">
      <h1>Podcast Shows</h1>

      <div className="controls">
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {Object.entries(genres).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <button onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}>
          Sort {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>

      <div className="shows-grid">
        {sortedShows.map(show => (
          <div 
            key={show.id} 
            className="show-card"
            onClick={() => onShowSelect(show.id)}
          >
            <img src={show.image} alt={show.title} />
            <h2>{show.title}</h2>
            <div className="genres">
              {show.genres.map(genreId => (
                <span key={genreId} className="genre-tag">
                  {genres[genreId]}
                </span>
              ))}
            </div>
            <p className="seasons">{show.seasons} seasons</p>
            <p className="updated">Updated: {new Date(show.updated).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}