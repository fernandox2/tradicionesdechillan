# Descripcion
Proyecto de Comercio Electrónico con Next 14 version App Router. 

## Correr en Dev

1. Clonar repositorio
2. Crear una copia del ```.env.template```, renombrarlo ```.env``` y completar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ````npm run seed```
7. Correr el proyecto ```npm run dev```

## Correr en Prod

De momento no hay información ya que el proyecto está en etapad de desarrollo