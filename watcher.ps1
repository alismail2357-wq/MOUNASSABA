# Target your user folder
$path = "$env:USERPROFILE"
$filter = "manifest.json"

# Set up the watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $path
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Define what happens when the file is created
$action = {
    $filePath = $Event.SourceEventArgs.FullPath
    try {
        Remove-Item -Path $filePath -Force -ErrorAction Stop
        Write-Host "DELETED: $filePath at $(Get-Date)" -ForegroundColor Red
    } catch {
        # If the file is locked by a program, we try to clear its content instead
        Clear-Content -Path $filePath -ErrorAction SilentlyContinue
        Write-Host "CLEARED: $filePath (File was locked)" -ForegroundColor Yellow
    }
}

# Link the event
Register-ObjectEvent $watcher "Created" -Action $action
Register-ObjectEvent $watcher "Changed" -Action $action

Write-Host "Guardian is live. Monitoring all subfolders in $path..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop."

# Keep the script alive
while ($true) { Start-Sleep 5 }