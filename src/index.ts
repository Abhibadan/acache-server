#!/usr/bin/env node

import * as net from 'net';
import crypto from 'crypto';
import handleRequest, { storeInstance } from './handleRequest';

const server = net.createServer((socket: net.Socket) => {
  socket.once('data', (data: Buffer) => {
    const request = data.toString();
    // upgrade the connection to WebSocket
    const headers = request.split('\r\n');
    const keyHeader = headers.find(h => h.toLowerCase().startsWith('sec-websocket-key')); // Case-insensitive lookup

    if (!keyHeader) {
      console.error('Invalid WebSocket handshake: Missing Sec-WebSocket-Key');
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      return;
    }

    // Add key to make communication secure

    const key = keyHeader.split(' ')[1];
    const acceptKey = crypto
      .createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
      .digest('base64');
      
    // Send the WebSocket handshake response to the client
    const response = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      '\r\n'
    ].join('\r\n');
    socket.write(response);

    // Handle WebSocket frames
    socket.on('data', (buffer) => {
      const opcode = buffer[0] & 0x0f;
      const mask = buffer[1] & 0x80;
      let payloadLength: any = buffer[1] & 0x7f;

      let offset = 2;
      if (payloadLength === 126) {
        payloadLength = buffer.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        payloadLength = buffer.readBigUInt64BE(offset);
        offset += 8;
      }

      const maskingKey = buffer.subarray(offset, offset + 4);
      offset += 4;

      const payload = buffer.subarray(offset, offset + payloadLength);
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskingKey[i % 4];
      }

      const request = payload.toString('utf8');
      // Handle WebSocket requests here using handelRequest 
      // Send a response (simple text frame)
      const response = Buffer.from(handleRequest(request));
      let frame: Buffer;
      const responseLength = response.length;
      /*
      *
      * WebSocket protocol requires:
      ** For payloads ≤125 bytes: Use frame[1] = response.length.
      ** For payloads 126–65535 bytes: Set frame[1] = 126 and write 2 extra bytes for length.
      ** For payloads >65535 bytes: Set frame[1] = 127 and write 8 extra bytes for length.
      *
      */
      if (responseLength <= 125) {
        frame = Buffer.alloc(2 + responseLength);
        frame[0] = 0x81; // FIN + Text frame opcode
        frame[1] = responseLength; // Payload length
        response.copy(frame, 2);
      } else if (responseLength <= 65535) {
        frame = Buffer.alloc(4 + responseLength);
        frame[0] = 0x81; // FIN + Text frame opcode
        frame[1] = 126; // Extended payload length indicator
        frame.writeUInt16BE(responseLength, 2); // Write 16-bit length
        response.copy(frame, 4);
      } else {
        frame = Buffer.alloc(10 + responseLength);
        frame[0] = 0x81; // FIN + Text frame opcode
        frame[1] = 127; // Extended payload length indicator
        frame.writeBigUInt64BE(BigInt(responseLength), 2); // Write 64-bit length
        response.copy(frame, 10);
      }
    
      // Send WebSocket frame back to the client
      socket.write(frame);
    });
  });
  // Handle connection errors and close event
  socket.on('error', (error: any) => {
    console.error('Client error:', error.message);
  });
  socket.on('close', () => console.log('Client disconnected'));
  socket.on('end', () => console.log('Client disconnected'));
});
const port = parseInt(process.argv[2], 10) || 6379;
server.listen(port, () => console.log(`Server listening on port ${port}`)).on('error', (error: any) => console.error('Server error:', error.message));

// Handle Ctrl+C (SIGINT)
process.on('SIGINT', () => {
  // console.log('SIGINT received (Ctrl+C pressed)');
  process.exit(0);
});

// Handle Termination (SIGTERM)
process.on('SIGTERM', () => {
  // console.log('SIGTERM received (Process Terminated)');
  process.exit(0);
});

// Handle Terminal Close (SIGHUP)
process.on('SIGHUP', () => {
  // console.log('SIGHUP received (Terminal Closed)');
  process.exit(0);
});

// Handle Process Exit (Ensures dump runs)
process.on('exit', () => {
  storeInstance.dump();
  // console.log('Process exit event');
});