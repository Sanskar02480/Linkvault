import axios from "axios"
import * as cheerio from 'cheerio'

async function scrapeUrl(url) {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const title = $('title').text().trim()
    const description = $('meta[name="description"]').attr('content') || ""
    return { title, description }
  } catch {
    return { title: "", description: "" }
  }
}

export default scrapeUrl