import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  GetAvgEmissionForC40AndNonC40,
  getCitiesByStatusType,
  getCitiesWithEmissionsRanking,
  getCityEmissionTargets,
  getContriesMostProminentGasses,
  getTotalEmissionsByCity,
  getTotalEmissionsForRegions,
} from "../services/emissions.service";

interface Params {
  cityName: string;
  statusType: string;
}

export async function emissionRoutes(fastify: FastifyInstance) {
  // 1
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
            c40Status: d.c40Status,
          },
          organisation: {
            name: d.organisationName,
            accountNo: d.organisationNo,
          },
          emission: {
            id: d.emissionID,
            reportingYear: d.reportingYear ? d.reportingYear : "N/A",
            measurementYear: d.measurementYear ? d.measurementYear : "N/A",
            total: d.total ? d.total : "N/A",
            totalScope1Emission: d.totalScope1Emission ? d.totalScope1Emission : "N/A",
            totalScope2Emission: d.totalScope2Emission ? d.totalScope2Emission : "N/A",
            gassesIncluded: d.gassesIncluded ? d.gassesIncluded : "N/A",
            methodology: d.methodology ? d.methodology : "N/A",
            methodologyDetails: d.methodologyDetails ? d.methodologyDetails : "N/A",
            change: d.type ? d.type : "N/A",
            description: d.description ? d.description : "N/A",
            comment: d.comment ? d.comment : "No comment",
          },
        };
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting total emissions. Please try again later." });
    }
  });

  // 2
  fastify.get("/status/:statusType", async function (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
      const statusType = request.params.statusType;
      const data = await getCitiesByStatusType(statusType);
      console.log(data);
      return data.map((d) => {
        return {
          city: {
            id: d.CityID,
            name: d.CityName,
            population: d.Population,
            c40Status: d.c40Status,
          },
          emission: {
            id: d.EmissionID,
            reportingYear: d.ReportingYear ? d.ReportingYear : "N/A",
            total: d.TotalCityWideEmissionsCO2 ? d.TotalCityWideEmissionsCO2 : "N/A",
            totalScope1Emission: d.TotalScope1_CO2 ? d.TotalScope1_CO2 : "N/A",
            totalScope2Emission: d.TotalScope2_CO2 ? d.TotalScope2_CO2 : "N/A",
            change: d.EmissionStatus ? d.EmissionStatus : "N/A",
            description: d.Description ? d.Description : "N/A",
            comment: d.Comment ? d.Comment : "No comment",
          },
        };
      });
    } catch (error: any) {
      fastify.log.error(error);
      reply.code(500).send({ error: error.message });
    }
  });

  // 3
  fastify.get("/avg", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const emissions = await GetAvgEmissionForC40AndNonC40();
      return { emissions };
    } catch (error: any) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting emissions. Please try again later." });
    }
  });

  // 4
  fastify.get("/targets/:cityName", async function (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
      const city = request.params.cityName;
      const data = await getCityEmissionTargets(city);
      console.log(data);
      return data.map((d) => {
        return {
          city: {
            id: d.cityID,
            name: d.cityName,
            population: d.population,
            c40Status: d.c40Status,
          },
          organisation: {
            name: d.organisationName,
            accountNo: d.organisationNo,
          },
          target: {
            id: d.targetID,
            sector: d.sectorName ? d.sectorName : "N/A",
            reportingYear: d.reportingYear ? d.reportingYear : "N/A",
            baselineYear: d.baselineYear ? d.baselineYear : "N/A",
            targetYear: d.targetYear ? d.targetYear : "N/A",
            reductionTargetPercentage: d.reductionTargetPercentage ? d.reductionTargetPercentage : "N/A",
            baselineEmissionsCO2: d.baselineEmissionsCO2 ? d.baselineEmissionsCO2 : "N/A",
            comment: d.comment ? d.comment : "No comment",
          },
        };
      });
    } catch (error: any) {
      fastify.log.error(error);
      reply.code(500).send({ error: error.message });
    }
  });

  // 5
  // TODO: NEEDS TO BE FIXED - ADD ARGUMENT 'ASC' OR 'DESC' TO THE FUNCTION
  fastify.get("/highest", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await getCitiesWithEmissionsRanking();
      return data;
    } catch (error: any) {
      fastify.log.error(error);
      reply.code(500).send({ error: error.message });
    }
  });

  // 6

  // 7
  // TODO: NEEDS TO BE FIXED - ADD GHG_EMISSION DATA

  // 8
  fastify.get('/regions', async function (request, reply: FastifyReply) {
    try {
      const data = await getTotalEmissionsForRegions();
      return {regions: data.map((d) => ({
        name: d.RegionName,
        totalEmission: d.TotalEmissions.toLocaleString()
      }))}
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed getting regions' emissions. Please try again later." });
    }
   });
  
  // 9

  // 10
  fastify.get("/countries/gas", async function (request, reply: FastifyReply) {
    try {
      const data = await getContriesMostProminentGasses();
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

  })
}
