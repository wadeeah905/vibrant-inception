export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const pastExperiencear: Experience[] = [
  {
    title: 'مدير برامج  CS',
    company: 'L-mobile تونس',
    period: '09/2024 - الآن',
    description: 'إدارة مشاكل البرمجيات للعملاء وحلها (كود أو قاعدة بيانات)، تطوير ميزات جديدة للعملاء والأدوات الداخلية.',
    technologies: ['Sql', 'C#' , '.NET' , 'KO JS'],
    achievements: []
  },
  {
    title: 'مطور برمجيات',
    company: 'عيادة بيو سيجور',
    period: '01/2024 - 05/2024',
    description: 'إنشاء تطبيق موبايل للأمهات للتواصل مع الممرضات، باستخدام React Native و PHP مع الاتصال بقاعدة بيانات العيادة (iOS و Android)، تطوير تطبيق موبايل لمديري الموارد البشرية لإدارة الوثائق الإدارية، جداول العمل، والتقاعد (iOS و Android)، إنشاء تطبيق ويب مع التعرف على الصوت.',
    technologies: ['React Native', 'PHP'],
    achievements: ['تطبيق موبايل للأمهات', 'تطبيق ويب بتقنية التعرف على الصوت AI']
  },
  {
    title: 'متدرب',
    company: 'ديليس هولدينغ',
    period: '06/2023 - 08/2023',
    description: 'تطوير موقع داخلي: مساعدة التعرف على الصوت لتوثيق الموظفين، تصميم وتطوير تطبيق ويب لإدارة المشاريع (القهوة الذواقة والسوق). التقنيات: Symfony، MySQL، Postman، Bytescale، PHP.',
    technologies: ['Symfony', 'MySQL', 'Postman', 'Bytescale', 'PHP', 'React Js'],
    achievements: ['تطبيق ويب كامل يعمل']
  },
  {
    title: 'متدرب',
    company: "المركز الوطني للمعلومات (CNI)",
    period: '01/2023 - 02/2023',
    description: 'تصميم وتطوير أداة للعمل الجماعي (تطبيق سطح مكتب باستخدام Java) لإدارة آلات عملاء CNI.',
    technologies: ['Java', 'MySQL'],
    achievements: []
  },
  {
    title: 'متدرب',
    company: "المركز الوطني للمعلومات (CNI)",
    period: '07/2022 - 08/2022',
    description: 'المشاركة في أعمال صيانة بيانات عملاء CNI (صيانة منتجات CNI)، تثبيت تكوينات البرمجيات الوطنية.',
    technologies: [],
    achievements: []
  }
];

export const skills = {
  frontend: ['React', 'Vue', 'Angular', 'Next.js'],
  backend: ['Node.js', 'Python', 'Java', 'PHP'],
  mobile: ['React Native', 'Flutter'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL'],
  cloud: ['AWS', 'Azure', 'GCP'],
  other: ['Docker', 'Kubernetes', 'CI/CD']
};
