import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Download, Calendar } from 'lucide-react';
import { pastExperience } from '../types/experience';
import { pastExperiencear } from '../types/experiencear';
import { pastExperiencede } from '../types/experiencede';
import { pastExperiencefr } from '../types/experiencefr';

const PastExperiencePreview = () => {
  const { t, i18n } = useTranslation();

  // Determine the correct experience data based on the current language
  let experiences;
  if (i18n.language === 'ar') {
    experiences = pastExperiencear;
  } else if (i18n.language === 'fr') {
    experiences = pastExperiencefr;
  } else if (i18n.language === 'de') {
    experiences = pastExperiencede;
  } else {
    experiences = pastExperience;
  }

  const resumeFile = i18n.language === 'fr' ? '/resumefr.pdf' : '/resumeen.pdf';

  return (
    <div className="mt-4 space-y-4">
      <a
        href={resumeFile}  
        download
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Download className="h-4 w-4" />
        {t('common.downloadResume')}
      </a>

      <div className="space-y-4">
        {experiences.slice(0, 4).map((exp) => (
          <div key={exp.title} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Briefcase className="h-4 w-4" />
                  {exp.company}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                {exp.period}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3">{exp.description}</p>

            <div className="space-y-2">
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {exp.achievements.slice(0, 2).map((achievement) => (
                  <>
                  <li key={achievement}>{achievement}</li>
                  </>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastExperiencePreview;
