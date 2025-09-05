import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  ShoppingCart,
  DollarSign,
  Archive,
  CalendarOff,
  Search
} from 'lucide-react';
import { FeedType } from './Feeding';

const FeedingInventory: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingFeed, setEditingFeed] = useState<FeedType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [feedTypes, setFeedTypes] = useState<FeedType[]>([
    {
      id: 'ft-001',
      name: 'Pellets Premium 6mm',
      brand: 'AquaGrow',
      pelletSize: '6mm',
      protein: 45,
      fat: 22,
      fiber: 1.5,
      moisture: 8,
      costPerKg: 1.85,
      stock: 12500,
      minStock: 5000,
      expiryDate: new Date('2025-06-30'),
      supplier: 'AquaSupplies Inc.'
    },
    {
      id: 'ft-002',
      name: 'Pellets Estándar 4mm',
      brand: 'BioFeed',
      pelletSize: '4mm',
      protein: 40,
      fat: 18,
      fiber: 2.0,
      moisture: 9,
      costPerKg: 1.45,
      stock: 8200,
      minStock: 4000,
      expiryDate: new Date('2025-08-15'),
      supplier: 'Global Feeds'
    },
    {
      id: 'ft-003',
      name: 'Pellets Juvenil 3mm',
      brand: 'AquaGrow',
      pelletSize: '3mm',
      protein: 50,
      fat: 24,
      fiber: 1.2,
      moisture: 7,
      costPerKg: 2.10,
      stock: 3800,
      minStock: 4000,
      expiryDate: new Date('2025-05-20'),
      supplier: 'AquaSupplies Inc.'
    },
    {
      id: 'ft-004',
      name: 'Suplemento Vitamínico',
      brand: 'VitaFish',
      pelletSize: 'N/A',
      protein: 15,
      fat: 5,
      fiber: 5,
      moisture: 10,
      costPerKg: 3.50,
      stock: 950,
      minStock: 500,
      expiryDate: new Date('2025-03-10'),
      supplier: 'HealthFish Co.'
    }
  ]);

  const filteredFeedTypes = feedTypes.filter(feed => 
    feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = feedTypes.reduce((sum, feed) => sum + feed.stock, 0);
  const inventoryValue = feedTypes.reduce((sum, feed) => sum + (feed.stock * feed.costPerKg), 0);
  const lowStockItems = feedTypes.filter(feed => feed.stock < feed.minStock).length;
  const expiringSoonItems = feedTypes.filter(feed => {
    const today = new Date();
    const expiry = new Date(feed.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  const handleAddNew = () => {
    setEditingFeed(null);
    setShowModal(true);
  };

  const handleEdit = (feed: FeedType) => {
    setEditingFeed(feed);
    setShowModal(true);
  };

  const handleDelete = (feedId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este tipo de alimento del inventario?')) {
      setFeedTypes(prev => prev.filter(f => f.id !== feedId));
    }
  };

  const handleReorder = (feed: FeedType) => {
    alert(`📦 Generando orden de compra para ${feed.name}\n\nProveedor: ${feed.supplier}\nCantidad sugerida: ${(feed.minStock * 1.5).toLocaleString()} kg\n\n📧 Notificación enviada a Compras`);
  };

  const handleSave = (formData: FeedType) => {
    if (editingFeed) {
      setFeedTypes(prev => prev.map(f => f.id === editingFeed.id ? formData : f));
    } else {
      setFeedTypes(prev => [...prev, { ...formData, id: `ft-${Date.now()}` }]);
    }
    setShowModal(false);
  };

  const getStockStatusColor = (stock: number, minStock: number) => {
    const percentage = (stock / minStock) * 100;
    if (percentage < 100) return 'bg-red-500';
    if (percentage < 120) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Archive} title="Stock Total" value={`${totalStock.toLocaleString()} kg`} color="blue" />
        <StatCard icon={DollarSign} title="Valor Inventario" value={`$${inventoryValue.toLocaleString('es-CL')}`} color="green" />
        <StatCard icon={AlertTriangle} title="Stock Bajo" value={`${lowStockItems} items`} color="red" />
        <StatCard icon={CalendarOff} title="Próximo a Vencer" value={`${expiringSoonItems} items`} color="yellow" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Alimento</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alimento / Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo/kg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedTypes.map((feed) => {
                const isLowStock = feed.stock < feed.minStock;
                const today = new Date();
                const expiry = new Date(feed.expiryDate);
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isExpiringSoon = diffDays <= 30;

                return (
                  <tr key={feed.id} className={`hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{feed.name}</div>
                      <div className="text-sm text-gray-500">{feed.brand} ({feed.pelletSize})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-24">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>{feed.stock.toLocaleString()} kg</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getStockStatusColor(feed.stock, feed.minStock)}`}
                              style={{ width: `${Math.min(100, (feed.stock / feed.minStock) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Mín: {feed.minStock.toLocaleString()} kg</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${feed.costPerKg.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isExpiringSoon ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feed.expiryDate.toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feed.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button onClick={() => handleReorder(feed)} className="text-green-600 hover:text-green-800" title="Reordenar"><ShoppingCart className="h-4 w-4" /></button>
                        <button onClick={() => handleEdit(feed)} className="text-blue-600 hover:text-blue-800" title="Editar"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(feed.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <InventoryModal
          feed={editingFeed}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string, color: string }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500' },
  };
  const selectedColor = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className={`${selectedColor.bg} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${selectedColor.text}`}>{title}</p>
          <p className={`text-2xl font-bold ${selectedColor.text}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${selectedColor.icon}`} />
      </div>
    </div>
  );
};

const InventoryModal = ({ feed, onClose, onSave }: { feed: FeedType | null, onClose: () => void, onSave: (data: FeedType) => void }) => {
  const [formData, setFormData] = useState<FeedType>(
    feed || {
      id: '',
      name: '',
      brand: '',
      pelletSize: '',
      protein: 0,
      fat: 0,
      fiber: 0,
      moisture: 0,
      costPerKg: 0,
      stock: 0,
      minStock: 0,
      expiryDate: new Date(),
      supplier: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full z-10">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{feed ? 'Editar Alimento' : 'Nuevo Alimento'}</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
                <InputField label="Marca" name="brand" value={formData.brand} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Tamaño Pellet" name="pelletSize" value={formData.pelletSize} onChange={handleChange} />
                <InputField label="Proveedor" name="supplier" value={formData.supplier} onChange={handleChange} />
              </div>
              <hr />
              <div className="grid grid-cols-4 gap-4">
                <InputField label="Proteína (%)" name="protein" type="number" value={formData.protein} onChange={handleChange} />
                <InputField label="Grasa (%)" name="fat" type="number" value={formData.fat} onChange={handleChange} />
                <InputField label="Fibra (%)" name="fiber" type="number" value={formData.fiber} onChange={handleChange} />
                <InputField label="Humedad (%)" name="moisture" type="number" value={formData.moisture} onChange={handleChange} />
              </div>
              <hr />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Stock Actual (kg)" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                <InputField label="Stock Mínimo (kg)" name="minStock" type="number" value={formData.minStock} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Costo por Kg ($)" name="costPerKg" type="number" step="0.01" value={formData.costPerKg} onChange={handleChange} required />
                <InputField label="Fecha Vencimiento" name="expiryDate" type="date" value={new Date(formData.expiryDate).toISOString().split('T')[0]} onChange={handleChange} required />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }: { label: string, [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

export default FeedingInventory;
