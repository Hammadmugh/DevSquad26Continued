import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminMoviesList = ({ onRefresh }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMovies?.();
      
      // Fallback if getAllMovies doesn't exist
      if (!response) {
        const mockMovies = [];
        setMovies(mockMovies);
      } else {
        setMovies(response.data || response);
      }
    } catch (err) {
      setError('Failed to load movies');
      console.log('Movie fetch error (expected if endpoint not created yet):', err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setEditData({
      title: movie.title,
      description: movie.description,
      director: movie.director,
      rating: movie.rating,
      duration: movie.duration,
      year: movie.year,
    });
  };

  const handleSaveEdit = async (movieId) => {
    try {
      await adminService.updateMovie?.(movieId, editData);
      setSuccess('Movie updated successfully!');
      setEditingId(null);
      fetchMovies();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update movie');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await adminService.deleteMovie?.(movieId);
        setSuccess('Movie deleted successfully!');
        fetchMovies();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete movie');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const filteredMovies = movies.filter(movie => {
    if (filterType === 'all') return true;
    return movie.contentType === filterType;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-400"></div>
        <p className="text-neutral-400 mt-4">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-white px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500/50 text-white px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-neutral-800">
        {['all', 'movie', 'show'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-6 py-3 font-semibold transition ${
              filterType === type
                ? 'text-white border-b-2 border-neutral-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {type === 'all' ? 'All Content' : type === 'movie' ? 'Movies' : 'Shows'}
            {filterType === type && (
              <span className="ml-2 text-xs bg-neutral-700 px-2 py-1 rounded">
                {filteredMovies.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Movies List */}
      <div className="space-y-4">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-neutral-400">No {filterType === 'all' ? 'content' : filterType + 's'} found</p>
          </div>
        ) : (
          filteredMovies.map(movie => (
            <div key={movie._id} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
              {/* Movie Header - Always Visible */}
              <div
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition"
                onClick={() =>
                  setExpandedId(expandedId === movie._id ? null : movie._id)
                }
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {movie.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    {movie.contentType === 'show' ? 'TV Show' : 'Movie'} • {movie.year}
                  </p>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm font-semibold">
                      ★ {movie.rating || 'N/A'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(movie);
                      setExpandedId(movie._id);
                    }}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={18} className="text-blue-400" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(movie._id);
                    }}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>

                  {expandedId === movie._id ? (
                    <ChevronUp size={20} className="text-neutral-400" />
                  ) : (
                    <ChevronDown size={20} className="text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === movie._id && (
                <div className="border-t border-neutral-800 p-6 bg-neutral-800/50">
                  {editingId === movie._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-300 text-sm font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) =>
                            setEditData(prev => ({ ...prev, title: e.target.value }))
                          }
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData(prev => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white resize-none"
                          rows="3"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-neutral-300 text-sm font-medium mb-2">
                            Director
                          </label>
                          <input
                            type="text"
                            value={editData.director}
                            onChange={(e) =>
                              setEditData(prev => ({ ...prev, director: e.target.value }))
                            }
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 text-sm font-medium mb-2">
                            Rating
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={editData.rating}
                            onChange={(e) =>
                              setEditData(prev => ({ ...prev, rating: e.target.value }))
                            }
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 text-sm font-medium mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={editData.duration}
                            onChange={(e) =>
                              setEditData(prev => ({ ...prev, duration: e.target.value }))
                            }
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 text-sm font-medium mb-2">
                            Year
                          </label>
                          <input
                            type="number"
                            value={editData.year}
                            onChange={(e) =>
                              setEditData(prev => ({ ...prev, year: parseInt(e.target.value) }))
                            }
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => handleSaveEdit(movie._id)}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-neutral-400 text-sm font-medium">Description</h4>
                        <p className="text-neutral-300 mt-2">{movie.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-neutral-400 text-xs font-medium">DIRECTOR</p>
                          <p className="text-white mt-1">{movie.director}</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-xs font-medium">DURATION</p>
                          <p className="text-white mt-1">{movie.duration}</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-xs font-medium">GENRES</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {movie.genres?.slice(0, 2).map((genre, idx) => (
                              <span key={idx} className="text-xs bg-neutral-700 px-2 py-1 rounded">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-xs font-medium">CAST</p>
                          <p className="text-white text-sm mt-1">
                            {movie.cast?.length || 0} cast members
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-neutral-400 text-sm">Media URLs</p>
                        <div className="mt-2 space-y-2 text-xs">
                          {movie.image && (
                            <p className="text-green-400">✓ Poster Image</p>
                          )}
                          {movie.trailerUrl && (
                            <p className="text-green-400">✓ Trailer Video</p>
                          )}
                          {movie.bannerUrl && (
                            <p className="text-green-400">✓ Banner Image</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMoviesList;
