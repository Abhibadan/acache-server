# acache-server

**acache-server** is an npm package designed to provide a simple and efficient caching server for storing and retrieving data types such as strings, numbers, booleans, and objects. It supports optional time-to-live (TTL) settings for cache entries, allowing for automatic expiration of data.

## Features

- **Data Storage**: Cache strings, numbers, booleans, and objects.
- **TTL Support**: Set optional TTL for cache entries to control data expiration.
- **Customizable Port**: Start the server on a specified port or use the default port 6379.

## Installation

To install **acache-server**, you need to have [Node.js](https://nodejs.org/) installed on your system. Install the package globally using npm:

```bash
npm install -g acache-server
```
    
## Usage

After installation, you can start the caching server by running:

```bash
acache-server
```

By default, the server starts on port 6379. To start the server on a different port, provide the desired port number as an argument:

```bash
acache-server 5000
```

This command starts the server on port 5000.
## Client Integration

To interact with the **acache-server**, use the companion client package, **acache-client**. Install it in your project:

```bash
npm install acache-client
```

For detailed usage instructions and API documentation, refer to the [acache-client package page](https://www.npmjs.com/package/acache-client).
## License

This project is licensed under the [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0) License.

