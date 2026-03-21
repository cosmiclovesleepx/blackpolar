# Videos - Portfolios App

Esta carpeta contiene todos los videos utilizados en la aplicación Portfolios.

## Estructura Recomendada

```
video/
├── portfolio-showcases/   - Videos de demostración de proyectos
├── testimonials/          - Videos de testimonios de clientes
└── backgrounds/           - Videos de fondo (loops)
```

## Recomendaciones

- Mantener videos cortos (menos de 2 minutos para web)
- Usar formatos optimizados (MP4 + WebM)
- Siempre incluir posters/thumbnails
- Asegurar accesibilidad con subtítulos

## Ejemplo de Implementación

```html
<figure>
    <video controls poster="thumbnail.jpg">
        <source src="video.mp4" type="video/mp4">
        <source src="video.webm" type="video/webm">
    </video>
    <figcaption>Descripción del video</figcaption>
</figure>
```
