#[cfg_attr(mobile, tauri::mobile_entry_point)]
extern crate dotenv;

pub fn run() {
    if cfg!(debug_assertions) {
        dotenv::from_filename(".env.development").unwrap().load();
    } else {
        let prod_env: &str = include_str!("../../.env.production");
        let result = dotenv::from_read(prod_env.as_bytes()).unwrap();
        result.load();
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
