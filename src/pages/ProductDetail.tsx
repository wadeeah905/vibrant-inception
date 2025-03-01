
import { motion } from 'framer-motion';
import { ChevronLeft, Leaf, Award } from 'lucide-react';
import { PRODUCTS } from '../config/products';
import Cookies from 'js-cookie';
import { useState } from 'react';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

type TabType = 'description' | 'ingredients' | 'nutrition';

const ProductDetail = ({ productId, onBack }: ProductDetailProps) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('description');
  
  // Get client type directly from cookies - same approach as navbar
  const clientType = Cookies.get('clientType');
  console.log("Direct client type check:", clientType);
  
  // Find the product by ID from our products config
  const product = PRODUCTS.find(p => p.id === productId) || {
    title: 'Dattes Deglet Nour Premium',
    description: 'Nos dattes Deglet Nour sont soigneusement sélectionnées et récoltées à la main au moment optimal de leur maturité. Leur texture moelleuse et leur goût équilibré en font un produit d\'exception, parfait pour une collation saine ou pour vos créations culinaires.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true
  };

  // Sample ingredients content
  const ingredients = [
    "Dattes Deglet Nour",
    "Sans additifs",
    "Sans conservateurs",
    "100% naturel"
  ];

  const nutritionFacts = [
    { 
      name: 'Énergie / Energie', 
      value: '306', 
      unit: 'kcal/1279kJ',
      dailyValue: '15.3%' 
    },
    { 
      name: 'Glucides / Carbohydrates', 
      value: '70', 
      unit: 'g',
      dailyValue: '26.9%' 
    },
    { 
      name: 'dont Sucres / Of which sugars', 
      value: '70', 
      unit: 'g',
      dailyValue: '77.8%' 
    },
    { 
      name: 'Fibres / Fiber', 
      value: '6.25', 
      unit: 'g',
      dailyValue: '25%' 
    },
    { 
      name: 'Protéines / Protein', 
      value: '2.2', 
      unit: 'g',
      dailyValue: '4.4%' 
    },
    { 
      name: 'Matières grasses / Fat', 
      value: '0.2', 
      unit: 'g',
      dailyValue: '0.3%' 
    },
    { 
      name: 'dont Acides gras saturés / Saturated fatty acids', 
      value: '0.2', 
      unit: 'g',
      dailyValue: '1%' 
    },
    { 
      name: 'Sel / Salt', 
      value: '0', 
      unit: 'g',
      dailyValue: '—' 
    },
  ];

  const packagingData = [
    {
      designation: 'Coffret cadeau dattes naturelles 1kg en bois',
      paquetsCarton: '10',
      cartonsPalette: '64',
      poidsNetPal: '640',
      poidsBrutPal: '780',
      hteurPal: '1,8',
      palSR: '33',
      palConteneur: '10'
    },
    {
      designation: 'Coffret cadeau dattes naturelles 500g en bois',
      paquetsCarton: '20',
      cartonsPalette: '64',
      poidsNetPal: '640',
      poidsBrutPal: '780',
      hteurPal: '1,8',
      palSR: '33',
      palConteneur: '10'
    }
  ];

  const technicalSpecs = [
    { label: 'Description', value: 'Datte Deglet Nour branchée de couleur jaune à brune' },
    { label: 'Conservation', value: '12 mois – température de 0°C à 4°C HR<65%' },
    { label: 'Période de récolte', value: 'Octobre à décembre' },
    { label: 'Région', value: 'Zaafrane-Douz-Kébili' },
    { label: 'Usage', value: 'Consommation' },
    { label: 'Etat', value: 'Avec noyaux' },
    { label: 'Type', value: 'Grasse comprise entre 20% et 30%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6F0]/50 to-white/50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center text-[#700100] hover:text-[#96cc39] transition-colors bg-transparent px-4 py-2 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour aux produits
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
              <img
                src="produitstemplate.png"
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {product.isOrganic && (
                  <span className="bg-[#96cc39] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Leaf className="w-4 h-4" />
                    Bio
                  </span>
                )}
                {product.isFairTrade && (
                  <span className="bg-[#700100] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Award className="w-4 h-4" />
                    Équitable
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-playfair text-[#700100] mb-4">
                {product.title}
              </h1>
              
              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'description' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'ingredients' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ingrédients
                </button>
                <button 
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'nutrition' 
                      ? 'text-[#700100] border-b-2 border-[#700100]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Valeurs Nutritionnelles
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[200px]">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 leading-relaxed text-lg"
                  >
                    {product.description}
                    <p className="mt-4">
                      Ces dattes premium sont soigneusement cultivées dans les palmeraies tunisiennes, où le climat et le terroir exceptionnels confèrent à nos dattes leurs qualités uniques. Chaque fruit est sélectionné à la main pour garantir un produit d'une qualité irréprochable.
                    </p>
                  </motion.div>
                )}
                
                {/* Ingredients Tab */}
                {activeTab === 'ingredients' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="space-y-2">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-[#96cc39] mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-gray-600 text-sm italic">
                      Aucun additif, conservateur ou colorant ajouté. Nos dattes sont conditionnées dans un environnement contrôlé pour préserver leur qualité et leur fraîcheur.
                    </p>
                  </motion.div>
                )}
                
                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                  >
                    <div className="divide-y divide-gray-100">
                      {nutritionFacts.map((fact, index) => (
                        <motion.div
                          key={fact.name}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium">{fact.name}</span>
                          <span className="text-[#700100] font-semibold">
                            {fact.value} {fact.unit}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 text-xs text-gray-500 italic">
                      *Les valeurs nutritionnelles sont données pour 100g de produit
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* B2B Only Section */}
        {clientType === 'B2B' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 space-y-12"
          >
            <div>
              <h2 className="text-2xl font-playfair text-[#700100] mb-6">
                Informations de Conditionnement
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gradient-to-br from-[#64381b] to-[#4e2b15] text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold">Désignation</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Paquets/<br/>Carton</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Cartons/<br/>Palette</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Poids Net<br/>Pal</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Poids Brut<br/>Pal</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">Hteur Pal</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold">Pal./SR</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Pal. /<br/>conteneur 20'</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {packagingData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.designation}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.paquetsCarton}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.cartonsPalette}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.poidsNetPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.poidsBrutPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.hteurPal}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.palSR}</td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">{item.palConteneur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-[#700100] mb-6">
                Spécifications Techniques
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-4 bg-gradient-to-br from-[#64381b] to-[#4e2b15]">
                  <h3 className="text-xl font-playfair text-white">Fiche technique</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-2">
                      <span className="text-sm font-medium text-[#700100]">{spec.label}</span>
                      <span className="text-sm text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
       
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
