# Comprehensive Dark Theme Removal Script
$rootPath = "c:\Users\KALP\OneDrive\Desktop\CAREflow Ai\src"

# Simple string replacements
$replacements = @{
    'bg-[#0a0a0a]' = 'bg-slate-50'
    'bg-[#1a1a1a]' = 'bg-white'
    'bg-[#121212]' = 'bg-white'
    'bg-black/60' = 'bg-slate-200'
    'bg-black/50' = 'bg-slate-100'
    'bg-black/40' = 'bg-slate-100'
    'bg-black/30' = 'bg-slate-50'
    'bg-black/20' = 'bg-slate-50'
    'bg-black/10' = 'bg-slate-50'
    'text-white/70' = 'text-slate-600'
    'text-white/60' = 'text-slate-500'
    'text-white/10' = 'text-slate-200'
    'border-white/20' = 'border-slate-200'
    'border-white/10' = 'border-slate-200'
    'border-white/5' = 'border-slate-200'
    'bg-white/10' = 'bg-slate-100'
    'bg-white/5' = 'bg-slate-50'
    'hover:bg-white/10' = 'hover:bg-slate-100'
    'hover:bg-white/5' = 'hover:bg-slate-50'
}

$files = Get-ChildItem -Path $rootPath -Recurse -Include *.tsx
$filesModified = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $relativePath = $file.FullName.Replace($rootPath, "").TrimStart('\')
        Write-Host "Updated: $relativePath" -ForegroundColor Green
        $filesModified++
    }
}

Write-Host "`nTotal files modified: $filesModified" -ForegroundColor Cyan
