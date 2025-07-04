import { eq, and, desc, count, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { automations, automationLogs, users } from '../database/schema';
import { 
  Automation, 
  CreateAutomationForm, 
  UpdateAutomationForm, 
  AutomationFilters,
  AutomationMetrics,
  PaginatedResponse,
  TriggerType,
  ActionType
} from '../../types';

export class AutomationService {
  // Create new automation
  async createAutomation(userId: string, data: CreateAutomationForm): Promise<Automation> {
    const [automation] = await db.insert(automations).values({
      userId,
      name: data.name,
      description: data.description,
      category: data.category,
      triggerType: data.triggerType,
      triggerConfig: data.triggerConfig,
      actionType: data.actionType,
      actionConfig: data.actionConfig,
      status: 'draft',
      isActive: false,
    }).returning();

    return this.mapToAutomation(automation);
  }

  // Get automations with pagination and filters
  async getAutomations(
    userId: string, 
    filters: AutomationFilters = {}
  ): Promise<PaginatedResponse<Automation>> {
    const { page = 1, limit = 10, status, category, triggerType, actionType, search } = filters;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(automations.userId, userId)];
    
    if (status) {
      conditions.push(eq(automations.status, status));
    }
    if (category) {
      conditions.push(eq(automations.category, category));
    }
    if (triggerType) {
      conditions.push(eq(automations.triggerType, triggerType));
    }
    if (actionType) {
      conditions.push(eq(automations.actionType, actionType));
    }
    if (search) {
      conditions.push(sql`${automations.name} ILIKE ${`%${search}%`}`);
    }

    // Get automations
    const results = await db
      .select()
      .from(automations)
      .where(and(...conditions))
      .orderBy(desc(automations.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(automations)
      .where(and(...conditions));

    return {
      data: results.map(this.mapToAutomation),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single automation
  async getAutomation(userId: string, automationId: string): Promise<Automation | null> {
    const [automation] = await db
      .select()
      .from(automations)
      .where(and(eq(automations.id, automationId), eq(automations.userId, userId)));

    return automation ? this.mapToAutomation(automation) : null;
  }

  // Update automation
  async updateAutomation(
    userId: string, 
    automationId: string, 
    data: UpdateAutomationForm
  ): Promise<Automation | null> {
    const [automation] = await db
      .update(automations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(automations.id, automationId), eq(automations.userId, userId)))
      .returning();

    return automation ? this.mapToAutomation(automation) : null;
  }

  // Toggle automation active status
  async toggleAutomation(userId: string, automationId: string): Promise<Automation | null> {
    const automation = await this.getAutomation(userId, automationId);
    if (!automation) return null;

    const [updated] = await db
      .update(automations)
      .set({
        isActive: !automation.isActive,
        status: !automation.isActive ? 'active' : 'inactive',
        updatedAt: new Date(),
      })
      .where(and(eq(automations.id, automationId), eq(automations.userId, userId)))
      .returning();

    return updated ? this.mapToAutomation(updated) : null;
  }

  // Delete automation
  async deleteAutomation(userId: string, automationId: string): Promise<boolean> {
    const result = await db
      .delete(automations)
      .where(and(eq(automations.id, automationId), eq(automations.userId, userId)));

    return result.rowCount > 0;
  }

  // Get automation metrics
  async getAutomationMetrics(userId: string): Promise<AutomationMetrics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get basic counts
    const [totalResult] = await db
      .select({ value: count() })
      .from(automations)
      .where(eq(automations.userId, userId));

    const [activeResult] = await db
      .select({ value: count() })
      .from(automations)
      .where(and(eq(automations.userId, userId), eq(automations.isActive, true)));

    // Get today's completed tasks
    const [todayResult] = await db
      .select({ value: count() })
      .from(automationLogs)
      .where(
        and(
          eq(automationLogs.userId, userId),
          eq(automationLogs.status, 'success'),
          sql`${automationLogs.startedAt} >= ${today}`
        )
      );

    // Get success rate
    const [successResult] = await db
      .select({ value: count() })
      .from(automationLogs)
      .where(
        and(
          eq(automationLogs.userId, userId),
          sql`${automationLogs.status} IN ('success', 'failure')`
        )
      );

    const [totalSuccessResult] = await db
      .select({ value: count() })
      .from(automationLogs)
      .where(
        and(
          eq(automationLogs.userId, userId),
          eq(automationLogs.status, 'success')
        )
      );

    const successRate = successResult.value > 0 
      ? (totalSuccessResult.value / successResult.value) * 100 
      : 0;

    // Get average execution time
    const [avgTimeResult] = await db
      .select({ value: sql<number>`AVG(${automationLogs.duration})` })
      .from(automationLogs)
      .where(
        and(
          eq(automationLogs.userId, userId),
          eq(automationLogs.status, 'success'),
          sql`${automationLogs.duration} IS NOT NULL`
        )
      );

    // Get category breakdown
    const categoryResults = await db
      .select({ category: automations.category, count: count() })
      .from(automations)
      .where(eq(automations.userId, userId))
      .groupBy(automations.category);

    const categoryBreakdown = categoryResults.reduce((acc, row) => {
      acc[row.category as keyof typeof acc] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);

    // Get recent executions
    const recentExecutions = await db
      .select()
      .from(automationLogs)
      .where(eq(automationLogs.userId, userId))
      .orderBy(desc(automationLogs.startedAt))
      .limit(10);

    // Calculate time saved (assuming each automation saves 5 minutes on average)
    const timeSaved = totalSuccessResult.value * 5;

    return {
      totalAutomations: totalResult.value,
      activeAutomations: activeResult.value,
      tasksCompletedToday: todayResult.value,
      successRate: Math.round(successRate * 100) / 100,
      averageExecutionTime: avgTimeResult.value || 0,
      timeSaved,
      categoryBreakdown,
      recentExecutions: recentExecutions.map(this.mapToAutomationLog),
    };
  }

  // Get automations ready for execution
  async getReadyAutomations(): Promise<Automation[]> {
    const now = new Date();
    
    const results = await db
      .select()
      .from(automations)
      .where(
        and(
          eq(automations.isActive, true),
          sql`${automations.nextRun} <= ${now}`
        )
      );

    return results.map(this.mapToAutomation);
  }

  // Log automation execution
  async logExecution(
    automationId: string,
    userId: string,
    status: 'success' | 'failure' | 'pending' | 'cancelled',
    triggerData?: Record<string, any>,
    actionResult?: Record<string, any>,
    errorMessage?: string,
    duration?: number
  ): Promise<void> {
    await db.insert(automationLogs).values({
      automationId,
      userId,
      status,
      startedAt: new Date(),
      completedAt: status !== 'pending' ? new Date() : undefined,
      duration,
      errorMessage,
      triggerData,
      actionResult,
    });

    // Update automation stats
    const updateData: any = {
      lastRun: new Date(),
      executionCount: sql`${automations.executionCount} + 1`,
    };

    if (status === 'success') {
      updateData.successCount = sql`${automations.successCount} + 1`;
    } else if (status === 'failure') {
      updateData.failureCount = sql`${automations.failureCount} + 1`;
    }

    await db
      .update(automations)
      .set(updateData)
      .where(eq(automations.id, automationId));
  }

  // Helper method to map database row to Automation type
  private mapToAutomation(row: any): Automation {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description,
      category: row.category,
      triggerType: row.triggerType as TriggerType,
      triggerConfig: row.triggerConfig,
      actionType: row.actionType as ActionType,
      actionConfig: row.actionConfig,
      status: row.status,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lastRun: row.lastRun,
      nextRun: row.nextRun,
      executionCount: row.executionCount,
      successCount: row.successCount,
      failureCount: row.failureCount,
    };
  }

  // Helper method to map database row to AutomationLog type
  private mapToAutomationLog(row: any): any {
    return {
      id: row.id,
      automationId: row.automationId,
      userId: row.userId,
      status: row.status,
      startedAt: row.startedAt,
      completedAt: row.completedAt,
      duration: row.duration,
      errorMessage: row.errorMessage,
      triggerData: row.triggerData,
      actionResult: row.actionResult,
      metadata: row.metadata,
    };
  }
} 