import 'dotenv/config'
import { app } from './server.js'

const PORT = process.env.PORT || 3000

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
