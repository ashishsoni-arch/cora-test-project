import { memo } from 'react';

const SearchInput = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <input
      type="text"
      placeholder="Search users..."
      className="rounded-xl border px-4 py-2 border-slate-300"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default memo(SearchInput);
