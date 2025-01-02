<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# PalmScale - Laravel

## Descripción
- Este proyecto es una aplicación web desarrollada en Laravel utilizando el paquete **Nova**. Está diseñado para proporcionar una plataforma robusta y escalable para aplicaciones web avanzadas.

##  Instalación
### Requisitos Previos
- Git
- Composer
- PHP

### Clonar el Repositorio
```bash
git clone https://github.com/clinicarehn/paynode.git
cd paynode
```

### Configuración del Proyecto
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Versionar un proyecto

### Paso 1: Instalar Conventional Changelog CLI
- Después de instalar npm, necesitas agregar Conventional Changelog CLI como una dependencia global. Esto te permitirá generar el archivo **CHANGELOG.md** fácilmente:

```bash
npm install -g conventional-changelog-cli
```

### Paso 32 Generar el Changelog
- Si no existe el archivo CHANGELOG.md, el siguiente comando lo creará y lo llenará con los registros basados en tus commits que sigan la convención Angular. Si el archivo ya existe, lo actualizará.

```bash
npx conventional-changelog-cli -p angular -i CHANGELOG.md -s
```

### Detalles del Comando:
- -p angular: Especifica que la convención de commits que seguimos es la del estilo Angular.
- -i CHANGELOG.md: Indica que se debe generar o actualizar el archivo CHANGELOG.md.
- -s: Sobrescribe el archivo si ya existe, agregando la nueva información de los commits.

### Paso 3: Confirmar Cambios
- Después de ejecutar el comando, verifica que el archivo CHANGELOG.md contiene la información deseada. Puedes incluir este archivo en tus commits y continuar actualizándolo con cada cambio significativo en el proyecto.

## Notas Importantes
- Asegúrate de seguir la convención de mensajes de commits para que el changelog se genere correctamente. Por ejemplo:
- feat: Para agregar una nueva funcionalidad.
- fix: Para corregir un error.
- docs: Para cambios en la documentación.
- refactor: Para refactorización de código.

## Configurando el versionado automático con standard-version
- Si quieres que la versión de tu proyecto se actualice automáticamente al hacer cambios significativos, puedes seguir estos pasos:

## Paso 1: Instalar standard-version
Primero, necesitas instalar **standard-version**, que se encargará de incrementar la versión y generar el changelog:

```bash
npm install --save-dev standard-version
```
### Paso 2: Configurar el script en package.json
- Agrega un script en tu package.json para ejecutar standard-version de manera sencilla:

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

## Debemos agregar este valor *"version": "1.0.1",*
```json
    "private": true,
    "type": "module",
    "version": "1.0.8",
```

### Paso 3: Usar el comando de release
- Cuando estés listo para hacer un release (liberar una nueva versión), ejecuta el siguiente comando:

```bash
npm run release
```

- Con esto logramos que se cambie la version de nuestro proyecto

### Este comando hará lo siguiente:
- Revisará los mensajes de commit para determinar si debe incrementar la versión de patch (parches), minor (menor) o major (mayor), según los cambios realizados:
- feat: incrementa la versión minor (1.0.0 → 1.1.0).
- fix: incrementa la versión patch (1.0.0 → 1.0.1).
- breaking change: incrementa la versión major (1.0.0 → 2.0.0).
- Actualizará el número de versión en tu package.json.
- Generará o actualizará el archivo CHANGELOG.md con los detalles de los commits más recientes
