import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  return (
    <div className="fixed bottom-12 right-8 z-[100]">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        aria-label="Back to top"
      >
        <FaArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
};

export default BackToTop;
