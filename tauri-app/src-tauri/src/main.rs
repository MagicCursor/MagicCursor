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
fn get_click_through_state(state: State<AppState>) -> bool {
    *state.click_through.lock().unwrap()
}

#[tauri::command]
fn set_click_through(window: Window, state: State<AppState>, enabled: bool) {
    let mut click_through = state.click_through.lock().unwrap();
    
    // Only change if different from current state
    if *click_through == enabled {
        drop(click_through);
        return;
    }
    
    *click_through = enabled;
    drop(click_through);

    println!("Set click-through to: {}", enabled);

    // Enable/disable global mouse tracking
    let mut tracking = state.mouse_tracking.lock().unwrap();
    *tracking = enabled;
    drop(tracking);
    
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT, WS_EX_LAYERED,
        };

        let hwnd = HWND(window.hwnd().unwrap().0 as isize);
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

        let ns_window = window.ns_window().unwrap() as id;
        unsafe {
            ns_window.setIgnoresMouseEvents_(enabled);
        }
    }

    #[cfg(target_os = "linux")]
    {
        if let Err(e) = window.set_ignore_cursor_events(enabled) {
            eprintln!("Failed to set ignore cursor events: {}", e);
        }
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        if let Err(e) = window.set_ignore_cursor_events(enabled) {
            eprintln!("Failed to set ignore cursor events: {}", e);
        }
    }

    // Update tray menu text
    if let Err(e) = window.app_handle().tray_handle().get_item("toggle_click_through")
        .set_title(if enabled { "Disable Click-Through" } else { "Enable Click-Through" }) {
        eprintln!("Failed to update tray menu: {}", e);
    }

    // Notify frontend
    if let Err(e) = window.emit("click-through-changed", enabled) {
        eprintln!("Failed to emit event: {}", e);
    }
}

#[tauri::command]
fn check_overlay_permission() -> bool {
    #[cfg(target_os = "android")]
    {
        // On Android, check SYSTEM_ALERT_WINDOW permission
        // This is a placeholder - actual implementation would use JNI
        true
    }
    
    #[cfg(not(target_os = "android"))]
    {
        true
    }
}

#[tauri::command]
fn request_overlay_permission() {
    #[cfg(target_os = "android")]
    {
        // On Android, request SYSTEM_ALERT_WINDOW permission
        // This would use JNI to call Android's Settings.ACTION_MANAGE_OVERLAY_PERMISSION
        println!("Requesting overlay permission on Android");
    }
}

#[tauri::command]
fn toggle_fullscreen(window: Window) {
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            SetWindowPos, HWND_TOPMOST, SWP_NOZORDER,
        };
        use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITOR_DEFAULTTONEAREST};

        let hwnd = HWND(window.hwnd().unwrap().0 as isize);
        unsafe {
            // Get monitor info
            let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
            let mut monitor_info = MONITORINFO {
                cbSize: std::mem::size_of::<MONITORINFO>() as u32,
                ..Default::default()
            };
            GetMonitorInfoW(monitor, &mut monitor_info);

            // Position window to cover entire monitor including taskbar
            // Don't change window style - keep it transparent and borderless
            let rect = monitor_info.rcMonitor;
            let _ = SetWindowPos(
                hwnd,
                HWND_TOPMOST,
                rect.left,
                rect.top,
                rect.right - rect.left,
                rect.bottom - rect.top,
                SWP_NOZORDER,
            );
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        let _ = window.set_fullscreen(true);
    }
}

