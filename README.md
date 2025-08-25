<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en Desarrollo
1. Clonar el repositorio
2. Ejecutar
```
npm i
```
3.Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4.Levantar la base de datos
```
docker-compose up -d
```

5. CLonar el archivo __.env.template.__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env.__

7. Ejecutar la aplicacion en dev:
```
npm run start:dev
```

8. Reconstruir la base de daros con la semilla
```
http://localhost:3000/api/v2/seed
```

# Stack Usado
* MongoDB
* Nest