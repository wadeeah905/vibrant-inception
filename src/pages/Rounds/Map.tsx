import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Calendar, User, Plus, ArrowLeft, 
  Settings, Trash2, Search, 
  QrCode, History, Navigation, Navigation2, Circle, CircleDot
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses } from '../../config/theme';

interface Point {
  id: number;
  position: [number, number];
  name: string;
  description?: string;
  qrCode?: string;
}

interface Site {
  id: number;
  name: string;
  description: string;
  location: [number, number];
}

interface AgentRoutePoint {
  position: [number, number];
  timestamp: string;
  type: 'checkpoint' | 'inbetween';
}

interface Round {
  id: number;
  name: string;
  site: string;
  siteId: number;
  checkpoints: Point[];
  duration: string;
  assignedTo: string;
  status: 'en-attente' | 'en-cours' | 'terminé';
  createdAt: string;
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  type: 'régulière' | 'urgente' | 'spéciale';
  agentRoute?: AgentRoutePoint[];
}

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const siteIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const agentIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getStatusColor = (status: Round['status'], theme: 'dark' | 'light') => {
  const baseColors = {
    'en-attente': 'yellow',
    'en-cours': 'blue',
    'terminé': 'green'
  };

  const color = baseColors[status];
  return `bg-${color}-500 ${theme === 'dark' ? 'bg-opacity-20' : 'bg-opacity-10'} text-${color}-${theme === 'dark' ? '400' : '600'}`;
};

const getRoundTypeColor = (type: Round['type'], theme: 'dark' | 'light') => {
  const baseColors = {
    'régulière': 'emerald',
    'urgente': 'red',
    'spéciale': 'purple'
  };

  const color = baseColors[type];
  return `text-${color}-${theme === 'dark' ? '400' : '600'}`;
};

interface PointModalProps {
  point: Point;
  onSave: (updatedPoint: Point) => void;
  onClose: () => void;
}

