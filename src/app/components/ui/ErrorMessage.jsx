"use client";

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[80vh]">
      <div className="bg-red-100 border w-[80vw] border-red-400 text-red-700 px-4 py-6 rounded-lg shadow-md max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-4">🚨 Error Occurred</h2>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
