'use client';
import { Chip } from '@/components/atoms';
import useFilters from '@/hooks/useFilters';
import { CloseIcon } from '@/icons';
import { useTranslations } from 'next-intl';

export const ActiveFilterElement = ({
  filter,
}: {
  filter: string[];
}) => {
  const t = useTranslations('ProductListing.filters');
  const { updateFilters } = useFilters(filter[0]);

  const activeFilters = filter[1].split(',');

  const removeFilterHandler = (filter: string) => {
    updateFilters(filter);
  };

  return (
    <div className='flex gap-2 items-center'>
      <span className='label-md hidden md:inline-block'>
        {t(`${filter[0]}`)}:
      </span>
      {activeFilters.map((element) => {
        const Element = () => {
          return (
            <span className='flex gap-2 items-center cursor-default whitespace-nowrap'>
              {element}{' '}
              <span
                onClick={() => removeFilterHandler(element)}
              >
                <CloseIcon
                  size={16}
                  className='cursor-pointer'
                />
              </span>
            </span>
          );
        };
        return <Chip key={element} value={<Element />} />;
      })}
    </div>
  );
};
