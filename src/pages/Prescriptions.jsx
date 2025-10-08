import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Eye, CheckCircle, Clock, AlertCircle, X, User, Calendar, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPrescriptionModalOpen, setIsNewPrescriptionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Mock data for prescriptions
  const mockPrescriptions = [
    {
      id: 1,
      prescription_number: 'RX-2025-001',
      customer_name: 'Juan Pérez García',
      doctor_name: 'Dr. María González',
      doctor_license: 'CMP-12345',
      issue_date: '2025-01-05',
      expiration_date: '2025-01-12',
      diagnosis: 'Infección respiratoria aguda',
      status: 'pending',
      medications: [
        { name: 'Amoxicilina 500mg', quantity: 21, dispensed: 0 },
        { name: 'Ibuprofeno 400mg', quantity: 10, dispensed: 0 }
      ]
    },
    {
      id: 2,
      prescription_number: 'RX-2025-002',
      customer_name: 'María González López',
      doctor_name: 'Dr. Carlos Rodríguez',
      doctor_license: 'CMP-67890',
      issue_date: '2025-01-04',
      expiration_date: '2025-01-11',
      diagnosis: 'Hipertensión arterial',
      status: 'partial',
      medications: [
        { name: 'Enalapril 10mg', quantity: 30, dispensed: 15 },
        { name: 'Aspirina 100mg', quantity: 30, dispensed: 30 }
      ]
    },
    {
      id: 3,
      prescription_number: 'RX-2025-003',
      customer_name: 'Ana Martínez Ramos',
      doctor_name: 'Dr. Luis Fernández',
      doctor_license: 'CMP-54321',
      issue_date: '2025-01-03',
      expiration_date: '2025-01-10',
      diagnosis: 'Dolor crónico',
      status: 'completed',
      medications: [
        { name: 'Tramadol 50mg', quantity: 20, dispensed: 20 }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrescriptions(mockPrescriptions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'partial':
        return 'Parcial';
      case 'completed':
        return 'Completada';
      case 'expired':
        return 'Vencida';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDispenseMedication = (prescriptionId, medicationIndex) => {
    toast.success('Medicamento dispensado correctamente');
    // Here you would update the prescription in the database
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsModalOpen(true);
  };

  const handleNewPrescription = () => {
    setIsNewPrescriptionModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recetas Médicas</h1>
          <p className="text-gray-600">Gestión de prescripciones y dispensación de medicamentos</p>
        </div>
        <button 
          onClick={handleNewPrescription}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Nueva Receta
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por número de receta, paciente o médico..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="partial">Parciales</option>
            <option value="completed">Completadas</option>
            <option value="expired">Vencidas</option>
          </select>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="grid gap-4">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Prescription Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {prescription.prescription_number}
                  </h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {getStatusIcon(prescription.status)}
                    {getStatusText(prescription.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Paciente</p>
                    <p className="font-medium text-gray-900">{prescription.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Médico</p>
                    <p className="font-medium text-gray-900">{prescription.doctor_name}</p>
                    <p className="text-xs text-gray-500">CMP: {prescription.doctor_license}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de emisión</p>
                    <p className="font-medium text-gray-900">{prescription.issue_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de vencimiento</p>
                    <p className="font-medium text-gray-900">{prescription.expiration_date}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Diagnóstico</p>
                  <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                </div>

                {/* Medications */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Medicamentos prescritos</p>
                  <div className="space-y-2">
                    {prescription.medications.map((medication, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{medication.name}</p>
                          <p className="text-sm text-gray-600">
                            Dispensado: {medication.dispensed} / {medication.quantity}
                          </p>
                        </div>
                        {medication.dispensed < medication.quantity && (
                          <button
                            onClick={() => handleDispenseMedication(prescription.id, index)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Dispensar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleViewDetails(prescription)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recetas</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay recetas registradas en el sistema'}
          </p>
        </div>
      )}

      {/* New Prescription Modal */}
      <NewPrescriptionModal 
        isOpen={isNewPrescriptionModalOpen}
        onClose={() => setIsNewPrescriptionModalOpen(false)}
        onSuccess={() => {
          toast.success('Receta creada exitosamente');
          setIsNewPrescriptionModalOpen(false);
        }}
      />

      {/* Details Modal */}
      {selectedPrescription && (
        <PrescriptionDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPrescription(null);
          }}
          prescription={selectedPrescription}
        />
      )}
    </div>
  );
};

// Modal para Nueva Receta
const NewPrescriptionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    doctor_name: '',
    doctor_license: '',
    diagnosis: '',
    medications: [{ name: '', quantity: '', dosage: '', instructions: '' }]
  });
  const [loading, setLoading] = useState(false);

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', quantity: '', dosage: '', instructions: '' }]
    });
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Receta Médica" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Info */}
        <div>
          <Input
            label="Nombre del Paciente *"
            icon={User}
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            required
            placeholder="Ej: Juan Pérez García"
          />
        </div>

        {/* Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Médico *"
            value={formData.doctor_name}
            onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
            required
            placeholder="Ej: Dr. María González"
          />
          <Input
            label="CMP del Médico *"
            value={formData.doctor_license}
            onChange={(e) => setFormData({ ...formData, doctor_license: e.target.value })}
            required
            placeholder="Ej: CMP-12345"
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnóstico *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="3"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            required
            placeholder="Describa el diagnóstico médico"
          />
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Medicamentos Prescritos *
            </label>
            <button
              type="button"
              onClick={handleAddMedication}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Agregar Medicamento
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.medications.map((medication, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 text-gray-400 mt-2" />
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Medicamento"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        required
                        placeholder="Ej: Amoxicilina 500mg"
                      />
                      <Input
                        label="Cantidad"
                        type="number"
                        value={medication.quantity}
                        onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                        required
                        placeholder="Ej: 21"
                      />
                    </div>
                    <Input
                      label="Indicaciones"
                      value={medication.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      placeholder="Ej: Tomar 1 cápsula cada 8 horas por 7 días"
                    />
                  </div>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Crear Receta
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

// Modal para Ver Detalles
const PrescriptionDetailsModal = ({ isOpen, onClose, prescription }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'partial':
        return 'Parcial';
      case 'completed':
        return 'Completada';
      case 'expired':
        return 'Vencida';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Receta" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {prescription.prescription_number}
              </h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(prescription.status)}`}>
                {getStatusIcon(prescription.status)}
                {getStatusText(prescription.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Información del Paciente</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-600" />
                <p className="font-semibold text-gray-900">{prescription.customer_name}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Médico Tratante</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{prescription.doctor_name}</p>
              <p className="text-sm text-gray-600">CMP: {prescription.doctor_license}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Fecha de Emisión</h4>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <p className="font-medium text-gray-900">{prescription.issue_date}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Fecha de Vencimiento</h4>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <p className="font-medium text-gray-900">{prescription.expiration_date}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Diagnóstico</h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-900">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Medications */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Medicamentos Prescritos</h4>
          <div className="space-y-3">
            {prescription.medications.map((medication, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Pill className="w-4 h-4 text-primary-600" />
                      <p className="font-semibold text-gray-900">{medication.name}</p>
                    </div>
                    <div className="ml-6">
                      <p className="text-sm text-gray-600">
                        Cantidad total: {medication.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dispensado: {medication.dispensed} ({Math.round((medication.dispensed / medication.quantity) * 100)}%)
                      </p>
                    </div>
                  </div>
                  {medication.dispensed < medication.quantity ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      Pendiente
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Completo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Prescriptions;
