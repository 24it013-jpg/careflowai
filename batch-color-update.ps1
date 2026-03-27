# Batch Color Scheme Replacement Script
# This script replaces dark theme colors with professional medical colors across all files

$rootPath = "c:\Users\KALP\OneDrive\Desktop\CAREflow Ai\src"

# Define replacement patterns
$replacements = @(
    @{Pattern = 'bg-\[#121212\]'; Replacement = 'bg-white'},
    @{Pattern = 'bg-black(?!/\d)'; Replacement = 'bg-slate-50'},  # bg-black but not bg-black/20
    @{Pattern = 'text-white(?!\/)'; Replacement = 'text-slate-900'},  # text-white but not text-white/10
    @{Pattern = 'border-white/5'; Replacement = 'border-slate-200'},
    @{Pattern = 'border-white/10'; Replacement = 'border-slate-200'},
    @{Pattern = 'bg-white/5'; Replacement = 'bg-slate-50'},
    @{Pattern = 'bg-white/10'; Replacement = 'bg-slate-100'},
    @{Pattern = 'hover:bg-white/5'; Replacement = 'hover:bg-slate-50'},
    @{Pattern = 'hover:bg-white/10'; Replacement = 'hover:bg-slate-100'},
    @{Pattern = 'text-slate-400(?! )'; Replacement = 'text-slate-600'},  # Secondary text
    @{Pattern = 'hover:text-white'; Replacement = 'hover:text-slate-900'}
)

# Get all .tsx files in pages/features and components/dashboard
$files = Get-ChildItem -Path $rootPath -Recurse -Include *.tsx | Where-Object {
    $_.FullName -like "*\pages\features\*" -or 
    $_.FullName -like "*\components\dashboard\*" -or
    $_.FullName -like "*\components\layout\*"
}

$filesModified = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace $replacement.Pattern, $replacement.Replacement
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
        $filesModified++
    }
}

Write-Host "`nTotal files modified: $filesModified"
