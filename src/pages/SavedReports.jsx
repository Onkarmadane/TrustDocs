import React, { useState, useEffect } from 'react';
import Heading from '../components/ui/Heading';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { Edit2, Copy, FileText, Trash2, Filter, ChevronDown, Download, Loader2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { reportService } from '../services/reportService';
import { CoverPage, PermissionsPage, ScheduleIXPage, IncomeExpPage, BalanceSheetPage } from '../components/auditreport/LivePreview';
import { mapBackendPayloadToFormData } from '../utils/reportMapper';
import SavedReportsSkeleton from '../components/ui/SavedReportsSkeleton';
import useDocumentTitle from '../utils/useDocumentTitle';

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
  useDocumentTitle('Saved Reports');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const result = await reportService.getReports(statusFilter, searchTerm, currentPage);
        if (result.success) {
          setReports(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // If search term is empty, fetch immediately for filter changes
    if (!searchTerm) {
      fetchReports();
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchReports();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [statusFilter, searchTerm, currentPage]);

  const getPageNumbers = () => {
    const totalPages = pagination?.total_pages || 0;
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const handleDownloadPdf = async (reportId, trustName) => {
    setDownloadingId(reportId);
    try {
      const blob = await reportService.downloadPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${trustName || 'Trust'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

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

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-12">
        <Heading
          title="Saved Reports"
          subtitle="All Drafts and finalized reports"
          actions={
            <div className="flex  items-center gap-4 ">
              <div className="relative group">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full sm:w-[140px] md:w-[120px] lg:w-[220px]"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                >
                  <Filter size={16} />
                  {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                    >
                      {['all', 'draft', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${statusFilter === status ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-600'
                            }`}
                        >
                          {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          }
          className="mb-12"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <SavedReportsSkeleton />
          ) : reports.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">No reports found. Create one to get started!</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 px-1">
                <p className="text-slate-500 text-sm font-medium">
                  Showing <span className="text-slate-800 font-bold">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, pagination?.total)}</span> of <span className="text-slate-800 font-bold">{pagination?.total || 0}</span> reports
                </p>
              </div>

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
                        <button
                          onClick={() => handleDownloadPdf(report._id, report.trustName)}
                          disabled={downloadingId === report._id}
                          className={`transition-colors ${downloadingId === report._id ? 'text-blue-500 cursor-not-allowed' : 'hover:text-blue-600'}`}
                          title={downloadingId === report._id ? "Downloading..." : "Download PDF"}
                        >
                          {downloadingId === report._id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Download size={18} />
                          )}
                        </button>
                        <button className="hover:text-red-600 transition-colors" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>

              {pagination && pagination.total_pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    disabled={!pagination.has_prev_page}
                    onClick={() => setCurrentPage(1)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hidden sm:flex items-center justify-center"
                    title="First Page"
                  >
                    <ChevronsLeft size={20} />
                  </button>

                  <button
                    disabled={!pagination.has_prev_page}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1.5 mx-2">
                    {getPageNumbers()[0] > 1 && <span className="text-slate-400 px-2">...</span>}
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${currentPage === pageNum
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30'
                          : 'text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
                          }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    {getPageNumbers()[getPageNumbers().length - 1] < pagination.total_pages && <span className="text-slate-400 px-2">...</span>}
                  </div>

                  <button
                    disabled={!pagination.has_next_page}
                    onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <button
                    disabled={!pagination.has_next_page}
                    onClick={() => setCurrentPage(pagination.total_pages)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hidden sm:flex items-center justify-center"
                    title="Last Page"
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>
              )}
            </>
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
