import type { DBHandle } from "../../../../../packages/db/src"
import { parseOrReport } from "../../invariant"
import type { CourseCode } from "../course/course-types"
import {
  GradeDistributionSchema,
  type GradeDistribution,
  type GradeDistributionWrite,
} from "./grade-distribution-types"

export interface GradeDistributionRepository {
  findMany(handle: DBHandle, courseCode?: CourseCode): Promise<GradeDistribution[]>
  createMany(handle: DBHandle, data: GradeDistributionWrite[]): Promise<GradeDistribution[]>
}

export function getGradeDistributionRepository(): GradeDistributionRepository {
  return {
    async findMany(handle, courseCode) {
      const gradeDistributions = await handle.gradeDistribution.findMany({
        where: {
          course: {
            code: courseCode?.toUpperCase(),
          },
        },
        orderBy: [{ year: "asc" }, { semester: "asc" }],
      })

      return parseOrReport(GradeDistributionSchema.array(), gradeDistributions)
    },
    async createMany(handle, data) {
      const gradeDistributions = await handle.gradeDistribution.createManyAndReturn({
        data,
      })

      return parseOrReport(GradeDistributionSchema.array(), gradeDistributions)
    },
  }
}
