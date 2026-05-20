const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gray-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
