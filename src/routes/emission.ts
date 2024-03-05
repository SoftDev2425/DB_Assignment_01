import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getContriesMostProminentGasses, getTotalEmissionsByCity, tester } from "../services/emissions.service";
import { log } from "console";

interface Params {
  cityName: string;
}

export async function emissionRoutes(fastify: FastifyInstance) {
  // fastify.get("/", async function (request: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const emissions = await tester();
  //     return { emissions };
  //   } catch (error) {
  //     fastify.log.error(error);
  //     reply.code(500).send({ error: "Failed getting emissions. Please try again later." });
  //   }
  // });

  // fastify.get("/:id", async function (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
  //   try {
  //     const id = request.params.id;
  //     //   return await getUserById(id);
  //     return { message: `hello from emission by id ${id}` };
  //   } catch (error: any) {
  //     fastify.log.error(error);
  //     reply.code(500).send({ error: error.message });
  //   }
  // });

  fastify.get("/total/:cityName", async function (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
      const city = request.params.cityName;
      console.log("cityname", city.trim());
      const data = await getTotalEmissionsByCity(city.trim());

      console.log("data", data);

      return data.map((d) => {
        return {
          city: {
            id: d.cityID,
            name: d.cityName,
            population: d.population,
            populationYear: d.cityPopulationYear,
            c40Status: d.city_c40Status,
            organisation: {
              name: d.organisationName,
              accountNo: d.organisationNo,
            },
            emission: {
              id: d.emissionID,
              reportingYear: d.reportingYear,
              measurementYear: d.measurementYear,
              total: d.total,
              totalScope1Emission: d.totalScope1Emission ? d.totalScope1Emission : "N/A",
              totalScope2Emission: d.totalScope2Emission ? d.totalScope2Emission : "N/A",
              gassesIncluded: d.gassesIncluded,
              methodology: d.methodology,
              methodologyDetails: d.methodologyDetails,
              change: d.type,
              description: d.description,
              comment: d.comment ? d.comment : "No comment",
            },
          },
        };
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting total emissions. Please try again later." });
    }
  });

  fastify.get("/countries/gas", async function (request, reply: FastifyReply) {
    try {
      const data = await getContriesMostProminentGasses();
      console.log(data);
      return data.map((d) => {
        return {
          countryName: d.CountryName,
          gasses: Array.from(
            new Set(
              d.Gasses.trim()
                .split(/[;\s]+/)
                .map((g: string) => g.trim())
            )
          ).join("; "),
        };
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting prominent gasses. Please try again later." });
    }
  });
}
