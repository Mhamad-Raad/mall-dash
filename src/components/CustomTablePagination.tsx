import React, { useState, useRef, useEffect } from 'react';

import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  total: number;
  suggestions: number[];
};

const CustomTablePagination: React.FC<Props> = ({ total, suggestions }) => {
  // Initial limit from URL or 40
  function getInitialLimit() {
    const params = new URLSearchParams(window.location.search);
    const limitParam = params.get('limit');
    const asNumber = Number(limitParam);
    return asNumber && asNumber > 0 ? asNumber.toString() : '40';
  }
  function getInitialPage() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const asNumber = Number(pageParam);
    return asNumber && asNumber >= 0 ? asNumber : 0;
  }

  const [value, setValue] = useState(getInitialLimit());
  const [lastValid, setLastValid] = useState(getInitialLimit());
  const [filtered, setFiltered] = useState(suggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(getInitialPage());

  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useRef<any>(null);

  // Filter suggestions on input change
  useEffect(() => {
    const num = Number(value);
    setFiltered(
      suggestions.filter((opt) => opt.toString().includes(value) || opt === num)
    );
  }, [value, suggestions]);

  // Debounced search param update: limit only
  useEffect(() => {
    if (value !== '') setLastValid(value); // Only update last valid when not empty
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      updateSearchParams(page, Number(value || lastValid));
    }, 300);

    return () => debounce.current && clearTimeout(debounce.current);
  }, [value, lastValid, page]);

  // Pagination logic
  const perPage = Number(value || lastValid) || 1;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = page * perPage + 1;
  const to = Math.min(total, (page + 1) * perPage);

  // Search param setter
  function updateSearchParams(newPage: number, newLimit: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('limit', String(newLimit));
    params.set('page', String(newPage));
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    );
  }

  // Suggestion click
  const handleSelect = (opt: number) => {
    setValue(opt.toString());
    setLastValid(opt.toString());
    setShowSuggestions(false);
    inputRef.current?.blur();
    updateSearchParams(page, opt);
  };

  // Input Focus/Blur logic
  const handleFocus = () => setShowSuggestions(true);
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 120); // allow mouse click in dropdown
    if (value === '') setValue(lastValid); // restore if empty
  };

  // Next/Prev buttons immediately update the page param (debounce not needed for buttons)
  const onNext = () => {
    const newPage = Math.min(totalPages - 1, page + 1);
    setPage(newPage);
    updateSearchParams(newPage, perPage);
  };

  const onPrev = () => {
    const newPage = Math.max(0, page - 1);
    setPage(newPage);
    updateSearchParams(newPage, perPage);
  };

  return (
    <div className='flex items-center justify-end space-x-6 bg-card py-3 px-4 rounded-md'>
      <div className='relative'>
        {showSuggestions && filtered.length > 0 && (
          <ul className='absolute left-0 bottom-full mb-1 z-10 bg-popover border border-border w-full rounded shadow-lg max-h-36 overflow-auto'>
            {filtered.map((opt) => (
              <li
                key={opt}
                className='px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors'
                onMouseDown={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
        <input
          ref={inputRef}
          type='text'
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
          className='w-16 h-10 border rounded bg-background px-2 font-medium focus:outline-none border-border transition text-foreground'
          placeholder='Rows'
          autoComplete='off'
        />
      </div>
      <span className='text-muted-foreground text-sm'>
        {from}-{to} of {total}
      </span>
      <button
        className='mx-1 px-2 py-2 rounded disabled:opacity-40 bg-transparent text-foreground hover:bg-muted transition'
        onClick={onPrev}
        disabled={page <= 0}
        aria-label='Previous'
        type='button'
      >
        <ChevronLeft />
      </button>
      <button
        className='mx-1 px-2 py-2 rounded disabled:opacity-40 bg-transparent text-foreground hover:bg-muted transition'
        onClick={onNext}
        disabled={page >= totalPages - 1}
        aria-label='Next'
        type='button'
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default CustomTablePagination;
