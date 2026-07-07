import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ── A4 Page wrapper matching Audit LivePreview style ──
const A4Page = ({ children, pageLabel }) => (
  <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative w-full aspect-[1/1.414] shrink-0 rounded-[2px] transition-all duration-500 overflow-hidden group">
    {/* Subtle Paper Texture Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

    <div className="h-full p-7 select-none relative z-10" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
      {children}
    </div>

    {pageLabel && (
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.3em]">{pageLabel}</span>
      </div>
    )}

    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
      <span className="text-[7px] font-bold text-green-600 uppercase tracking-widest">Live Sync</span>
    </div>
  </div>
);

// ── Format helpers ──
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

// ── Page 1: Application (परिशिष्ट "अ") ──
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
    <A4Page pageLabel="Page 1 — Application">
      <div className="text-[5.5px] leading-relaxed h-full flex flex-col">
        <div className="border border-black p-1 text-center font-bold mx-auto mb-4 text-[7px]">
          परिशिष्ट " अ "<br />
          <span className="text-[5.5px] font-normal">(Society Application)</span>
        </div>

        <div className="flex justify-between mb-4 text-[5.5px]">
          <div>
            प्रति,<br />
            मा. सहाय्यक संस्था निबंधक,<br />
            जालना विभाग जालना.
          </div>
          <div>दि. {date}</div>
        </div>

        <table className="w-full mb-3 text-[5.5px]">
          <tbody>
            <tr>
              <td className="w-16 font-bold align-top">विषय :-</td>
              <td className="font-bold underline">संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</td>
            </tr>
            <tr>
              <td className="w-16 font-bold align-top pt-2">संस्थेचे नांव :-</td>
              <td className="pt-2 font-bold text-[7px]">
                " {trustName} "<br />
                <span className="text-[5px] font-normal">{address}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mb-3 text-[5.5px]">
          महोदय,<br />
          <p className="indent-4 mt-1">
            निवेदन सादर करण्यात येते की, वरिल विषयात नमुद केलेल्या संस्थेची नोंदणी अधिनियम 1860 अन्वये
            नोंदणी करावयाची आहे. सबब आपणाकडे खालील प्रमाणे कागदपत्रे सादर करण्यात आलेली आहेत.
          </p>
        </div>

        <table className="w-full border-collapse mb-3 text-[5px] border border-black">
          <thead>
            <tr>
              <th className="border border-black p-1 w-8">अ.क्र.</th>
              <th className="border border-black p-1">कागदपत्राचे नाव</th>
              <th className="border border-black p-1 w-14">सादर केले</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((item, i) => (
              <tr key={i}>
                <td className="border border-black p-1 text-center">{i + 1})</td>
                <td className="border border-black p-1">{item.documentName}</td>
                <td className="border border-black p-1 text-center">{item.isSubmitted ? 'होय' : 'नाही'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-3 text-[5px]">
          <p className="indent-4">
            पुढे असेही निवेदन करण्यात येते की, वरील संस्थेचे सर्व उद्देश सन 1860 च्या संस्था नोंदणी या अधिनियमाच्या
            कलम 20 अन्वये असून, वरील संस्थेच्या नावांची या नामसदृष्य असलेली अन्य संस्था माझ्या माहिती प्रमाणे
            अस्तित्वात नाही. नोंदणी शुल्क रू. 50/- (अक्षरी पन्नास रूपये फक्त ) भरण्यासाठी तयार आहे.
          </p>
          <p className="text-center font-bold mt-2">
            तरी वरील संस्था नोंदणी अधिनियम 1860 अन्वये त्वरीत नोंदवावी अशी विनंती आहे.
          </p>
        </div>

        <div className="flex justify-between mt-auto text-[5px]">
          <div>सहपत्रे :- वरील प्रमाणे</div>
          <div className="text-center">
            आपला विश्वासु,<br /><br />
            <b>{presidentName}</b><br />
            अध्यक्ष<br />
            " {trustName} "<br />
            {address}
          </div>
        </div>
      </div>
    </A4Page>
  );
};

// ── Page 2: Memorandum (परिशिष्ट "ब") ──
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
    <A4Page pageLabel="Page 2 — Memorandum">
      <div className="text-[5.5px] leading-relaxed">
        <div className="text-center font-bold text-[7px] mb-3">
          परिशिष्ट " ब "<br />
          <span className="text-[6px] font-normal underline">या संस्थेचे ज्ञापन</span>
        </div>
        <div className="text-center font-bold text-[6px] underline mb-4">
          मेमोरंडम ऑफ असोसिएशन<br />
          (Memorandum of Association)
        </div>

        <table className="w-full mb-3 text-[5.5px]">
          <tbody>
            <tr>
              <td className="w-4 font-bold align-top">1)</td>
              <td className="w-24 font-bold align-top">संस्थेचे नांव :-</td>
              <td className="font-bold text-[7px]">" {trustName} "</td>
            </tr>
            <tr>
              <td className="w-4 font-bold align-top pt-2">2)</td>
              <td className="w-24 font-bold align-top pt-2">संस्थेच्या कार्यालयाचा पत्ता :</td>
              <td className="pt-2">{address}</td>
            </tr>
            <tr>
              <td className="w-4 font-bold align-top pt-2">3)</td>
              <td className="w-24 font-bold align-top pt-2">संस्थेचे उद्देश :</td>
              <td className="pt-2 font-bold underline">या संस्थेचे उद्देश खालील प्रमाणे आहेत.</td>
            </tr>
          </tbody>
        </table>

        <div className="ml-6 space-y-1 text-[5.5px]">
          {objectives.map((obj, i) => (
            <div key={i}><b>{i + 1})</b> {obj || '_____'}</div>
          ))}
        </div>
      </div>
    </A4Page>
  );
};

// ── Page 3: Committee (कार्यकारी मंडळ) ──
const CommitteePage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
    ? formData.committeeMembers 
    : Array(7).fill({ name: '_________________', address: '_________________', designation: '_________________', age: '____', occupation: '_________________', nationality: 'भारतीय' });

  return (
    <A4Page pageLabel="Page 3 — Committee">
      <div className="text-[5.5px] leading-relaxed">
        <div className="mb-3">
          <b>4) " {trustName} "</b> {address}. या संस्थेचे 
          नियम व नियमावली प्रमाणे या कार्यकारी मंडळावर सदरहु संस्थेच्या कार्यकारी मंडळाचा संस्थेचा कार्यभार सोपविण्यात 
          आला आहे. त्या पहिल्या कार्यकारी मंडळाचा संपुर्ण पत्ता, हुद्दा, वय, व्यवसाय, राष्ट्रीयत्व खालील प्रमाणे आहे.
        </div>

        <table className="w-full border-collapse border border-black text-[4.5px] mb-4">
          <thead>
            <tr>
              <th className="border border-black p-1">अ.क्र.</th>
              <th className="border border-black p-1">सभासदाचे संपूर्ण नांव</th>
              <th className="border border-black p-1">पत्ता</th>
              <th className="border border-black p-1">पद</th>
              <th className="border border-black p-1">वय</th>
              <th className="border border-black p-1">व्यवसाय</th>
              <th className="border border-black p-1">राष्ट्रीयत्व</th>
            </tr>
          </thead>
          <tbody>
            {committeeMembers.map((m, i) => (
              <tr key={i}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1">{m.name || '_____'}</td>
                <td className="border border-black p-1">{m.address || '_____'}</td>
                <td className="border border-black p-1">{m.designation || '_____'}</td>
                <td className="border border-black p-1 text-center">{m.age || '_____'}</td>
                <td className="border border-black p-1">{m.occupation || '_____'}</td>
                <td className="border border-black p-1">{m.nationality || 'भारतीय'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between px-4 mt-6 text-[5px]">
          <div>अध्यक्ष: {formData.presidentName || "_________________"}</div>
          <div>उपाध्यक्ष: {formData.vicePresidentName || "_________________"}</div>
          <div>सचिव: {formData.secretaryName || "_________________"}</div>
        </div>
      </div>
    </A4Page>
  );
};

// ── Page 4: Signatures (सही पत्र) ──
const SignaturesPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const date = formatDate(formData.date);
  const place = formData.place || "_________________";
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
    ? formData.committeeMembers 
    : Array(7).fill({ name: '_________________', address: '_________________' });

  return (
    <A4Page pageLabel="Page 4 — Signatures">
      <div className="text-[5.5px] leading-relaxed">
        <div className="mb-3">
          <b>5.</b> आम्ही खालील सह्या करणार <b>" {trustName} "</b> {address}. 
          चे पदाधिकारी सदस्य जाहीर करतो की, संस्था अधिनियम 1860 अन्वये अभिप्रेत
          केलेली संस्था अस्तित्वात आणण्याची आमची ईच्छा असून वरील उद्देशाने आम्ही एकत्र येऊन 
          <b>" {trustName} "</b> {address}. ही संस्था आज दिनांक <b>{date}</b> रोजी स्थापन केली असून 
          संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी करण्यासाठी आम्ही या विधानपत्रावर सह्या केल्या आहेत.
        </div>

        <table className="w-full border-collapse border border-black text-[4.5px] mb-4">
          <thead>
            <tr>
              <th className="border border-black p-1 w-8">अ.क्र.</th>
              <th className="border border-black p-1">सभासदाचे संपूर्ण नांव</th>
              <th className="border border-black p-1">पत्ता</th>
              <th className="border border-black p-1 w-16">सही</th>
            </tr>
          </thead>
          <tbody>
            {committeeMembers.map((m, i) => (
              <tr key={i}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1">{m.name || '_____'}</td>
                <td className="border border-black p-1">{m.address || '_____'}</td>
                <td className="border border-black p-1 h-6"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-[5px]">
          स्थळ : {place}<br />
          दिनांक : {date}
        </div>

        <div className="mt-6 ml-[50%] text-[5px]">
          वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br />
          व त्यांनी माझ्या समक्ष या विधानपत्रावर सह्या केल्या आहेत.<br /><br /><br />
          <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
        </div>
      </div>
    </A4Page>
  );
};

// ── Page 5: Anusuchi 2 (1) (अनुसूची - २ पान १) ──
const Anusuchi2Page1 = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const presidentName = formData.presidentName || "_________________";
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
    ? formData.committeeMembers 
    : Array(7).fill({ name: '_________________', address: '_________________', designation: '_________________' });

  return (
    <A4Page pageLabel="Page 5 — Anusuchi 2 (1)">
      <div className="text-[5px] leading-relaxed h-full flex flex-col" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
        <div className="text-center font-bold text-[7px] mb-0.5">सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज</div>
        <div className="text-center font-bold text-[6px] underline mb-0.5">अनुसूची - २</div>
        <div className="text-center text-[5px] mb-3">(नियम ६ पहा)</div>
        
        <div className="mb-2 leading-normal">
          <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br />
          जालना विभाग जालना.
        </div>
        
        <div className="mb-2 leading-normal">
          <b>" {trustName} "</b> &nbsp;&nbsp;&nbsp;&nbsp; {address}<br />
          <b>या सार्वजनिक विश्वस्त व्यवस्थेसंबंधी.</b>
        </div>
        
        <div className="mb-2 text-justify indent-4 leading-normal">
          मी <b>{presidentName}</b> या द्वारे उपरिनिर्दिष्ट सार्वजनिक विश्वस्तव्यवस्थेचा विश्वस्त सदरहू सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठी मुंबई सार्वजनिक विश्वस्त अधिनियम 1950 च्या कलम 18 अन्वये अर्ज सादर करीत आहे.
        </div>
        
        <table className="w-full border-collapse mb-1 text-[5px] leading-normal">
          <tbody>
            <tr>
              <td className="w-4 font-bold align-top">२</td>
              <td colSpan="2" className="font-bold align-top">मी पुढील आवश्यक तपशील सादर करीत आहे :-</td>
            </tr>
            <tr>
              <td className="w-4 align-top pt-1">(अ.१)</td>
              <td className="w-40 align-top pt-1 pr-2">
                सार्वजनिक विश्वस्त व्यवस्था ज्या नावाने ओळखली जावी ते नाव व पूर्ण पत्ता :-
              </td>
              <td className="align-top pt-1 font-bold leading-tight">
                " {trustName} "<br />
                <span className="font-normal text-[4.5px]">{address}</span>
              </td>
            </tr>
            <tr>
              <td className="w-4 align-top pt-2">१.</td>
              <td colSpan="2" className="align-top pt-2">
                विश्वस्त व व्यवस्थापक यांची नावे पत्ता व पद :-
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Committee Table with Dashed Lines */}
        <table className="w-full border-collapse text-[4.5px] mt-1">
          <thead>
            <tr className="border-t border-b border-dashed border-black">
              <th className="py-1 text-left font-bold w-[6%]">अ.क्र.</th>
              <th className="py-1 text-left font-bold w-[44%]">सभासदाचे संपूर्ण नांव</th>
              <th className="py-1 text-left font-bold w-[35%]">पत्ता</th>
              <th className="py-1 text-left font-bold w-[15%]">पद</th>
            </tr>
          </thead>
          <tbody>
            {committeeMembers.map((m, i) => (
              <tr key={i} className={i === committeeMembers.length - 1 ? "border-b border-dashed border-black" : ""}>
                <td className="py-1 align-top">{i + 1}.</td>
                <td className="py-1 align-top font-bold">{m.name || '_____'}</td>
                <td className="py-1 align-top text-[4px] leading-tight">{m.address || '_____'}</td>
                <td className="py-1 align-top">{m.designation || '_____'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Item 2 describing election method at the bottom of the page */}
        <table className="w-full border-collapse mt-3 text-[4.5px] leading-normal">
          <tbody>
            <tr>
              <td className="w-5 font-bold align-top">२)</td>
              <td className="w-40 align-top pr-2">
                विश्वस्तांच्या किंवा व्यवस्थापकांच्या जागी दुसरा विश्वस्त किंवा व्यवस्थापक घेण्याची रीत :-
              </td>
              <td className="align-top text-justify">
                कार्यकारी मंडळाचा कार्यकाल पाच वर्षांचा राहील निवडणूक दर पाच वर्षांनी सर्वसाधारण सभेत गुप्त मतदान पद्धतीने घेण्यात येईल
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};

// ── Page 6: Anusuchi 2 (2) (अनुसूची - २ पान २) ──
const Anusuchi2Page2 = ({ formData }) => {
  return (
    <A4Page pageLabel="Page 6 — Anusuchi 2 (2)">
      <div className="text-[5px] leading-relaxed h-full flex flex-col" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
        <table className="w-full border-collapse text-[5px] leading-relaxed">
          <tbody>
            {/* Row 3 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(३)</td>
              <td className="w-44 font-bold py-1 pr-2">विश्वस्त व्यवस्थेचा हेतू</td>
              <td className="w-4 text-center py-1">:-</td>
              <td className="py-1">परिशिष्ट ( ब ) प्रमाणे</td>
            </tr>
            {/* Row 4 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1.5">(४)</td>
              <td className="font-bold py-1.5 pr-2">
                (अ) सार्वजनिक विश्वस्त व्यवस्था निर्माण करणाऱ्या दस्तऐवजाचा तपशील (नक्कल जोडा)<br /><br />
                (ब) सार्वजनिक विश्वस्त व्यवस्था उगम किंवा निर्मिती संबंधीचा दस्तऐवजाशिवाय इतर तपशील (नक्कल जोडा)
              </td>
              <td className="text-center py-1.5">
                :-<br /><br /><br />
                :-
              </td>
              <td className="py-1.5">
                मेमोरंडम ऑफ असो. ची प्रत.<br /><br /><br />
                -||-
              </td>
            </tr>
            {/* Row 5 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1.5">(५)</td>
              <td className="font-bold py-1.5 pr-2">
                सार्वजनिक विश्वस्त व्यवस्थेसंबंधी योजना कोणतीही असल्यास तिचा तपशील (नक्कल जोडा)
              </td>
              <td className="text-center py-1.5">:-</td>
              <td className="py-1.5">संस्थेची नियम व नियमावलीची प्रत</td>
            </tr>
            {/* Row 6 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1.5">(६)</td>
              <td className="font-bold py-1.5 pr-2 text-justify leading-tight text-[4.5px]">
                जंगम मालमत्ता अशा मालमत्तेच्या प्रत्येक वर्गाच्या अंदाजे किंमतीसह. (टिप:- प्रत्येक वस्तूचे वर्णन ठरविण्याऐवजी अशा मालमत्ताकतींच्या वर्गांचे स्थूल वर्णन करून नोंदी भराव्यात, जसे फर्निचर, पुस्तके वगैरे, रोकड रक्कम विश्वस्तव्यवस्थेच्या, भांडवलाचा भाग असेल तरच फक्त रोकड रकमेसंबंधी नोंद करावी, रोकडच्या बाबतीत प्रत्येक तारण पत्र, कर्जरोखे (Securities) संचय (Stock) शेअर, ऋणपत्र (Debentures) यांचा त्यावर जो क्रमांक असेल तो धरून तपशील द्या )
              </td>
              <td className="text-center py-1.5">:-</td>
              <td className="py-1.5 leading-normal">
                <br />
                1. &nbsp;&nbsp; अर्जदार जवळ रुपये 707/- जमा.<br /><br />
                2.<br /><br />
                3.
              </td>
            </tr>
            {/* Row 7 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1.5">(७)</td>
              <td className="font-bold py-1.5 pr-2 leading-tight text-[4.5px]">
                (अ) जेथे स्थावर मालमत्ता असेल ते गाव किंवा नगर भूमापन महानगर पालिका किंवा भूमापन क्रमांक क्षेत्र आकार किंवा जुनी दर्शविणारी अथवा मालमत्तेची सविस्तर माहिती ज्या अधिका-याने ती धारण केली असेल त्या धारण अधिका-याचे वर्णन<br /><br /><br />
                (ब) प्रत्येक स्थावर मालमत्तेची अंदाजे किंमत
              </td>
              <td className="text-center py-1.5">
                :-<br /><br /><br /><br /><br />
                :-
              </td>
              <td className="py-1.5 leading-normal">
                संस्था नवीन असल्यामुळे सध्या काही नाही<br />
                1.<br />
                2.<br />
                3.<br /><br />
                संस्था नवीन असल्यामुळे सध्या काही नाही<br />
                1.<br />
                2.<br />
                3.
              </td>
            </tr>
            {/* Row 8 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1.5">(८)</td>
              <td className="font-bold py-1.5 pr-2">सार्वजनिक विश्वस्त व्यवस्थेच्या उत्पन्नाची साधने</td>
              <td className="text-center py-1.5">:-</td>
              <td className="py-1.5 leading-normal">
                देणगी, वर्गणी, सभासद FEES, शासकीय व निमशासकीय अनुदान इत्यादी.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};

// ── Page 7: Anusuchi 2 (3) (अनुसूची - २ पान ३) ──
const Anusuchi2Page3 = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const presidentName = formData.presidentName || "_________________";

  return (
    <A4Page pageLabel="Page 7 — Anusuchi 2 (3)">
      <div className="text-[5px] leading-relaxed h-full flex flex-col" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
        <table className="w-full border-collapse text-[5px] leading-relaxed mb-3">
          <tbody>
            {/* Row 9 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(९)</td>
              <td className="w-44 font-bold py-1 pr-2">सरासरी ढोबळ वार्षिक उत्पन्न</td>
              <td className="w-4 text-center py-1">:-</td>
              <td className="py-1">संस्था नवीन असल्यामुळे सध्या काही नाही.</td>
            </tr>
            {/* Row 10 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(१०)</td>
              <td className="font-bold py-1 pr-2">सरासरी वार्षिक खर्च</td>
              <td className="text-center py-1">:-</td>
              <td className="py-1">-||-</td>
            </tr>
            {/* Row 11 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(११)</td>
              <td className="font-bold py-1 pr-2">
                सरासरी वार्षिक खर्चाची रक्कम<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;अ) &nbsp;&nbsp;&nbsp;&nbsp; विश्वस्त व व्यवस्थापक यांच्या<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;पगारावर होणारा खर्च<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ब) &nbsp;&nbsp;&nbsp;&nbsp; आस्थापना व नोकर वर्ग यांवर<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;होणारा खर्च<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;क) &nbsp;&nbsp;&nbsp;&nbsp; धार्मिक हेतुप्रीत्यर्थ होणारा खर्च<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ड) &nbsp;&nbsp;&nbsp;&nbsp; किरकोळ हेतुप्रीत्यर्थ होणारा खर्च
              </td>
              <td className="text-center py-1">
                :-<br />
                :-<br /><br />
                :-<br /><br />
                :-<br />
                :-
              </td>
              <td className="py-1">
                -||-<br />
                -||-<br /><br />
                -||-<br /><br />
                -||-<br />
                -||-
              </td>
            </tr>
            {/* Row 12 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(१२)</td>
              <td className="font-bold py-1 pr-2">
                विश्वस्त व्यवस्थेच्या मालमत्तेवरील भाराचा<br />
                कोणतेही असल्यास त्यांचा तपशील
              </td>
              <td className="text-center py-1">:-</td>
              <td className="py-1"><br />-||-</td>
            </tr>
            {/* Row 13 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(१३)</td>
              <td className="font-bold py-1 pr-2">
                विश्वस्त व्यवस्थेच्या मालमत्ते संबंधातील<br />
                मालकी हक्काच्या दस्तऐवजाचा तपशील<br />
                व ते ताब्यात असणाऱ्या विश्वस्तांची नावे.
              </td>
              <td className="text-center py-1">:-</td>
              <td className="py-1"><br />संस्थेच्या अध्यक्ष/सचिवाकडे राहील.</td>
            </tr>
            {/* Row 14 */}
            <tr className="align-top">
              <td className="w-5 font-bold py-1">(१४)</td>
              <td className="font-bold py-1 pr-2">
                शेरे कोणतेही असल्यास
              </td>
              <td className="text-center py-1">:-</td>
              <td className="py-1">
                हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च<br />
                असे राहील.
              </td>
            </tr>
          </tbody>
        </table>

        <div className="leading-relaxed mb-3 text-[4.5px]">
          <b>३.&nbsp;&nbsp;&nbsp;&nbsp; फी दाखल रु. ३/- (अक्षरी तीन रुपये फक्त) सोबत पाठवित आहोत.</b><br />
          <b>४.&nbsp;&nbsp;&nbsp;&nbsp; सार्वजनिक विश्वस्त व्यवस्थेसंबंधी विश्वस्तांशी किंवा व्यवस्थापक यांच्याशी करावयाचा कोणताही पत्र व्यवहार पुढील पत्त्यावर करावा.</b>
        </div>

        <div className="leading-tight ml-5 mb-4 text-[4.5px]">
          संस्थेचे नाव &nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>" {trustName} "</b><br />
          पत्ता &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>{address}</b>
        </div>

        <table className="w-full border-none mb-4 text-[4.5px]">
          <tbody>
            <tr>
              <td className="w-1/2">
                <b>तारीख :- &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026</b>
              </td>
              <td className="text-right font-bold pr-5">
                <br />
                अर्जदाराची सही
              </td>
            </tr>
          </tbody>
        </table>

        <div className="border-t border-dashed border-black my-2"></div>

        <div className="text-justify indent-4 leading-relaxed mb-3 text-[4.5px]">
          मी वर नामनिर्देशित <b>{presidentName}</b>, <b>{address}</b> येथील रहिवासी असून, प्रतिज्ञा करतो व सांगतो की, वरील अर्जात नमूद केलेली माहिती माझ्या पूर्ण माहिती प्रमाणे व विश्वासा प्रमाणे खरी आहे.
        </div>
        
        <div className="font-bold mb-4 indent-4 text-[4.5px]">
          उपरिनिर्दिष्ट जालना येथे गांभीर्यपूर्वक प्रतिज्ञा केली.
        </div>

        <table className="w-full border-none mb-2 text-[4.5px]">
          <tbody>
            <tr>
              <td className="w-1/2">
                <b>तारीख :- &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026</b>
              </td>
              <td className="text-right font-bold pr-5">
                <br />
                अर्जदाराची सही
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-center font-bold mt-2 text-[5px]">
          माझ्या समक्ष
        </div>
      </div>
    </A4Page>
  );
};

// ── Page 8: Sammatipatra (संमतीपत्राचा नमुना) ──
const SammatipatraPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const presidentName = formData.presidentName || "_________________";
  const committeeMembers = formData.committeeMembers && formData.committeeMembers.length > 0 
    ? formData.committeeMembers 
    : Array(7).fill({ name: '_________________', address: '_________________' });

  return (
    <A4Page pageLabel="Page 8 — Sammatipatra">
      <div className="text-[5px] leading-relaxed h-full flex flex-col" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
        <div className="title-lg text-center underline font-bold text-[7px] mb-3">संमतीपत्राचा नमुना</div>
        
        <div className="mb-3 leading-normal">
          <b>प्रति,</b><br />
          <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br />
          <b>जालना विभाग जालना.</b>
        </div>

        <div className="mb-3">
          <b>महोदय,</b><br />
          <p className="text-justify indent-4 leading-normal my-1 text-[4.8px]">
            <b>{presidentName}</b>, यांनी विश्वस्त व्यवस्था/संस्था/मंडळ <b>" {trustName} "</b> <b>{address}</b> नोंदविण्यासाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये दि. &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026 रोजी अर्ज सादर केला आहे. त्या अर्जातील सर्व माहिती खरी आहे. आम्हास त्या संबंधी जास्त सांगावयाचे नाही सदरहू अर्जाची सुनावणीची स्वतंत्र नोटीस आम्हास पाठवण्याची आवश्यकता नाही. नोंदणी प्रमाणपत्र अर्जदाराच्या नावे देण्यास आमची कोणतीही हरकत नाही.
          </p>
        </div>

        <div className="mb-2 leading-normal">
          <b>कळावे,</b>
        </div>
        
        <div className="text-right font-bold pr-8 mb-1 text-[5px]">
          आपले,
        </div>

        {/* Committee Members Table with Dashed Lines */}
        <table className="w-full border-collapse text-[4.5px] mt-1">
          <thead>
            <tr className="border-t border-b border-dashed border-black">
              <th className="py-1 text-left font-bold w-[6%]">अ.क्र.</th>
              <th className="py-1 text-left font-bold w-[44%]">सभासदाचे संपूर्ण नांव</th>
              <th className="py-1 text-left font-bold w-[35%]">पत्ता</th>
              <th className="py-1 text-center font-bold w-[15%]">सही</th>
            </tr>
          </thead>
          <tbody>
            {committeeMembers.map((m, i) => (
              <tr key={i} className={i === committeeMembers.length - 1 ? "border-b border-dashed border-black" : ""}>
                <td className="py-1.5 align-top">{i + 1}.</td>
                <td className="py-1.5 align-top font-bold">{m.name || '_____'}</td>
                <td className="py-1.5 align-top text-[4px] leading-tight">{m.address || '_____'}</td>
                <td className="py-1.5 align-middle text-center">
                  <span className="border-b border-black w-12 h-2 inline-block">&nbsp;</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full border-none mt-3 text-[4.8px]">
          <tbody>
            <tr>
              <td className="w-[40%]"></td>
              <td className="text-right font-bold pr-5 leading-normal">
                वरील सर्व सह्या मी ओळखतो<br /><br />
                (अर्जदाराची सही.)<br /><br />
                <b>{presidentName}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};

// ── Page 9: Affidavit (प्रतिज्ञापत्र) ──
const AffidavitPage = ({ formData }) => {
  const trustName = formData.trustName || "_________________";
  const address = getAddress(formData);
  const presidentName = formData.presidentName || "_________________";
  
  const committeeMembers = formData.committeeMembers || [];
  const presidentDetails = committeeMembers.find(m => m.designation?.includes('अध्यक्ष') || m.name === presidentName) || {};
  const presidentAge = presidentDetails.age || "____";
  const presidentOccupation = presidentDetails.occupation || "________";

  return (
    <A4Page pageLabel="Page 9 — Affidavit">
      <div className="text-[4.5px] leading-normal h-full flex flex-col" style={{ fontFamily: "'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', serif" }}>
        <div className="title-lg text-center underline font-bold text-[7px] mb-2">प्रतिज्ञापत्र</div>
        <div className="mb-2 leading-relaxed text-justify">
          मी खाली सही करणार <b>{presidentName}</b>, वय <b>{presidentAge}</b> वर्षे, व्यवसाय - <b>{presidentOccupation}</b>, राहणार <b>{address}</b>.<br />
          सत्य प्रतिज्ञेवर खालीलप्रमाणे लिहून देतो की,<br /><br />
          १) मी <b>" {trustName} "</b> {address}. या संस्थेचा अध्यक्ष/विश्वस्त असून संस्था नोंदणी अधिनियम १८६० व मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये सदर संस्था नोंदणी करण्याकरिता सहाय्यक संस्था निबंधक तथा सहाय्यक धर्मादाय आयुक्त जालना विभाग जालना यांच्या कार्यालयात प्रस्ताव सादर केला आहे. प्रस्तावासोबत जोडलेले सर्व पुरावे, नियम व नियमावली तसेच विवरणातील मजकूर खरा व सत्य आहे. सदर संस्था ही धर्मादाय व शैक्षणिक स्वरूपाच्या उद्देशाकरिता स्थापन केली असून, तिचे ध्येय व उद्देश संस्था नोंदणी अधिनियम १८६० च्या कलम २० ला अनुसरून आहेत.<br /><br />
          २) या संस्थेच्या विधानपत्रावर व नियमावलीवर सह्या करणाऱ्या सर्व सभासदांना मी चांगल्या प्रकारे ओळखतो व त्यांनी माझ्या समक्ष स्वाक्षऱ्या केल्या आहेत.<br /><br />
          ३) आज तारखेपर्यंत नोंदणी प्रकरणातील मजकुरामध्ये कोणताही बदल झालेला नाही.<br /><br />
          ४) वरील नावाची अथवा या नामाशी मिळतीजुळती असणारी कोणतीही संस्था/मंडळ आमच्या गावात व परिसरात सध्या अस्तित्वात नाही व नोंदणीकृत नाही.<br /><br />
          ५) आज तारखेपर्यंत संस्थेच्या नावावर कोणत्याही प्रकारची स्थावर मालमत्ता नाही. जंगम मालमत्ता म्हणून संस्थेकडे फक्त रोख रक्कम रुपये ७०७/- (अक्षरी सातशे सात रुपये फक्त) जमा असून ती अध्यक्ष/सचिव यांच्या ताब्यात सुरक्षित आहे.<br /><br />
          ६) संस्थेच्या कार्यालयाचा पत्ता <b>" {trustName} "</b> {address} हा असून सदर जागा ही भाडेतत्वावर घेण्यात आली आहे. त्यापुष्ट्यर्थ घरमालकाचे नाहरकत प्रमाणपत्र, टॅक्स पावती, पी.आर.कार्ड, ८-अ चा उतारा इत्यादी कागदपत्रे या प्रस्तावासोबत जोडली आहेत.<br /><br />
          सदर प्रस्तावाबाबत किंवा पत्त्याबाबत भविष्यात काही वाद निर्माण झाल्यास अथवा तक्रार आल्यास त्याची संपूर्ण जबाबदारी वैयक्तिक व सामूहिकरीत्या माझी व कार्यकारी मंडळाची राहील. कार्यालयाच्या पत्त्यात काही बदल झाल्यास तो नियमानुसार आपल्या कार्यालयाला अवगत करण्यात येईल.<br /><br />
          हे प्रतिज्ञापत्र मी स्वेच्छेने व राजीखुशीने लिहून दिले असून ते सत्य व बरोबर आहे.
        </div>
        <div className="flex justify-between mt-3">
          <div>स्थळ : {formData.place || "_________________"}<br />दिनांक : {formatDate(formData.date)}</div>
          <div className="text-center font-bold">
            प्रतिज्ञाक<br /><br /><br />
            {presidentName}
          </div>
        </div>
        <div className="border-t border-black my-2"></div>
        <div className="ml-[50%] leading-normal text-[4.5px] mt-1">
          माझ्या समक्ष प्रतिज्ञाकाची सही घेतली व ओळख पटवली.<br /><br /><br />
          <b>विशेष कार्यकारी दंडाधिकारी / नोटरी संपूर्ण नांव व शिक्का.</b>
        </div>
      </div>
    </A4Page>
  );
};

