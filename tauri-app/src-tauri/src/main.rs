// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    Window, State, AppHandle,
};
use std::sync::{Arc, Mutex};
use std::thread;

struct AppState {
    click_through: Mutex<bool>,
    mouse_tracking: Arc<Mutex<bool>>,
}

#[tauri::command]
fn get_click_through_state(state: State<AppState>) -> Result<bool, String> {
    state.click_through.lock()
        .map(|guard| *guard)
        .map_err(|e| format!("Failed to get click-through state: {}", e))
}

#[tauri::command]
fn set_click_through(window: Window, state: State<AppState>, enabled: bool) -> Result<(), String> {
    // Check current state
    {
        let click_through = state.click_through.lock()
            .map_err(|e| format!("Failed to lock click_through state: {}", e))?;
        
        if *click_through == enabled {
            return Ok(()); // No change needed
        }
    }
    
    // Update state
    {
        let mut click_through = state.click_through.lock()
            .map_err(|e| format!("Failed to lock click_through state: {}", e))?;
        *click_through = enabled;
    }

    println!("Set click-through to: {}", enabled);

    // Enable/disable global mouse tracking
    {
        let mut tracking = state.mouse_tracking.lock()
            .map_err(|e| format!("Failed to lock mouse_tracking state: {}", e))?;
        *tracking = enabled;
    }
    
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT, WS_EX_LAYERED,
        };

        let hwnd = HWND(window.hwnd()
            .map_err(|e| format!("Failed to get window handle: {}", e))?.0 as isize);
        
        unsafe {
            let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            
            let new_style = if enabled {
                ex_style | WS_EX_LAYERED.0 as isize | WS_EX_TRANSPARENT.0 as isize
            } else {
                ex_style & !(WS_EX_TRANSPARENT.0 as isize)
            };
            
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
            println!("Click-through set to: {}", if enabled { "ENABLED" } else { "DISABLED" });
        }
    }

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::NSWindow;
        use cocoa::base::id;

        let ns_window = window.ns_window()
            .map_err(|e| format!("Failed to get NSWindow: {}", e))? as id;
        
        unsafe {
            ns_window.setIgnoresMouseEvents_(enabled);
            println!("macOS click-through set to: {}", if enabled { "ENABLED" } else { "DISABLED" });
        }
    }

    #[cfg(target_os = "linux")]
    {
        window.set_ignore_cursor_events(enabled)
            .map_err(|e| format!("Failed to set ignore cursor events: {}", e))?;
        println!("Linux click-through set to: {}", if enabled { "ENABLED" } else { "DISABLED" });
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        window.set_ignore_cursor_events(enabled)
            .map_err(|e| format!("Failed to set ignore cursor events: {}", e))?;
    }

    // Update tray menu text
    window.app_handle().tray_handle().get_item("toggle_click_through")
        .set_title(if enabled { "Disable Click-Through" } else { "Enable Click-Through" })
        .map_err(|e| format!("Failed to update tray menu: {}", e))?;

    // Notify frontend
    window.emit("click-through-changed", enabled)
        .map_err(|e| format!("Failed to emit event: {}", e))?;
    
    Ok(())
}

#[tauri::command]
fn check_overlay_permission() -> bool {
    #[cfg(target_os = "android")]
    {
        // On Android, check SYSTEM_ALERT_WINDOW permission
        // Note: Requires JNI bridge implementation in Android-specific code
        use std::process::Command;
        
        // Try to check via ADB if available (development mode)
        match Command::new("adb")
            .args(&["shell", "appops", "get", "com.magiccursor.app", "SYSTEM_ALERT_WINDOW"])
            .output()
        {
            Ok(output) => {
                let result = String::from_utf8_lossy(&output.stdout);
                result.contains("allow")
            }
            Err(_) => {
                // Assume permission is granted if we can't check
                println!("Cannot check overlay permission, assuming granted");
                true
            }
        }
    }
    
    #[cfg(not(target_os = "android"))]
    {
        // Desktop platforms don't require overlay permissions
        true
    }
}

