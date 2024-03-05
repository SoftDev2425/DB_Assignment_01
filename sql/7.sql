IF OBJECT_ID('GetC40Cities', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE GetC40Cities;
END
GO

CREATE PROCEDURE GetC40Cities
@C40Status BIT
AS
BEGIN
    SELECT 
        c.id AS CityID,
        c.name AS CityName,
        (SELECT TOP 1 p.count FROM Populations p WHERE p.cityID = c.id ORDER BY p.year DESC) AS Population,
        c.c40Status AS C40Status,

        co.id AS CountryID,
        co.name AS CountryName,
        co.regionName AS RegionName
    FROM Cities c
    JOIN Countries co on c.countryID = co.id
    WHERE c40Status = @C40Status
    ORDER BY c.name;
END;

EXEC GetC40Cities @C40Status = 1;