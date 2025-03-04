
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  location?: string;
  date?: string;
}

const VilartEvents = () => {
  // Define a single event - the Ramadan event
  const events: Event[] = [
    {
      id: "soiree-ramadanesque-mixte",
      name: "Soirée Ramadanesque Mixte",
      image: "/lovable-uploads/117a8190-aa6c-4f4a-82a9-6c398fc09fe8.png",
      description: "Une soirée exceptionnelle mettant en vedette deux artistes talentueux : Dorsaf Hamdani, maître du Malouf tunisien, et Abdallah Mrich, dans un cadre élégant à l'Hôtel l'occidental.",
      price: 95,
      location: "Hôtel l'occidental, Lac 1",
      date: "13 Mars 2025 à 21H30"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-rich-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Nos Événements Vilart
          </h2>
          <p className="text-xl text-white/80">
            Découvrez nos événements exclusifs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="luxury-card rounded-lg overflow-hidden shadow-xl border border-gold-500/20"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-gold-400">{event.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/80 mb-4">{event.description}</p>
                
                <div className="flex flex-col space-y-3 mb-4">
                  {event.date && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gold-400" />
                      <p className="text-sm text-white/90">
                        {event.date}
                      </p>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-gold-400" />
                      <p className="text-sm text-white/90">
                        {event.location}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gold-400" />
                    <p className="text-sm text-white/90">
                      Dorsaf Hamdani & Abdallah Mrich
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="bg-gold-400/20 rounded-full px-3 py-1">
                    <span className="text-lg font-bold text-gold-400">{event.price}dt</span>
                  </div>
                  <Link 
                    to={`/events/${event.id}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gold-400 hover:bg-gold-500 text-black font-semibold rounded-lg transition-colors"
                  >
                    Détails
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VilartEvents;
