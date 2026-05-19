import Navbar from '../components/layout/Navbar';
import Heading from '../components/ui/Heading';
import Card from '../components/ui/Card';
import Image from '../components/ui/Image';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardImg from '../assets/dashboard.png';

const templates = [
  {
    id: 1,
    title: 'Audit Report',
    description: 'Annual audit report with income, expenditure & auditor remarks.',
    accent: 'bg-blue-400/20'
  },
  {
    id: 2,
    title: 'Non-Dini Register',
    description: 'Schedule VIII non-religious property register entries.',
    accent: 'bg-emerald-400/20'
  },
  {
    id: 3,
    title: 'Donation Report',
    description: 'Donor-wise contributions with receipt details.',
    accent: 'bg-pink-400/20'
  },
  {
    id: 4,
    title: 'Balance Sheet',
    description: 'Statement of assets & liabilities for the financial year.',
    accent: 'bg-orange-400/20'
  }
];



const Templates = () => {
  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-[#F8FAFF]">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-400/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-400/10 blur-[120px] rounded-full translate-x-1/3" />

      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 pt-12 relative z-10">
        <Heading
          title="Report Templates"
          subtitle="Choose a template to begin."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          {/* Left: Template Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                <Card className="p-5 min-h-[230px] w-full max-w-[350px] mx-auto flex flex-col justify-between group border border-slate-200 cursor-pointer hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500  bg-white">
                  {/* Top-Right Accent Glow (Matching design exactly) */}
                  <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[80px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-700 ${template.accent}`} />

                  <div className="relative z-10">
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-600 w-[60px] h-[60px] rounded-[12px] flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform duration-500">
                      <FileText size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-4 tracking-tight">{template.title}</h3>
                    <div className="flex justify-between">
                      <p className="text-slate-500 text-[15px] leading-relaxed font-normal">
                        {template.description}
                      </p>
                      <div className="w-[60px] h-[60px] p-5 ms-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:bg-slate-50 transition-all duration-300">
                        <ArrowRight size={26} className="group-hover:-rotate-45 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                </Card>
              </motion.div>
            ))}

          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-500/15 blur-[120px] rounded-full scale-110" />
            <div className="relative z-10 flex items-center justify-center p-8">
              <Image
                src={dashboardImg}
                alt="Templates Hero"
                className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)]"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};


export default Templates;
