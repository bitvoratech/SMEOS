import type { Request, Response } from "express";
import { getDashboardStats } from "../services/stats.service.js";

interface StatsParams {
  organizationId: string;
}

export async function stats(
  request: Request<StatsParams>,
  response: Response
) {
  const { organizationId } = request.params;

  const data = await getDashboardStats(organizationId);
  response.json({ stats: data });
}