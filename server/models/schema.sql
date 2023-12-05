CREATE DATABASE MedTask;
USE MedTask;

CREATE TABLE Participants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_number SMALLINT UNSIGNED UNIQUE NOT NULL CHECK (participant_number > 99 AND participant_number < 400),
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  task_duration INT UNSIGNED NOT NULL DEFAULT 45,
  break_duration INT UNSIGNED NOT NULL DEFAULT 5,
  break_count_interval INT UNSIGNED NOT NULL DEFAULT 10,
  break_time_interval INT UNSIGNED NOT NULL DEFAULT 10,
  primary key (id),
  index (participant_number)
);

INSERT INTO Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) VALUES (166, 'John Doe', 1000, 100, 5, 100), (167, 'Jane Doe', 1111, 111, 6, 111);

CREATE TABLE Sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  participant_number BIGINT UNSIGNED NOT NULL,
  duration INT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Sessions (id, participant_number, duration) VALUES (1, 166, 1000), (2, 167, 1111);

CREATE TABLE Breaks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT UNSIGNED NOT NULL,
  has_accepted BOOLEAN NOT NULL,
  duration INT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (1, true, 4), (1, false, 5), (2, true, 6), (2, false, 7);


CREATE TABLE Submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  session_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  patient_id VARCHAR(255) NOT NULL,
  interpretation ENUM('within range', 'not within range') NOT NULL,
  last_interaction INT UNSIGNED NOT NULL,
  is_valid BOOLEAN NOT NULL,
  primary key (id)
);

INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (1, 'pid-1', 'within range', 6, true), (1, 'pid-2', 'not within range', 22, true), (1, 'pid-3', 'within range', 100, false), (1, 'pid-4', 'within range', 100, true), (1, 'pid-5', 'within range', 100, true), (1, 'pid-5', 'within range', 100, true), (1, 'pid-6', 'not within range', 100, true), (2, 'pid-7', 'within range', 50, false );

CREATE TABLE Patients (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  age TINYINT,
  sex ENUM('Male', 'Female') NOT NULL,
  heart_rate SMALLINT UNSIGNED NOT NULL,
  qt_intervals DECIMAL UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

