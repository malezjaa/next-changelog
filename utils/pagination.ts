export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  const maxVisiblePages = 50;

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pagesToShow: (number | string)[] = [1];
  const leftSiblingIndex = Math.max(currentPage - 2, 1);
  const rightSiblingIndex = Math.min(currentPage + 2, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (shouldShowLeftDots) pagesToShow.push("...");

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) pagesToShow.push(i);
  }

  if (shouldShowRightDots) pagesToShow.push("...");
  if (totalPages > 1) pagesToShow.push(totalPages);

  return pagesToShow;
};
