import { addHours, addMinutes, format } from "date-fns"
import { prisma } from "../../config/db";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";
import { Prisma } from "@prisma/client";


const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    )

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    )
    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime
      }

      const isScheduleExist = await prisma.schedule.findFirst({
        where: scheduleData
      });

      if (isScheduleExist) {
        throw new Error("This schedule already exist")
      }

      const result = await prisma.schedule.create({
        data: scheduleData
      })
      schedules.push(result);

      slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
}

const getAllScheduleForDoctor = async (params: any, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = params;

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: filterStartDateTime
          }
        },
        {
          endDateTime: {
            lte: filterEndDateTime
          }
        }
      ]
    })
  }

  const whereCondition: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
    AND: andConditions
  } : {}

  const result = await prisma.schedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  })

  const total = await prisma.schedule.count({
    where: whereCondition
  });

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
}

const deleteSchedule = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id
    }
  })
}

export const scheduleService = {
  createSchedule,
  getAllScheduleForDoctor,
  deleteSchedule
}