#[tauri::command]
fn request_overlay_permission(app_handle: AppHandle) {
    #[cfg(target_os = "android")]
    {
        // On Android, request SYSTEM_ALERT_WINDOW permission
        // This requires opening Android Settings
        println!("Requesting overlay permission on Android");
        
        // Emit event to frontend to handle via Capacitor/Cordova plugin
        if let Some(window) = app_handle.get_window("main") {
            let _ = window.emit("request-overlay-permission", ());
        }
        
        // Alternative: Use JNI to directly open settings
        // This would require platform-specific code in src-tauri/gen/android/
        // Example intent: android.settings.action.MANAGE_OVERLAY_PERMISSION
    }
    
    #[cfg(not(target_os = "android"))]
    {
        println!("Overlay permission not required on this platform");
    }
}

#[tauri::command]
fn toggle_fullscreen(window: Window) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            SetWindowPos, HWND_TOPMOST, SWP_NOZORDER,
        };
        use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITOR_DEFAULTTONEAREST};

        let hwnd = HWND(window.hwnd()
            .map_err(|e| format!("Failed to get window handle: {}", e))?.0 as isize);
        
        unsafe {
            // Get monitor info
            let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
            let mut monitor_info = MONITORINFO {
                cbSize: std::mem::size_of::<MONITORINFO>() as u32,
                ..Default::default()
            };
            
            if !GetMonitorInfoW(monitor, &mut monitor_info).as_bool() {
                return Err("Failed to get monitor info".to_string());
            }

            // Position window to cover entire monitor including taskbar
            let rect = monitor_info.rcMonitor;
            SetWindowPos(
                hwnd,
                HWND_TOPMOST,
                rect.left,
                rect.top,
                rect.right - rect.left,
                rect.bottom - rect.top,
                SWP_NOZORDER,
            ).map_err(|e| format!("Failed to set window position: {}", e))?;
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        window.set_fullscreen(true)
            .map_err(|e| format!("Failed to set fullscreen: {}", e))?;
    }
    
    Ok(())
}

