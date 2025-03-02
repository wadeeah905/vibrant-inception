export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const pastExperiencefr: Experience[] = [
  {
    title: 'CS Responsable Logiciel 3éme niveau',
    company: 'L-mobile Tunis',
    period: '09/2024 - présent',
    description: 'Gérer les problèmes logiciels des clients et les résoudre (code ou base de données), développer de nouvelles fonctionnalités pour les clients et les outils internes.',
    technologies: ['Sql', 'C#', '.NET', 'KO JS'],
    achievements: []
  },
  {
    title: 'Développeur Logiciel',
    company: 'Clinique Beau Séjour',
    period: '01/2024 - 05/2024',
    description: 'Création d’une application mobile pour permettre aux mères de communiquer avec les infirmières, en utilisant React Native et PHP avec connexion à la base de données de la clinique (iOS et Android), développement d’une application mobile pour les gestionnaires des ressources humaines pour gérer les documents administratifs, les plannings de travail et les départs à la retraite (iOS et Android), création d’une application web avec reconnaissance vocale.',
    technologies: ['React Native', 'PHP'],
    achievements: ['Application mobile pour les mères', 'Application web de reconnaissance vocale avec IA']
  },
  {
    title: 'Stagiaire',
    company: 'Delice Holding',
    period: '06/2023 - 08/2023',
    description: 'Développement d’un site web interne : assistance par reconnaissance vocale pour la documentation des employés, conception et développement d’une application web pour la gestion de projets (café gourmet et marché). Technologies : Symfony, MySQL, Postman, Bytescale, PHP.',
    technologies: ['Symfony', 'MySQL', 'Postman', 'Bytescale', 'PHP', 'React Js'],
    achievements: ['Application web fonctionnelle complète']
  },
  {
    title: 'Stagiaire',
    company: "Centre National de l’Informatique (CNI)",
    period: '01/2023 - 02/2023',
    description: 'Conception et développement d’un outil de travail collaboratif (application de bureau avec Java) pour la gestion des machines des clients CNI.',
    technologies: ['Java', 'MySQL'],
    achievements: []
  },
  {
    title: 'Stagiaire',
    company: "Centre National de l’Informatique (CNI)",
    period: '07/2022 - 08/2022',
    description: 'Participation aux travaux de maintenance des données clients CNI (maintenance des produits CNI), installation des configurations logicielles nationales.',
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
