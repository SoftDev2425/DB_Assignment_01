CREATE TABLE Regions (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	name varchar(100)
)

CREATE TABLE Countries (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	name varchar(60),
	regionID uniqueidentifier,
	FOREIGN KEY (regionID) REFERENCES Regions(id)
)

CREATE TABLE Cities (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	name varchar(100),
	c40Status BIT,
	countryID uniqueidentifier,
	FOREIGN KEY (countryID) REFERENCES Countries(id)
)

CREATE TABLE Populations (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	count INT,
	year INT,
	cityID uniqueidentifier,
	FOREIGN KEY (cityID) REFERENCES Cities(id)	
)

CREATE TABLE Organisations (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	accountNo int,
	cityID uniqueidentifier,
	countryID uniqueidentifier,
	FOREIGN KEY (cityID) REFERENCES Cities(id),
	FOREIGN KEY (countryID) REFERENCES Countries(id)
)

CREATE TABLE Sectors (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	name varchar(75)
)

CREATE TABLE TargetTypes (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	type varchar(75)
)

CREATE TABLE Targets (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	reportingYear int,
	baslineYear int,
	targetYear int,
	reductionTargetPercentage int,
	comment varchar(MAX),
	organisationID uniqueidentifier,
	sectorID uniqueidentifier,
	targetTypeID uniqueidentifier,
	FOREIGN KEY (organisationID) REFERENCES Organisations(id),
	FOREIGN KEY (sectorID) REFERENCES Sectors(id),
	FOREIGN KEY (targetTypeID) REFERENCES TargetTypes(id),
)

CREATE TABLE EmissionStatusTypes (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	type varchar(75)
)

CREATE TABLE GHG_EmissionsStatus (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	description varchar(MAX),
	emissionStatusTypeID uniqueidentifier,
	FOREIGN KEY (emissionStatusTypeID) REFERENCES EmissionStatusTypes(id)
)

CREATE TABLE GHG_Emissions (
	id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
	reportingYear INT,
	measurementYear INT,
	boundary varchar(350),
	methodology varchar(250),
	methodologyDetails varchar(MAX),
	gassesIncluded varchar(100),
	totalCityWideEmissionsCO2 FLOAT,
	totalScope1_CO2 FLOAT,
	totalScope2_CO2 FLOAT,
	organisationID uniqueidentifier,
	GHG_EmissionsStatusID uniqueidentifier,
	FOREIGN KEY (organisationID) REFERENCES Organisations(id),
	FOREIGN KEY (GHG_EmissionsStatusID) REFERENCES GHG_EmissionsStatus(id),
)