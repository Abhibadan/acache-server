export default (port:Number) =>{
  console.clear();
  console.log(`
    █████╗  ██████╗ █████╗  ██████╗██╗  ██╗███████╗     ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
   ██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║██╔════╝     ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
   ███████║██║     ███████║██║     ███████║█████╗       ███████╗█████╗  ██████╔╝██╚╗  ██║█████╗  ██████╔╝
   ██╔══██║██║     ██╔══██║██║     ██╔══██║██╔══╝       ╚════██║██╔══╝  ██╔══██╗ ██║ ██╔╝██╔══╝  ██╔══██╗
   ██║  ██║╚██████╗██║  ██║╚██████╗██║  ██║███████╗     ███████║███████╗██║  ██║  ████╔╝ ███████╗██║  ██║
   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
  
  High-performance caching system for storing strings, numbers, booleans, and objects with optional TTL.

  Server running on: ${port}

  Ready to cache! 🚀
  `);
}