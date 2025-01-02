<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class VersionController extends Controller
{
    public static function getLatestVersionFromChangelog(): string
    {
        $changelogPath = base_path('CHANGELOG.md');  // Ajusta el path según tu estructura de carpetas

        if (File::exists($changelogPath)) {
            $contents = File::get($changelogPath);
            // Ajustar la expresión regular para capturar el formato de versión actual
            preg_match('/([0-9]+\.[0-9]+\.[0-9]+)\s*\(/', $contents, $matches);
            return $matches[1] ?? 'Desconocida';
        }

        return 'Desconocida';
    }
}
