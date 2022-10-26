#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{ Manager };

#[derive(Clone, serde::Serialize)]
struct Payload {
    data: Vec<u8>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // listen();
    println!("UP");

    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            listen(main_window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        // .invoke_handler(tauri::generate_handler![send_udp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn listen(window: tauri::Window) {
    let socket = std::net::UdpSocket::bind("0.0.0.0:60084").expect("couldn't bind to address");
    let socket_clone = socket.try_clone().unwrap();

    std::thread::spawn(move || loop {
        let mut buffer = [0;1442];
        let (amt, src_addr) = socket_clone.recv_from(&mut buffer).unwrap();
        // println!("amt: {}", amt);
        // println!("src: {}", src_addr);                
        let first_slice = &buffer[2..182];
        window.emit("got-udp", Payload{data: first_slice.to_vec()});
        // print!("{}", std::str::from_utf8(&buffer).unwrap());
    });
}