import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { consumeSse } from './parse-sse';
import * as s from './XTerm.css';

const THEME = {
  background: '#0d0d0d',
  foreground: '#ebebeb',
  cursor: '#f0e468',
  cursorAccent: '#0d0d0d',
  black: '#0d0d0d',
  brightBlack: '#444444',
  red: '#ff5c5c',
  brightRed: '#ff5c5c',
  green: '#4dff91',
  brightGreen: '#4dff91',
  yellow: '#f0e468',
  brightYellow: '#f0e468',
  blue: '#6699ff',
  brightBlue: '#6699ff',
  magenta: '#cc99ff',
  brightMagenta: '#cc99ff',
  cyan: '#66ffff',
  brightCyan: '#66ffff',
  white: '#ebebeb',
  brightWhite: '#ffffff',
};

interface XTermProps {
  /** SSE endpoint для логов (read-only) */
  logsUrl?: string;
  /** WebSocket URL для интерактивного терминала */
  wsUrl?: string;
  containerId?: string;
  token?: string;
}

export function XTerm({ logsUrl, wsUrl, containerId, token }: XTermProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: THEME,
      fontFamily: '"Martian Mono", "JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.5,
      cursorBlink: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;

    const observer = new ResizeObserver(() => fitAddon.fit());
    observer.observe(containerRef.current);

    // ── Режим логов (SSE) ──────────────────────────────────
    if (logsUrl) {
      term.writeln('\x1b[2m── logs ──\x1b[0m\r\n');
      const ac = new AbortController();
      let ended = false;

      void (async () => {
        try {
          const res = await fetch(logsUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
            signal: ac.signal,
          });
          if (!res.ok || !res.body) {
            if (!ended) term.writeln('\r\n\x1b[31mSSE connection lost\x1b[0m');
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const { rest, events } = consumeSse(buffer);
            buffer = rest;
            for (const ev of events) {
              if (ev.event === 'end') {
                ended = true;
                term.writeln('\r\n\x1b[2;32m── done ──\x1b[0m');
                ac.abort();
                return;
              }
              if (ev.data) term.writeln(ev.data);
            }
          }
          if (!ended) term.writeln('\r\n\x1b[31mSSE connection lost\x1b[0m');
        } catch {
          if (!ac.signal.aborted && !ended) {
            term.writeln('\r\n\x1b[31mSSE connection lost\x1b[0m');
          }
        }
      })();

      return () => {
        ac.abort();
        observer.disconnect();
        term.dispose();
      };
    }

    // ── Режим терминала (WebSocket) ────────────────────────
    if (wsUrl && containerId && token) {
      term.writeln('\x1b[2m── connecting… ──\x1b[0m\r\n');
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        ws.send(JSON.stringify({ event: 'attach', data: { containerId, token } }));
        term.writeln('\x1b[2m── connected ──\x1b[0m\r\n');

        term.onData((data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'input', data }));
          }
        });

        term.onResize(({ cols, rows }) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'resize', data: { cols, rows } }));
          }
        });
      };

      ws.onmessage = (e) => {
        if (e.data instanceof ArrayBuffer) {
          term.write(new Uint8Array(e.data));
        } else if (typeof e.data === 'string') {
          term.write(e.data);
        }
      };

      ws.onclose = () => term.writeln('\r\n\x1b[31mConnection closed\x1b[0m');
      ws.onerror = () => term.writeln('\r\n\x1b[31mConnection error\x1b[0m');

      return () => {
        ws.close();
        observer.disconnect();
        term.dispose();
      };
    }

    return () => {
      observer.disconnect();
      term.dispose();
    };
  }, [logsUrl, wsUrl, containerId, token]);

  return <div ref={containerRef} className={s.wrapper} />;
}
