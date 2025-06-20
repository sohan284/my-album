const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`bg-[#ebebeb] rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