fn main() {
    // Create system tray menu
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let toggle_click_through_item = CustomMenuItem::new("toggle_click_through".to_string(), "Disable Click-Through");
    let color_presets = CustomMenuItem::new("color_presets".to_string(), "Color Presets");
    let theme_customizer = CustomMenuItem::new("theme_customizer".to_string(), "Theme Customizer");
    let settings = CustomMenuItem::new("settings".to_string(), "Settings");
    let welcome = CustomMenuItem::new("welcome".to_string(), "Show Welcome");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(toggle_click_through_item)
        .add_item(color_presets)
        .add_item(theme_customizer)
        .add_item(settings)
        .add_item(welcome)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);
    let mouse_tracking = Arc::new(Mutex::new(true));
    
    tauri::Builder::default()
        .manage(AppState {
            click_through: Mutex::new(true),
            mouse_tracking: mouse_tracking.clone(),
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                if let Some(window) = app.get_window("main") {
                    match id.as_str() {
                        "quit" => std::process::exit(0),
                        "hide" => { let _ = window.hide(); }
                        "show" => { let _ = window.show(); }
                        "toggle_click_through" => toggle_click_through_fn(&window, app.state()),
                        "color_presets" => { let _ = window.emit("open-color-presets", ()); }
                        "theme_customizer" => { let _ = window.emit("open-theme-customizer", ()); }
                        "settings" => { let _ = window.emit("open-settings", ()); }
                        "welcome" => { let _ = window.emit("open-welcome", ()); }
                        _ => {}
                    }
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            get_click_through_state, 
            set_click_through, 
            toggle_fullscreen,
            check_overlay_permission,
            request_overlay_permission
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let app_handle = app.handle();
            let state: State<AppState> = app.state();
            let mouse_tracking = state.mouse_tracking.clone();
            
            // Start global mouse tracking thread
            #[cfg(any(target_os = "windows", target_os = "linux", target_os = "macos"))]
            {
                thread::spawn(move || {
                    start_mouse_tracking(app_handle, mouse_tracking);
                });
            }
            
            // Windows-specific setup
            #[cfg(target_os = "windows")]
            {
                use windows::Win32::Foundation::HWND;
                use windows::Win32::UI::WindowsAndMessaging::{
                    SetWindowPos, HWND_TOPMOST, SWP_SHOWWINDOW, SWP_NOACTIVATE,
                    GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, 
                    WS_EX_LAYERED, WS_EX_TRANSPARENT, WS_EX_TOOLWINDOW, WS_EX_NOACTIVATE,
                };
                use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITOR_DEFAULTTOPRIMARY};

                let hwnd = HWND(window.hwnd().unwrap().0 as isize);
                unsafe {
                    let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTOPRIMARY);
                    let mut monitor_info = MONITORINFO {
                        cbSize: std::mem::size_of::<MONITORINFO>() as u32,
                        ..Default::default()
                    };
                    GetMonitorInfoW(monitor, &mut monitor_info);

                    let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                    let new_style = ex_style 
                        | WS_EX_LAYERED.0 as isize
                        | WS_EX_TRANSPARENT.0 as isize
                        | WS_EX_TOOLWINDOW.0 as isize
                        | WS_EX_NOACTIVATE.0 as isize;
                    
                    SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
                    println!("Initial window style set to: 0x{:X}", new_style);

                    let rect = monitor_info.rcMonitor;
                    let _ = SetWindowPos(
                        hwnd,
                        HWND_TOPMOST,
                        rect.left,
                        rect.top,
                        rect.right - rect.left,
                        rect.bottom - rect.top,
                        SWP_SHOWWINDOW | SWP_NOACTIVATE,
                    );
                    
                    println!("Window positioned over entire screen");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "windows")]
fn start_mouse_tracking(app_handle: AppHandle, tracking_enabled: Arc<Mutex<bool>>) {
    use windows::Win32::UI::WindowsAndMessaging::{GetCursorPos, GetSystemMetrics, SM_CXSCREEN, SM_CYSCREEN};
    use windows::Win32::Foundation::POINT;
    use std::time::Duration;
    
    let (screen_width, screen_height) = unsafe {
        (GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN))
    };
    
    loop {
        thread::sleep(Duration::from_millis(16));
        
        let is_tracking = match tracking_enabled.lock() {
            Ok(guard) => *guard,
            Err(_) => {
                thread::sleep(Duration::from_millis(100));
                continue;
            }
        };
        
        if !is_tracking {
            thread::sleep(Duration::from_millis(100));
            continue;
        }
        
        unsafe {
            let mut point = POINT { x: 0, y: 0 };
            if GetCursorPos(&mut point).is_ok() {
                if let Some(window) = app_handle.get_window("main") {
                    let _ = window.emit("global-mouse-move", serde_json::json!({
                        "x": point.x,
                        "y": point.y,
                        "screenWidth": screen_width,
                        "screenHeight": screen_height,
                    }));
                }
            }
        }
    }
}

#[cfg(target_os = "linux")]
fn start_mouse_tracking(app_handle: AppHandle, tracking_enabled: Arc<Mutex<bool>>) {
    use std::time::Duration;
    use std::process::Command;
    
    let has_xdotool = Command::new("which")
        .arg("xdotool")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    
    if !has_xdotool {
        eprintln!("Warning: xdotool not found. Mouse tracking disabled.");
        eprintln!("Install with: sudo apt-get install xdotool");
        return;
    }
    
    let (mut screen_width, mut screen_height) = (1920, 1080);
    if let Ok(output) = Command::new("xdpyinfo").output() {
        if let Ok(info) = String::from_utf8(output.stdout) {
            for line in info.lines() {
                if line.contains("dimensions:") {
                    if let Some(dims) = line.split_whitespace().nth(1) {
                        if let Some((w, h)) = dims.split_once('x') {
                            screen_width = w.parse().unwrap_or(1920);
                            screen_height = h.parse().unwrap_or(1080);
                        }
                    }
                    break;
                }
            }
        }
    }
    
    loop {
        thread::sleep(Duration::from_millis(16));
        
        let is_tracking = match tracking_enabled.lock() {
            Ok(guard) => *guard,
            Err(_) => {
                thread::sleep(Duration::from_millis(100));
                continue;
            }
        };
        
        if !is_tracking {
            thread::sleep(Duration::from_millis(100));
            continue;
        }
        
        if let Ok(output) = Command::new("xdotool").args(&["getmouselocation", "--shell"]).output() {
            if let Ok(result) = String::from_utf8(output.stdout) {
                let (mut x, mut y) = (0, 0);
                
                for line in result.lines() {
                    if let Some((key, value)) = line.split_once('=') {
                        match key {
                            "X" => x = value.parse().unwrap_or(0),
                            "Y" => y = value.parse().unwrap_or(0),
                            _ => {}
                        }
                    }
                }
                
                if let Some(window) = app_handle.get_window("main") {
                    let _ = window.emit("global-mouse-move", serde_json::json!({
                        "x": x,
                        "y": y,
                        "screenWidth": screen_width,
                        "screenHeight": screen_height,
                    }));
                }
            }
        }
    }
}

