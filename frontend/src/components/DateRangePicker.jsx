import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSelect = (ranges) => {
    onChange({
      start: ranges.selection.startDate,
      end: ranges.selection.endDate
    });
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {`${format(value.start, 'MMM d, yyyy')} - ${format(value.end, 'MMM d, yyyy')}`}
      </button>
      
      {showCalendar && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <DateRange
            ranges={[{
              startDate: value.start,
              endDate: value.end,
              key: 'selection'
            }]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;