fn main() {
    // Create system tray menu
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let toggle_click_through_item = CustomMenuItem::new("toggle_click_through".to_string(), "Disable Click-Through"); // Default is enabled
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

    let mouse_tracking = Arc::new(Mutex::new(true)); // Start with tracking enabled
    
    tauri::Builder::default()
        .manage(AppState {
            click_through: Mutex::new(true), // Click-through ON by default
            mouse_tracking: mouse_tracking.clone(),
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        window.hide().unwrap();
                    }
                    "show" => {
                        window.show().unwrap();
                    }
                    "toggle_click_through" => {
                        toggle_click_through_fn(&window, app.state());
                    }
                    "color_presets" => {
                        window.emit("open-color-presets", {}).unwrap();
                    }
                    "theme_customizer" => {
                        window.emit("open-theme-customizer", {}).unwrap();
                    }
                    "settings" => {
                        window.emit("open-settings", {}).unwrap();
                    }
                    "welcome" => {
                        window.emit("open-welcome", {}).unwrap();
                    }
                    _ => {}
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
            
            // Start global mouse tracking thread for Windows and Linux
            #[cfg(any(target_os = "windows", target_os = "linux"))]
            {
                thread::spawn(move || {
                    start_mouse_tracking(app_handle, mouse_tracking);
                });
            }
            
            // On Windows, setup window to overlay everything including taskbar and Start menu
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
                    // Get primary monitor info
                    let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTOPRIMARY);
                    let mut monitor_info = MONITORINFO {
                        cbSize: std::mem::size_of::<MONITORINFO>() as u32,
                        ..Default::default()
                    };
                    GetMonitorInfoW(monitor, &mut monitor_info);

                    // Set extended window styles for overlay behavior
                    let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                    let new_style = ex_style 
                        | WS_EX_LAYERED.0 as isize      // Required for transparency and click-through
                        | WS_EX_TRANSPARENT.0 as isize  // Click-through enabled by default
                        | WS_EX_TOOLWINDOW.0 as isize   // Prevents taskbar button, helps overlay taskbar
                        | WS_EX_NOACTIVATE.0 as isize;  // Never activates, stays in background
                    
                    SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
                    println!("Initial window style set to: 0x{:X}", new_style);

                    // Position to cover entire monitor including taskbar
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
                    
                    println!("Window positioned over entire screen including taskbar");
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
    
    // Cache screen dimensions (they rarely change)
    let (screen_width, screen_height) = unsafe {
        (GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN))
    };
    
    loop {
        thread::sleep(Duration::from_millis(16)); // ~60 FPS
        
        let is_tracking = *tracking_enabled.lock().unwrap();
        if !is_tracking {
            thread::sleep(Duration::from_millis(100)); // Sleep longer when not tracking
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
    
    loop {
        thread::sleep(Duration::from_millis(16)); // ~60 FPS
        
        let is_tracking = *tracking_enabled.lock().unwrap();
        if !is_tracking {
            continue;
        }
        
        // Use xdotool to get mouse position on Linux
        if let Ok(output) = Command::new("xdotool")
            .args(&["getmouselocation", "--shell"])
            .output() 
        {
            if let Ok(result) = String::from_utf8(output.stdout) {
                let mut x = 0;
                let mut y = 0;
                let mut screen_width = 1920;
                let mut screen_height = 1080;
                
                for line in result.lines() {
                    if let Some((key, value)) = line.split_once('=') {
                        match key {
                            "X" => x = value.parse().unwrap_or(0),
                            "Y" => y = value.parse().unwrap_or(0),
                            _ => {}
                        }
                    }
                }
                
                // Get screen dimensions
                if let Ok(screen_output) = Command::new("xdpyinfo")
                    .output()
                {
                    if let Ok(screen_info) = String::from_utf8(screen_output.stdout) {
                        for line in screen_info.lines() {
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

fn toggle_click_through_fn(window: &Window, state: State<AppState>) {
    let mut click_through = state.click_through.lock().unwrap();
    *click_through = !*click_through;
    let is_enabled = *click_through;
    drop(click_through);

    println!("Toggle click-through: {}", is_enabled);

    // Enable/disable global mouse tracking
    let mut tracking = state.mouse_tracking.lock().unwrap();
    *tracking = is_enabled;
    drop(tracking);
    
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT, WS_EX_LAYERED,
        };

        let hwnd = HWND(window.hwnd().unwrap().0 as isize);
        unsafe {
            let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            println!("Current ex_style: 0x{:X}", ex_style);
            
            // CRITICAL: Must have WS_EX_LAYERED for WS_EX_TRANSPARENT to work!
            let new_style = if is_enabled {
                ex_style | WS_EX_LAYERED.0 as isize | WS_EX_TRANSPARENT.0 as isize
            } else {
                ex_style & !(WS_EX_TRANSPARENT.0 as isize)
            };
            
            println!("Setting ex_style to: 0x{:X}", new_style);
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
            
            // Verify it was set
            let verify_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            println!("Verified ex_style: 0x{:X}", verify_style);
            println!("Click-through is now: {}", if is_enabled { "ENABLED" } else { "DISABLED" });
        }
    }

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::NSWindow;
        use cocoa::base::id;

        let ns_window = window.ns_window().unwrap() as id;
        unsafe {
            ns_window.setIgnoresMouseEvents_(is_enabled);
        }
    }

    #[cfg(target_os = "linux")]
    {
        // On Linux (X11/Wayland), use Tauri's built-in API
        if let Err(e) = window.set_ignore_cursor_events(is_enabled) {
            eprintln!("Failed to set ignore cursor events: {}", e);
        } else {
            println!("Linux click-through is now: {}", if is_enabled { "ENABLED" } else { "DISABLED" });
        }
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
    {
        if let Err(e) = window.set_ignore_cursor_events(is_enabled) {
            eprintln!("Failed to set ignore cursor events: {}", e);
        }
    }

    // Update tray menu text
    if let Err(e) = window.app_handle().tray_handle().get_item("toggle_click_through")
        .set_title(if is_enabled { "Disable Click-Through" } else { "Enable Click-Through" }) {
        eprintln!("Failed to update tray menu: {}", e);
    }

    // Notify frontend
    if let Err(e) = window.emit("click-through-changed", is_enabled) {
        eprintln!("Failed to emit event: {}", e);
    }
}
