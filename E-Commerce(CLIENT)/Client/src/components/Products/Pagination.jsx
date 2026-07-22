import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* PREVIOUS BUTTON */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5"/>
      </button>

      {/* PAGE NUMBERS */}
      {getPageNumbers().map((page, index) => {
        return (
          <button
            key={index}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`px-3 py-1 rounded-lg font-medium ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80 transition"
            } ${
              page === "..."
                ? "cursor-default text-muted-foreground"
                : " glass-card hover:glow-on-hover text-foreground hover:text-primary animate-smooth"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* NEXT BUTTON */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5"/>
      </button>
    </div>
  );
};

export default Pagination;
