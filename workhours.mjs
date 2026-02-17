"use strict";

import sql from "mssql";

// Database configuration
const config = {
    user: 'work_login',
    password: 'Parol111',
    server: '127.0.0.1', // You can use 'localhost' or an IP address
    port: 1433,
    database: 'РАБОТА',
    timeout: 2000,
    options: {
        encrypt: false, // Use true for Azure SQL Database, false for local SQL Server if not using SSL
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// данные приложения:
let app = {};

// подключимся к СУБД
async function connect() {
    try {
        //app.pool = await sql.connect(config);
        await sql.connect(config);
        console.log('Connected to SQL Server.');
        
    } catch (err) {
        console.error('Database error:', err);
        await sql.close();
        console.log('Connection closed.');
    }
}

// отключимся от СУБД
async function disconnect() {
    try {
        await sql.close();
        console.log('Disconnected from SQL Server.');
        
    } catch (err) {
        console.error('Database error:', err);
    }
}

async function addEmployee(args) {
    // широта
    let posport = args[0];
    let iin = args[1];
    let fio = args[2]; 

    let query =
        `
        insert into сотрудники(posport,ИИН,FIO)
        output inserted.id
        values('${posport}', '${iin}', '${fio}')
        
        `;

    try {
        // создаем и выполняем запрос
        const request = new sql.Request(app.pool);
        const result = await request.query(query);

        console.log("Сотрудник добавлен, id: ", result.recordset[0].id);
    } catch (e) {
        console.log("Что-то сломалось: " + e.message);
    }
}

async function runQuery(query) {
    try {
        // создаем и выполняем запрос
        const request = new sql.Request(app.pool);
        const result = await request.query(query);
        return result.recordset;
    } catch (e) {
        console.log("Что-то сломалось: " + e.message);
        return null;
    }
}


async function addRole(role) {
    let query = `insert into роли (называние)
         values ('${role}');`
    return await runQuery(query);
}

async function printRoles() {
    let query = `select * from роли;`;
    console.log(await runQuery(query));
}


async function findEmployee(name) {
    let query = `select * from сотрудники where fio like '%${name}%'`;
    return await runQuery(query);
}

async function printEmployee(name) {
    console.log(await findEmployee(name));
}

async function addTask(args) {
    let name = args[0];

    let employees = await findEmployee(name);

    if (employees.length != 1) {
        console.log("Нашли несколько или ноль сотрудников:");

        for (let employee of employees) {
            console.log(employee.fio)
        }

        return;
    }

    let employeeId = employees[0].id;

    let query = `insert into задачи(кто_поставил, описание, когда_поставил) 
        output inserted.*
        values (${employeeId}, '${args[1]}', getdate());    
    `;

    let result = await runQuery(query);

    console.log(result);
}

// подключимся к СУБД
await connect();

let command = process.argv[2];
let args = process.argv.slice(3);

switch (command) {
    case "+сотрудник": await addEmployee(args); break;
    case "+задача": await addTask(args); break;
    case "?сотрудник": await printEmployee(args); break;
    case "+роли": await addRole(args); break;
    case "роли": await printRoles(args); break;
}

await disconnect();
