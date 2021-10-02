# screeps

## Cycle Logic

- Check to spawn creeps
  - If we're defending or attacking and have energy, and have no attack capabilities, spawn fighters
  - If we have creeps that need healing, spawn healers
  - Otherwise, if we don't have enough workers and have energy, spawn workers
- Process screep actions
  - If we're defending or attacking, assign those with attack capabilities to fighter behaviour
  - If creeps need healing, assign those with heal capabilities to healer behaviour
  - Otherwise if they can work:
    - If structures need repairs, assign those with repair capabilities to healer behaviour
    - If construction sites, build them
    - Harvest energy
    - Upgrade
  - Otherwise:
    - Explore other rooms
- Spawn structure construction sites
  - If available spaces for extensions, construct extensions
  - Otherwise spawn walls over exits
  - Spawn towers within walls
