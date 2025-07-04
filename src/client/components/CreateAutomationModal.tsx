import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  CreateAutomationForm, 
  TriggerType, 
  ActionType, 
  AutomationCategory,
  ModalProps 
} from '../../types';

interface CreateAutomationModalProps extends ModalProps {
  onSuccess: () => void;
}

const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
  title,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateAutomationForm>({
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      triggerType: 'new_lead',
      triggerConfig: {},
      actionType: 'send_email',
      actionConfig: {},
    },
  });

  const watchedTriggerType = watch('triggerType');
  const watchedActionType = watch('actionType');

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Name and category' },
    { id: 2, title: 'Trigger', description: 'When to run' },
    { id: 3, title: 'Action', description: 'What to do' },
    { id: 4, title: 'Review', description: 'Confirm settings' },
  ];

  const triggerOptions = [
    { value: 'new_lead', label: 'New Lead', description: 'When a new lead is created' },
    { value: 'payment_received', label: 'Payment Received', description: 'When a payment is processed' },
    { value: 'email_opened', label: 'Email Opened', description: 'When an email is opened' },
    { value: 'custom_schedule', label: 'Custom Schedule', description: 'Run on a schedule' },
  ];

  const actionOptions = [
    { value: 'send_email', label: 'Send Email', description: 'Send an automated email' },
    { value: 'create_task', label: 'Create Task', description: 'Create a new task' },
    { value: 'update_crm', label: 'Update CRM', description: 'Update CRM record' },
    { value: 'generate_report', label: 'Generate Report', description: 'Generate and send report' },
  ];

  const categoryOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support' },
    { value: 'general', label: 'General' },
  ];

  const onSubmit = async (data: CreateAutomationForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create automation');
      }

      toast.success('Automation created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create automation');
      console.error('Error creating automation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Name *
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="input-field"
                    placeholder="Enter automation name"
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-danger-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="input-field"
                    placeholder="Describe what this automation does"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <select {...field} className="select-field">
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Type *
              </label>
              <Controller
                name="triggerType"
                control={control}
                rules={{ required: 'Trigger type is required' }}
                render={({ field }) => (
                  <select {...field} className="select-field">
                    {triggerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Trigger-specific configuration */}
            {watchedTriggerType === 'new_lead' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">New Lead Configuration</h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minimum Lead Value</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    onChange={(e) => setValue('triggerConfig.new_lead.minValue', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {watchedTriggerType === 'payment_received' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Payment Configuration</h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minimum Amount</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    onChange={(e) => setValue('triggerConfig.payment_received.minAmount', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {watchedTriggerType === 'custom_schedule' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Schedule Configuration</h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cron Expression</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="0 9 * * * (every day at 9 AM)"
                    onChange={(e) => setValue('triggerConfig.custom_schedule.cronExpression', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type *
              </label>
              <Controller
                name="actionType"
                control={control}
                rules={{ required: 'Action type is required' }}
                render={({ field }) => (
                  <select {...field} className="select-field">
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Action-specific configuration */}
            {watchedActionType === 'send_email' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Email Configuration</h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Email subject"
                    onChange={(e) => setValue('actionConfig.send_email.subject', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Recipients</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="email@example.com, another@example.com"
                    onChange={(e) => setValue('actionConfig.send_email.recipients', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
              </div>
            )}

            {watchedActionType === 'create_task' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Task Configuration</h4>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Task Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Task title"
                    onChange={(e) => setValue('actionConfig.create_task.title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Priority</label>
                  <select
                    className="select-field"
                    onChange={(e) => setValue('actionConfig.create_task.priority', e.target.value as any)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        const formData = watch();
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Automation Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trigger:</span>
                  <span className="font-medium">{formData.triggerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Action:</span>
                  <span className="font-medium">{formData.actionType}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Create Automation
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationModal; 