# Quiniela - Proyecto (React + Node + SQLite)
Proyecto generado automáticamente con la estructura básica para que puedas subirlo a GitHub.

## Estructura
- backend/: servidor Node.js con Express y SQLite.
- frontend/: app React (Vite) con diseño negro/dorado simple.
- data/original_input.txt: tu archivo original con los pronósticos y jornadas. (fuente: archivo subido por el usuario).

## Cómo usar (desarrollador)
1. Clona el proyecto y entra a las carpetas `backend` y `frontend`.
2. Backend:
   - `cd backend`
   - `npm install`
   - `node index.js` (o `npm run dev` si instalas nodemon)
   El servidor corre en el puerto 4000 por defecto.
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. Para producción: `npm run build` en frontend y el backend sirve la carpeta `../frontend/dist`.

## Importar tus TXT
He incluido `data/original_input.txt` tal y como lo subiste. Puedes escribir un script en `backend/` para parsear ese TXT y poblar la base SQLite (`quiniela.db`).
También hay `backend/init.sql` para crear las tablas iniciales.

## Notas importantes
- Este es un esqueleto funcional. Todavía necesitas:
  - Implementar el parsing completo de los archivos TXT a la base de datos.
  - Añadir validaciones y seguridad (hashing de contraseñas en lugar de guardarlas planas).
  - Configurar el envío de correos (variables de entorno en `.env`).
  - Mejorar la UI y añadir las pantallas completas según tus reglas.
- Todo el diseño básico está en negro/dorado como solicitaste.
