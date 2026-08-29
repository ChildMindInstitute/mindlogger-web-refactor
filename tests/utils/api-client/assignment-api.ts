import { CuriousApi } from './api';

export type AssignmentCreate = {
  activityId?: string;
  activityFlowId?: string;
  respondentSubjectId: string;
  targetSubjectId: string;
};

export class AssignmentAPI extends CuriousApi {
  // The caller's own subject in an applet (respondent identity).
  async getMySubjectId(appletId: string): Promise<string> {
    const response = await this.apiContext.get(`/users/me/subjects/${appletId}`);
    if (!response.ok()) {
      throw new Error(`Failed to fetch my subject: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()).result.id;
  }

  async createAssignments(appletId: string, assignments: AssignmentCreate[]): Promise<any> {
    // This endpoint expects snake_case (no camelCase aliasing on the backend model).
    const response = await this.apiContext.post(`/assignments/applet/${appletId}`, {
      data: {
        assignments: assignments.map((a) => ({
          activity_id: a.activityId ?? null,
          activity_flow_id: a.activityFlowId ?? null,
          respondent_subject_id: a.respondentSubjectId,
          target_subject_id: a.targetSubjectId,
        })),
      },
    });
    if (!response.ok()) {
      throw new Error(`Failed to create assignments: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  // Convenience: manually assign the flow/activity to the caller (self-report).
  async assignToSelf(
    appletId: string,
    target: { activityId?: string; activityFlowId?: string },
  ): Promise<string> {
    const subjectId = await this.getMySubjectId(appletId);
    await this.createAssignments(appletId, [
      { ...target, respondentSubjectId: subjectId, targetSubjectId: subjectId },
    ]);
    return subjectId;
  }
}
