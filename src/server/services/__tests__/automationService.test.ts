import { AutomationService } from '../automationService';
import { CreateAutomationForm } from '../../../types';

// Mock the database connection
jest.mock('../../database/connection', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  automations: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    category: 'category',
    triggerType: 'triggerType',
    triggerConfig: 'triggerConfig',
    actionType: 'actionType',
    actionConfig: 'actionConfig',
    status: 'status',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastRun: 'lastRun',
    nextRun: 'nextRun',
    executionCount: 'executionCount',
    successCount: 'successCount',
    failureCount: 'failureCount',
  },
}));

describe('AutomationService', () => {
  let automationService: AutomationService;
  const mockUserId = 'user-123';

  beforeEach(() => {
    automationService = new AutomationService();
    jest.clearAllMocks();
  });

  describe('createAutomation', () => {
    it('should create a new automation', async () => {
      const automationData: CreateAutomationForm = {
        name: 'Test Automation',
        description: 'Test description',
        category: 'sales',
        triggerType: 'new_lead',
        triggerConfig: { new_lead: { minValue: 100 } },
        actionType: 'send_email',
        actionConfig: { send_email: { templateId: 'template-1', recipients: ['test@example.com'], subject: 'Test' } },
      };

      const mockAutomation = {
        id: 'automation-123',
        userId: mockUserId,
        name: automationData.name,
        description: automationData.description,
        category: automationData.category,
        triggerType: automationData.triggerType,
        triggerConfig: automationData.triggerConfig,
        actionType: automationData.actionType,
        actionConfig: automationData.actionConfig,
        status: 'draft',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0,
        successCount: 0,
        failureCount: 0,
      };

      // Mock the database insert
      const { db } = require('../../database/connection');
      db.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockAutomation]),
        }),
      });

      const result = await automationService.createAutomation(mockUserId, automationData);

      expect(result).toEqual(expect.objectContaining({
        id: 'automation-123',
        name: 'Test Automation',
        category: 'sales',
        triggerType: 'new_lead',
        actionType: 'send_email',
        status: 'draft',
        isActive: false,
      }));
    });
  });

  describe('getAutomations', () => {
    it('should return paginated automations', async () => {
      const mockAutomations = [
        {
          id: 'automation-1',
          userId: mockUserId,
          name: 'Automation 1',
          category: 'sales',
          triggerType: 'new_lead',
          triggerConfig: {},
          actionType: 'send_email',
          actionConfig: {},
          status: 'active',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          executionCount: 5,
          successCount: 4,
          failureCount: 1,
        },
      ];

      const { db } = require('../../database/connection');
      db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(mockAutomations),
              }),
            }),
          }),
        }),
      });

      const result = await automationService.getAutomations(mockUserId, { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Automation 1');
    });
  });

  describe('toggleAutomation', () => {
    it('should toggle automation active status', async () => {
      const mockAutomation = {
        id: 'automation-123',
        userId: mockUserId,
        name: 'Test Automation',
        category: 'sales',
        triggerType: 'new_lead',
        triggerConfig: {},
        actionType: 'send_email',
        actionConfig: {},
        status: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0,
        successCount: 0,
        failureCount: 0,
      };

      const { db } = require('../../database/connection');
      db.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ ...mockAutomation, isActive: false }]),
          }),
        }),
      });

      const result = await automationService.toggleAutomation(mockUserId, 'automation-123');

      expect(result?.isActive).toBe(false);
    });
  });
}); 