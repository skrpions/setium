# Setium - Manejo de Fondos BTG

Aplicacion web Angular para la gestion de fondos de inversion (FPV/FIC), permitiendo suscripcion, cancelacion y seguimiento de transacciones.

## Requisitos previos

- Node.js 20+
- npm 10+

## Instalacion

```bash
git clone https://github.com/skrpions/setium.git
cd setium
npm install
```

## Ejecucion

```bash
npm start          # Abre en http://localhost:4200
npm run build      # Build de produccion
npm test           # Ejecutar pruebas unitarias
```

## Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Clean Architecture)** con separacion clara de responsabilidades:

```
src/app/
  core/                              # Nucleo de la aplicacion
    domain/
      entities/                      # Modelos de dominio (Fund, Transaction, Subscription)
      repositories/                  # Interfaces/contratos (puertos)
    application/                     # Servicio central de estado (AppStateService)
    infrastructure/
      services/                      # Implementaciones concretas (FundMockService)
  modules/                           # Modulos de negocio
    funds/
      views/                         # Vista principal de fondos
      components/                    # fund-card, subscribe-modal
    transactions/
      views/                         # Vista de historial de transacciones
  shared/
    components/                      # Componentes reutilizables (notification-selector)
  layout/                            # Header con navegacion y saldo
```

### Capas

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Domain** | Modelos e interfaces puras, sin dependencias externas | `Fund`, `Transaction`, `Subscription`, `FundRepository` |
| **Application** | Logica de negocio y estado centralizado | `AppStateService` (saldo, suscripciones, historial) |
| **Infrastructure** | Implementaciones concretas, acceso a datos | `FundMockService` (datos mock simulando API REST) |
| **Modules** | Features de la UI organizados por dominio | Fondos, Transacciones |

## Funcionalidades

1. **Visualizar fondos disponibles** - Lista de fondos FPV y FIC con filtro por categoria.
2. **Suscribirse a un fondo** - Modal con validacion de monto minimo y formato de moneda (ngx-mask).
3. **Cancelar suscripcion** - Devolucion automatica del saldo con notificacion al usuario.
4. **Historial de transacciones** - Tabla en desktop y cards en mobile con detalle de cada operacion.
5. **Metodo de notificacion** - Seleccion de Email o SMS al suscribirse (se conserva en cancelaciones).
6. **Mensajes de error** - Feedback visual para saldo insuficiente, monto minimo no alcanzado y suscripcion duplicada.

## Manejo de estado

Se utiliza **RxJS** con `BehaviorSubject` y `Observable` en un servicio centralizado (`AppStateService`):

- `userBalance$` - Saldo disponible del usuario
- `subscribedFunds$` - Suscripciones activas
- `transactions$` - Historial de transacciones

## Stack tecnologico

- **Angular 21** con TypeScript estricto
- **Angular Material** (M3) con paleta Cyan personalizada
- **ngx-sonner** - Notificaciones toast
- **ngx-mask** - Formato de moneda en inputs
- **RxJS** - Manejo de estado reactivo
- **Vitest** - Pruebas unitarias
- **SCSS** con metodologia **BEM**

## Datos mock

Se asume un usuario unico con saldo inicial de **COP $500.000**. Los fondos disponibles son:

| ID | Nombre | Monto minimo | Categoria |
|----|--------|-------------|-----------|
| 1 | FPV_BTG_PACTUAL_RECAUDADORA | $75.000 | FPV |
| 2 | FPV_BTG_PACTUAL_ECOPETROL | $125.000 | FPV |
| 3 | DEUDAPRIVADA | $50.000 | FIC |
| 4 | FDO-ACCIONES | $250.000 | FIC |
| 5 | FPV_BTG_PACTUAL_DINAMICA | $100.000 | FPV |

## Pruebas unitarias

4 archivos de test con 22 pruebas:

- **AppStateService** - Saldo inicial, suscripcion, validaciones, cancelacion, historial
- **FundCardComponent** - Renderizado, eventos, estados suscrito/no suscrito
- **TransactionListComponent** - Estado vacio, visualizacion de operaciones
- **SubscribeModalComponent** - Validacion de formulario (required, min), flujo de confirmacion

```bash
npm test
```

## Decisiones tecnicas

- **Arquitectura Hexagonal**: Desacopla el dominio de la infraestructura. Permite reemplazar los mocks por una API REST real sin modificar la logica de negocio.
- **RxJS**: Manejo de estado reactivo con `BehaviorSubject`, `Observable` y operadores como `map` y `pipe`.
- **Lazy loading**: Los modulos de fondos y transacciones se cargan bajo demanda via `loadComponent`.
- **Angular Material M3**: Paleta Cyan personalizada con variables CSS del sistema (`--mat-sys-*`).
- **ngx-sonner**: Toasts ligeros y elegantes para feedback visual.
- **ngx-mask**: Formato de moneda con separador de miles en inputs numericos.
- **BEM en SCSS**: Metodologia de nombrado que facilita la escalabilidad y mantenimiento de estilos.
- **Responsive**: Tabla en desktop, cards en mobile para transacciones. Grid adaptable para fondos.
- **Confirmacion de cancelacion**: Modal de confirmacion antes de cancelar una suscripcion para evitar acciones accidentales.

## Preview
- Preview:
- <img width="1680" height="820" alt="image" src="https://github.com/user-attachments/assets/aaaec80f-917c-46d5-9c93-d123dbbe66c0" />

## Live
https://setium.netlify.app/


