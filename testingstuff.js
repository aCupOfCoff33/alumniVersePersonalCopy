const scrapedin = require('scrapedin')

const options = {
    email: 'your.linkedin@email.com',
    password: 'your.linkedin.password'
  }

const profileScraper = await scrapedin(options)
const profile = await profileScraper('https://www.linkedin.com/in/some-profile/')


