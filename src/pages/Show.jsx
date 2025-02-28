import React, { useState, useEffect } from 'react';

export default function Show({ showId, onBack }) {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!showId) return;

    fetch(`https://mahnoorspodcastshow.netlify.app/638d9fe5-ee48-4355-9951-246a421bb499/${showId}`)
      .then(res => res.json())
      .then(data => {
        setShow(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setLoading(false); // Handle error state
      });
  }, [showId]);  // Re-fetch when showId changes

  const toggleFavorite = (episodeId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handlePlayPause = (episode) => {
    if (currentEpisode && currentEpisode.episode === episode.episode) {
      setCurrentEpisode(null); // Pause the episode
    } else {
      setCurrentEpisode(episode); // Play the new episode
    }
  };

  if (loading) {
    return <div className="loading">Loading show...</div>;
  }

  return (
    <div className="show-container">
      <button onClick={onBack} className="back-button">← Back to Shows</button>

      <div className="show-header">
        <img src={show.image} alt={show.title} className="show-image" />
        <div>
          <h1>{show.title}</h1>
          <p>{show.description}</p>
        </div>
      </div>

      <div className="seasons">
        {show.seasons.map(season => (
          <div key={season.season} className="season">
            <h2>Season {season.season}</h2>
            <div className="episodes">
              {season.episodes.map(episode => (
                <div key={episode.episode} className="episode">
                  <h3>{episode.title}</h3>
                  <div className="episode-controls">
                    <button onClick={() => handlePlayPause(episode)}>
                      {currentEpisode?.episode === episode.episode ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <button 
                      onClick={() => toggleFavorite(episode.id)}
                      className={favorites.includes(episode.id) ? 'favorite' : ''}
                    >
                      {favorites.includes(episode.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentEpisode && (
        <div className="audio-player">
          <p>Now Playing: {currentEpisode.title}</p>
          <audio
            controls
            autoPlay
            src={currentEpisode.file}
            onEnded={() => setCurrentEpisode(null)}
          />
        </div>
      )}
    </div>
  );
}
