import React from 'react';
import Navbar from '../components/layout/Navbar';
import Heading from '../components/ui/Heading';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Edit2, Copy, FileText, Trash2, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const reports = [
  { id: 1, name: 'Audit Report - Jay bhavani Jay shivaji Sanstha', template: 'Audit Report', date: '12/02/2026', status: 'Draft' },
  { id: 2, name: 'Audit Report - Jay bhavani Jay shivaji Sanstha', template: 'Audit Report', date: '12/02/2026', status: 'Created' },
  { id: 3, name: 'Audit Report - Jay bhavani Jay shivaji Sanstha', template: 'Audit Report', date: '12/02/2026', status: 'Draft' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Draft: 'bg-orange-50 text-orange-600 border-orange-200',
    Created: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const SavedReports = () => {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-8 pt-12">
        <Heading 
          title="Saved Reports" 
          subtitle="All Drafts and finalized reports"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <Filter size={16} />
              All Status
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          }
          className="mb-12"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Table headers={['Report Name', 'Template', 'Created On', 'Status', 'Actions']}>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="text-slate-800 w-1/3">{report.name}</TableCell>
                <TableCell>{report.template}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                    <button className="hover:text-blue-600 transition-colors"><Copy size={18} /></button>
                    <button className="hover:text-blue-600 transition-colors"><FileText size={18} /></button>
                    <button className="hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </motion.div>
      </main>
    </div>
  );
};

export default SavedReports;
