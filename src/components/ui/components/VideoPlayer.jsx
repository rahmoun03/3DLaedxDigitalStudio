const VideoPlayer = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-11/12 md:w-3/4 lg:w-1/2">
        <video
          src={src}
          controls
          autoPlay
          className="w-full rounded-lg shadow-lg"
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
