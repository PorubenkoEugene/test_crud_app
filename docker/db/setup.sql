create database IF not exists `test_crud_db`;

create table IF not exists `Users`
(
 `id`               INT(20) AUTO_INCREMENT,
 `name`             VARCHAR(20) NOT NULL,
 `email`            VARCHAR(255) NOT NULL,
 `password`         VARCHAR(255) NOT NULL,
 `createdAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
 `updatedAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

create table IF not exists `Childrens`
(
 `id`               INT(20) AUTO_INCREMENT,
 `name`             VARCHAR(20) NOT NULL,
 `birthDate`        DATE NOT NULL,
 `parentId`         INT(20),
 `createdAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
 `updatedAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId)  REFERENCES Users (id) ON DELETE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

create table IF not exists `CreditCards`
(
 `id`               INT(20) AUTO_INCREMENT,
 `cardHolder`       INT(20),
 `type`             VARCHAR(20) NOT NULL,
 `number`           VARCHAR(16) NOT NULL,
 `expDate`          DATE NOT NULL,
 `securityCode`     VARCHAR(255) NOT NULL,
 `limit`            DECIMAL(9,2),
 `balance`           DECIMAL(9,2),
 `createdAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
 `updatedAt`        Datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cardHolder)  REFERENCES Childrens (id) ON DELETE CASCADE,
    PRIMARY KEY (`id`),
    UNIQUE (`number`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

create table IF not exists `Transactions`
(
 `id`               INT(20) AUTO_INCREMENT,
 `cardId`           INT(20) NOT NULL,
 `sum`              DECIMAL(9,2),
 `createdAt`       Datetime DEFAULT CURRENT_TIMESTAMP,
 `updatedAt`       Datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cardId)  REFERENCES CreditCards (id) ON DELETE NO ACTION,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
