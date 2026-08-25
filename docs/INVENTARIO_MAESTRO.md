# Pitagóricos.ai — Inventario Maestro

## Assets
| Asset | Ubicación | Descripción |
|---|---|---|
| Logo Tetractys | `public/images/logo.svg` | Logo SVG con Tetractys dorado. |
| Scene 3D | `components/temple/HeroScene.tsx` | Tetractys + esferas armónicas con React Three Fiber. |
| Knowledge Base | `knowledge-base/` | Corpus de conocimiento para agente ElevenLabs Amelita. |
| Libro Pitágoras | `knowledge-base/pitagoras-auto-aprendizaje-de-vida-raw.txt` | Libro completo de Amelia Ruiz (193KB, 12 capítulos). |

## Endpoints
| Endpoint | Uso |
|---|---|
| `https://pitagoricos.ai` | Producción |
| `https://pitagoricos.ai/es` | Español |
| `https://pitagoricos.ai/en` | Inglés |
| `https://pitagoricos.ai/api/auth/callback/google` | OAuth callback |
| `https://pitagoricos.ai/api/signed-url` | Signed URL ElevenLabs |

## Servicios externos
| Servicio | Propósito | Variable de entorno |
|---|---|---|
| Google OAuth | Autenticación | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |
| ElevenLabs | Voz y chat de Amelita | `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` |
| AWS S3 | Deploy packages | `chatita-deployments-temp` |
| AWS SSM | Ejecución remota en servidor | IAM role `EC2-SessionManager-Role` |

## Infraestructura
- **Dominio**: `pitagoricos.ai` (Route 53)
- **Servidor**: EC2 Chatita, `54.212.177.221`, `i-0994d0887cc3c3476`
- **Puerto app**: `3200`
- **Proceso**: `pitagoricos-ai` en PM2
- **Reverse proxy**: nginx `/etc/nginx/conf.d/pitagoricos.ai.conf` → `proxy_pass http://127.0.0.1:3200`
- **SSL**: Let's Encrypt `/etc/letsencrypt/live/pitagoricos.ai/`

## Repositorio
- GitHub: `https://github.com/ManuelCadena/pitagoricos-ai`

## Notas de operación
- El middleware protege todo el sitio y redirige a `/{locale}/login` si no hay sesión.
- Si la sesión existe pero el email no está en `ALLOWED_EMAILS`, redirige a `/{locale}/no-autorizado`.
- El deploy se hace con `bash scripts/deploy.sh` (build → S3 → SSM → PM2 reload).
