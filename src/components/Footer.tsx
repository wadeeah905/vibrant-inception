
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-black to-rich-black text-gray-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">VILART</h3>
            <p className="text-gray-400 mb-6">
              Créer des expériences inoubliables à travers la production musicale et l'organisation d'événements.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/vilartprod/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/share/161tuMFPjz/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Liens Rapides</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/prod" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  Production
                </Link>
              </li>
              <li>
                <Link to="/digital" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  Digital
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  Évènementiel
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-400 transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Coordonnées</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gold-400 mt-1" />
                <a href="mailto:vilartprod@gmail.com" className="text-gray-400 hover:text-gold-400 transition-colors">
                  vilartprod@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gold-400 mt-1" />
                <a href="tel:+21654754704" className="text-gray-400 hover:text-gold-400 transition-colors">
                  +216 54 754 704
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-400 mt-1" />
                <span className="text-gray-400">Tunis, Tunisie</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Newsletter</h3>
            <p className="text-gray-400 mb-4">Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres exclusives.</p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gold-500 text-black font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Vilart. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                Conditions d'Utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
