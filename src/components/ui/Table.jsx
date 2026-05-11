import React from 'react';
import { cn } from '../../lib/utils';

const Table = ({ headers, children, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ children, className }) => (
  <tr className={cn("hover:bg-slate-50/50 transition-colors group", className)}>
    {children}
  </tr>
);

const TableCell = ({ children, className }) => (
  <td className={cn("px-6 py-4 text-sm text-slate-600 font-medium", className)}>
    {children}
  </td>
);

export { Table, TableRow, TableCell };