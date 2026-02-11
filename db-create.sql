create database РАБОТА
go
use РАБОТА
go

--первое таблица

create table сотрудники 
(
id int primary key identity,
posport char (15),
ИИН char (20),
FIO char (50)
)

--второе таблица

create table логины 
(
username int primary key identity,
сотрудники int foreign key references сотрудники (id),
password char (50)
)

--третие таблица

create table роли 
(
id int primary key identity,
называние char (50)
)

--четвертое таблица

create table роли_сотрудники
(
сотрудники int foreign key references сотрудники (id),
роли int foreign key references роли (id)
)

--пятое таблица

create table задачи 
(
id int primary key identity,
кто_поставил int foreign key references сотрудники (id),
когда_поставил datetime,
описание varchar(100)
)

--шестое таблица

create table назначение
(
кто_назначил int foreign key references сотрудники (id),
на_кого_назначил int foreign key references сотрудники (id),
когда datetime,
какую_задачу int foreign key references задачи(id)
)

--седмое таблица

create table выполнение
(
кто int foreign key references сотрудники (id),
время_начало datetime,
время_окончание datetime,
задача int foreign key references задачи (id)
)
