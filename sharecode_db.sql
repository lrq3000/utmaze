DROP DATABASE IF EXISTS sharecode_db;

CREATE DATABASE sharecode_db CHARACTER SET ascii;

USE sharecode_db;

SET NAMES ascii;

CREATE TABLE codes (
	share CHAR(6) NOT NULL PRIMARY KEY,
	code TEXT NOT NULL UNIQUE
);
