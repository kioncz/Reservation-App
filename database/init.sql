USE reservations_db;

CREATE TABLE IF NOT EXISTS user_type (
  id_userty INT NOT NULL AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_userty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user (
  id_user INT NOT NULL AUTO_INCREMENT,
  User_Name VARCHAR(100) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  type_user INT NOT NULL,
  PRIMARY KEY (id_user),
  UNIQUE KEY Password_UNIQUE (Password),
  KEY id_userty_idx (type_user),
  CONSTRAINT id_userty FOREIGN KEY (type_user) REFERENCES user_type (id_userty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS events (
  id_event INT NOT NULL AUTO_INCREMENT,
  name_event VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  location VARCHAR(150) NOT NULL,
  date_events DATE DEFAULT NULL,
  hour_event TIME DEFAULT NULL,
  total_tickets INT NOT NULL DEFAULT 100,
  available_tickets INT NOT NULL DEFAULT 100,
  PRIMARY KEY (id_event)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reservation (
  id_reser INT NOT NULL AUTO_INCREMENT,
  id_event INT DEFAULT NULL,
  id_user INT DEFAULT NULL,
  date_reserv DATE DEFAULT (CURRENT_DATE),
  amount INT DEFAULT NULL,
  PRIMARY KEY (id_reser),
  KEY reservation_event_idx (id_event),
  KEY reservation_user_idx (id_user),
  CONSTRAINT reservation_event_fk FOREIGN KEY (id_event) REFERENCES events (id_event),
  CONSTRAINT reservation_user_fk FOREIGN KEY (id_user) REFERENCES user (id_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;