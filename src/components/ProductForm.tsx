import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateLeads } from '../lib/api';
import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { useGenerationHistory } from '../contexts/GenerationHistoryContext';

interface FormData {
  productName: string;
  productDescription: string;
  location: string;
}

const initialFormData: FormData = {
  productName: '',
  productDescription: '',
  location: '',
};

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addGeneration } = useGenerationHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Please sign in to generate leads', 'error');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Starting lead generation...');
      const { success, sheetLink, error } = await generateLeads(formData);
      
      if (!success) {
        throw new Error(error || 'Webhook request failed');
      }

      if (!sheetLink) {
        throw new Error('No Google Sheets link received from webhook');
      }

      addGeneration({
        productName: formData.productName,
        productDescription: formData.productDescription,
        location: formData.location,
        status: 'success',
        sheetLink: sheetLink,
        timestamp: new Date().toISOString()
      });

      setFormData(initialFormData);
      showToast('Leads generated successfully!', 'success');
      
      navigate('/app/leads');
    } catch (error) {
      console.error('Error generating leads:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      addGeneration({
        productName: formData.productName,
        productDescription: formData.productDescription,
        location: formData.location,
        status: 'error',
        errorMessage,
        timestamp: new Date().toISOString()
      });

      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="productName"
        label="Product Name"
        value={formData.productName}
        onChange={handleInputChange('productName')}
        placeholder="Enter your product name"
        required
      />

      <FormTextArea
        id="productDescription"
        label="Product Description"
        value={formData.productDescription}
        onChange={handleInputChange('productDescription')}
        placeholder="Describe your product in detail"
        required
        rows={4}
      />

      <FormInput
        id="location"
        label="Geographic Location"
        value={formData.location}
        onChange={handleInputChange('location')}
        placeholder="Enter target location"
        required
      />

      <button
        type="submit"
        disabled={isLoading || !user}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Processing...
          </>
        ) : (
          'Generate Leads'
        )}
      </button>
    </form>
  );
}
