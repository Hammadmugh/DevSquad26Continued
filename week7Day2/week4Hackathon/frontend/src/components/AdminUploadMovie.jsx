import React, { useState } from 'react';
import { uploadService } from '../services/uploadService';

const AdminUploadMovie = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '2h 30min',
    genres: ['Drama'],
    director: '',
    cast: [],
    year: new Date().getFullYear(),
    contentType: 'movie',
    rating: '4.5',
  });

  const [imageFile, setImageFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleGenresChange = (e) => {
    const genres = e.target.value.split(',').map(g => g.trim()).filter(g => g);
    setFormData(prev => ({
      ...prev,
      genres: genres.length > 0 ? genres : ['Drama'],
    }));
  };

  const handleCastChange = (e) => {
    const cast = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setFormData(prev => ({
      ...prev,
      cast: cast,
    }));
  };

  const handleTrailerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Trailer file must be less than 100MB');
        return;
      }
      setTrailerFile(file);
      setError('');
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Banner file must be less than 50MB');
        return;
      }
      setBannerFile(file);
      setError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Poster image must be less than 20MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!imageFile) {
        throw new Error('Poster image is required');
      }

      console.log('📤 Starting upload process with direct Cloudinary upload...');

      // Upload poster image to Cloudinary
      console.log('📸 Uploading poster image...');
      const imageUrl = await uploadService.uploadToCloudinary(imageFile, 'poster');
      console.log('✅ Poster uploaded:', imageUrl);

      // Upload trailer if provided
      let trailerUrl = null;
      if (trailerFile) {
        console.log('🎬 Uploading trailer video...');
        trailerUrl = await uploadService.uploadToCloudinary(trailerFile, 'trailer');
        console.log('✅ Trailer uploaded:', trailerUrl);
      }

      // Upload banner if provided
      let bannerUrl = null;
      if (bannerFile) {
        console.log('🖼️ Uploading banner image...');
        bannerUrl = await uploadService.uploadToCloudinary(bannerFile, 'banner');
        console.log('✅ Banner uploaded:', bannerUrl);
      }

      // Save movie metadata to backend
      console.log('💾 Saving movie metadata...');
      const movieData = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        genres: formData.genres,
        director: formData.director,
        cast: formData.cast,
        year: formData.year,
        contentType: formData.contentType,
        rating: formData.rating,
        imageUrl,
        trailerUrl,
        bannerUrl,
      };

      const response = await uploadService.saveMovieWithUrls(movieData);
      console.log('✅ Movie saved successfully:', response.data);

      setSuccess('Movie/Show uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: '2h 30min',
        genres: ['Drama'],
        director: '',
        cast: [],
        year: new Date().getFullYear(),
        contentType: 'movie',
        rating: '4.5',
      });
      setImageFile(null);
      setTrailerFile(null);
      setBannerFile(null);

      // Call callback
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Failed to upload movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Movie/Show</h2>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500/50 text-white px-4 py-3 rounded-lg mb-6 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              placeholder="Movie/Show title"
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Type *</label>
            <select
              name="contentType"
              value={formData.contentType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600 transition"
            >
              <option value="movie">Movie</option>
              <option value="show">Show</option>
            </select>
          </div>

          {/* Director */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Director</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              placeholder="Director name"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600 transition"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="10"
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600 transition"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-neutral-300 font-medium mb-2 text-sm">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              placeholder="2h 30min"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Poster Image (JPG, PNG, WebP) *</label>
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer text-center">
              <div className="text-neutral-400 text-sm">
                {imageFile ? (
                  <>
                    <p className="text-green-400 font-semibold">{imageFile.name}</p>
                    <p className="text-xs mt-1">({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Click to select poster or drag and drop</p>
                    <p className="text-xs mt-1">Max file size: 20MB (300x450 recommended)</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Genres (comma separated)</label>
          <input
            type="text"
            value={formData.genres.join(', ')}
            onChange={handleGenresChange}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition mb-3"
            placeholder="Drama, Action, Thriller"
          />
          {formData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-700 text-neutral-200 text-xs rounded-full"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        genres: prev.genres.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="ml-1 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cast */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Cast (comma separated)</label>
          <input
            type="text"
            value={formData.cast.join(', ')}
            onChange={handleCastChange}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition mb-3"
            placeholder="Actor 1, Actor 2, Actor 3"
          />
          {formData.cast.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.cast.map((actor, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-700 text-neutral-200 text-xs rounded-full"
                >
                  {actor}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        cast: prev.cast.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="ml-1 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition resize-none"
            placeholder="Movie/Show description"
          />
        </div>

        {/* Trailer Upload */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Trailer Video (MP4, WebM, MOV)</label>
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition">
            <input
              type="file"
              accept="video/*"
              onChange={handleTrailerChange}
              className="hidden"
              id="trailer-input"
            />
            <label htmlFor="trailer-input" className="cursor-pointer text-center">
              <div className="text-neutral-400 text-sm">
                {trailerFile ? (
                  <>
                    <p className="text-green-400 font-semibold">{trailerFile.name}</p>
                    <p className="text-xs mt-1">({(trailerFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Click to select trailer or drag and drop</p>
                    <p className="text-xs mt-1">Max file size: 100MB</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-neutral-300 font-medium mb-2 text-sm">Banner Image (JPG, PNG, WebP)</label>
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              id="banner-input"
            />
            <label htmlFor="banner-input" className="cursor-pointer text-center">
              <div className="text-neutral-400 text-sm">
                {bannerFile ? (
                  <>
                    <p className="text-green-400 font-semibold">{bannerFile.name}</p>
                    <p className="text-xs mt-1">({(bannerFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Click to select banner or drag and drop</p>
                    <p className="text-xs mt-1">Max file size: 50MB (1920x1080 recommended)</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 border border-neutral-700 hover:border-neutral-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Uploading...' : 'Upload Movie/Show'}
        </button>
      </form>
    </div>
  );
};

export default AdminUploadMovie;
