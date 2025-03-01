
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#64381b] to-[#4e2b15] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center md:justify-between items-start gap-8 md:gap-12">
          {/* About Company */}
          <div className="w-full md:flex-1 max-w-sm space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              Notre Entreprise
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium Dates est votre source de confiance pour des dattes de la plus haute qualité. 
              Depuis plus de 20 ans, nous sélectionnons les meilleures variétés pour vous offrir une 
              expérience gustative exceptionnelle.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <Instagram size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <Facebook size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#96cc39] transition-all duration-300 group">
                <Youtube size={16} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:flex-1 max-w-xs space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              Liens Rapides
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="/about" className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>À Propos</span>
              </a>
              <a href="/products" className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>Nos Produits</span>
              </a>
              <a href="/certifications" className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>Certifications</span>
              </a>
              <a href="/blog" className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>Blog</span>
              </a>
              <a href="/faq" className="group flex items-center space-x-1 hover:text-[#96cc39] transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>FAQ</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:flex-1 max-w-xs space-y-4">
            <h3 className="text-xl font-playfair relative inline-block">
              Contactez-nous
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39]"></span>
            </h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:contact@example.com" 
                className="flex items-center space-x-3 hover:text-[#96cc39] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#96cc39] transition-colors">
                  <Mail size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                <span>contact@example.com</span>
              </a>
              <a href="tel:+1234567890" 
                className="flex items-center space-x-3 hover:text-[#96cc39] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#96cc39] transition-colors">
                  <Phone size={14} className="group-hover:scale-110 transition-transform" />
                </div>
                <span>+1 234 567 890</span>
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span>123 Rue des Dattes, Paris</span>
              </div>
            </div>
          </div>

          {/* Image with 100% Tunisian text */}
          <div className="w-full md:flex-1 max-w-xs flex justify-center md:justify-start">
            <div className="relative">
              <img src="MadeInTunisiaFooter.png" alt="Footer Image" className="w-[180px] h-[220px] object-cover rounded-lg" />
              <div className="absolute top-4 left-0 right-0 text-center">
                <div className="bg-[#96cc39] text-white px-4 py-1 rounded-full inline-block font-bold shadow-md transform -rotate-2">
                  100% TUNISIAN
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-300">
            Fait avec <Heart size={12} className="text-[#96cc39]" fill="#96cc39" /> par{" "}
            <a 
              href="https://ihebchebbi.pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#96cc39] hover:underline transition-all"
            >
              Iheb Chebbi
            </a>
            {" "}© {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
