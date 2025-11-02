import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoCompleteProps {
  fetchOptions: (query: string) => Promise<string[]>;
  onSelectOption: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  fetchOptions,
  onSelectOption,
  placeholder = 'Search...',
  className = '',
  debounceMs = 200,
}) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);

  // Fetch options as input changes (debounced)
  useEffect(() => {
    if (!input) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOptions(input)
        .then((opts) => {
          setOptions(opts);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load');
          setOptions([]);
          setLoading(false);
        });
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, fetchOptions, debounceMs]);

  // Keyboard navigation for options
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || options.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIdx((idx) => Math.min(options.length - 1, idx + 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIdx((idx) => Math.max(0, idx - 1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      handleSelect(options[selectedIdx]);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowOptions(true);
    setSelectedIdx(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
      // Only keep input if it matches an available option
      if (!options.includes(input)) {
        setInput('');
        onSelectOption('');
      }
      // If matches, do nothing (selection already handled)
    }, 150); // allow click select before hiding
  };

  const handleSelect = (val: string) => {
    setInput(val);
    setShowOptions(false);
    setSelectedIdx(-1);
    onSelectOption(val); // Only fire on explicit user select/Enter
  };

  const handleClear = () => {
    setInput('');
    setOptions([]);
    setSelectedIdx(-1);
    inputRef.current?.focus();
    onSelectOption('');
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        ref={inputRef}
        value={input}
        placeholder={placeholder}
        onChange={handleInput}
        onFocus={() => setShowOptions(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className='pr-10'
        autoComplete='off'
      />
      {input.length > 0 && (
        <button
          onClick={handleClear}
          className='absolute top-1/2 right-10 -translate-y-1/2 text-muted-foreground hover:text-primary'
          type='button'
        >
          <X className='w-4 h-4' />
        </button>
      )}
      {loading && (
        <span className='absolute top-1/2 right-4 -translate-y-1/2 animate-spin text-primary'>
          <Loader2 className='w-4 h-4' />
        </span>
      )}

      {showOptions && (options.length > 0 || error) && (
        <Card className='absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-auto border shadow-lg'>
          {error ? (
            <div className='text-sm text-destructive p-2'>{error}</div>
          ) : (
            options.map((option, idx) => (
              <div
                key={option}
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-muted',
                  selectedIdx === idx && 'bg-primary/10 font-semibold'
                )}
                onMouseDown={() => handleSelect(option)}
                onMouseOver={() => setSelectedIdx(idx)}
              >
                {option}
              </div>
            ))
          )}
          {!loading && options.length === 0 && !error && (
            <div className='text-sm text-muted-foreground p-2'>No results</div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AutoComplete;
