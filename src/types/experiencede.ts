export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export const pastExperiencede: Experience[] = [
  {
    title: '3rd level CS Field Software Manager',
    company: 'L-mobile Tunis',
    period: '09/2024 - aktuell',
    description: 'Verwalten von Softwareproblemen der Kunden und deren Behebung (Code oder Datenbank), Entwicklung neuer Funktionen für Kunden und interne Tools.',
    technologies: ['Sql', 'C#', '.NET', 'KO JS'],
    achievements: []
  },
  {
    title: 'Softwareentwickler',
    company: 'Beau Séjour Klinik',
    period: '01/2024 - 05/2024',
    description: 'Erstellung einer mobilen Anwendung für Mütter zur Kommunikation mit Krankenschwestern, unter Verwendung von React Native und PHP mit Verbindung zur Datenbank der Klinik (iOS und Android), Entwicklung einer mobilen Anwendung für Personalmanager zur Verwaltung von Verwaltungsdokumenten, Arbeitsplänen und Renten (iOS und Android), Erstellung einer Webanwendung mit Spracherkennung.',
    technologies: ['React Native', 'PHP'],
    achievements: ['Mobile Anwendung für Mütter', 'Webanwendung mit KI-Spracherkennung']
  },
  {
    title: 'Praktikant',
    company: 'Delice Holding',
    period: '06/2023 - 08/2023',
    description: 'Entwicklung einer internen Website: Spracherkennungshilfe für die Mitarbeiterdokumentation, Design und Entwicklung einer Webanwendung für das Projektmanagement (Gourmetkaffee und Markt). Technologien: Symfony, MySQL, Postman, Bytescale, PHP.',
    technologies: ['Symfony', 'MySQL', 'Postman', 'Bytescale', 'PHP', 'React Js'],
    achievements: ['Vollständig funktionierende Webanwendung']
  },
  {
    title: 'Praktikant',
    company: "Nationales Computerzentrum (CNI)",
    period: '01/2023 - 02/2023',
    description: 'Design und Entwicklung eines kollaborativen Arbeitstools (Desktop-Anwendung mit Java) für das Management der CNI-Kundenmaschinen.',
    technologies: ['Java', 'MySQL'],
    achievements: []
  },
  {
    title: 'Praktikant',
    company: "Nationales Computerzentrum (CNI)",
    period: '07/2022 - 08/2022',
    description: 'Beteiligung an der Wartung der Kundendaten von CNI (Wartung von CNI-Produkten), Installation von Konfigurationen nationaler Software.',
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
