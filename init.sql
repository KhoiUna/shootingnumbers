DROP DATABASE IF EXISTS shooting_number;
CREATE DATABASE shooting_number;

CREATE TABLE public.player_info (
    id SERIAL,
    player VARCHAR(45) NOT NULL,
    score INT NOT NULL,
    PRIMARY KEY(id)
);