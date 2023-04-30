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
        order: [["id", "ASC"]],
      },
      order: [[{model: Workshop, as: "workshops"}, "id", "ASC"]],
    });

    return eventsWithWorkshops;
  }

  
  async getFutureEventWithWorkshops() {
    const futureEventsWithWorkshops = await Event.findAll({
      include: [
        {
          model: Workshop,
          as: 'workshops',
          attributes: { exclude: ["EventId"] },
          where: {
            start: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      attributes: [
        "id",
        "name",
        "createdAt",
        [
          Sequelize.fn("min", Sequelize.col("Workshops.start")),
          "firstWorkshopStart",
        ],
      ],
      group: ["Event.id"],
      having: {
        firstWorkshopStart: {
          [Op.gt]: new Date(),
        },
      },
      order: [[{model: Workshop, as: "workshops"}, "id", "ASC"]],
    });

    return futureEventsWithWorkshops;
  }
}
