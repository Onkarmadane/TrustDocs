import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// Helper for generic A4 page styling
const A4Page = ({ children, className }) => (
  <div className={cn("bg-white text-black p-10 mx-auto border border-slate-200 shadow-xl shadow-slate-200/50 mb-8 overflow-hidden", className)}
       style={{ 
         width: '210mm',
         minHeight: '297mm',
         fontFamily: "'Tiro Devanagari Marathi', serif",
         fontSize: '14px',
         lineHeight: '1.5'
       }}>
    {children}
  </div>
);

// Format helpers
const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('en-GB');
  return new Date(dateString).toLocaleDateString('en-GB');
};

const getAddress = (formData) => {
  const addressObj = formData.trustDetails?.address || {};
  const parts = [];
  if (addressObj.buildingName) parts.push(addressObj.buildingName);
  if (addressObj.streetName) parts.push(addressObj.streetName);
  if (addressObj.village) parts.push(`मु. ${addressObj.village}`);
  if (addressObj.taluka) parts.push(`ता. ${addressObj.taluka}`);
  if (addressObj.district) parts.push(`जि. ${addressObj.district}`);
  return parts.length > 0 ? parts.join(', ') : "_________________";
};

// --- Page Components ---

const ApplicationPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const presidentName = formData.presidentName || "_________________";
  const date = formatDate(formData.date);
  
  const checklist = formData.checklist || [
    { documentName: 'विधान पत्र (ज्ञापन) मेमोरंडम ऑफ असोसिएशन', isSubmitted: true },
    { documentName: 'नियम व नियमावलीची सत्यप्रत', isSubmitted: true },
    { documentName: 'संमतीपत्र व अधिकारपत्र', isSubmitted: true }
  ];

  return (
    <A4Page>
      <div className="border-2 border-black p-2 text-center font-bold w-64 mx-auto mb-8 text-base">
        परिशिष्ट " अ "<br />
        <span className="text-sm font-normal">(Society Application)</span>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          प्रति,<br />
          मा. सहाय्यक संस्था निबंधक,<br />
          जालना विभाग जालना.
        </div>
        <div>दि. {date}</div>
      </div>

      <table className="w-full mb-8">
        <tbody>
          <tr>
            <td className="w-24 font-bold align-top">विषय :-</td>
            <td className="font-bold underline">संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</td>
          </tr>
          <tr>
            <td className="w-24 font-bold align-top pt-4">संस्थेचे नांव :-</td>
            <td className="pt-4 font-bold text-lg">
              " {trustName} "<br />
              <span className="text-sm font-normal">{address}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-8">
        महोदय,<br />
        <p className="indent-8 mt-2">
          निवेदन सादर करण्यात येते की, वरिल विषयात नमुद केलेल्या संस्थेची नोंदणी अधिनियम 1860 अन्वये
          नोंदणी करावयाची आहे. सबब आपणाकडे खालील प्रमाणे कागदपत्रे सादर करण्यात आलेली आहेत.
        </p>
      </div>

      <table className="w-full border-collapse mb-8 text-sm border border-black">
        <thead>
          <tr>
            <th className="border border-black p-2 w-12">अ.क्र.</th>
            <th className="border border-black p-2">कागदपत्राचे नाव</th>
            <th className="border border-black p-2 w-24">सादर केले</th>
          </tr>
        </thead>
        <tbody>
          {checklist.map((item, i) => (
            <tr key={i}>
              <td className="border border-black p-2 text-center">{i + 1})</td>
              <td className="border border-black p-2">{item.documentName}</td>
              <td className="border border-black p-2 text-center">{item.isSubmitted ? 'होय' : 'नाही'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-8">
        <p className="indent-8">
          पुढे असेही निवेदन करण्यात येते की, वरील संस्थेचे सर्व उद्देश सन 1860 च्या संस्था नोंदणी या अधिनियमाच्या
          कलम 20 अन्वये असून, वरील संस्थेच्या नावांची या नामसदृष्य असलेली अन्य संस्था माझ्या माहिती प्रमाणे
          अस्तित्वात नाही. नोंदणी शुल्क रू. 50/- (अक्षरी पन्नास रूपये फक्त ) भरण्यासाठी तयार आहे.
        </p>
        <p className="text-center font-bold mt-6">
          तरी वरील संस्था नोंदणी अधिनियम 1860 अन्वये त्वरीत नोंदवावी अशी विनंती आहे.
        </p>
      </div>

      <div className="flex justify-between mt-12">
        <div>सहपत्रे :- वरील प्रमाणे</div>
        <div className="text-center">
          आपला विश्वासु,<br /><br /><br />
          <b>{presidentName}</b><br />
          अध्यक्ष<br />
          " {trustName} "<br />
          {address}
        </div>
      </div>
    </A4Page>
  );
};

const MemorandumPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const defaultObjectives = [
      "लोकांना वाचनाची आवड निर्माण करणे.",
      "साहित्यिक, कलावंतास पुरस्कार देऊन कौतुक करणे.",
      "व्याख्याने कविसंमेलन, वादविवाद, परिसंवाद, साहित्यसंमेलन इत्यादी साहित्यिक उपक्रम राबविणे.",
      "लेखक वाचक सुसंवाद घडवून आणणे.",
      "विविध भाषिक पुस्तके उपलब्ध करून देणे."
  ];
  const objectives = (formData.objectives && formData.objectives.length > 0) ? formData.objectives : defaultObjectives;

  return (
    <A4Page>
      <div className="text-center font-bold text-lg mb-6">
        परिशिष्ट " ब "<br />
        <span className="text-base font-normal underline">या संस्थेचे ज्ञापन</span>
      </div>
      <div className="text-center font-bold text-base underline mb-8">
        मेमोरंडम ऑफ असोसिएशन<br />
        (Memorandum of Association)
      </div>

      <table className="w-full mb-6">
        <tbody>
          <tr>
            <td className="w-8 font-bold align-top">1)</td>
            <td className="w-48 font-bold align-top">संस्थेचे नांव :-</td>
            <td className="font-bold text-lg">" {trustName} "</td>
          </tr>
          <tr>
            <td className="w-8 font-bold align-top pt-4">2)</td>
            <td className="w-48 font-bold align-top pt-4">संस्थेच्या कार्यालयाचा पत्ता :</td>
            <td className="pt-4">{address}</td>
          </tr>
          <tr>
            <td className="w-8 font-bold align-top pt-4">3)</td>
            <td className="w-48 font-bold align-top pt-4">संस्थेचे उद्देश :</td>
            <td className="pt-4 font-bold underline">या संस्थेचे उद्देश खालील प्रमाणे आहेत.</td>
          </tr>
        </tbody>
      </table>

      <div className="ml-12 space-y-2">
        {objectives.map((obj, i) => (
          <div key={i}><b>{i + 1})</b> {obj || '_____'}</div>
        ))}
      </div>
    </A4Page>
  );
};

