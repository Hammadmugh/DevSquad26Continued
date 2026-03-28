import React, { useState } from 'react';

const VideoPlayer = ({ videoUrl, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const videoElement = document.getElementById(`video-${title}`);
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ✕
          </button>
        )}

        {/* Video Player */}
        <video
          id={`video-${title}`}
          className="w-full aspect-video bg-black"
          controls
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Title */}
        <div className="bg-neutral-900 px-6 py-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
