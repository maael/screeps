import { promises as fs } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'

const targets = {
  persistent: 'https://screeps.com/api/user/code',
  season: 'https://screeps.com/season/api/user/code',
}

const TARGET = process.env.SCREEPS_TARGET || 'persistent'
const BRANCH = process.env.SCREEPS_BRANCH || 'default'

;(async () => {
  console.info(`Uploading to ${TARGET} on branch ${BRANCH} (Got token?: ${process.env.SCREEPS_TOKEN ? '✔️' : '❌'})`)
  const res = await fetch(targets[TARGET], {
    method: 'POST',
    body: JSON.stringify({
      branch: BRANCH,
      modules: {
        main: await fs.readFile(join(process.cwd(), 'bundle.js'), 'utf-8'),
      },
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Token': process.env.SCREEPS_TOKEN,
    },
  })
  const json = await res.json()
  if (json.ok === 1) {
    process.exit(0)
  } else {
    throw new Error(`Failed: "${json.error}"`)
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
