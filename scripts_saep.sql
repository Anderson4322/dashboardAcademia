create table usuario(
id_user serial primary key,
nome varchar(255) not null,
senha varchar(255) not null,
status varchar(255)
)

create table treinos(
id_treino serial primary key,
nome_treino varchar(255) not null,
exercicio varchar(255) not null,
id_prof int references professor(id_prof),
id_user int references usuario(id_user)
)

create table professor(
id_prof serial primary key,
nome_prof varchar(255) not null,
senha varchar(255) not null
)

select * from professor
select * from usuario
select * from treinos