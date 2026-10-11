import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: { label: string; value: string }[] = [
    { label: 'সব খবর', value: 'all' },
    { label: 'জাতীয়', value: 'জাতীয়' },
    { label: 'আন্তর্জাতিক', value: 'আন্তর্জাতিক' },
    { label: 'ভাইরাল', value: 'ভাইরাল' },
    { label: 'খেলা', value: 'খেলা' },
    { label: 'প্রযুক্তি', value: 'প্রযুক্তি' },
    { label: 'অর্থনীতি', value: 'অর্থনীতি' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none my-4">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              isSelected
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
