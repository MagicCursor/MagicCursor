// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    Window,
};

fn main() {
    // Create system tray menu
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let toggle_click_through = CustomMenuItem::new("toggle_click_through".to_string(), "Toggle Click-Through");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(toggle_click_through)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
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
                        toggle_click_through(&window);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            
            // Set window to be click-through by default
            #[cfg(target_os = "windows")]
            {
                use windows::Win32::Foundation::HWND;
                use windows::Win32::UI::WindowsAndMessaging::{
                    GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_LAYERED,
                    WS_EX_TRANSPARENT,
                };

                let hwnd = HWND(window.hwnd().unwrap().0 as isize);
                unsafe {
                    let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                    SetWindowLongPtrW(
                        hwnd,
                        GWL_EXSTYLE,
                        ex_style | WS_EX_LAYERED as isize | WS_EX_TRANSPARENT as isize,
                    );
                }
            }

            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSWindow, NSWindowCollectionBehavior};
                use cocoa::base::id;

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    ns_window.setIgnoresMouseEvents_(cocoa::base::YES);
                    ns_window.setCollectionBehavior_(
                        NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                    );
                }
            }

            #[cfg(target_os = "linux")]
            {
                use gtk::prelude::*;
                use gtk::gdk::WindowExt;

                let gtk_window = window.gtk_window().unwrap();
                gtk_window.set_input_shape_combine_region(None);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn toggle_click_through(window: &Window) {
    #[cfg(target_os = "windows")]
    {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::{
            GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT,
        };

        let hwnd = HWND(window.hwnd().unwrap().0 as isize);
        unsafe {
            let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            if (ex_style & WS_EX_TRANSPARENT as isize) != 0 {
                // Remove click-through
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex_style & !WS_EX_TRANSPARENT as isize);
            } else {
                // Add click-through
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex_style | WS_EX_TRANSPARENT as isize);
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::NSWindow;
        use cocoa::base::id;

        let ns_window = window.ns_window().unwrap() as id;
        unsafe {
            let ignores = ns_window.ignoresMouseEvents();
            ns_window.setIgnoresMouseEvents_(!ignores);
        }
    }
}

#[cfg(target_os = "windows")]
use windows::Win32;
