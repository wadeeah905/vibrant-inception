
import React, { useState, useRef } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  Search, 
  Filter,
  AlertTriangle,
  Camera,
  FileText,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  QrCode,
  ArrowLeft,
  ArrowUpDown,
  Circle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses } from '../../config/theme';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RoundReport {
  id: number;
  roundName: string;
  completedBy: {
    name: string;
    avatar: string;
  };
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'incident' | 'incomplete';
  checkpoints: {
    name: string;
    time: string;
    status: 'ok' | 'warning' | 'error';
    photo?: string;
    notes?: string;
    position?: [number, number]; // adding position for map display
    completionTime?: string; // adding completion time
  }[];
  incidents?: {
    type: string;
    description: string;
    time: string;
    location: string;
    severity: 'high' | 'medium' | 'low';
    photo?: string;
    position?: [number, number]; // adding position for map display
  }[];
}

const sampleReports: RoundReport[] = [
  {
    id: 1,
    roundName: "Périmètre Nord - Matin",
    completedBy: {
      name: "Jean Dupont",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    startTime: "2024-02-28 08:00:00",
    endTime: "2024-02-28 09:15:00",
    duration: "1h 15min",
    status: "completed",
    checkpoints: [
      {
        name: "Entrée principale",
        time: "08:15:00",
        status: "ok",
        photo: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        notes: "RAS - Portes sécurisées",
        position: [48.8561, 2.3522],
        completionTime: "5 minutes"
      },
      {
        name: "Zone de stockage A",
        time: "08:45:00",
        status: "ok",
        notes: "Inventaire vérifié",
        position: [48.8571, 2.3532],
        completionTime: "8 minutes"
      }
    ]
  },
  {
    id: 2,
    roundName: "Périmètre Sud - Après-midi",
    completedBy: {
      name: "Marie Martin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    startTime: "2024-02-28 14:00:00",
    endTime: "2024-02-28 15:30:00",
    duration: "1h 30min",
    status: "incident",
    checkpoints: [
      {
        name: "Parking visiteurs",
        time: "14:15:00",
        status: "ok",
        notes: "RAS",
        position: [48.8581, 2.3542],
        completionTime: "4 minutes"
      },
      {
        name: "Zone sécurisée B",
        time: "14:45:00",
        status: "warning",
        photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        notes: "Porte mal fermée",
        position: [48.8591, 2.3552],
        completionTime: "10 minutes"
      }
    ],
    incidents: [
      {
        type: "Sécurité",
        description: "Porte de sécurité mal fermée dans la zone B",
        time: "14:45:00",
        location: "Zone B - Niveau 2",
        severity: "medium",
        photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        position: [48.8591, 2.3552]
      }
    ]
  },
  {
    id: 3,
    roundName: "Périmètre Est - Soir",
    completedBy: {
      name: "Lucas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    startTime: "2024-02-28 20:00:00",
    endTime: "2024-02-28 21:00:00",
    duration: "1h",
    status: "incomplete",
    checkpoints: [
      {
        name: "Entrée service",
        time: "20:15:00",
        status: "error",
        photo: "https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        notes: "Point de contrôle non atteint",
        position: [48.8601, 2.3562],
        completionTime: "7 minutes"
      },
      {
        name: "Escalier principal",
        time: "20:25:00",
        status: "ok",
        notes: "Vérification effectuée",
        position: [48.8611, 2.3572],
        completionTime: "3 minutes"
      },
      {
        name: "Salle de réunion",
        time: "20:35:00",
        status: "ok",
        notes: "Lumières éteintes, portes fermées",
        position: [48.8621, 2.3582],
        completionTime: "5 minutes"
      },
      {
        name: "Zone d'archives",
        time: "20:45:00",
        status: "warning",
        notes: "Fenêtre mal fermée",
        position: [48.8631, 2.3592],
        completionTime: "6 minutes"
      }
    ]
  }
];

const getStatusColor = (status: RoundReport['status']) => {
  switch (status) {
    case 'completed':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'incident':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'incomplete':
      return 'text-red-500 bg-red-500/10';
  }
};

const getCheckpointStatusColor = (status: 'ok' | 'warning' | 'error') => {
  switch (status) {
    case 'ok':
      return 'text-emerald-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
  }
};

const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'high':
      return 'text-red-500 bg-red-500/10';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'low':
      return 'text-emerald-500 bg-emerald-500/10';
  }
};

interface QRCodeModalProps {
  report: RoundReport;
  onClose: () => void;
}

function QRCodeModal({ report, onClose }: QRCodeModalProps) {
  const { theme } = useTheme();
  const qrValue = `ronde:${report.id}:${report.roundName}:${report.completedBy.name}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 max-w-md w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
            QR Code de la Ronde
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
          >
            <ChevronDown className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg flex items-center justify-center`}>
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
              bgColor={theme === 'dark' ? '#1e293b' : '#ffffff'}
              fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
            />
          </div>
          <div className="text-center">
            <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{report.roundName}</p>
            <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
              Technicien: {report.completedBy.name}
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className={`${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg`}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// New component for the Route Map visualization
function RouteMap({ report }: { report: RoundReport }) {
  const { theme } = useTheme();
  
  // Extract positions for the route
  const positions = report.checkpoints.map(checkpoint => checkpoint.position).filter(Boolean) as [number, number][];
  
  // Calculate center position
  const calculateCenter = () => {
    if (positions.length === 0) return [48.8566, 2.3522]; // Default to Paris
    
    const latSum = positions.reduce((sum, pos) => sum + pos[0], 0);
    const lngSum = positions.reduce((sum, pos) => sum + pos[1], 0);
    
    return [latSum / positions.length, lngSum / positions.length];
  };
  
  const center = calculateCenter() as [number, number];
  
  return (
    <div className="h-[400px] rounded-lg overflow-hidden mb-6">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className={`rounded-lg overflow-hidden border ${getThemeClasses(theme, 'border')}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {/* Route line connecting checkpoints */}
        {positions.length > 1 && (
          <Polyline 
            positions={positions}
            color="#0ea5e9"
            weight={3}
            opacity={0.8}
          />
        )}
        
        {/* Checkpoints */}
        {report.checkpoints.map((checkpoint, index) => checkpoint.position && (
          <CircleMarker
            key={`checkpoint-${index}`}
            center={checkpoint.position}
            radius={8}
            fillColor={
              checkpoint.status === 'ok' ? '#10b981' : 
              checkpoint.status === 'warning' ? '#f59e0b' : 
              '#ef4444'
            }
            color="#ffffff"
            weight={2}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{checkpoint.name}</h3>
                <p className="text-sm">Temps: {checkpoint.time}</p>
                <p className="text-sm">Durée: {checkpoint.completionTime}</p>
                {checkpoint.notes && <p className="text-sm">Notes: {checkpoint.notes}</p>}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Incidents */}
        {report.incidents?.map((incident, index) => incident.position && (
          <CircleMarker
            key={`incident-${index}`}
            center={incident.position}
            radius={10}
            fillColor="#f43f5e"
            color="#ffffff"
            weight={2}
            fillOpacity={0.9}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-red-500">{incident.type}</h3>
                <p className="text-sm">{incident.description}</p>
                <p className="text-sm">Lieu: {incident.location}</p>
                <p className="text-sm">Heure: {incident.time}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function RoundsHistory() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoundReport['status'] | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<RoundReport | null>(null);
  const [expandedCheckpoints, setExpandedCheckpoints] = useState<number[]>([]);
  const [qrCodeReport, setQrCodeReport] = useState<RoundReport | null>(null);
  const [sortField, setSortField] = useState<keyof RoundReport>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: selectedReport ? `Rapport-${selectedReport.roundName}` : 'Rapport-Ronde',
    onAfterPrint: () => console.log('PDF generated successfully!')
  });

  const filteredReports = sampleReports
    .filter(report => 
      report.roundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.completedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(report => statusFilter === 'all' || report.status === statusFilter)
    .sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });

  const handleSort = (field: keyof RoundReport) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleCheckpoints = (reportId: number) => {
    setExpandedCheckpoints(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const getStatusText = (status: RoundReport['status']) => {
    switch (status) {
      case 'completed': return 'Complétée';
      case 'incident': return 'Avec incident';
      case 'incomplete': return 'Incomplète';
    }
  };

  const getSeverityText = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
    }
  };

  return (
    <div className="space-y-6">
      {!selectedReport ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/rounds')}
                className={`${getButtonClasses(theme, 'secondary')} p-2 rounded-full flex items-center justify-center`}
                title="Retour aux rondes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className={`text-xl font-bold ${getThemeClasses(theme, 'text')}`}>
                  Historique des Rondes
                </h2>
                <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
                  Consultez les rapports des rondes effectuées
                </p>
              </div>
            </div>
            <button
              onClick={() => handlePrint()}
              className={`${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg flex items-center space-x-2`}
            >
              <Download className="w-5 h-5" />
              <span>Exporter les Rapports</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
              <input
                type="text"
                placeholder="Rechercher des rapports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RoundReport['status'] | 'all')}
              className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Complétée</option>
              <option value="incident">Avec incident</option>
              <option value="incomplete">Incomplète</option>
            </select>
          </div>

          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 overflow-x-auto`}>
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b ${getThemeClasses(theme, 'border')}`}>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('roundName')}
                    >
                      <span>Nom de la ronde</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('completedBy')}
                    >
                      <span>Technicien</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('duration')}
                    >
                      <span>Durée</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('startTime')}
                    >
                      <span>Date</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('status')}
                    >
                      <span>Statut</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className={`text-left py-3 px-4 ${getThemeClasses(theme, 'text')}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr 
                    key={report.id}
                    className={`border-b ${getThemeClasses(theme, 'border')} ${getThemeClasses(theme, 'hover')}`}
                  >
                    <td className={`py-3 px-4 ${getThemeClasses(theme, 'text')}`}>{report.roundName}</td>
                    <td className={`py-3 px-4`}>
                      <div className="flex items-center space-x-2">
                        <img
                          src={report.completedBy.avatar}
                          alt={report.completedBy.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className={getThemeClasses(theme, 'text')}>{report.completedBy.name}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${getThemeClasses(theme, 'text')}`}>{report.duration}</td>
                    <td className={`py-3 px-4 ${getThemeClasses(theme, 'text')}`}>{report.startTime}</td>
                    <td className={`py-3 px-4`}>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className={`py-3 px-4`}>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'textSecondary')}`}
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setQrCodeReport(report)}
                          className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'textSecondary')}`}
                          title="QR Code"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setTimeout(() => handlePrint(), 500);
                          }}
                          className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'textSecondary')}`}
                          title="Télécharger le rapport"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div ref={printRef} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className={`${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg flex items-center space-x-2`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à la liste</span>
            </button>
            <button
              onClick={handlePrint}
              className={`${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg flex items-center space-x-2`}
            >
              <FileText className="w-4 h-4" />
              <span>Exporter PDF</span>
            </button>
          </div>
          
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedReport.completedBy.avatar}
                  alt={selectedReport.completedBy.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className={`text-xl font-bold ${getThemeClasses(theme, 'text')}`}>
                    {selectedReport.roundName}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedReport.status)}`}>
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                  <User className="w-5 h-5 mr-2" />
                  <span>Technicien: {selectedReport.completedBy.name}</span>
                </div>
                <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Durée: {selectedReport.duration}</span>
                </div>
                <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Début: {selectedReport.startTime}</span>
                </div>
                <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Fin: {selectedReport.endTime}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Points de contrôle: {selectedReport.checkpoints.length}</span>
                </div>
                {selectedReport.incidents && (
                  <div className={`flex items-center ${getThemeClasses(theme, 'textSecondary')}`}>
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>Incidents: {selectedReport.incidents.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map visualization of the route */}
            <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-3`}>
              Parcours de la ronde
            </h3>
            <RouteMap report={selectedReport} />

            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')}`}>
                Points de contrôle
              </h3>
              <div className="space-y-4">
                {selectedReport.checkpoints.map((checkpoint, index) => (
                  <div
                    key={index}
                    className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className={`w-5 h-5 ${getCheckpointStatusColor(checkpoint.status)}`} />
                        <span className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                          {checkpoint.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-md text-xs bg-primary-500/10 text-primary-500`}>
                          Temps: {checkpoint.completionTime || "N/A"}
                        </span>
                        <span className={getThemeClasses(theme, 'textSecondary')}>
                          {checkpoint.time}
                        </span>
                      </div>
                    </div>
                    {checkpoint.notes && (
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                        {checkpoint.notes}
                      </p>
                    )}
                    {checkpoint.photo && (
                      <div className="mt-2">
                        <img
                          src={checkpoint.photo}
                          alt={`Photo - ${checkpoint.name}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedReport.incidents && selectedReport.incidents.length > 0 && (
                <div className="mt-6">
                  <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                    Incidents Signalés
                  </h3>
                  <div className="space-y-4">
                    {selectedReport.incidents.map((incident, index) => (
                      <div
                        key={index}
                        className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <span className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                              {incident.type}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(incident.severity)}`}>
                            {getSeverityText(incident.severity)}
                          </span>
                        </div>
                        <p className={`text-sm ${getThemeClasses(theme, 'text')} mb-2`}>
                          {incident.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={getThemeClasses(theme, 'textSecondary')}>
                            <Clock className="w-4 h-4 inline mr-1" />
                            {incident.time}
                          </span>
                          <span className={getThemeClasses(theme, 'textSecondary')}>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {incident.location}
                          </span>
                        </div>
                        {incident.photo && (
                          <div className="mt-2">
                            <img
                              src={incident.photo}
                              alt={`Incident - ${incident.type}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-inherit flex justify-end space-x-4">
              <button
                onClick={() => setQrCodeReport(selectedReport)}
                className={`${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg flex items-center space-x-2`}
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {qrCodeReport && (
        <QRCodeModal
          report={qrCodeReport}
          onClose={() => setQrCodeReport(null)}
        />
      )}
    </div>
  );
}
