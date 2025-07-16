import { TabsTrigger } from '@/components/atoms';
import { Link } from '@/i18n/routing';

export const TabsList = ({
  list,
  activeTab,
}: {
  list: { label: string; link: string }[];
  activeTab: string;
}) => {
  return (
    <div className='flex gap-4 w-full'>
      {list.map(({ label, link }) => (
        <Link key={label} href={link}>
          <TabsTrigger
            isActive={activeTab === label.toLowerCase()}
          >
            {label}
          </TabsTrigger>
        </Link>
      ))}
    </div>
  );
};
