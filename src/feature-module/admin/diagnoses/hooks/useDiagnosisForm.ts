import { useState, useEffect, useCallback } from 'react';
import { diagnosesApi } from '../../../../api/diagnoses';
import type { Diagnosis } from '../../../../types/diagnosis';

interface FormData {
  code: string;
  nameEn: string;
  nameAr: string;
  category: string;
  isActive: boolean;
}

interface FormErrors {
  code?: string;
  nameEn?: string;
  nameAr?: string;
  category?: string;
  general?: string;
}

interface UseDiagnosisFormParams {
  diagnosis: Diagnosis | null;
  onSuccess: () => void;
}

interface UseDiagnosisFormResult {
  formData: FormData;
  errors: FormErrors;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for managing diagnosis form state and submission
 * Handles validation, API calls, and error handling
 */
export const useDiagnosisForm = ({ diagnosis, onSuccess }: UseDiagnosisFormParams): UseDiagnosisFormResult => {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    nameEn: '',
    nameAr: '',
    category: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (diagnosis) {
      setFormData({
        code: diagnosis.code,
        nameEn: diagnosis.nameEn,
        nameAr: diagnosis.nameAr,
        category: diagnosis.category || '',
        isActive: diagnosis.isActive
      });
    }
  }, [diagnosis]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.length > 50) {
      newErrors.code = 'Code must be 50 characters or less';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'English name is required';
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'Arabic name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        code: formData.code,
        nameEn: formData.nameEn,
        nameAr: formData.nameAr,
        category: formData.category || null,
        isActive: formData.isActive
      };

      if (diagnosis) {
        await diagnosesApi.update(diagnosis.id, submitData);
      } else {
        await diagnosesApi.create(submitData);
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Error submitting diagnosis:', err);
      
      // Handle API errors
      if (err.response?.data?.message) {
        const message = err.response.data.message;
        
        // Check if error is about duplicate code
        if (message.includes('already exists') || message.includes('duplicate')) {
          setErrors({ code: 'This diagnosis code already exists' });
        } else {
          setErrors({ general: message });
        }
      } else {
        setErrors({ general: 'Failed to save diagnosis. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};

