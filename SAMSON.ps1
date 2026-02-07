# 1. THE ENGINE: C# Low-Level Sniper + Keyboard Watcher
$SniperCode = @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class UltraSniper {
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr hWnd, uint Msg, int wParam, int lParam);
    [DllImport("user32.dll")] public static extern IntPtr FindWindowEx(IntPtr hP, IntPtr hC, string c, string t);
    [DllImport("user32.dll")] public static extern short GetAsyncKeyState(int vKey);
    [DllImport("user32.dll", CharSet = CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    
    public static void NukeDevTools() {
        // Class 'DevToolsWindow' (Undocked)
        IntPtr undocked = FindWindow("DevToolsWindow", null);
        if (undocked != IntPtr.Zero) PostMessage(undocked, 0x0010, 0, 0);

        // Class 'Chrome_WidgetWin_1' (Docked/Panels)
        IntPtr hWnd = IntPtr.Zero;
        while ((hWnd = FindWindowEx(IntPtr.Zero, hWnd, "Chrome_WidgetWin_1", null)) != IntPtr.Zero) {
            StringBuilder sb = new StringBuilder(256);
            GetWindowText(hWnd, sb, 256);
            string title = sb.ToString();
            // Nuke if it's named DevTools OR if it's a blank sub-panel (how docked tools hide)
            if (title.Contains("DevTools") || title == "" || title.Contains("Developer Tools") || title.Contains("Inspect")) {
                PostMessage(hWnd, 0x0010, 0, 0);
            }
        }
    }

    public static bool IsTryingToInspect() {
        // F12 (0x7B) OR Ctrl(0x11)+Shift(0x10)+I(0x49)
        bool f12 = (GetAsyncKeyState(0x7B) & 0x8000) != 0;
        bool ctrlShiftI = ((GetAsyncKeyState(0x11) & 0x8000) != 0) && 
                          ((GetAsyncKeyState(0x10) & 0x8000) != 0) && 
                          ((GetAsyncKeyState(0x49) & 0x8000) != 0);
        return f12 || ctrlShiftI;
    }
}
"@
Add-Type -TypeDefinition $SniperCode -ErrorAction SilentlyContinue

# 2. Setup
$FlagFile = "$HOME\Desktop\samson_is_calling_ya.txt"
[System.Diagnostics.Process]::GetCurrentProcess().PriorityClass = 'RealTime'

Write-Host "--- PERFECT LOCKDOWN ACTIVE ---" -BackgroundColor DarkRed -ForegroundColor White

while($true) {
    if (Test-Path $FlagFile) { [System.Threading.Thread]::Sleep(1000); continue }

    # --- ACTION 0: KEYBOARD BLOCKER ---
    # If they touch the hotkeys, kill the browser immediately before it can react
    if ([UltraSniper]::IsTryingToInspect()) {
        Get-Process chrome, msedge, brave, opera -ErrorAction SilentlyContinue | Stop-Process -Force
    }

    # --- ACTION 1: THE C# SNIPER (DevTools Windows) ---
    [UltraSniper]::NukeDevTools()

    # --- ACTION 2: COMMAND LINE DNA SCAN (Docked/Sub-process) ---
    # This hits the 'hidden' devtools engine across all chromium browsers
    $bad = Get-CimInstance Win32_Process -Filter "CommandLine LIKE '%--developer-tools%' OR CommandLine LIKE '%--devtools-app%'"
    if ($bad) { $bad | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } }

    # --- ACTION 3: THE DIALOG BLOCKER (Stops 'Load Unpacked') ---
    $dialog = [UltraSniper]::FindWindow("#32770", $null)
    if ($dialog -ne 0) { [UltraSniper]::PostMessage($dialog, 0x0010, 0, 0) }

    # --- ACTION 4: SURGICAL EXPLORER & SYSTEM TOOLS ---
    (New-Object -ComObject Shell.Application).Windows() | ForEach-Object { 
        if ($_.Name -match "Explorer" -or $_.LocationName -ne $null) { $_.Quit() } 
    }
    Get-Process cmd, taskmgr, powershell_ise, pwsh -ErrorAction SilentlyContinue | Stop-Process -Force

    # --- ACTION 5: FALLBACK (Visual Title Check) ---
    Get-Process chrome, msedge, brave, opera -ErrorAction SilentlyContinue | Where-Object { 
        $_.MainWindowTitle -match "Inspect" -or $_.MainWindowTitle -match "Dev" -or $_.MainWindowTitle -match "Extension"
    } | Stop-Process -Force

    # 5ms loop - No human can beat this.
    [System.Threading.Thread]::Sleep(5)
}