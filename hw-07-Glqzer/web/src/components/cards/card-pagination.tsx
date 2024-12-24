import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CardPagination: React.FC<CardPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageLinks = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1); // Show the previous page
    const endPage = Math.min(totalPages, currentPage + 1); // Show the next page

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={`${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </PaginationItem>

        {/* First page with ellipsis if applicable */}
        {currentPage > 2 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 3 && <PaginationEllipsis />}
          </>
        )}

        {/* Dynamically rendered page links */}
        {renderPageLinks()}

        {/* Last page with ellipsis if applicable */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={`${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CardPagination;
