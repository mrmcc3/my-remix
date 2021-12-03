import { nanoid } from 'nanoid'

export class ExampleDO {
  state: DurableObjectState
  env: Env
  colo: string
  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
    this.colo = ''
    if (!globalThis.isolateId) globalThis.isolateId = nanoid(8)
  }

  async fetch(request: Request) {
    const { colo = 'N/A' } = await request.json()
    const coloKey = `colo:${colo}`

    // find the DO colo
    let creationColo = await this.state.storage.get('creationColo')
    if (!creationColo || this.colo === '') {
      const res = await fetch('https://1.1.1.1/cdn-cgi/trace')
      const str = await res.text()
      this.colo = str.split('\n')[6].substring(5)
      if (!creationColo) {
        await this.state.storage.put('creationColo', this.colo)
        creationColo = this.colo
      }
    }

    // bump the call count
    const coloCount: number = (await this.state.storage.get(coloKey)) || 0
    await this.state.storage.put(coloKey, coloCount + 1)

    // get all the counts
    const coloMap = await this.state.storage.list({ prefix: 'colo:' })

    return new Response(
      JSON.stringify({
        doId: this.state.id.toString(),
        doIsolateId: isolateId,
        currentColo: this.colo,
        creationColo,
        counts: Object.fromEntries(coloMap)
      })
    )
  }
}
