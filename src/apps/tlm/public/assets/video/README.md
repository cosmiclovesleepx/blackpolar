# Videos - TLM App

Esta carpeta contiene todos los videos utilizados en la aplicación TLM.

## Estructura Recomendada

```
video/
├── course-content/     - Contenido de cursos educativos
├── lectures/           - Grabaciones de clases
├── tutorials/          - Videos tutoriales
└── promotional/        - Videos promocionales
```

## Recomendaciones para Educación

- **Calidad**: Mínimo 720p, preferiblemente 1080p
- **Duración**: 5-20 minutos para máxima retención
- **Subtítulos**: Obligatorios para accesibilidad
- **Formatos**: MP4 + WebM

## Especificaciones Técnicas

```
Resolución: 1920x1080p (Full HD)
Bitrate Video: 2500-5000 kbps
Bitrate Audio: 128-192 kbps
Framerate: 24/30 fps
Subtítulos: VTT formato
```

## Ejemplo con Subtítulos

```html
<video controls poster="poster.jpg">
    <source src="lecture.mp4" type="video/mp4">
    <source src="lecture.webm" type="video/webm">
    <track kind="subtitles" src="es.vtt" srclang="es" label="Español">
    <track kind="subtitles" src="en.vtt" srclang="en" label="English">
</video>
```

## Herramientas Recomendadas

- **Subtitle Generation**: Whisper (OpenAI)
- **Video Compression**: FFmpeg
- **Transcoding**: HandBrake
- **Hosting**: Video CDN para mejor distribución