// ── MAIN LIVE PREVIEW COMPONENT ──
const LivePreview = ({ currentStep, formData, zoom = 100, setZoom }) => {
  const viewportRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [previewPage, setPreviewPage] = React.useState(1);

  const handleFit = React.useCallback(() => {
    if (!viewportRef.current) return;

    const viewport = viewportRef.current;
    const vWidth = viewport.clientWidth - (isFullscreen ? 120 : 80);
    const vHeight = viewport.clientHeight - (isFullscreen ? 120 : 80);

    const baseWidth = isFullscreen ? 1000 : 500;
    const baseHeight = baseWidth * 1.414;

    const scaleX = vWidth / baseWidth;
    const scaleY = vHeight / baseHeight;

    const fitScale = Math.min(scaleX, scaleY);
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
    return () => window.removeEventListener('resize', handleFit);
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
      if (viewport) {
        viewport.removeEventListener('wheel', handleWheel);
      }
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
            case 5: return <Anusuchi2Page1 formData={formData} />;
            case 6: return <Anusuchi2Page2 formData={formData} />;
            case 7: return <Anusuchi2Page3 formData={formData} />;
            case 8: return <SammatipatraPage formData={formData} />;
            case 9: return <AffidavitPage formData={formData} />;
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
            : "h-auto bg-slate-50 border border-slate-100 shadow-inner rounded-3xl"
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
              onClick={() => setPreviewPage(prev => Math.min(9, prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50"
              disabled={previewPage === 9}
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 z-50">
              Page {previewPage} of 9
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
            "flex-shrink-0 origin-top mb-12 transition-shadow duration-500",
            zoom > 100 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
          )}
          style={{
            width: '100%',
            maxWidth: isFullscreen ? '1000px' : '500px',
            scale: zoom / 100,
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
