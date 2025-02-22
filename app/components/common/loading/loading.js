const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      <p className="mt-4 text-yellow-500">Cargando...</p>
    </div>
  );
};

export default Loading;
