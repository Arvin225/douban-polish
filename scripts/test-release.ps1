# scripts/test-release.ps1
npm run build

if (-not (Test-Path "dist/douban-polish.user.js")) {
    Write-Error "Build failed: file not found"
    exit 1
}

$head = Get-Content "dist/douban-polish.user.js" -Head 15
Write-Host "=== Metadata ==="
$head | Select-String "^// @"

$size = (Get-Item "dist/douban-polish.user.js").Length
Write-Host "File size: $size bytes"
if ($size -gt 2MB) {
    Write-Warning "File exceeds 2MB, may fail to upload"
}
