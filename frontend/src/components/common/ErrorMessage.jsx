const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">😞</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
