import index from "./index.html"

const port = process.env.PORT || 3000

Bun.serve({
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
  port,
})

console.log(`🚀 BookingSearch Widget server running on http://localhost:${port}`)