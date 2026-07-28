import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  if (totalPages <= 1) return null;


  const getPages = () => {

    const pages = [];


    if (totalPages <= 7) {

      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }


    pages.push(1);


    if (currentPage > 3) {
      pages.push("...");
    }


    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );


    for (let i = start; i <= end; i++) {
      pages.push(i);
    }


    if (currentPage < totalPages - 2) {
      pages.push("...");
    }


    pages.push(totalPages);


    return pages;

  };


  return (

    <div
      className="
        mt-8
        flex
        items-center
        justify-center
        gap-2
      "
    >


      {/* Previous */}

      <button
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-gray-300
          transition
          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        <ChevronLeft size={18} />

      </button>



      {/* Pages */}

      <div
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/5
          px-2
          py-1
          backdrop-blur-xl
        "
      >

        {getPages().map((page, index) => (

          page === "..." ? (

            <span
              key={index}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-gray-500
              "
            >
              ...
            </span>

          ) : (

            <button
              key={page}
              onClick={() =>
                onPageChange(page)
              }
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-sm
                font-semibold
                transition

                ${
                  currentPage === page
                    ? `
                      bg-blue-600
                      text-white
                      shadow-lg
                      shadow-blue-600/30
                    `
                    : `
                      text-gray-300
                      hover:bg-white/10
                    `
                }
              `}
            >
              {page}
            </button>

          )

        ))}

      </div>



      {/* Next */}

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-gray-300
          transition
          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        <ChevronRight size={18} />

      </button>


    </div>

  );

};


export default Pagination;