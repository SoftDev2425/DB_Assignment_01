CREATE PROCEDURE GetCitiesByCountry
    @CountryName varchar(60)
AS
BEGIN
    SELECT c.name AS CityName
    FROM Cities c
    JOIN Countries co ON c.countryID = co.id
    WHERE co.name = @CountryName;
END;

EXEC GetCitiesByCountry @CountryName = 'Denmark';

-----------------------------------------------------------

CREATE PROCEDURE GetTotalEmissionsForCity
    @CityName varchar(100)
AS
BEGIN
    SELECT c.name AS CityName, SUM(e.totalCityWideEmissionsCO2) AS TotalEmissionsCO2e
    FROM Cities c
    JOIN Organisations o ON c.id = o.cityID
    JOIN GHG_Emissions e ON o.id = e.organisationID
    WHERE c.name = @CityName
    GROUP BY c.name;
END;

EXEC GetTotalEmissionsForCity @CityName = 'Copenhagen'

-----------------------------------------------------------

CREATE PROCEDURE GetCityDetails
    @CityName VARCHAR(100)
AS
BEGIN
    SELECT 
        c.id,
        c.name,
        (SELECT TOP 1 p.count FROM Populations p WHERE p.cityID = c.id ORDER BY p.year DESC) AS population,
        CASE WHEN c.c40Status = 1 THEN 'true' ELSE 'false' END AS c40Status
    FROM Cities c
    WHERE c.name = @CityName;
END;

EXEC GetCityDetails @CityName = 'Copenhagen'

-----------------------------------------------------------

CREATE PROCEDURE GetCityEmissionsWithStatus
    @CityName VARCHAR(100)
AS
BEGIN
    -- Determine the most recent reporting year for the city
    DECLARE @MostRecentYear INT;
    SELECT @MostRecentYear = MAX(e.reportingYear)
    FROM GHG_Emissions e
    JOIN Organisations o ON e.organisationID = o.id
    JOIN Cities c ON o.cityID = c.id
    WHERE c.name = @CityName;

    -- Aggregate emissions for the most recent year and get the status
    SELECT 
        e.id,
        SUM(e.totalCityWideEmissionsCO2) AS Total,
        SUM(e.totalScope1_CO2) AS TotalScope1Emission,
        SUM(e.totalScope2_CO2) AS TotalScope2Emission,
        est.type AS Change,
        e.description,
        e.comment
    FROM GHG_Emissions e
    JOIN Organisations o ON e.organisationID = o.id
    JOIN Cities c ON o.cityID = c.id
    JOIN EmissionStatusTypes est ON e.emissionStatusTypeID = est.id
    WHERE c.name = @CityName AND e.reportingYear = @MostRecentYear
    GROUP BY e.id, est.type, e.description, e.comment;
END;

EXEC GetCityEmissionsWithStatus @CityName = 'Johannesburg';

-----------------------------------------------------------