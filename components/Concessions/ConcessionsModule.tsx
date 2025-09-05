import React, { useEffect } from 'react';
import { Map, Layers, CheckCircle, Building, Loader, AlertTriangle, MapPin, Phone, Mail, Calendar, FileText, ShieldCheck, Globe } from 'lucide-react';
import { useConcessionStore } from '../../stores/concessionStore';
import { Concession } from '../../types/concession';
import { motion } from 'framer-motion';

const ConcessionCard: React.FC<{ concession: Concession; isSelected: boolean; onSelect: () => void }> = ({ concession, isSelected, onSelect }) => {
  return (
    <motion.div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${isSelected ? 'bg-primary/10 border-primary shadow-lg' : 'bg-surface border-border hover:border-primary/50'}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isSelected ? 'bg-primary' : 'bg-primary/20'}`}>
            <Building className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-text">{concession.name}</h3>
            <p className="text-sm text-textSecondary flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {concession.location}
            </p>
          </div>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-success" />}
      </div>
    </motion.div>
  );
};

const SelectedConcessionDetails: React.FC<{ concession: Concession }> = ({ concession }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-surface rounded-lg border border-border flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-text">{concession.name}</h2>
                <p className="text-textSecondary">{concession.rut}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoItem icon={MapPin} label="Ubicación" value={`${concession.address}, ${concession.location}`} />
                <InfoItem icon={Phone} label="Contacto" value={`${concession.manager} (${concession.phone})`} />
                <InfoItem icon={Mail} label="Email" value={concession.email} />
                <InfoItem icon={Calendar} label="Establecida" value={concession.established} />
                <InfoItem icon={Globe} label="Cuerpo de Agua" value={concession.water_body} />
                <InfoItem icon={FileText} label="Licencia" value={concession.license} />
            </div>
             <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-1 text-primary" />
                <div>
                    <p className="font-semibold text-textSecondary">Estado Operacional</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        concession.operational_status === 'Activa' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                        {concession.operational_status}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const InfoItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
        <div>
            <p className="font-semibold text-textSecondary">{label}</p>
            <p className="text-text">{value || 'No especificado'}</p>
        </div>
    </div>
);

const ConcessionsModule: React.FC = () => {
  const { concessions, selectedConcession, loading, error, fetchConcessions, setSelectedConcession } = useConcessionStore();

  useEffect(() => {
    fetchConcessions();
  }, [fetchConcessions]);

  return (
    <div className="p-6 bg-background text-text min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Concesiones</h1>
        <p className="text-textSecondary">Seleccione una concesión para ver y gestionar sus datos en toda la aplicación.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Lista de Concesiones
          </h2>
          {loading && (
            <div className="flex items-center justify-center p-8 bg-surface rounded-lg">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-4">Cargando concesiones...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center p-4 bg-error/10 text-error rounded-lg">
              <AlertTriangle className="w-5 h-5 mr-3" />
              <p>Error: {error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {concessions.map((concession) => (
                <ConcessionCard
                  key={concession.id}
                  concession={concession}
                  isSelected={selectedConcession?.id === concession.id}
                  onSelect={() => setSelectedConcession(concession)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
           <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-primary" />
            Detalles de la Concesión
          </h2>
          {selectedConcession ? (
            <SelectedConcessionDetails concession={selectedConcession} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-surface rounded-lg border-2 border-dashed border-border text-center">
              <Layers className="w-12 h-12 text-textSecondary mb-4" />
              <h3 className="text-lg font-semibold">Ninguna concesión seleccionada</h3>
              <p className="text-textSecondary">Por favor, elija una concesión de la lista para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcessionsModule;
