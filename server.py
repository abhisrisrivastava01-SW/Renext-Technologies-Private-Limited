"""
Renext Technologies Pvt Ltd — Local Preview Server
Serves index.html, spenditwisely.html, ai-studio.html, and all assets.
Run with: python server.py
"""

import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run():
    port = DEFAULT_PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print("=" * 65)
                print("  RENEXT TECHNOLOGIES PVT LTD — LOCAL PREVIEW SERVER")
                print("=" * 65)
                print(f"  1. Home            : http://localhost:{port}/index.html")
                print(f"  2. About Us        : http://localhost:{port}/about.html")
                print(f"  3. Services        : http://localhost:{port}/services.html")
                print(f"  4. SpendItWisely   : http://localhost:{port}/spenditwisely.html")
                print(f"  5. Ads Creative    : http://localhost:{port}/ai-studio.html")
                print(f"  6. Contact Us      : http://localhost:{port}/contact.html")
                print(f"  7. Background Paths: http://localhost:{port}/background-paths.html")
                print("=" * 65)
                print("  Press Ctrl+C to stop the server.")
                print("=" * 65)
                sys.stdout.flush()
                httpd.serve_forever()
                break
        except OSError:
            port += 1
            continue

if __name__ == '__main__':
    run()
