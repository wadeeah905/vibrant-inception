
import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { suppliers, stores } from '../config/resellers';

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

const Revendeurs = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [filteredStores, setFilteredStores] = useState(stores);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      setFilteredStores(stores.filter(store => store.suppliers.includes(selectedSupplier)));
    } else {
      setFilteredStores(stores);
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
            Nos Revendeurs
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez où trouver nos produits professionnels dans toute la Tunisie. 
            Notre réseau de revendeurs agréés vous garantit qualité et service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 glass-card rounded-2xl overflow-hidden shadow-lg relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-[1]">
              <MapContainer
                center={[36.8065, 10.1815]}
                zoom={7}
                className="h-[600px] w-full"
              >
                <MapController onMapReady={handleMapReady} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStores.map((store) => (
                  <Marker key={store.id} position={store.coordinates}>
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                        <p className="text-gray-600 text-sm">{store.address}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {store.suppliers.map(supplierId => {
                            const supplier = suppliers.find(s => s.id === supplierId);
                            return supplier && (
                              <img
                                key={supplierId}
                                src={supplier.logo}
                                alt={supplier.name}
                                className="h-6 w-auto object-contain"
                              />
                            );
                          })}
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
            className="space-y-6"
          >
            <motion.div 
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nos Partenaires</h2>
              <div className="space-y-4">
                <motion.button
                  onClick={() => setSelectedSupplier(null)}
                  className={`w-full p-4 rounded-xl transition-all ${
                    selectedSupplier === null
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Tous les revendeurs
                </motion.button>
                {suppliers.map((supplier) => (
                  <motion.button
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier.id)}
                    className={`w-full transition-all rounded-xl overflow-hidden ${
                      selectedSupplier === supplier.id
                        ? 'ring-2 ring-gray-900 ring-offset-2'
                        : 'hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-4 bg-white border border-gray-100 rounded-xl">
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="h-12 w-full object-contain mb-3"
                      />
                      <p className="text-sm text-gray-600">{supplier.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Revendeurs;
