from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000

if __name__ == "__main__":
    import os
    os.chdir(ROOT)
    try:
        server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    except OSError as exc:
        print(f"Could not start IPO Reality Lab on port {PORT}: {exc}")
        print(f"Close the application already using http://localhost:{PORT}, or change PORT in serve_local.py.")
        input("Press Enter to close...")
        raise SystemExit(1)

    url = f"http://{HOST}:{PORT}"
    print("IPO Reality Lab is running.")
    print(f"Open: {url}")
    print("Keep this window open. Press Ctrl+C to stop the server.")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\\nStopping IPO Reality Lab server...")
    finally:
        server.server_close()
