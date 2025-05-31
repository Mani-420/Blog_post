const Spinner = () => (
  <div className="flex items-center justify-center min-h-[100px]">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-4 text-blue-600 font-medium">Loading...</span>
  </div>
);

export default Spinner;
