# Probar el panel (Decap CMS) en local con la plantilla Barbería

1. Terminal 1, en esta carpeta (plantillas-web):
   git init            (solo si aún no es un repositorio Git)
   npx decap-server    (déjala abierta; usa el puerto 8081)

2. VS Code: clic derecho en demos/barberia/index.html > Open with Live Server.

3. En el navegador abre la misma dirección pero terminando en:
   /demos/barberia/admin/
   Ejemplo: http://127.0.0.1:5500/demos/barberia/admin/
   (debe ser localhost o 127.0.0.1; el modo local no funciona en otros dominios)

4. Pulsa Login, abre "Contenido de la web", cambia algo y pulsa Publicar.
