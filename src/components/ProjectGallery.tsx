import { Card, CardContent } from "./ui/card";

const projects = [
  {
    id: 1,
    image: "https://placehold.co/600x400",
    title: "Uniformes Hôpital Saint-Marie",
    description: "Collection complète d'uniformes médicaux personnalisés pour le personnel hospitalier"
  },
  {
    id: 2,
    image: "https://placehold.co/600x400",
    title: "Restaurant Le Gourmet",
    description: "Tenues élégantes pour l'équipe de service et les chefs"
  },
  {
    id: 3,
    image: "https://placehold.co/600x400",
    title: "Clinique Dentaire Sourire",
    description: "Blouses médicales modernes avec logo brodé"
  },
  {
    id: 4,
    image: "https://placehold.co/600x400",
    title: "Spa Zen & Beauté",
    description: "Collection de tuniques confortables pour les esthéticiennes"
  }
];

const ProjectGallery = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Nos Réalisations Récentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;