const CommitteePage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
      ? formData.committeeMembers 
      : Array(7).fill({ name: '_________________', address: '_________________', designation: '_________________', age: '____', occupation: '_________________', nationality: 'भारतीय' });

  return (
    <A4Page>
      <div className="mb-6">
        <b>4) " {trustName} "</b> {address}. या संस्थेचे 
        नियम व नियमावली प्रमाणे या कार्यकारी मंडळावर सदरहु संस्थेच्या कार्यकारी मंडळाचा संस्थेचा कार्यभार सोपविण्यात 
        आला आहे. त्या पहिल्या कार्यकारी मंडळाचा संपुर्ण पत्ता, हुद्दा, वय, व्यवसाय, राष्ट्रीयत्व खालील प्रमाणे आहे.
      </div>

      <table className="w-full border-collapse border border-black text-[13px] mb-8">
        <thead>
          <tr>
            <th className="border border-black p-2">अ.क्र.</th>
            <th className="border border-black p-2">सभासदाचे संपूर्ण नांव</th>
            <th className="border border-black p-2">पत्ता</th>
            <th className="border border-black p-2">पद</th>
            <th className="border border-black p-2">वय</th>
            <th className="border border-black p-2">व्यवसाय</th>
            <th className="border border-black p-2">राष्ट्रीयत्व</th>
          </tr>
        </thead>
        <tbody>
          {committeeMembers.map((m, i) => (
            <tr key={i}>
              <td className="border border-black p-2 text-center">{i + 1}</td>
              <td className="border border-black p-2">{m.name || '_____'}</td>
              <td className="border border-black p-2">{m.address || '_____'}</td>
              <td className="border border-black p-2">{m.designation || '_____'}</td>
              <td className="border border-black p-2 text-center">{m.age || '_____'}</td>
              <td className="border border-black p-2">{m.occupation || '_____'}</td>
              <td className="border border-black p-2">{m.nationality || 'भारतीय'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between px-8 mt-12">
        <div>अध्यक्ष: {formData.presidentName || "_________________"}</div>
        <div>उपाध्यक्ष: {formData.vicePresidentName || "_________________"}</div>
        <div>सचिव: {formData.secretaryName || "_________________"}</div>
      </div>
    </A4Page>
  );
};

const SignaturesPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const date = formatDate(formData.date);
  const place = formData.place || "_________________";
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
      ? formData.committeeMembers 
      : Array(7).fill({ name: '_________________', address: '_________________' });

  return (
    <A4Page>
      <div className="mb-6">
        <b>5.</b> आम्ही खालील सह्या करणार <b>" {trustName} "</b> {address}. 
        चे पदाधिकारी सदस्य जाहीर करतो की, संस्था अधिनियम 1860 अन्वये अभिप्रेत
        केलेली संस्था अस्तित्वात आणण्याची आमची ईच्छा असून वरील उद्देशाने आम्ही एकत्र येऊन 
        <b>" {trustName} "</b> {address}. ही संस्था आज दिनांक <b>{date}</b> रोजी स्थापन केली असून 
        संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी करण्यासाठी आम्ही या विधानपत्रावर सह्या केल्या आहेत.
      </div>

      <table className="w-full border-collapse border border-black text-[13px] mb-8">
        <thead>
          <tr>
            <th className="border border-black p-2 w-12">अ.क्र.</th>
            <th className="border border-black p-2">सभासदाचे संपूर्ण नांव</th>
            <th className="border border-black p-2">पत्ता</th>
            <th className="border border-black p-2 w-32">सही</th>
          </tr>
        </thead>
        <tbody>
          {committeeMembers.map((m, i) => (
            <tr key={i}>
              <td className="border border-black p-2 text-center">{i + 1}</td>
              <td className="border border-black p-2">{m.name || '_____'}</td>
              <td className="border border-black p-2">{m.address || '_____'}</td>
              <td className="border border-black p-2 h-10"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8">
        स्थळ : {place}<br />
        दिनांक : {date}
      </div>

      <div className="mt-12 ml-[50%]">
        वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br />
        व त्यांनी माझ्या समक्ष या विधानपत्रावर सह्या केल्या आहेत.<br /><br /><br />
        <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
      </div>
    </A4Page>
  );
};


//MAIN LIVE PREVIEW COMPONENT
const LivePreview = ({ currentStep, formData, zoom = 100, setZoom }) => {
  const viewportRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [previewPage, setPreviewPage] = React.useState(1);

  const handleFit = React.useCallback(() => {
    if (!viewportRef.current) return;
    const viewport = viewportRef.current;
    // 210mm is approximately 794px at 96dpi
    const baseWidth = 794;
    const baseHeight = 1123;
    
    // Calculate available space in viewport
    const vWidth = viewport.clientWidth - (isFullscreen ? 120 : 40);
    
    // Fit strictly to width (100% of container width)
    const fitScale = vWidth / baseWidth;
    const fitZoom = Math.round(fitScale * 100);
    setZoom?.(Math.min(250, Math.max(30, fitZoom)));
  }, [isFullscreen, setZoom]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      setTimeout(handleFit, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFit]);

  React.useEffect(() => {
    window.addEventListener('resize', handleFit);
    // Call once on mount to set initial fit
    const timer = setTimeout(() => handleFit(), 100);
    return () => {
      window.removeEventListener('resize', handleFit);
      clearTimeout(timer);
    };
  }, [handleFit]);

  React.useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        setZoom?.(prev => Math.min(250, Math.max(30, prev + delta)));
      }
    };
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (viewport) viewport.removeEventListener('wheel', handleWheel);
    };
  }, [setZoom]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const renderContent = () => {
    const stepToRender = currentStep === 3 ? previewPage : currentStep;
    return (
      <motion.div
        key={`${stepToRender}`}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full"
      >
        {(() => {
          switch (stepToRender) {
            case 1: return <ApplicationPage formData={formData} />;
            case 2: return <MemorandumPage formData={formData} />;
            case 3: return <CommitteePage formData={formData} />;
            case 4: return <SignaturesPage formData={formData} />;
            default: return <ApplicationPage formData={formData} />;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "lg:col-span-5 sticky top-8 transition-all duration-700 ease-in-out",
        isFullscreen
          ? "fixed inset-0 z-[100] h-auto w-screen bg-slate-950 flex flex-col items-center justify-center p-0 overflow-hidden"
          : "h-auto "
      )}
    >
      {!isFullscreen && (
        <div className="flex items-center justify-between mb-4 bg-white/80 p-3 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Live Preview</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              A4 — Real Time
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.max(30, prev - 10))}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Zoom Out"
            >
              <Search size={14} className="scale-x-[-1]" />
            </button>
            <div className="w-14 text-center">
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">{zoom}%</span>
            </div>
            <button
              onClick={() => setZoom(prev => Math.min(250, prev + 10))}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Zoom In"
            >
              <Search size={14} />
            </button>
            <div className="w-px h-4 bg-slate-100 mx-1" />
            <button
              onClick={() => setZoom(100)}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Reset Zoom"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2.5 rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center gap-1 px-2">
              <button
                onClick={() => setZoom(prev => Math.max(30, prev - 10))}
                className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <Minimize2 size={18} />
              </button>
              <span className="w-16 text-center text-xs font-bold text-white tabular-nums">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(250, prev + 10))}
                className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <button
              onClick={toggleFullscreen}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
            >
              <Minimize2 size={16} />
              Exit Full View
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={viewportRef}
        className={cn(
          "relative transition-all duration-500 flex flex-col items-center overflow-auto scrollbar-hide select-none w-full",
          isFullscreen
            ? "h-auto bg-transparent p-12 md:p-20"
            : "h-[calc(100vh-200px)] bg-slate-50 border border-slate-100 shadow-inner rounded-3xl pb-10"
        )}
      >
        {currentStep === 3 && (
          <>
            <button
              onClick={() => setPreviewPage(prev => Math.max(1, prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50"
              disabled={previewPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setPreviewPage(prev => Math.min(4, prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50"
              disabled={previewPage === 4}
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 z-50">
              Page {previewPage} of 4
            </div>
          </>
        )}

        <motion.div
          layout
          drag={zoom > 100}
          dragMomentum={false}
          onClick={(e) => {
            if (zoom <= 100) toggleFullscreen();
          }}
          className={cn(
            "flex-shrink-0 origin-top mt-8 transition-shadow duration-500",
            zoom > 100 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
          )}
          style={{
            width: '210mm',
            scale: zoom / 100,
            transformOrigin: 'top center'
          }}
          animate={{
            scale: zoom / 100,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LivePreview;
