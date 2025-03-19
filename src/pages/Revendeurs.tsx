
import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { suppliers, stores, Store } from '../config/resellers';
import { ShoppingBag, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define the extended reseller interface
interface ExtendedReseller {
  id: string;
  name: string;
  coordinates: [number, number];
  address: string;
  suppliers: string[];
  city?: string;
  category?: string;
  website?: string;
}

const MapController = ({ onMapReady }: { onMapReady: (map: L.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const getMarkerColor = (supplier: string) => {
  switch(supplier) {
    case 'benyaghlen': return '#96cc39';
    case 'carrefour': return '#1E3764';
    case 'geant': return '#E30613';
    case 'monoprix': return '#E2001A';
    default: return '#700100';
  }
};

const Revendeurs = () => {
  const { t } = useTranslation();
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [filteredStores, setFilteredStores] = useState<ExtendedReseller[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const convertToExtendedReseller = (storeData: Store[]): ExtendedReseller[] => {
    return storeData.map(store => ({
      ...store,
      id: String(store.id)
    }));
  };

  useEffect(() => {
    if (selectedSupplier) {
      setFilteredStores(
        convertToExtendedReseller(
          stores.filter(store => store.suppliers.includes(selectedSupplier))
        )
      );
    } else {
      setFilteredStores(convertToExtendedReseller(stores));
    }
  }, [selectedSupplier]);

  useEffect(() => {
    if (map && filteredStores.length > 0) {
      const bounds = L.latLngBounds(filteredStores.map(store => store.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredStores, map]);

  const handleMapReady = useCallback((map: L.Map) => {
    setMap(map);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('resellers.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('resellers.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 glass-card rounded-2xl overflow-hidden shadow-lg relative h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ minHeight: '650px' }}
          >
            <div className="relative z-[1] h-full">
              <MapContainer
                center={[36.8065, 10.1815]}
                zoom={7}
                className="h-full w-full"
                style={{ height: '100%', minHeight: '650px' }}
              >
                <MapController onMapReady={handleMapReady} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStores.map((store) => (
                  <Marker 
                    key={store.id} 
                    position={store.coordinates}
                  >
                    <Popup className="leaflet-popup">
                      <div className="p-3">
                        <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {store.address}
                          {store.city && `, ${store.city}`}
                        </p>
                        <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
                          {store.suppliers.map(supplierId => {
                            const supplier = suppliers.find(s => s.id === supplierId);
                            return supplier && (
                              <div key={supplierId} className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMarkerColor(supplierId) }}></div>
                                <span className="text-xs text-gray-500 mt-1">{supplier.name}</span>
                              </div>
                            );
                          })}
                          
                          <div className="flex-shrink-0">
                            {store.website && (
                              <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#96cc39] hover:text-[#700100] flex items-center transition-colors">
                                <ShoppingBag className="w-4 h-4 mr-1" />
                                {t('resellers.see_products')}
                              </a>
                            )}
                            {!store.website && (
                              <button className="text-sm font-medium text-[#96cc39] hover:text-[#700100] flex items-center transition-colors">
                                <ShoppingBag className="w-4 h-4 mr-1" />
                                {t('resellers.see_products')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 h-full"
          >
            <motion.div 
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl h-full overflow-auto"
              style={{ maxHeight: '540px' }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('resellers.our_distributors')}</h2>
              <div className="space-y-4">
                <motion.button
                  onClick={() => setSelectedSupplier(null)}
                  className={`w-full p-3 rounded-xl transition-all ${
                    selectedSupplier === null
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('resellers.all_resellers')}
                </motion.button>
                
                <div className="grid grid-cols-2 gap-3">
                  {suppliers.map((supplier) => (
                    <motion.button
                      key={supplier.id}
                      onClick={() => setSelectedSupplier(supplier.id)}
                      className={`transition-all rounded-xl overflow-hidden ${
                        selectedSupplier === supplier.id
                          ? 'ring-2 ring-gray-900 ring-offset-2'
                          : 'hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center">
                        <img
                          src={supplier.logo}
                          alt={supplier.name}
                          className="h-10 w-auto object-contain mb-2"
                        />
                        <p className="text-xs font-medium text-gray-700">{supplier.name}</p>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {t(`resellers.supplier_descriptions.${supplier.id}`)}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm italic mt-6">
                {t('resellers.and_many_more')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Revendeurs;
