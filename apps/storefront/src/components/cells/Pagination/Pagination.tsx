'use client';
import { v4 as uuidv4 } from 'uuid';
import { PaginationButton } from '@/components/atoms';
import { CollapseIcon, MeatballsMenuIcon } from '@/icons';

export const Pagination = ({
  pages,
  setPage,
  currentPage,
}: {
  pages: number;
  setPage: (page: number) => void;
  currentPage: number;
}) => {
  const renderPaginationButtons = () => {
    const buttons = [];

    if (currentPage > 2) {
      buttons.push(
        <PaginationButton key={uuidv4()} disabled>
          <MeatballsMenuIcon />
        </PaginationButton>
      );
    }

    if (currentPage > 1) {
      buttons.push(
        <PaginationButton
          key={uuidv4()}
          onClick={() => setPage(currentPage - 1)}
        >
          {currentPage - 1}
        </PaginationButton>
      );
    }

    buttons.push(
      <PaginationButton key={uuidv4()} isActive>
        {currentPage}
      </PaginationButton>
    );

    if (currentPage < pages) {
      buttons.push(
        <PaginationButton
          key={uuidv4()}
          onClick={() => setPage(currentPage + 1)}
        >
          {currentPage + 1}
        </PaginationButton>
      );
    }

    if (currentPage < pages - 1) {
      buttons.push(
        <PaginationButton key={uuidv4()} disabled>
          <MeatballsMenuIcon />
        </PaginationButton>
      );
    }

    return buttons;
  };

  return (
    <div className='flex items-center'>
      <PaginationButton
        disabled={Boolean(currentPage === 1)}
        onClick={() => setPage(currentPage - 1)}
        className='border-none'
      >
        <CollapseIcon size={20} className='rotate-90' />
      </PaginationButton>

      {renderPaginationButtons()}

      <PaginationButton
        disabled={Boolean(currentPage === pages)}
        onClick={() => setPage(currentPage + 1)}
        className='border-none'
      >
        <CollapseIcon size={20} className='-rotate-90' />
      </PaginationButton>
    </div>
  );
};
