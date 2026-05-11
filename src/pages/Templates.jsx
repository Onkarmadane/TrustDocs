import Navbar from '../components/layout/Navbar';
import Heading from '../components/ui/Heading';
import Card from '../components/ui/Card';
import Image from '../components/ui/Image';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
  { 
    id: 1, 
    title: 'Audit Report', 
    description: 'Annual audit report with income, expenditure & auditor remarks.',
    gradient: 'from-blue-50/50 to-indigo-50/50'
  },
  { 
    id: 2, 
    title: 'Non-Dini Register', 
    description: 'Schedule VIII non-religious property register entries.',
    gradient: 'from-emerald-50/50 to-teal-50/50'
  },
  { 
    id: 3, 
    title: 'Donation Report', 
    description: 'Donor-wise contributions with receipt details.',
    gradient: 'from-pink-50/50 to-rose-50/50'
  },
  { 
    id: 4, 
    title: 'Balance Sheet', 
    description: 'Statement of assets & liabilities for the financial year.',
    gradient: 'from-orange-50/50 to-amber-50/50'
  }
];

const Templates = () => {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-8 pt-12">
        <Heading 
          title="Report Templates" 
          subtitle="Choose a template to begin."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Template Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-8 h-full flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all border-slate-100 bg-gradient-to-br ${template.gradient}`}>
                  <div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{template.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{template.description}</p>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                      <ArrowRight size={20} className="group-hover:-rotate-45 transition-transform" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right: Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="relative z-10 flex items-center justify-center p-12">
               <Image src="/dashboard.png" alt="Templates Hero" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
