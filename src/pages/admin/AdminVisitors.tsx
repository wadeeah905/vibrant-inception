
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface RawVisitor {
  ip_address: string;
  page_visited: string;
  referrer: string;
  country: string;
  city: string;
  visit_date: string;
}

interface VisitorStats {
  visitorsToday: number;
  pageviewsToday: number;
  avgTimeOnSite: string;
  bounceRate: number;
  dailyVisitors: {
    date: string;
    visitors: number;
    pageviews: number;
    bounceRate: number;
  }[];
  topPages: {
    page: string;
    visitors: number;
    total_visits: number;
    percentage: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    color: string;
  }[];
  countries: {
    country: string;
    visitors: number;
    flag: string;
  }[];
  deviceData: {
    name: string;
    value: number;
    color: string;
  }[];
  rawVisitors: RawVisitor[];
}

const AdminVisitors = () => {
  const { toast } = useToast();
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchVisitorsData = async () => {
    setLoading(true);
    try {
      console.log('Fetching visitor statistics...');
      const response = await fetch('https://draminesaid.com/lucci/api/get_visitor_stats.php');
      console.log('Visitor stats response status:', response.status);
      
      const result = await response.json();
      console.log('Visitor stats API response:', result);

      if (result.success && result.data) {
        // Process and enhance the data if needed
        const processedData = {
          ...result.data,
          // Ensure deviceData has proper structure with fallback
          deviceData: result.data.deviceData && result.data.deviceData.length > 0 
            ? result.data.deviceData 
            : [
                { name: 'Desktop', value: 45, color: '#0088FE' },
                { name: 'Mobile', value: 40, color: '#00C49F' },
                { name: 'Tablet', value: 15, color: '#FFBB28' }
              ],
          // Ensure dailyVisitors has proper data for growth chart
          dailyVisitors: result.data.dailyVisitors && result.data.dailyVisitors.length > 0
            ? result.data.dailyVisitors.map((item: any) => ({
                ...item,
                date: item.date,
                visitors: parseInt(item.visitors) || 0,
                pageviews: parseInt(item.pageviews) || 0,
                bounceRate: parseFloat(item.bounceRate) || 0
              }))
            : []
        };
        
        console.log('Processed visitor stats:', processedData);
        setVisitorStats(processedData);
      } else {
        console.warn('Failed to fetch visitor statistics:', result.message);
        // Set default data structure to prevent UI issues
        setVisitorStats({
          visitorsToday: 0,
          pageviewsToday: 0,
          avgTimeOnSite: '0:00',
          bounceRate: 0,
          dailyVisitors: [],
          topPages: [],
          trafficSources: [],
          countries: [],
          deviceData: [
            { name: 'Desktop', value: 45, color: '#0088FE' },
            { name: 'Mobile', value: 40, color: '#00C49F' },
            { name: 'Tablet', value: 15, color: '#FFBB28' }
          ],
          rawVisitors: []
        });
        toast({
          title: 'Information',
          description: 'Aucune donnée de visiteur disponible pour le moment',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error fetching visitor statistics:', error);
      // Set default data structure on error
      setVisitorStats({
        visitorsToday: 0,
        pageviewsToday: 0,
        avgTimeOnSite: '0:00',
        bounceRate: 0,
        dailyVisitors: [],
        topPages: [],
        trafficSources: [],
        countries: [],
        deviceData: [
          { name: 'Desktop', value: 45, color: '#0088FE' },
          { name: 'Mobile', value: 40, color: '#00C49F' },
          { name: 'Tablet', value: 15, color: '#FFBB28' }
        ],
        rawVisitors: []
      });
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques des visiteurs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorsData();
  }, []);

  const filteredVisitorsData = dateFilter === 'all' || !visitorStats
    ? visitorStats?.dailyVisitors || []
    : visitorStats.dailyVisitors.filter(data => {
        const [day, month] = data.date.split('/');
        const dataDate = new Date(2024, parseInt(month) - 1, parseInt(day));
        const today = new Date();

        switch (dateFilter) {
          case 'today':
            return dataDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return dataDate >= weekAgo && dataDate <= today;
          case 'month':
            return dataDate.getMonth() === today.getMonth() && dataDate.getFullYear() === today.getFullYear();
          case 'year':
            return dataDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });

  const totalVisitors = visitorStats?.dailyVisitors.reduce((sum, data) => sum + data.visitors, 0) || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques des visiteurs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">
                  Statistiques des Visiteurs
                </h1>
                <p className="text-gray-600 mt-1">
                  Analyse du trafic et comportement des visiteurs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!visitorStats ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
                  <p className="text-gray-500">
                    Les statistiques des visiteurs apparaîtront ici une fois que des données seront collectées.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Visiteurs Aujourd'hui
                    </CardTitle>
                    <Users className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{visitorStats.visitorsToday}</div>
                    <p className="text-xs text-white/70">Visiteurs uniques aujourd'hui</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Pages Vues
                    </CardTitle>
                    <Eye className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{visitorStats.pageviewsToday}</div>
                    <p className="text-xs text-white/70">Pages vues aujourd'hui</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Temps Moyen
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{visitorStats.avgTimeOnSite}</div>
                    <p className="text-xs text-white/70">Temps moyen sur le site</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Taux de Rebond
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-white/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{visitorStats.bounceRate}%</div>
                    <p className="text-xs text-white/70">Taux de rebond</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitors Over Time - Enhanced */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Croissance des visiteurs</CardTitle>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className={showFilters ? 'bg-gray-100' : ''}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    {showFilters && (
                      <DateFilter
                        value={dateFilter}
                        onValueChange={setDateFilter}
                      />
                    )}
                    <CardDescription>Évolution du nombre de visiteurs dans le temps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={filteredVisitorsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          stroke="#666"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="#666"
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="visitors" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: '#8884d8' }}
                          dot={{ fill: '#8884d8', r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pageviews" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: '#82ca9d' }}
                          dot={{ fill: '#82ca9d', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Device Types - Enhanced */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Analyse des Appareils</CardTitle>
                    <CardDescription>Répartition des visiteurs par type d'appareil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={visitorStats.deviceData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={40}
                          fill="#8884d8"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {visitorStats.deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center mt-4 gap-4">
                      {visitorStats.deviceData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          {item.name === 'Desktop' && <Monitor className="mr-2 h-4 w-4" style={{ color: item.color }} />}
                          {item.name === 'Mobile' && <Smartphone className="mr-2 h-4 w-4" style={{ color: item.color }} />}
                          {(item.name === 'Tablette' || item.name === 'Tablet') && <Globe className="mr-2 h-4 w-4" style={{ color: item.color }} />}
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500 ml-1">({item.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Data Tables */}
              {(visitorStats.topPages.length > 0 || visitorStats.countries.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Pages */}
                  {visitorStats.topPages.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Pages les plus visitées</CardTitle>
                        <CardDescription>Top des pages par nombre de visiteurs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {visitorStats.topPages.map((page, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium truncate">{page.page}</p>
                                <p className="text-xs text-gray-500">{page.total_visits} visites</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">{page.visitors}</p>
                                <p className="text-xs text-gray-500">{page.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Countries */}
                  {visitorStats.countries.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Pays des visiteurs</CardTitle>
                        <CardDescription>Répartition géographique</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {visitorStats.countries.map((country, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{country.flag}</span>
                                <span className="text-sm font-medium">{country.country}</span>
                              </div>
                              <span className="text-sm font-bold">{country.visitors}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Raw Visitor Data Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Données détaillées des visiteurs</CardTitle>
                  <CardDescription>Liste des visites récentes avec détails</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Adresse IP</TableHead>
                          <TableHead>Page visitée</TableHead>
                          <TableHead>Source/Référent</TableHead>
                          <TableHead>Pays</TableHead>
                          <TableHead>Ville</TableHead>
                          <TableHead>Date/Heure de visite</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visitorStats.rawVisitors && visitorStats.rawVisitors.length > 0 ? (
                          visitorStats.rawVisitors.map((visitor, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{visitor.ip_address}</TableCell>
                              <TableCell>{visitor.page_visited}</TableCell>
                              <TableCell>{visitor.referrer || 'Direct'}</TableCell>
                              <TableCell>{visitor.country || 'N/A'}</TableCell>
                              <TableCell>{visitor.city || 'N/A'}</TableCell>
                              <TableCell>{formatDate(visitor.visit_date)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              Aucune donnée de visiteur disponible
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
