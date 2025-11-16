use template_db;

create table if not exists facilities(
    id int auto_increment primary key,
    name varchar(255) not null,
    latitude double not null,
    longitude double not null,
    type varchar(255) not null,
    region varchar(10) not null
)