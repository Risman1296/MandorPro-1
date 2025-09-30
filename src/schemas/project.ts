import { z } from 'zod';

export const ProjectSiteSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  radiusM: z.number().min(10),
  note: z.string().optional().default(''),
});
export type ProjectSite = z.infer<typeof ProjectSiteSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string(),
  title: z.string().min(1),
  desc: z.string().optional().default(''),
  assigneeId: z.string().nullable().optional().default(null),
  startAt: z.number().int(),    // epoch ms
  dueAt: z.number().int(),
  status: z.enum(['TODO','DOING','DONE']).default('TODO'),
  priority: z.enum(['LOW','MEDIUM','HIGH']).default('MEDIUM'),
  progress: z.number().min(0).max(100).default(0),
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskDependencySchema = z.object({
  id: z.string().uuid(),
  taskId: z.string(),
  dependsOnTaskId: z.string(),
});
export type TaskDependency = z.infer<typeof TaskDependencySchema>;

export const MilestoneSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string(),
  name: z.string(),
  atDate: z.number().int(),
  note: z.string().optional().default(''),
});
export type Milestone = z.infer<typeof MilestoneSchema>;
