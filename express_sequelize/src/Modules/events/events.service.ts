import { Op, Sequelize } from "sequelize";
import Event from "./entities/event.entity";
import Workshop from "./entities/workshop.entity";

export class EventsService {
  async getWarmupEvents() {
    return await Event.findAll();
  }

  async getEventsWithWorkshops() {
    const eventsWithWorkshops = await Event.findAll({
      include: {
        model: Workshop,
        as: "workshops",
        attributes: { exclude: ["EventId"] },
      },
      order: [[{ model: Workshop, as: "workshops" }, "id", "ASC"]],
    });

    return eventsWithWorkshops;
  }

  async getFutureEventWithWorkshops() {
    const futureEventsWithWorkshops = await Event.findAll({
      include: {
        model: Workshop,
        as: "workshops",
        where: {
          start: { [Op.gte]: new Date() },
        },
        attributes: { exclude: ["EventId"] },
      },
      order: [[{ model: Workshop, as: "workshops" }, "id", "ASC"]],
    });

    return futureEventsWithWorkshops;
  }
}