#[cfg(target_os = "macos")]
fn start_mouse_tracking(app_handle: AppHandle, tracking_enabled: Arc<Mutex<bool>>) {
    use std::time::Duration;
    use cocoa::appkit::NSEvent;
    use cocoa::foundation::NSPoint;
    
    loop {
        thread::sleep(Duration::from_millis(16));
        
        let is_tracking = match tracking_enabled.lock() {
            Ok(guard) => *guard,
            Err(_) => {
                thread::sleep(Duration::from_millis(100));
                continue;
            }
        };
        
        if !is_tracking {
            thread::sleep(Duration::from_millis(100));
            continue;
        }
        
        unsafe {
            let mouse_location: NSPoint = NSEvent::mouseLocation();
            let screen_width = 1920;
            let screen_height = 1080;
            
            if let Some(window) = app_handle.get_window("main") {
                let _ = window.emit("global-mouse-move", serde_json::json!({
                    "x": mouse_location.x as i32,
                    "y": (screen_height as f64 - mouse_location.y) as i32,
                    "screenWidth": screen_width,
                    "screenHeight": screen_height,
                }));
            }
        }
    }
}

fn toggle_click_through_fn(window: &Window, state: State<AppState>) {
    let is_enabled = {
        let mut click_through = match state.click_through.lock() {
            Ok(guard) => guard,
            Err(e) => {
                eprintln!("Failed to lock click_through: {}", e);
                return;
            }
        };
        *click_through = !*click_through;
        *click_through
    };

    println!("Toggle click-through: {}", is_enabled);

    {
        let mut tracking = match state.mouse_tracking.lock() {
            Ok(guard) => guard,
            Err(e) => {
                eprintln!("Failed to lock mouse_tracking: {}", e);
                return;
            }
        };
        *tracking = is_enabled;
    }
    
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT, WS_EX_LAYERED,
        };

        if let Ok(hwnd_wrapper) = window.hwnd() {
            let hwnd = HWND(hwnd_wrapper.0 as isize);
            unsafe {
                let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                let new_style = if is_enabled {
                    ex_style | WS_EX_LAYERED.0 as isize | WS_EX_TRANSPARENT.0 as isize
                } else {
                    ex_style & !(WS_EX_TRANSPARENT.0 as isize)
                };
                
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
                println!("Click-through: {}", if is_enabled { "ENABLED" } else { "DISABLED" });
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::NSWindow;
        use cocoa::base::id;

        if let Ok(ns_window_ptr) = window.ns_window() {
            let ns_window = ns_window_ptr as id;
            unsafe {
                ns_window.setIgnoresMouseEvents_(is_enabled);
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        let _ = window.set_ignore_cursor_events(is_enabled);
    }

    let _ = window.app_handle().tray_handle().get_item("toggle_click_through")
        .set_title(if is_enabled { "Disable Click-Through" } else { "Enable Click-Through" });

    let _ = window.emit("click-through-changed", is_enabled);
}
