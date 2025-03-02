export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const pastExperience: Experience[] = [
  {
    title: '3rd level CS Field Software Manager',
    company: 'L-mobile Tunis',
    period: '09/2024 - present',
    description: 'Manage client software issues and resolve them (code or database), develop new features for clients and internal tools.',
    technologies: ['Sql', 'C#' , '.NET' , 'KO JS'],
    achievements: []
  },
  {
    title: 'Software Developer',
    company: 'Beau Séjour Clinic',
    period: '01/2024 - 05/2024',
    description: 'Created a mobile application for mothers to communicate with nurses, using React Native and PHP with connection to the clinic’s database (iOS and Android), developed a mobile application for human resource managers to manage administrative documents, work schedules, and retirements (iOS and Android), created a web application with voice recognition.',
    technologies: ['React Native', 'PHP'],
    achievements: ['Mobile Application for Moms', 'AI Voice Recognition Web App']
  },
  {
    title: 'Intern',
    company: 'Delice Holding',
    period: '06/2023 - 08/2023',
    description: 'Developed an internal website: voice recognition assistance for employee documentation, designed and developed a web application for project management (gourmet coffee and the market). Technologies: Symfony, MySQL, Postman, Bytescale, PHP.',
    technologies: ['Symfony', 'MySQL', 'Postman', 'Bytescale', 'PHP', 'React Js'],
    achievements: ['Complete Working Web Application']
  },
  {
    title: 'Intern',
    company: "National Computer Center (CNI)",
    period: '01/2023 - 02/2023',
    description: 'Designed and developed a collaborative work tool (desktop application with Java) for managing CNI client machines.',
    technologies: ['Java', 'MySQL'],
    achievements: []
  },
  {
    title: 'Intern',
    company: "National Computer Center (CNI)",
    period: '07/2022 - 08/2022',
    description: 'Participated in CNI client data maintenance work (maintenance of CNI products), installation of national software configurations.',
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
