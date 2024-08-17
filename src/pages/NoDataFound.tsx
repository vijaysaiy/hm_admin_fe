const NoDataFound = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8  ">
      <p className="text-lg font-medium text-muted-foreground mb-4">
        {message}
      </p>
    </div>
  );
};

export default NoDataFound;
