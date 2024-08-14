// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate dotenv;

fn main() {
  if cfg!(debug_assertions) {
    dotenv::from_filename(".env.development").unwrap().load();
  } else {
    let prod_env: &str = include_str!("../../.env.production");
    let result = dotenv::from_read(prod_env.as_bytes()).unwrap();
    result.load();
  }

  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
