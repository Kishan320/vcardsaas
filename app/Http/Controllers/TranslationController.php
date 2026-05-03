<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use App\Models\Setting;
use App\Models\User;
use App\Models\Addon;

class TranslationController extends BaseController
{
    public function getTranslations($locale)
    {
        $path = resource_path("lang/{$locale}.json");
        
        if (!File::exists($path)) {
            $path = resource_path("lang/en.json");
            $locale = 'en';
        }
        
        // Use user's saved layoutDirection from DB, not derived from language
        $layoutDirection = 'ltr'; // default
        if (auth()->check()) {
            $savedDir = getSetting('layoutDirection', 'ltr', auth()->id());
            $layoutDirection = in_array($savedDir, ['ltr', 'rtl']) ? $savedDir : 'ltr';
        } elseif (in_array($locale, ['ar', 'he'])) {
            // Only auto-set RTL for inherently RTL languages when not authenticated
            $layoutDirection = 'rtl';
        }
        
        // Always store language preference in cookie for persistence
        Cookie::queue('app_language', $locale, 60 * 24 * 30); // 30 days
        Cookie::queue('app_direction', $layoutDirection, 60 * 24 * 30);
        
        // Demo mode handling
        if (config('app.is_demo') !== true) {
            if (auth()->check()) {
                // Update authenticated user's language setting only (not layoutDirection)
                auth()->user()->update(['lang' => $locale]);
            } else {
                // For unauthenticated users on auth pages, use superadmin's language
                $superAdmin = User::where('type', 'superadmin')->first();
                if ($superAdmin && request()->is('login', 'register', 'password/*', 'email/*')) {
                    $locale = $superAdmin->lang ?? 'en';
                    $path = resource_path("lang/{$locale}.json");
                    
                    if (!File::exists($path)) {
                        $path = resource_path("lang/en.json");
                        $locale = 'en';
                    }
                }
            }
        }

        $translations = json_decode(File::get($path), true) ?? [];
        // Set Laravel app locale
        app()->setLocale($locale);
        
        // Merge enabled addon translations
        $enabledPackages = Addon::where('is_enabled', true)->pluck('package_name');
        foreach ($enabledPackages as $packageName) {
            $packageLangFile = base_path("packages/workdo/{$packageName}/src/resources/lang/{$locale}.json");

            if (File::exists($packageLangFile)) {
                $packageTranslations = json_decode(File::get($packageLangFile), true) ?? [];
                $translations = array_merge($translations, $packageTranslations);

            }
        }
        return response()->json([
            'translations' => $translations,
            'layoutDirection' => $layoutDirection,
            'locale' => $locale
        ]);
    }
    
    public function getInitialLocale()
    {
        $cookieLang = Cookie::get('app_language');
        if ($cookieLang) {
            return $cookieLang;
        }
        
        if (auth()->check()) {
            return auth()->user()->lang ?? 'en';
        } else if (request()->is('login', 'register', 'password/*', 'email/*')) {
            $superAdmin = User::where('type', 'superadmin')->first();
            return $superAdmin->lang ?? 'en';
        }
        
        return 'en';
    }
} 