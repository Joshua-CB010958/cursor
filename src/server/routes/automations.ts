import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { AutomationService } from '../services/automationService';
import { authenticateToken } from '../middleware/auth';
import { ApiResponse, CreateAutomationForm, UpdateAutomationForm, AutomationFilters } from '../../types';

const router = Router();
const automationService = new AutomationService();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/automations - Get user's automations with pagination and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'inactive', 'draft']).withMessage('Invalid status'),
  query('category').optional().isIn(['sales', 'marketing', 'support', 'general']).withMessage('Invalid category'),
  query('triggerType').optional().isIn(['new_lead', 'payment_received', 'email_opened', 'custom_schedule']).withMessage('Invalid trigger type'),
  query('actionType').optional().isIn(['send_email', 'create_task', 'update_crm', 'generate_report']).withMessage('Invalid action type'),
  query('search').optional().isString().trim().isLength({ max: 100 }).withMessage('Search query too long'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const filters: AutomationFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      status: req.query.status as any,
      category: req.query.category as any,
      triggerType: req.query.triggerType as any,
      actionType: req.query.actionType as any,
      search: req.query.search as string,
    };

    const result = await automationService.getAutomations(userId, filters);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automations',
    });
  }
});

// POST /api/automations - Create new automation
router.post('/', [
  body('name').isString().trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be 1-255 characters'),
  body('description').optional().isString().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('category').isIn(['sales', 'marketing', 'support', 'general']).withMessage('Invalid category'),
  body('triggerType').isIn(['new_lead', 'payment_received', 'email_opened', 'custom_schedule']).withMessage('Invalid trigger type'),
  body('triggerConfig').isObject().withMessage('Trigger configuration is required'),
  body('actionType').isIn(['send_email', 'create_task', 'update_crm', 'generate_report']).withMessage('Invalid action type'),
  body('actionConfig').isObject().withMessage('Action configuration is required'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const automationData: CreateAutomationForm = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      triggerType: req.body.triggerType,
      triggerConfig: req.body.triggerConfig,
      actionType: req.body.actionType,
      actionConfig: req.body.actionConfig,
    };

    const automation = await automationService.createAutomation(userId, automationData);

    res.status(201).json({
      success: true,
      data: automation,
      message: 'Automation created successfully',
    });
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create automation',
    });
  }
});

// GET /api/automations/:id - Get single automation
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid automation ID'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const automation = await automationService.getAutomation(userId, req.params.id);

    if (!automation) {
      return res.status(404).json({
        success: false,
        error: 'Automation not found',
      });
    }

    res.json({
      success: true,
      data: automation,
    });
  } catch (error) {
    console.error('Error fetching automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation',
    });
  }
});

// PUT /api/automations/:id - Update automation
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid automation ID'),
  body('name').optional().isString().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be 1-255 characters'),
  body('description').optional().isString().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('category').optional().isIn(['sales', 'marketing', 'support', 'general']).withMessage('Invalid category'),
  body('triggerType').optional().isIn(['new_lead', 'payment_received', 'email_opened', 'custom_schedule']).withMessage('Invalid trigger type'),
  body('triggerConfig').optional().isObject().withMessage('Invalid trigger configuration'),
  body('actionType').optional().isIn(['send_email', 'create_task', 'update_crm', 'generate_report']).withMessage('Invalid action type'),
  body('actionConfig').optional().isObject().withMessage('Invalid action configuration'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const updateData: UpdateAutomationForm = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      triggerType: req.body.triggerType,
      triggerConfig: req.body.triggerConfig,
      actionType: req.body.actionType,
      actionConfig: req.body.actionConfig,
      isActive: req.body.isActive,
    };

    const automation = await automationService.updateAutomation(userId, req.params.id, updateData);

    if (!automation) {
      return res.status(404).json({
        success: false,
        error: 'Automation not found',
      });
    }

    res.json({
      success: true,
      data: automation,
      message: 'Automation updated successfully',
    });
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update automation',
    });
  }
});

// PUT /api/automations/:id/toggle - Toggle automation active status
router.put('/:id/toggle', [
  param('id').isUUID().withMessage('Invalid automation ID'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const automation = await automationService.toggleAutomation(userId, req.params.id);

    if (!automation) {
      return res.status(404).json({
        success: false,
        error: 'Automation not found',
      });
    }

    res.json({
      success: true,
      data: automation,
      message: `Automation ${automation.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error toggling automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle automation',
    });
  }
});

// DELETE /api/automations/:id - Delete automation
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid automation ID'),
], async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const deleted = await automationService.deleteAutomation(userId, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Automation not found',
      });
    }

    res.json({
      success: true,
      message: 'Automation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete automation',
    });
  }
});

// GET /api/automations/analytics - Get automation analytics
router.get('/analytics', async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const metrics = await automationService.getAutomationMetrics(userId);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

export default router; 