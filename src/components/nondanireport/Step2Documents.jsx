import React from 'react';
import { InputField } from '../ui/FormFields';
const DOCUMENTS_LIST = [
  "विधान पत्र (ज्ञापन) मेमोरंडम ऑफ असोसिएशन.",
  "नियम व नियमावलीची सत्यप्रत.",
  "संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सहीनिशी संमतीपत्र.",
  "संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सहीनिशी अधिकारपत्र.",
  "कार्यकारिणीची निवड व घटनेस व नियमावलीस मंजूरी बाबत ठरावाची सत्यप्रत.",
  "संस्थेच्या पत्त्या बाबत व मालमत्तेबाबत अध्यक्ष व सचिव यांचे प्रतिज्ञापत्र 100/- रूपयाच्या स्टॅम्प पेपरवर 5 रू. कोर्ट फी राहील.",
  "भाडेकरारनामा 100/- रूपयाच्या स्टॅम्प पेपरवर तसेच जागा मालकाचे नाहरकत, जागेचा पुरावा, सर्व सभासदांचे आधार कार्ड व फोटो.",
  "लकीड्रॉ काढणे, भिशीचालविणे व गैर मार्गाने निधी जमा करणार नाही करीता अध्यक्ष वा सचिव यांचे प्रतिज्ञापत्र. धर्मादाय वैद्यकीय केंद्राची माहिती अवगत करणे बाबत हमीपत्र.",
  "परिशिष्ट 1-2-6.",
  "सुचना, ठराव, सभासद नोंदवही इ. ची सत्यप्रत."
];

const Step2Documents = ({ formData, setFormData }) => {
  const checklist = formData.checklist || DOCUMENTS_LIST.map(doc => ({ documentName: doc, isSubmitted: false }));

  const handleToggle = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].isSubmitted = !newChecklist[index].isSubmitted;
    setFormData(prev => ({ ...prev, checklist: newChecklist }));
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6">Document Checklist</h2>
      <div className="space-y-4">
        {checklist.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-sm text-slate-700 font-medium pr-4">{index + 1}. {item.documentName}</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={item.isSubmitted || false}
                onChange={() => handleToggle(index)}
                className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Documents;
