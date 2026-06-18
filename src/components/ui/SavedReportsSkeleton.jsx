import React from 'react';
import { Table, TableRow, TableCell } from './Table';

const SavedReportsSkeleton = () => {
  // Generate 10 skeleton rows
  const skeletonRows = Array.from({ length: 10 });

  return (
    <Table headers={['Report Name', 'Template', 'Created On', 'Status', 'Actions']}>
      {skeletonRows.map((_, index) => (
        <TableRow key={index} className="hover:bg-transparent">
          {/* Column 1: Report Name & Trust Name */}
          <TableCell className="w-1/3">
            <div className="flex items-center gap-3">
              <div className="w-full space-y-2">
                <div className="h-4 bg-slate-200/80 animate-pulse rounded-lg w-[75%]" />
              </div>
            </div>
          </TableCell>

          {/* Column 2: Template Type */}
          <TableCell>
            <div className="h-4 bg-slate-200/80 animate-pulse rounded-lg w-[60%]" />
          </TableCell>

          {/* Column 3: Created On */}
          <TableCell>
            <div className="h-4 bg-slate-200/80 animate-pulse rounded-lg w-[50%]" />
          </TableCell>

          {/* Column 4: Status Badge */}
          <TableCell>
            <div className="h-7 bg-slate-200/80 animate-pulse rounded-full w-24" />
          </TableCell>

          {/* Column 5: Actions */}
          <TableCell>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-md bg-slate-200/60 animate-pulse" />
              <div className="w-5 h-5 rounded-md bg-slate-200/60 animate-pulse" />
              <div className="w-5 h-5 rounded-md bg-slate-200/60 animate-pulse" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};

export default SavedReportsSkeleton;
