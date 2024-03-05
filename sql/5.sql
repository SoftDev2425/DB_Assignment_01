IF OBJECT_ID('GetCitiesWithEmissionsRanking', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE GetCitiesWithEmissionsRanking;
END
GO

CREATE PROCEDURE GetCitiesWithEmissionsRanking
AS
BEGIN
    DECLARE @MostRecentYear INT;
    SELECT @MostRecentYear = MAX(reportingYear) FROM GHG_Emissions;

    SELECT TOP 10
        c.id AS CityID,
        c.name AS CityName,
        (SELECT TOP 1 count FROM Populations WHERE cityID = c.id ORDER BY year DESC) AS Population,
        c.c40Status AS C40Status,
        e.reportingYear AS ReportingYear,
        e.totalCityWideEmissionsCO2 AS TotalEmissions,
        e.totalScope1_CO2 AS TotalScope1Emission,
        e.totalScope2_CO2 AS TotalScope2Emission,
        est.type AS EmissionStatus,
        e.description AS Description,
        e.comment AS Comment,
        ROW_NUMBER() OVER (ORDER BY e.totalCityWideEmissionsCO2 DESC) AS Rank
    FROM Cities c
    INNER JOIN Organisations o ON c.id = o.cityID
    INNER JOIN GHG_Emissions e ON o.id = e.organisationID AND e.reportingYear = @MostRecentYear
    INNER JOIN EmissionStatusTypes est ON e.emissionStatusTypeID = est.id
    ORDER BY e.totalCityWideEmissionsCO2 DESC;
END;

EXEC GetCitiesWithEmissionsRanking;
