# FEEL Rollout HUB

ŠKODA FEEL global rollout workspace, maintained by PROGENIUM.

## Production
- Existing Vercel project: `feel-rollout-hub` in team Lewis Work
- URL: https://feel-rollout-hub-lewis-work.vercel.app
- GitHub main is connected to Vercel production builds.

## Features in this iteration
- Premium responsive layout with exactly five sections: SKODA World, Dashboard, Rollout, Modules, Reports.
- Offline map geometry: bundled Natural Earth TopoJSON with 177 country features, sourced from vega/vega-datasets `data/world-110m.json`. No external map tiles, CDN or API key.
- Nine markets: Spain, France, United Kingdom, India, Czech Republic, Germany, Austria, Finland and Poland.
- Interactive hover, tooltips, click-to-focus zoom, reset and market search.
- Market-specific HQ assignments, technical readiness, lifecycle, health, deployment status, actual completion date and KPIs.
- Ordering information, notes, local document attachments, activity history and CSV export.

## Development
```bash
npm install
npm run dev
npm run build
```

## Important limitations
- Data is persisted only in the current browser's localStorage, not centrally shared.
- No authentication or permission enforcement. Do not enter confidential production data.
- Documents are browser-local with a 1 MB per-file limit, not central file storage.
- Original ŠKODA Next font assets still need to be bundled in the repository and referenced through @font-face.
- Location-level rollout workflows and backend audit logs are not yet implemented.
- This is an interactive functional iteration, not a production-complete enterprise backend.
