import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { WorkshopValidation } from '@/types/ebios';

interface StandardValidationPanelProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  validationResults: WorkshopValidation[];
  title?: string;
}

const StandardValidationPanel: React.FC<StandardValidationPanelProps> = ({
  workshopNumber,
  validationResults,
  title = `État d'Avancement - Atelier ${workshopNumber}`
}) => {
  
  const getValidationIcon = (met: boolean, required: boolean) => {
    if (met) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (required) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const completionPercentage = Math.round(
    (validationResults.filter(r => r.met).length / validationResults.length) * 100
  );

  const requiredCriteria = validationResults.filter(r => r.required);
  const metRequiredCriteria = requiredCriteria.filter(r => r.met);
  const isWorkshopComplete = requiredCriteria.length === metRequiredCriteria.length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isWorkshopComplete 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isWorkshopComplete ? '✅ Complet' : '⏳ En cours'}
          </div>
          <div className="text-sm text-gray-600">
            {completionPercentage}% terminé
          </div>
        </div>
      </div>

      {/* 📊 GRILLE DE VALIDATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validationResults.map((result, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 p-4 border rounded-lg ${
              result.met 
                ? 'border-green-200 bg-green-50' 
                : result.required 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getValidationIcon(result.met, result.required)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {result.criterion}
                {result.required && (
                  <span className="ml-1 text-red-500 text-xs">*</span>
                )}
              </div>
              {result.evidence && (
                <div className="text-xs text-gray-600 mt-1">
                  {result.evidence}
                </div>
              )}
              {result.comments && (
                <div className="text-xs text-gray-500 mt-1 italic">
                  {result.comments}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 📈 BARRE DE PROGRESSION */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progression globale</span>
          <span>{metRequiredCriteria.length}/{requiredCriteria.length} critères obligatoires</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isWorkshopComplete ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 🎯 RÉSUMÉ CONFORMITÉ EBIOS RM */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <strong>Conformité EBIOS RM v1.5 :</strong> {' '}
          {isWorkshopComplete ? (
            <span className="text-green-600">✅ Atelier conforme aux exigences ANSSI</span>
          ) : (
            <span className="text-yellow-600">⚠️ Critères obligatoires manquants</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardValidationPanel;
