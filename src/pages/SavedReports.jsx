import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Heading from '../components/ui/Heading';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { Edit2, Copy, FileText, Trash2, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { reportService } from '../services/reportService';
import { CoverPage, PermissionsPage, ScheduleIXPage, IncomeExpPage, BalanceSheetPage } from './LivePreview';
import { mapBackendPayloadToFormData } from '../utils/reportMapper';

const StatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-orange-50 text-orange-600 border-orange-200',
    completed: 'bg-green-50 text-green-600 border-green-200',
  };

  const statusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${styles[status?.toLowerCase()] || styles.draft}`}>
      {statusLabel}
    </span>
  );
};

const SavedReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await reportService.getReports();
        if (result.success) {
          setReports(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const renderReportDetails = (report) => {
    if (!report) return null;
    const formData = mapBackendPayloadToFormData(report);

    return (
      <div className="bg-slate-100 -mx-6 -my-5 px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-[500px] flex flex-col gap-8">
          <CoverPage formData={formData} />
          <PermissionsPage formData={formData} />
          <ScheduleIXPage formData={formData} />
          <IncomeExpPage formData={formData} />
          <BalanceSheetPage formData={formData} />
        </div>
      </div>
    );
  };

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
          {isLoading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">No reports found. Create one to get started!</div>
          ) : (
            <Table headers={['Report Name', 'Template', 'Created On', 'Status', 'Actions']}>
              {reports.map((report) => (
                <TableRow key={report._id} onClick={() => setSelectedReport(report)} className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-800 w-1/3 font-medium">
                    {report.reportType} Report - {report.trustName || 'Untitled Trust'}
                  </TableCell>
                  <TableCell className="capitalize">{report.reportType} Report</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-slate-400" onClick={(e) => e.stopPropagation()}>
                      <button className="hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                      <button className="hover:text-blue-600 transition-colors"><Copy size={18} /></button>
                      <button className="hover:text-blue-600 transition-colors"><FileText size={18} /></button>
                      <button className="hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </motion.div>
      </main>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Report Details"
        className="max-w-3xl"
      >
        {renderReportDetails(selectedReport)}
      </Modal>
    </div>
  );
};

export default SavedReports;
