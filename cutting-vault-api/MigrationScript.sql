CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;
CREATE TABLE `Customer` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FirstName` longtext NULL,
    `LastName` longtext NULL,
    `PhoneNumber` longtext NULL,
    `DateOfBirth` datetime(6) NULL,
    `Email` longtext NULL,
    `Barcode` longtext NULL,
    `Street` longtext NULL,
    `Town` longtext NULL,
    `Suburb` longtext NULL,
    `Comment` longtext NULL,
    `LoyaltyCount` int NOT NULL,
    `LastLoyaltyCountUpdate` datetime(6) NULL,
    `LastUpdate` datetime(6) NULL,
    `CreationDate` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `User` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserName` varchar(255) NOT NULL,
    `FirstName` longtext NULL,
    `LastName` longtext NULL,
    `Email` longtext NULL,
    `LastLoggin` datetime(6) NULL,
    `Password` longtext NOT NULL,
    `FailedLoginCount` int NOT NULL,
    `AccountLocked` tinyint(1) NOT NULL,
    `ChangePassword` tinyint(1) NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Appointment` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Date` datetime(6) NOT NULL,
    `StylistId` int NOT NULL,
    `Style` longtext NULL,
    `Comment` longtext NULL,
    `Price` int NOT NULL,
    `CustomerDboId` int NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Appointment_Customer_CustomerDboId` FOREIGN KEY (`CustomerDboId`) REFERENCES `Customer` (`Id`),
    CONSTRAINT `FK_Appointment_User_StylistId` FOREIGN KEY (`StylistId`) REFERENCES `User` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `RefreshToken` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Token` longtext NOT NULL,
    `Expires` datetime(6) NOT NULL,
    `Created` datetime(6) NOT NULL,
    `Revoked` datetime(6) NULL,
    `UserId` int NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_RefreshToken_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `UserAppointment` (
    `UserId` int NOT NULL,
    `AppointmentId` int NOT NULL,
    PRIMARY KEY (`UserId`, `AppointmentId`),
    CONSTRAINT `FK_UserAppointment_Appointment_AppointmentId` FOREIGN KEY (`AppointmentId`) REFERENCES `Appointment` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_UserAppointment_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_Appointment_CustomerDboId` ON `Appointment` (`CustomerDboId`);

CREATE INDEX `IX_Appointment_StylistId` ON `Appointment` (`StylistId`);

CREATE INDEX `IX_RefreshToken_UserId` ON `RefreshToken` (`UserId`);

CREATE UNIQUE INDEX `IX_User_UserName` ON `User` (`UserName`);

CREATE INDEX `IX_UserAppointment_AppointmentId` ON `UserAppointment` (`AppointmentId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250307203936_InitialCreate', '9.0.2');

COMMIT;

