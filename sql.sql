CREATE OR REPLACE TABLE `boxen` (
   listID SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   stationID SMALLINT UNSIGNED NOT NULL,
   boxID SMALLINT UNSIGNED NOT NULL,
   titel VARCHAR(100),
   beschreibung VARCHAR (500),
   belegt BOOLEAN NOT NULL DEFAULT FALSE,
   groesse CHAR(1) NOT NULL,
   typ CHAR(20),
   erstellt CHAR(20),
   geoeffnet CHAR(20),
   offen TINYINT UNSIGNED
) ENGINE = InnoDB

INSERT INTO `boxen` (groesse, stationID, boxID)
VALUES
("S", 1, 1),
("M", 1, 2)