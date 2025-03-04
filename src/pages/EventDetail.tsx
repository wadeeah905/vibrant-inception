import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Music, Info, Utensils, Phone } from 'lucide-react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface Event {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  location?: string;
  date?: string;
  performers?: string;
  menu?: {
    sales?: string[];
    sucres?: string[];
    buffetShour?: string[];
    boissons?: string[];
  };
  reservationNumbers?: string[];
  organizers?: string[];
  about?: string;
  mapCoordinates?: [number, number];
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  const specialEvents: Event[] = [
    {
      id: "soiree-ramadanesque-mixte",
      name: "Soirée Ramadanesque Mixte",
      image: "/lovable-uploads/117a8190-aa6c-4f4a-82a9-6c398fc09fe8.png",
      description: "Une soirée exceptionnelle mettant en vedette deux artistes talentueux : Dorsaf Hamdani, maître du Malouf tunisien, et Abdallah Mrich, dans un cadre élégant à l'Hôtel l'occidental.",
      price: 95,
      location: "Hôtel l'occidental, Lac 1",
      date: "13 Mars 2025 à 21H30",
      performers: "Dorsaf Hamdani & Abdallah Mrich",
      menu: {
        sales: [
          "Brick dannouni à la viande",
          "Mini tartelettes au saumon",
          "Des nems aux chevrettes avec une sauce aigre-douce",
          "Roulé au poulet pistaches",
          "Mini pizza"
        ],
        sucres: [
          "Mini ktaiefs",
          "Bouza"
        ],
        buffetShour: [
          "Café, lait",
          "Mini viennoiseries",
          "Masfouf à la crème et aux fruits secs",
          "Gâteau biscuit praliné"
        ],
        boissons: [
          "Eau minérale",
          "Thé à la menthe",
          "Citronnade fraiche",
          "Jus de fraise frais"
        ]
      },
      reservationNumbers: ["51056606", "58531730", "54754704"],
      organizers: ["La Maison du Tréheur (By Amel Haddad)", "VILART Artistic Production"],
      about: "Dorsaf Hamdani est une chanteuse tunisienne renommée et maître du Malouf (musique arabo-andalouse de Tunisie). Avec sa voix exceptionnelle et sa maîtrise des répertoires classiques, elle a su conquérir un public international tout en préservant l'authenticité de la tradition musicale tunisienne.",
      mapCoordinates: [36.8331779, 10.2338569]
    }
  ];

  const foundEvent = specialEvents.find(e => e.id === id);

  useEffect(() => {
    if (!foundEvent?.mapCoordinates || !mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: foundEvent.mapCoordinates,
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map.current);

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #403E43;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          border: 2px solid #8E9196;
        ">
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background-color: #403E43;
            border-right: 2px solid #8E9196;
            border-bottom: 2px solid #8E9196;
          "></div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    const marker = L.marker(foundEvent.mapCoordinates, { icon: customIcon })
      .addTo(map.current)
      .bindPopup(`<b>📍 ${foundEvent.location}</b>`, {
        className: 'custom-popup'
      });

    setTimeout(() => marker.openPopup(), 1000);

    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        background-color: #403E43;
        color: white;
        border: 1px solid #8E9196;
      }
      .custom-popup .leaflet-popup-tip {
        background-color: #403E43;
        border: 1px solid #8E9196;
      }
    `;
    document.head.appendChild(style);

    return () => {
      map.current?.remove();
      document.head.removeChild(style);
    };
  }, [foundEvent]);

  if (!foundEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Événement non trouvé</h1>
          <button 
            onClick={() => navigate('/vilart-events')}
            className="px-4 py-2 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto py-12 px-4">
        <button onClick={() => navigate('/vilart-events')} className="flex items-center mb-6 hover:text-gold-400 transition-colors">
          <ArrowLeft className="mr-2" /> Retour aux événements
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex justify-center items-center bg-black/20 rounded-xl overflow-hidden shadow-xl border border-gold-500/10">
            <img 
              src={foundEvent.image} 
              alt={foundEvent.name} 
              className="object-contain w-full h-full max-h-[500px]" 
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gold-400">{foundEvent.name}</h1>
            <p className="text-gray-300 mb-8">{foundEvent.description}</p>
            
            <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20 space-y-4">
              <div className="flex items-center">
                <Calendar className="text-gold-400 h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-white/70 text-sm">Date et Heure</span>
                  <p className="text-white font-medium">{foundEvent.date}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-gold-400 h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-white/70 text-sm">Lieu</span>
                  <p className="text-white font-medium">{foundEvent.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Music className="text-gold-400 h-5 w-5 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-white/70 text-sm">Artistes</span>
                  <p className="text-white font-medium">{foundEvent.performers}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gold-500/20">
                <span className="text-white font-semibold">Prix</span>
                <span className="text-2xl font-bold text-gold-400">{foundEvent.price} dt</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {foundEvent.reservationNumbers && foundEvent.reservationNumbers.length > 0 && (
                <div className="flex-1 bg-black/30 p-4 rounded-lg border border-gold-500/20">
                  <div className="flex items-center mb-2">
                    <Phone className="text-gold-400 h-5 w-5 mr-2" />
                    <span className="text-lg font-semibold text-white">Réservation</span>
                  </div>
                  <p className="text-white/90 text-center">
                    {foundEvent.reservationNumbers.map((number, index) => (
                      <span key={index}>
                        <a 
                          href={`tel:${number}`} 
                          className="hover:text-gold-400 transition-colors"
                        >
                          {number}
                        </a>
                        {index < foundEvent.reservationNumbers.length - 1 && ' / '}
                      </span>
                    ))}
                  </p>
                </div>
              )}
              
              <a 
                href="https://www.instagram.com/vilart.tn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 text-center px-6 py-4 bg-gold-500 text-black rounded-md hover:bg-gold-600 transition-colors font-semibold flex items-center justify-center"
              >
                Réserver Maintenant
              </a>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Info className="text-gold-400 h-6 w-6 mr-3" />
            <h2 className="text-2xl font-bold text-gold-400">À propos de l'événement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {foundEvent.about && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">À propos de l'artiste</h3>
                  <p className="text-white/80">{foundEvent.about}</p>
                </div>
              )}
            </div>
            
            <div>
              {foundEvent.organizers && foundEvent.organizers.length > 0 && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Organisateurs</h3>
                  <div className="flex flex-col gap-2">
                    {foundEvent.organizers.map((organizer, index) => (
                      <div key={index} className="bg-black/50 px-3 py-2 rounded-md border border-gold-500/20 text-sm text-white/80">
                        {organizer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {foundEvent.menu && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Utensils className="text-gold-400 h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold text-gold-400">Menu</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {foundEvent.menu.sales && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20">
                  <h3 className="text-xl font-semibold mb-4 text-gold-400">SALÉS</h3>
                  <ul className="space-y-2">
                    {foundEvent.menu.sales.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold-500 mr-2 mt-1">•</span>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {foundEvent.menu.sucres && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20">
                  <h3 className="text-xl font-semibold mb-4 text-gold-400">SUCRÉS</h3>
                  <ul className="space-y-2">
                    {foundEvent.menu.sucres.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold-500 mr-2 mt-1">•</span>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {foundEvent.menu.buffetShour && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20">
                  <h3 className="text-xl font-semibold mb-4 text-gold-400">BUFFET SHOUR</h3>
                  <ul className="space-y-2">
                    {foundEvent.menu.buffetShour.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold-500 mr-2 mt-1">•</span>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {foundEvent.menu.boissons && (
                <div className="bg-black/30 p-6 rounded-lg border border-gold-500/20">
                  <h3 className="text-xl font-semibold mb-4 text-gold-400">BOISSONS</h3>
                  <ul className="space-y-2">
                    {foundEvent.menu.boissons.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold-500 mr-2 mt-1">•</span>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {foundEvent.mapCoordinates && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <MapPin className="text-gold-400 h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold text-gold-400">Localisation</h2>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-gold-500/20 overflow-hidden">
              <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventDetail;