function PointModal({ point, onSave, onClose }: PointModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(point.name);
  const [description, setDescription] = useState(point.description || '');
  const qrValue = `checkpoint:${point.id}:${point.position.join(',')}:${name}`;

  const handleSave = () => {
    onSave({
      ...point,
      name,
      description,
      qrCode: qrValue
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 max-w-md w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
            Point de Contrôle
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
          >
            <ArrowLeft className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
              Nom du Point
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${getThemeClasses(theme, 'input')}`}
              placeholder="Nom du point de contrôle"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full ${getThemeClasses(theme, 'input')} min-h-[100px]`}
              placeholder="Description du point de contrôle"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
              QR Code
            </label>
            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg flex items-center justify-center`}>
              <QrCode className="w-24 h-24" />
            </div>
            <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')} mt-2`}>
              Ce QR code sera utilisé pour valider le passage à ce point de contrôle
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSave}
              className={`flex-1 ${getButtonClasses(theme, 'primary')} py-2 rounded-lg flex items-center justify-center gap-2`}
            >
              <QrCode className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={onClose}
              className={`flex-1 ${getButtonClasses(theme, 'secondary')} py-2 rounded-lg`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapComponent({ 
  points, 
  sites,
  isCreating = false, 
  onAddPoint = () => {},
  selectedSite,
  readOnly = false,
  center = [48.8566, 2.3522] as [number, number],
  onPointUpdate = () => {},
  agentRouteHistory = []
}: {
  points: Point[];
  sites: Site[];
  isCreating?: boolean;
  onAddPoint?: (point: Point) => void;
  selectedSite: Site | null;
  readOnly?: boolean;
  center?: [number, number];
  onPointUpdate?: (point: Point) => void;
  agentRouteHistory?: AgentRoutePoint[];
}) {
  const { theme } = useTheme();
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  
  const positions = points.map(point => point.position);
  const agentRoutePositions = agentRouteHistory.map(point => point.position);

  return (
    <>
      <MapContainer
        center={selectedSite ? selectedSite.location : center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className={`rounded-lg overflow-hidden border ${getThemeClasses(theme, 'border')}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {sites?.map((site) => (
          <Marker
            key={site.id}
            position={site.location}
            icon={siteIcon}
          >
            <Popup>
              <div className={getThemeClasses(theme, 'text')}>
                <h3 className="font-bold">{site.name}</h3>
                <p className="text-sm">{site.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {points.map((point, index) => (
          <Marker
            key={point.id}
            position={point.position}
            icon={customIcon}
            eventHandlers={{
              click: () => !readOnly && setSelectedPoint(point)
            }}
          >
            <Popup>
              <div className={getThemeClasses(theme, 'text')}>
                {point.name}
                {!readOnly && (
                  <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')} block`}>
                    Point {index + 1} sur {points.length}
                  </span>
                )}
                {point.description && (
                  <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')} mt-1`}>{point.description}</p>
                )}
                {point.qrCode && !readOnly && (
                  <button
                    onClick={() => setSelectedPoint(point)}
                    className={`mt-2 flex items-center gap-2 text-sm ${getThemeClasses(theme, 'textSecondary')} hover:text-primary-500`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Voir le QR Code</span>
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions}
            color="#0ea5e9"
            weight={3}
            opacity={0.8}
          />
        )}

        {agentRouteHistory.length > 0 && (
          <>
            <Polyline 
              positions={agentRoutePositions}
              color="#10b981"
              weight={3}
              opacity={0.8}
              dashArray="5, 10"
            />

            {agentRouteHistory.map((point, index) => (
              <CircleMarker 
                key={`route-${index}`}
                center={point.position}
                radius={point.type === 'checkpoint' ? 8 : 4}
                fillColor={point.type === 'checkpoint' ? '#10b981' : '#d1d5db'}
                color={point.type === 'checkpoint' ? '#047857' : '#9ca3af'}
                weight={2}
                fillOpacity={0.7}
              >
                <Popup>
                  <div className={getThemeClasses(theme, 'text')}>
                    <p className="font-medium">
                      {point.type === 'checkpoint' ? 'Point de contrôle validé' : 'Point intermédiaire'}
                    </p>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                      Heure: {new Date(point.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {agentRouteHistory.length > 0 && (
              <Marker
                position={agentRouteHistory[agentRouteHistory.length - 1].position}
                icon={agentIcon}
              >
                <Popup>
                  <div className={getThemeClasses(theme, 'text')}>
                    <p className="font-medium">Position actuelle de l'agent</p>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                      Dernière mise à jour: {new Date(agentRouteHistory[agentRouteHistory.length - 1].timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>

      {selectedPoint && !readOnly && (
        <PointModal
          point={selectedPoint}
          onSave={(updatedPoint) => {
            onPointUpdate(updatedPoint);
            setSelectedPoint(null);
          }}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </>
  );
}

export default function RoundsMap() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [roundData, setRoundData] = useState({
    name: '',
    type: 'régulière' as Round['type'],
    schedule: {
      startTime: '09:00',
      endTime: '17:00',
      days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    }
  });
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Round['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Round['type'] | 'all'>('all');

  useEffect(() => {
    const savedRounds = localStorage.getItem('rounds');
    const savedSites = localStorage.getItem('sites');
    if (savedRounds) {
      const parsedRounds = JSON.parse(savedRounds);
      
      const updatedRounds = parsedRounds.map((round: Round) => {
        if (round.status === 'terminé' && !round.agentRoute) {
          const agentRoute = generateRandomAgentRoute(round.checkpoints);
          return { ...round, agentRoute };
        }
        return round;
      });
      
      setRounds(updatedRounds);
      localStorage.setItem('rounds', JSON.stringify(updatedRounds));
    } else {
      setRounds([]);
    }
    
    if (savedSites) setSites(JSON.parse(savedSites));
  }, []);

  const generateRandomAgentRoute = (checkpoints: Point[]): AgentRoutePoint[] => {
    if (!checkpoints || checkpoints.length < 2) return [];
    
    const route: AgentRoutePoint[] = [];
    const baseTime = new Date();
    baseTime.setHours(9, 0, 0, 0);
    
    route.push({
      position: checkpoints[0].position,
      timestamp: new Date(baseTime).toISOString(),
      type: 'checkpoint'
    });
    
    for (let i = 0; i < checkpoints.length - 1; i++) {
      const startPoint = checkpoints[i].position;
      const endPoint = checkpoints[i + 1].position;
      
      const numPoints = 2 + Math.floor(Math.random() * 3);
      
      for (let j = 1; j <= numPoints; j++) {
        baseTime.setMinutes(baseTime.getMinutes() + 5 + Math.floor(Math.random() * 10));
        
        const ratio = j / (numPoints + 1);
        const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * ratio;
        const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * ratio;
        
        const randomLat = (Math.random() - 0.5) * 0.005;
        const randomLng = (Math.random() - 0.5) * 0.005;
        
        route.push({
          position: [lat + randomLat, lng + randomLng] as [number, number],
          timestamp: new Date(baseTime).toISOString(),
          type: 'inbetween'
        });
      }
      
      baseTime.setMinutes(baseTime.getMinutes() + 5 + Math.floor(Math.random() * 10));
      route.push({
        position: endPoint,
        timestamp: new Date(baseTime).toISOString(),
        type: 'checkpoint'
      });
    }
    
    return route;
  };

  const saveRounds = (newRounds: Round[]) => {
    localStorage.setItem('rounds', JSON.stringify(newRounds));
    setRounds(newRounds);
  };

  const handleSaveRound = () => {
    if (roundData.name && points.length >= 2 && selectedSite) {
      const newRound: Round = {
        id: Date.now(),
        name: roundData.name,
        site: selectedSite.name,
        siteId: selectedSite.id,
        checkpoints: points,
        duration: '45 mins',
        assignedTo: 'Non assigné',
        status: 'en-attente',
        createdAt: new Date().toISOString(),
        type: roundData.type,
        schedule: roundData.schedule
      };
      
      saveRounds([...rounds, newRound]);
      setIsCreating(false);
      setPoints([]);
      setRoundData({
        name: '',
        type: 'régulière',
        schedule: {
          startTime: '09:00',
          endTime: '17:00',
          days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
        }
      });
      setSelectedSite(null);
    }
  };

  const handleAddPoint = (point: Point) => {
    setPoints([...points, point]);
  };

  const handlePointUpdate = (updatedPoint: Point) => {
    const newPoints = points.map(p => 
      p.id === updatedPoint.id ? updatedPoint : p
    );
    setPoints(newPoints);
  };

  const filteredRounds = rounds
    .filter(round => 
      round.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      round.site.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(round => statusFilter === 'all' || round.status === statusFilter)
    .filter(round => typeFilter === 'all' || round.type === typeFilter);

  if (selectedRound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedRound(null)}
            className={`flex items-center gap-2 text-primary-400 hover:text-primary-500 transition-colors ${getButtonClasses(theme, 'secondary')}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux rondes
          </button>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>{selectedRound.name}</h1>
        </div>

        <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedRound.site}</span>
              </div>
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Clock className="w-4 h-4 mr-2" />
                <span>{selectedRound.duration}</span>
              </div>
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>{selectedRound.checkpoints.length} points de contrôle</span>
              </div>
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <User className="w-4 h-4 mr-2" />
                <span>{selectedRound.assignedTo}</span>
              </div>
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Type: <span className={getRoundTypeColor(selectedRound.type, theme)}>{selectedRound.type}</span></span>
              </div>
            </div>
            <div className="space-y-3">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRound.status, theme)}`}>
                {selectedRound.status}
              </div>
              <div className={getThemeClasses(theme, 'textSecondary')}>
                <p className="font-medium mb-1">Horaires:</p>
                <p>{selectedRound.schedule.startTime} - {selectedRound.schedule.endTime}</p>
                <p className="text-sm">{selectedRound.schedule.days.join(', ')}</p>
              </div>
              
              {selectedRound.agentRoute && selectedRound.agentRoute.length > 0 && (
                <div className={`p-3 rounded-lg ${getThemeClasses(theme, 'backgroundTertiary')} mt-2`}>
                  <div className="flex items-center">
                    <Navigation2 className="w-4 h-4 text-emerald-500 mr-2" />
                    <span className="font-medium text-emerald-500">Parcours de l'agent</span>
                  </div>
                  <p className={`text-sm mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
                    {selectedRound.agentRoute.filter(p => p.type === 'checkpoint').length} points visités 
                    • {selectedRound.agentRoute.length - selectedRound.agentRoute.filter(p => p.type === 'checkpoint').length} points intermédiaires
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="h-[600px]">
            <MapComponent
              points={selectedRound.checkpoints}
              sites={sites}
              isCreating={false}
              onAddPoint={() => {}}
              readOnly={true}
              selectedSite={sites.find(s => s.id === selectedRound.siteId) || null}
              onPointUpdate={() => {}}
              agentRouteHistory={selectedRound.agentRoute}
            />
          </div>
          
          {selectedRound.agentRoute && selectedRound.agentRoute.length > 0 && (
            <div className="mt-6 p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
              <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                Historique des mouvements
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedRound.agentRoute.map((point, index) => (
                  <div 
                    key={`timeline-${index}`} 
                    className={`flex items-start ${index < selectedRound.agentRoute!.length - 1 ? 'pb-3' : ''}`}
                  >
                    <div className="mr-3 flex flex-col items-center">
                      {point.type === 'checkpoint' ? (
                        <CircleDot className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      {index < selectedRound.agentRoute!.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${point.type === 'checkpoint' ? 'text-emerald-600 dark:text-emerald-400' : getThemeClasses(theme, 'textSecondary')}`}>
                        {point.type === 'checkpoint' ? 'Point de contrôle validé' : 'Déplacement'}
                      </p>
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        {new Date(point.timestamp).toLocaleTimeString()} - 
                        Coordonnées: {point.position[0].toFixed(6)}, {point.position[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Créez et gérez vos rondes de sécurité
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
            <input
              type="text"
              placeholder="Rechercher des rondes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 ${getThemeClasses(theme, 'input')}`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Round['status'] | 'all')}
            className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
          >
            <option value="all">Tous les statuts</option>
            <option value="en-attente">En attente</option>
            <option value="en-cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Round['type'] | 'all')}
            className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
          >
            <option value="all">Tous les types</option>
            <option value="régulière">Régulière</option>
            <option value="urgente">Urgente</option>
            <option value="spéciale">Spéciale</option>
          </select>
          <button
            onClick={() => navigate('/rounds/history')}
            className={`${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg flex items-center gap-2`}
          >
            <History className="w-5 h-5" />
            Voir l'historique
          </button>
        </div>
      </div>

      <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
            {isCreating ? 'Créer une Nouvelle Ronde' : 'Carte des Rondes'}
          </h2>
          <div className="flex gap-4">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className={`${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <Plus className="w-5 h-5" />
                Nouvelle Ronde
              </button>
            ) : (
              <div className="flex gap-4">
                <select
                  value={selectedSite?.id || ''}
                  onChange={(e) => setSelectedSite(sites.find(s => s.id === Number(e.target.value)) || null)}
                  className={getThemeClasses(theme, 'input')}
                >
                  <option value="">Sélectionner un site</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={roundData.name}
                  onChange={(e) => setRoundData({ ...roundData, name: e.target.value })}
                  placeholder="Nom de la ronde"
                  className={getThemeClasses(theme, 'input')}
                />
                <select
                  value={roundData.type}
                  onChange={(e) => setRoundData({ ...roundData, type: e.target.value as Round['type'] })}
                  className={getThemeClasses(theme, 'input')}
                >
                  <option value="régulière">Régulière</option>
                  <option value="urgente">Urgente</option>
                  <option value="spéciale">Spéciale</option>
                </select>
                <button
                  onClick={handleSaveRound}
                  className={`${getButtonClasses(theme, 'success')} px-4 py-2 rounded-lg flex items-center gap-2`}
                  disabled={!roundData.name || points.length < 2 || !selectedSite}
                >
                  <Plus className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setPoints([]);
                    setRoundData({
                      name: '',
                      type: 'régulière',
                      schedule: {
                        startTime: '09:00',
                        endTime: '17:00',
                        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
                      }
                    });
                    setSelectedSite(null);
                  }}
                  className={`${getButtonClasses(theme, 'danger')} px-4 py-2 rounded-lg flex items-center gap-2`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {isCreating && (
          <div className="mb-4 space-y-4">
            <div className={`p-4 ${getThemeClasses(theme, 'backgroundTertiary')} border ${getThemeClasses(theme, 'border')} rounded-lg`}>
              <div className="flex items-center gap-2 text-primary-400 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Instructions</span>
              </div>
              <p className={getThemeClasses(theme, 'text')}>
                Cliquez sur la carte pour ajouter des points de contrôle. Minimum 2 points requis.
              </p>
              <p className={`text-sm mt-2 ${getThemeClasses(theme, 'textSecondary')}`}>
                Points ajoutés: {points.length}
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
              <div>
                <h3 className={`${getThemeClasses(theme, 'text')} font-medium mb-2`}>Horaires</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm ${getThemeClasses(theme, 'textSecondary')} mb-1`}>Début</label>
                    <input
                      type="time"
                      value={roundData.schedule.startTime}
                      onChange={(e) => setRoundData({
                        ...roundData,
                        schedule: { ...roundData.schedule, startTime: e.target.value }
                      })}
                      className={getThemeClasses(theme, 'input')}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm ${getThemeClasses(theme, 'textSecondary')} mb-1`}>Fin</label>
                    <input
                      type="time"
                      value={roundData.schedule.endTime}
                      onChange={(e) => setRoundData({
                        ...roundData,
                        schedule: { ...roundData.schedule, endTime: e.target.value }
                      })}
                      className={getThemeClasses(theme, 'input')}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`${getThemeClasses(theme, 'text')} font-medium mb-2`}>Jours</h3>
                <div className="flex flex-wrap gap-2">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={roundData.schedule.days.includes(day)}
                        onChange={(e) => {
                          const days = e.target.checked
                            ? [...roundData.schedule.days, day]
                            : roundData.schedule.days.filter(d => d !== day);
                          setRoundData({
                            ...roundData,
                            schedule: { ...roundData.schedule, days }
                          });
                        }}
                        className="text-primary-600"
                      />
                      <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="h-[500px]">
            <MapComponent
              points={points}
              sites={sites}
              isCreating={isCreating}
              onAddPoint={handleAddPoint}
              selectedSite={selectedSite}
              onPointUpdate={handlePointUpdate}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRounds.map((round) => (
          <div 
            key={round.id} 
            className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 ${getThemeClasses(theme, 'cardHover')} transition-colors cursor-pointer`}
            onClick={() => setSelectedRound(round)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${getThemeClasses(theme, 'text')}`}>{round.name}</h3>
              <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(round.status, theme)}`}>
                {round.status}
              </div>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <MapPin className="w-4 h-4 mr-2" />
                <span>{round.site}</span>
              </div>
              
              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Clock className="w-4 h-4 mr-2" />
                <span>{round.duration}</span>
              </div>

              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>{round.checkpoints.length} points de contrôle</span>
              </div>

              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <User className="w-4 h-4 mr-2" />
                <span>{round.assignedTo}</span>
              </div>

              <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                <Settings className="w-4 h-4 mr-2" />
                <span className={getRoundTypeColor(round.type, theme)}>{round.type}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-inherit">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRound(round);
                }}
                className={`w-full ${getButtonClasses(theme, 'secondary')} py-2 rounded-lg`}
              >
                Voir les détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
